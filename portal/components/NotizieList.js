'use client';

import { useEffect, useState } from 'react';
import { useComunicati } from './useComunicati';

const COLOR = { Ordinanza: 'text-link', Allerta: 'text-bad', Comunicato: 'text-gold-ink' };
const FILTRI = ['Tutti', 'Ordinanza', 'Allerta', 'Comunicato'];
const LABEL = { Tutti: 'Tutti', Ordinanza: 'Ordinanze', Allerta: 'Allerte', Comunicato: 'Comunicati' };

function parseData(d) {
  try {
    return d && d.toDate ? d.toDate() : new Date(String(d) + 'T12:00:00');
  } catch (e) {
    return null;
  }
}

export function NotizieList() {
  const all = useComunicati(100);
  const [f, setF] = useState('Tutti');
  const [hl, setHl] = useState(null);
  const list = (all || []).filter((c) => f === 'Tutti' || c.tipo === f);

  // Arrivo da un link tipo /notizie#c-ID: evidenzia e porta in vista il comunicato.
  useEffect(() => {
    if (!all || !all.length) return undefined;
    const m = window.location.hash.match(/^#c-(.+)$/);
    if (!m) return undefined;
    setHl(m[1]);
    const t = setTimeout(() => document.getElementById('c-' + m[1])?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, [all]);

  if (all === null) return <p className="py-10 text-sm text-muted">Caricamento…</p>;
  if (all.length === 0) return <p className="py-10 text-[13.5px] text-muted">Al momento non ci sono comunicati pubblicati.</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtra per tipo">
        {FILTRI.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setF(t)}
            aria-pressed={f === t}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${f === t ? 'bg-surface2 text-link' : 'text-muted hover:bg-white/5 hover:text-fg'}`}
          >
            {LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-line">
        {list.map((c) => {
          const dt = parseData(c.data);
          return (
            <article
              id={`c-${c.id}`}
              key={c.id}
              className={`grid scroll-mt-28 gap-x-8 gap-y-2 border-b border-line px-2 py-7 transition-colors duration-700 md:grid-cols-[170px_1fr] ${hl === c.id ? 'bg-primary/10' : ''}`}
            >
              <div>
                <div className={`text-xs font-medium uppercase tracking-[0.16em] ${COLOR[c.tipo]}`}>{c.tipo}</div>
                {dt ? (
                  <time className="mt-1 block font-mono text-[11.7px] text-muted" dateTime={dt.toISOString()}>
                    {dt.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                ) : null}
              </div>
              <div>
                <h2 className="text-xl font-semibold leading-snug">{c.titolo}</h2>
                <p className="mt-2 max-w-3xl whitespace-pre-line text-[13.5px] leading-relaxed text-muted">{c.testo}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
