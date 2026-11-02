'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Btn, Notice } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { useAgentProfile } from '../../../components/useAgentProfile';
import { db } from '../../../lib/firebase';

const CENTRALE = ['ATTIVA', 'NON ATTIVA'];
const SPORTELLO = ['APERTO AL PUBBLICO', 'CHIUSO'];

function Card({ icon, title, children }) {
  return (
    <section className="rounded-2xl border border-line p-6">
      <h2 className="flex items-center gap-3 border-b border-line pb-4 text-xl font-medium">
        <Icon name={icon} size={26} strokeWidth={1.4} className="text-link" /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Pills({ value, options, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${value === o ? 'border-primary bg-primary/15 text-link' : 'border-line hover:border-white/40'}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function ImpostazioniPage() {
  const { loading, profile } = useAgentProfile();
  const [centrale, setCentrale] = useState('');
  const [sportello, setSportello] = useState('');
  const [tariffe, setTariffe] = useState([]);
  const [msg, setMsg] = useState({ status: '', tariffe: '' });

  useEffect(() => {
    if (loading || !profile) return;
    (async () => {
      try {
        const s = await getDoc(doc(db, 'config', 'status'));
        if (s.exists()) {
          setCentrale(s.data().centrale || '');
          setSportello(s.data().sportello || '');
        }
        const t = await getDoc(doc(db, 'config', 'tariffe'));
        if (t.exists() && Array.isArray(t.data().items)) setTariffe(t.data().items);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [loading, profile]);

  async function saveStatus() {
    try {
      await setDoc(doc(db, 'config', 'status'), { centrale, sportello, aggiornatoIl: serverTimestamp() });
      setMsg((m) => ({ ...m, status: 'Salvato.' }));
    } catch (e) {
      console.error(e);
      setMsg((m) => ({ ...m, status: 'Salvataggio non riuscito.' }));
    }
  }

  async function saveTariffe() {
    const items = tariffe
      .map((t) => ({ nome: (t.nome || '').trim().slice(0, 60), importo: (t.importo || '').trim().slice(0, 30), note: (t.note || '').trim().slice(0, 120) }))
      .filter((t) => t.nome && t.importo);
    try {
      await setDoc(doc(db, 'config', 'tariffe'), { items, aggiornatoIl: serverTimestamp() });
      setTariffe(items);
      setMsg((m) => ({ ...m, tariffe: 'Salvate.' }));
    } catch (e) {
      console.error(e);
      setMsg((m) => ({ ...m, tariffe: 'Salvataggio non riuscito.' }));
    }
  }

  const upd = (i, k, v) => setTariffe((l) => l.map((t, j) => (j === i ? { ...t, [k]: v } : t)));

  return (
    <div className="px-5 py-7 sm:px-8">
      <h1 className="text-[25px] font-normal">Impostazioni del sito</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">Quello che imposti qui compare nel sito pubblico. Se un campo è vuoto, il sito non mostra nulla.</p>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-2">
        <Card icon="radio" title="Stato della Questura">
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-sm text-muted">Centrale Operativa</div>
              <Pills value={centrale} options={CENTRALE} onChange={setCentrale} label="Centrale Operativa" />
            </div>
            <div>
              <div className="mb-2 text-sm text-muted">Sportello</div>
              <Pills value={sportello} options={SPORTELLO} onChange={setSportello} label="Sportello" />
            </div>
            <div className="flex items-center gap-4">
              <Btn as="button" type="button" onClick={saveStatus} disabled={!centrale && !sportello}>
                Salva stato
              </Btn>
              {msg.status ? <span className="text-sm text-muted">{msg.status}</span> : null}
            </div>
          </div>
        </Card>

        <Card icon="wallet" title="Tariffe porto d'armi">
          <div className="space-y-3">
            {tariffe.length === 0 ? <p className="text-sm text-muted">Nessuna tariffa impostata: nel sito la sezione resta vuota.</p> : null}
            {tariffe.map((t, i) => (
              <div key={i} className="grid gap-2 rounded-2xl border border-line p-3 sm:grid-cols-[1fr_120px_auto]">
                <input aria-label="Nome" placeholder="Es. Difesa personale" value={t.nome || ''} maxLength={60} onChange={(e) => upd(i, 'nome', e.target.value)} className="input" />
                <input aria-label="Importo" placeholder="Es. $ 2.500" value={t.importo || ''} maxLength={30} onChange={(e) => upd(i, 'importo', e.target.value)} className="input" />
                <button type="button" aria-label="Rimuovi" onClick={() => setTariffe((l) => l.filter((_, j) => j !== i))} className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-bad">
                  <Icon name="x" size={16} />
                </button>
                <input aria-label="Nota" placeholder="Nota (facoltativa)" value={t.note || ''} maxLength={120} onChange={(e) => upd(i, 'note', e.target.value)} className="input sm:col-span-3" />
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Btn as="button" type="button" variant="outline" onClick={() => setTariffe((l) => [...l, { nome: '', importo: '', note: '' }])}>
                Aggiungi voce
              </Btn>
              <Btn as="button" type="button" onClick={saveTariffe}>
                Salva tariffe
              </Btn>
              {msg.tariffe ? <span className="text-sm text-muted">{msg.tariffe}</span> : null}
            </div>
          </div>
        </Card>
      </div>
      <Notice tone="info" className="mt-6">
        Le foto del sito sono nella cartella <code>portal/public/assets</code> del repository.
      </Notice>
    </div>
  );
}
