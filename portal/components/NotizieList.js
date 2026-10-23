'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui';
import { COMUNICATI } from '../lib/data';

const TONE = { Ordinanza: 'blue', Allerta: 'warn', Comunicato: 'neutral' };
const FILTRI = ['Tutti', 'Ordinanza', 'Allerta', 'Comunicato'];

export function NotizieList() {
  const [f, setF] = useState('Tutti');
  const [hl, setHl] = useState(null);

  // Arrivo da un link tipo /notizie#c3: evidenzia e porta in vista il comunicato.
  useEffect(() => {
    const m = window.location.hash.match(/^#c(\d+)$/);
    if (!m) return;
    setHl(Number(m[1]));
    const t = setTimeout(() => document.getElementById('c' + m[1])?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, []);

  const list = COMUNICATI.filter((c) => f === 'Tutti' || c.tipo === f);
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtra per tipo">
        {FILTRI.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setF(t)}
            aria-pressed={f === t}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${f === t ? 'border-primary bg-primary text-primary-fg' : 'border-line hover:bg-surface2'}`}
          >
            {t === 'Tutti' ? 'Tutti' : t === 'Ordinanza' ? 'Ordinanze' : t === 'Allerta' ? 'Allerte' : 'Comunicati'}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {list.map((c) => (
          <article id={`c${c.id}`} key={c.id} className={`flex scroll-mt-28 flex-col rounded-2xl border bg-surface p-6 transition-colors duration-700 ${hl === c.id ? 'border-primary' : 'border-line'}`}>
            <div className="flex items-center justify-between gap-3">
              <Badge tone={TONE[c.tipo]}>{c.tipo}</Badge>
              <time className="text-xs text-muted" dateTime={c.data}>
                {new Date(c.data + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
            <h2 className="mt-4 text-lg font-semibold leading-snug">{c.titolo}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.testo}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
