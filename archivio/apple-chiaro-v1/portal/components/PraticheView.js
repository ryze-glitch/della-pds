'use client';

import { useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { Badge, Btn, Container } from './ui';
import { Icon } from './icons';
import { db } from '../lib/firebase';
import { logAggiornamento } from '../lib/logAgente';
import { STATI, TIPI_PRATICA } from '../lib/data';

function fmt(ts) {
  try {
    return ts && ts.toDate ? ts.toDate().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  } catch (e) {
    return '—';
  }
}

function Row({ p, agent, onSaved }) {
  const [stato, setStato] = useState(p.stato);
  const [nota, setNota] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const st = STATI[p.stato] || STATI.ricevuta;
  const dirty = stato !== p.stato || nota.trim() !== '';
  const last = (p.aggiornamenti && p.aggiornamenti.length ? p.aggiornamenti[p.aggiornamenti.length - 1].data : null) || p.aggiornatoIl || p.creatoIl;
  const lastMs = last && last.toDate ? last.toDate().getTime() : last && last.seconds ? last.seconds * 1000 : null;
  const aperta = ['ricevuta', 'in_lavorazione', 'in_attesa'].includes(p.stato);
  const giorniFerma = aperta && lastMs ? Math.floor((Date.now() - lastMs) / 86400000) : 0;

  async function save(opts = {}) {
    setSaving(true);
    setErr('');
    const nome = `${agent.nome} ${agent.cognome}`.trim();
    const nuovoStato = opts.stato || stato;
    try {
      const update = {
        stato: nuovoStato,
        aggiornatoIl: serverTimestamp(),
        aggiornamenti: arrayUnion({ stato: nuovoStato, nota: nota.trim().slice(0, 300), data: Timestamp.now(), agente: nome }),
      };
      if (opts.assegna) update.assegnataA = nome;
      await updateDoc(doc(db, 'pratiche', p.id), update);
      logAggiornamento({ code: p.id, stato: nuovoStato, nota: nota.trim(), assegnataA: opts.assegna ? nome : p.assegnataA });
      setStato(nuovoStato);
      onSaved(p.id, nuovoStato, nota.trim(), opts.assegna ? nome : undefined);
      setNota('');
    } catch (e) {
      console.error(e);
      setErr('Salvataggio non riuscito.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[13.5px] font-semibold tracking-wide text-primary">#{p.id}</div>
          <div className="text-xs text-muted">
            {TIPI_PRATICA[p.tipo] || p.tipo} · {fmt(p.creatoIl)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {giorniFerma >= 2 ? <Badge tone="warn">Ferma da {giorniFerma} giorni</Badge> : null}
          {p.assegnataA ? <Badge tone="neutral">In carico a {p.assegnataA}</Badge> : null}
          <Badge tone={st.tone}>{st.label}</Badge>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[200px_1fr_auto]">
        <select value={stato} onChange={(e) => setStato(e.target.value)} className="input h-11 rounded-full py-0" aria-label="Stato pratica">
          {Object.entries(STATI).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <input value={nota} onChange={(e) => setNota(e.target.value)} maxLength={300} placeholder="Nota visibile al cittadino (facoltativa)" className="input h-11 rounded-full py-0" aria-label="Nota" />
        <div className="flex gap-2">
          {p.stato === 'ricevuta' && !p.assegnataA ? (
            <Btn as="button" type="button" size="sm" variant="outline" disabled={saving} onClick={() => save({ stato: 'in_lavorazione', assegna: true })} className="h-11">
              Prendi in carico
            </Btn>
          ) : null}
          <Btn as="button" type="button" size="sm" disabled={!dirty || saving} onClick={() => save()} className="h-11">
            {saving ? 'Salvo…' : 'Aggiorna'}
          </Btn>
        </div>
      </div>
      {err ? <p className="mt-2 text-sm text-bad">{err}</p> : null}
    </li>
  );
}

export function PraticheView({ authLoading, profile, discordId, demoItems }) {
  const [items, setItems] = useState(demoItems || []);
  const [state, setState] = useState({ loaded: !!demoItems, error: '' });
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('tutte');
  const [filtroStato, setFiltroStato] = useState('tutti');

  useEffect(() => {
    if (demoItems || authLoading || !profile) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'pratiche'), orderBy('creatoIl', 'desc'), limit(150)));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setState({ loaded: true, error: '' });
      } catch (e) {
        console.error(e);
        setState({ loaded: false, error: 'Impossibile caricare le pratiche.' });
      }
    })();
  }, [authLoading, profile]);

  const agent = profile ? { discordId, nome: profile.nome || '', cognome: profile.cognome || '' } : null;
  const filtered = useMemo(() => {
    const t = q.trim().toUpperCase().replace('#', '');
    return items.filter((p) => (tipo === 'tutte' || p.tipo === tipo) && (filtroStato === 'tutti' || p.stato === filtroStato) && (!t || p.id.includes(t)));
  }, [items, q, tipo, filtroStato]);

  function onSaved(id, stato, nota, assegnataA) {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, stato, assegnataA: assegnataA || p.assegnataA, aggiornamenti: [...(p.aggiornamenti || []), { stato, nota }] } : p)));
  }

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-[22.5px] font-normal">Gestione pratiche</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">Aggiorna lo stato delle pratiche dello Sportello. I dettagli di ogni richiesta sono nei canali Discord della fazione.</p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-full border border-line px-5 focus-within:border-link focus-within:ring-2 focus-within:ring-link/25">
          <Icon name="search" size={17} className="text-muted" />
          <span className="sr-only">Cerca per codice</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca per codice (es. K7M2QX)" className="w-full bg-transparent font-mono text-sm uppercase outline-none placeholder:normal-case placeholder:text-muted" />
        </label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input h-12 w-full rounded-full py-0 sm:w-56" aria-label="Tipo">
          <option value="tutte">Tutti i tipi</option>
          {Object.entries(TIPI_PRATICA).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtra per stato">
        {[['tutti', 'Tutte'], ...Object.entries(STATI).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <button key={k} type="button" aria-pressed={filtroStato === k} onClick={() => setFiltroStato(k)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${filtroStato === k ? 'bg-surface2 text-link' : 'text-muted hover:bg-black/5 hover:text-fg'}`}>
            {label}
            {items.length ? <span className="ml-1.5 text-xs opacity-70">{k === 'tutti' ? items.length : items.filter((p) => p.stato === k).length}</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line">
        {!state.loaded ? (
          <div className={`p-6 text-sm ${state.error ? 'text-bad' : 'text-muted'}`} role="status">
            {state.error || 'Caricamento pratiche…'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-muted">Nessuna pratica trovata.</div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((p) => (
              <Row key={p.id} p={p} agent={agent} onSaved={onSaved} />
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
