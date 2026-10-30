'use client';

import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { Badge, Btn, Notice } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { useAgentProfile } from '../../../components/useAgentProfile';
import { db } from '../../../lib/firebase';

const TIPI = ['Comunicato', 'Ordinanza', 'Allerta'];
const TONE = { Comunicato: 'blue', Ordinanza: 'neutral', Allerta: 'bad' };

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ComunicatiAgentiPage() {
  const { loading, profile } = useAgentProfile();
  const [items, setItems] = useState(null);
  const [tipo, setTipo] = useState('Comunicato');
  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [data, setData] = useState(today());
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, 'comunicati'), orderBy('data', 'desc'), limit(100)));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!loading && profile) load();
  }, [loading, profile, load]);

  async function publish(e) {
    e.preventDefault();
    setErr('');
    if (!titolo.trim() || !testo.trim()) {
      setErr('Titolo e testo sono obbligatori.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'comunicati'), {
        tipo,
        titolo: titolo.trim().slice(0, 140),
        testo: testo.trim().slice(0, 2000),
        data,
        creatoDa: `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente',
        creatoIl: serverTimestamp(),
      });
      setTitolo('');
      setTesto('');
      await load();
    } catch (e2) {
      console.error(e2);
      setErr('Pubblicazione non riuscita.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('Eliminare questo comunicato?')) return;
    try {
      await deleteDoc(doc(db, 'comunicati', id));
      setItems((l) => l.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      setErr('Eliminazione non riuscita.');
    }
  }

  return (
    <div className="px-5 py-7 sm:px-8">
      <h1 className="text-[22.5px] font-normal">Comunicati</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">I comunicati pubblicati compaiono nella bacheca e nella pagina Comunicati del sito. Se non ce n'è nessuno, il sito non mostra nulla.</p>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={publish} className="rounded-2xl border border-line p-6">
          <h2 className="text-xl font-medium">Nuovo comunicato</h2>
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo">
              {TIPI.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tipo === t} onClick={() => setTipo(t)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${tipo === t ? 'border-primary bg-primary/15 text-link' : 'border-line hover:border-white/40'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="c-data" className="mb-1.5 block text-sm text-muted">Data</label>
              <input id="c-data" type="date" value={data} onChange={(e) => setData(e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="c-tit" className="mb-1.5 block text-sm text-muted">Titolo</label>
              <input id="c-tit" value={titolo} maxLength={140} onChange={(e) => setTitolo(e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="c-txt" className="mb-1.5 block text-sm text-muted">Testo</label>
              <textarea id="c-txt" rows={6} value={testo} maxLength={2000} onChange={(e) => setTesto(e.target.value)} className="input resize-y" />
            </div>
            {err ? <Notice tone="bad">{err}</Notice> : null}
            <Btn as="button" type="submit" disabled={saving} iconStart="send">
              {saving ? 'Pubblico…' : 'Pubblica'}
            </Btn>
          </div>
        </form>

        <div className="rounded-2xl border border-line p-6">
          <h2 className="border-b border-line pb-4 text-xl font-medium">Pubblicati</h2>
          {items === null ? (
            <p className="py-8 text-center text-sm text-muted">Caricamento…</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Nessun comunicato pubblicato.</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((c) => (
                <li key={c.id} className="flex items-start gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <Badge tone={TONE[c.tipo]}>{c.tipo}</Badge> {c.data}
                    </div>
                    <div className="mt-1.5 font-medium">{c.titolo}</div>
                  </div>
                  <button type="button" onClick={() => remove(c.id)} aria-label={`Elimina ${c.titolo}`} className="rounded-full p-2 text-muted transition hover:bg-black/5 hover:text-bad">
                    <Icon name="x" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
