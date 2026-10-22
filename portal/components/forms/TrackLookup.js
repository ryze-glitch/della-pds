'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../icons';
import { Badge, Btn, Card, Notice } from '../ui';
import { cercaPratica } from '../../lib/sportello';
import { STATI, TIPI_PRATICA } from '../../lib/data';

const STEPS = [
  ['ricevuta', 'Ricevuta'],
  ['in_lavorazione', 'In lavorazione'],
  ['conclusa', 'Conclusa'],
];

function fmt(ts) {
  try {
    const d = ts && ts.toDate ? ts.toDate() : null;
    return d ? d.toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  } catch (e) {
    return '';
  }
}

function Result({ code, pratica }) {
  const st = STATI[pratica.stato] || STATI.ricevuta;
  const idx = pratica.stato === 'conclusa' ? 2 : pratica.stato === 'ricevuta' ? 0 : 1;
  const bad = pratica.stato === 'respinta';
  return (
    <Card className="mt-6 overflow-hidden">
      <div className="gold-rule" />
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Pratica</div>
            <div className="text-2xl font-extrabold tracking-wide text-primary">#{code}</div>
            <div className="mt-1 text-sm text-muted">
              {TIPI_PRATICA[pratica.tipo] || pratica.tipo} · inviata il {fmt(pratica.creatoIl) || '—'}
            </div>
          </div>
          <Badge tone={st.tone} className="!px-3 !py-1 !text-sm">
            {st.label}
          </Badge>
        </div>

        <ol className="mt-7 grid grid-cols-3 gap-2" aria-label="Avanzamento">
          {STEPS.map(([key, label], i) => {
            const done = !bad && i <= idx;
            return (
              <li key={key}>
                <div className={`h-1.5 rounded-full ${bad ? 'bg-bad/40' : done ? 'bg-primary' : 'bg-surface2'}`} />
                <div className={`mt-2 text-xs font-semibold sm:text-sm ${done ? 'text-fg' : 'text-muted'}`}>{label}</div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 flex items-start gap-2 text-[15px] leading-relaxed">
          <Icon name="info" size={18} className="mt-0.5 flex-none text-link" /> {st.text}
        </p>

        {pratica.aggiornamenti && pratica.aggiornamenti.length > 0 ? (
          <div className="mt-7">
            <h3 className="text-sm font-bold">Aggiornamenti</h3>
            <ul className="mt-3 space-y-3 border-l-2 border-line pl-5">
              {[...pratica.aggiornamenti].reverse().map((a, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
                  <div className="text-sm font-semibold">{(STATI[a.stato] || {}).label || a.stato}</div>
                  {a.nota ? <div className="text-sm text-muted">{a.nota}</div> : null}
                  <div className="text-xs text-muted">{fmt(a.data)}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function TrackLookup() {
  const [input, setInput] = useState('');
  const [state, setState] = useState({ loading: false, error: '', result: null });

  async function search(value) {
    setState({ loading: true, error: '', result: null });
    try {
      const r = await cercaPratica(value);
      if (r.error) setState({ loading: false, error: r.error, result: null });
      else setState({ loading: false, error: '', result: r });
    } catch (e) {
      setState({ loading: false, error: 'Servizio momentaneamente non disponibile. Riprova tra poco.', result: null });
    }
  }

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('codice');
    if (c) {
      setInput(c);
      search(c);
    }
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(input);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <label htmlFor="codice" className="mb-1.5 block text-sm font-semibold">
            Codice pratica
          </label>
          <input
            id="codice"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="POL-2026-K7M2QX"
            autoComplete="off"
            spellCheck="false"
            className="input h-12 font-mono text-base uppercase tracking-wider"
          />
        </div>
        <Btn as="button" type="submit" size="lg" iconStart="search" disabled={state.loading || !input.trim()} className="sm:mt-[1.7rem]">
          {state.loading ? 'Ricerca…' : 'Verifica stato'}
        </Btn>
      </form>
      {state.error ? <Notice tone="warn" className="mt-5">{state.error}</Notice> : null}
      {state.result ? <Result code={state.result.code} pratica={state.result.pratica} /> : null}
    </div>
  );
}
