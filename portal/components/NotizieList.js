'use client';

import { useEffect, useState } from 'react';
import { COMUNICATI } from '../lib/data';

const COLOR = { Ordinanza: 'text-link', Allerta: 'text-bad', Comunicato: 'text-gold-ink' };
const FILTRI = ['Tutti', 'Ordinanza', 'Allerta', 'Comunicato'];
const LABEL = { Tutti: 'Tutti', Ordinanza: 'Ordinanze', Allerta: 'Allerte', Comunicato: 'Comunicati' };

export function NotizieList() {
  const [f, setF] = useState('Tutti');
  const [hl, setHl] = useState(null);
  const list = COMUNICATI.filter((c) => f === 'Tutti' || c.tipo === f);

  // Arrivo da un link tipo /notizie#c3: evidenzia e porta in vista il comunicato.
  useEffect(() => {
    const m = window.location.hash.match(/^#c(\d+)$/);
    if (!m) return;
    setHl(Number(m[1]));
    const t = setTimeout(() => document.getElementById('c' + m[1])?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtra per tipo">
        {FILTRI.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setF(t)}
            aria-pressed={f === t}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${f === t ? 'bg-[#0f3947] text-[#17a8bd]' : 'text-muted hover:bg-white/5 hover:text-fg'}`}
          >
            {LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-line">
        {list.map((c) => (
          <article
            id={`c${c.id}`}
            key={c.id}
            className={`grid scroll-mt-28 gap-x-8 gap-y-2 border-b border-line px-2 py-7 transition-colors duration-700 md:grid-cols-[170px_1fr] ${hl === c.id ? 'bg-primary/10' : ''}`}
          >
            <div>
              <div className={`text-xs font-medium uppercase tracking-[0.16em] ${COLOR[c.tipo]}`}>{c.tipo}</div>
              <time className="mt-1 block font-mono text-[13px] text-muted" dateTime={c.data}>
                {new Date(c.data + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-snug">{c.titolo}</h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{c.testo}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
