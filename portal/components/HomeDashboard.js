'use client';

import Link from 'next/link';
import { Icon } from './icons';
import { MiePratiche } from './MiePratiche';
import { HeroTrack } from './forms/HeroTrack';
import { usePratichePersonali } from './usePratichePersonali';

const COUNTERS = [
  ['ricevuta', 'Ricevute', '--tt-blue', '--tn-blue'],
  ['in_lavorazione', 'In lavorazione', '--tt-amber', '--tn-amber'],
  ['in_attesa', 'In attesa', '--tt-violet', '--tn-violet'],
  ['conclusa', 'Concluse', '--tt-green', '--tn-green'],
];

function Counter({ n, label, tt, tn }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full text-[22px] font-semibold tabular-nums" style={{ color: `var(${tt})`, background: `var(${tn})` }}>
        {n}
      </span>
      <span className="text-[13px] font-medium leading-tight" style={{ color: `var(${tt})` }}>
        {label}
      </span>
    </div>
  );
}

// Riquadro "Le tue pratiche": cerchi con i numeri per stato + elenco + ricerca per codice.
export function HomePratiche() {
  const items = usePratichePersonali();
  const count = (s) => (items || []).filter((p) => p.stato === s).length;
  const aperte = count('ricevuta') + count('in_lavorazione') + count('in_attesa');
  return (
    <section className="sh-card rounded-[20px] border border-[color:var(--sh-line)] p-6">
      <div className="flex items-center justify-between border-b border-[color:var(--sh-line)] pb-4">
        <h2 className="flex items-center gap-3.5 text-[18px] font-medium">
          <Icon name="file-text" size={26} strokeWidth={1.3} className="text-[color:var(--sh-acc)]" /> Le tue pratiche
        </h2>
        <Link href="/sportello/pratica" aria-label="Apri Le mie pratiche" className="text-fg transition hover:text-[color:var(--sh-acc)]">
          <Icon name="chevron" size={22} />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2">
        {COUNTERS.map(([s, label, tt, tn]) => (
          <Counter key={s} n={items === null ? '–' : count(s)} label={label} tt={tt} tn={tn} />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[color:var(--sh-soft)] px-5 py-4 text-[color:var(--sh-acc)]">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color:var(--sh-acc)] text-white">
          <Icon name="info" size={19} />
        </span>
        <span className="text-[14px] leading-snug">
          {items === null ? 'Caricamento…' : items.length === 0 ? 'Non hai ancora pratiche su questo dispositivo.' : aperte ? `${aperte} ${aperte === 1 ? 'pratica in corso' : 'pratiche in corso'}.` : 'Nessuna pratica in corso.'}
        </span>
      </div>
      <div className="mt-5">
        <MiePratiche compact />
      </div>
      <div className="mt-4 border-t border-[color:var(--sh-line)] pt-4">
        <p className="mb-2 text-sm text-muted">Hai un codice? Inseriscilo qui.</p>
        <HeroTrack />
      </div>
    </section>
  );
}
