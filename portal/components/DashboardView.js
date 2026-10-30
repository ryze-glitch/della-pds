'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import { Widget } from './Widget';
import { STATI, TIPI_PRATICA } from '../lib/data';
import { Bacheca } from './Bacheca';

const BORDER = 'border-line';

function Ring({ value, label }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex h-[118.8px] w-[118.8px] items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1f2836" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#17a8bd" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="text-center">
        <div className="text-[25.2px] font-semibold tabular-nums">{value}%</div>
        <div className="text-[9.9px] uppercase tracking-wider text-muted">{label}</div>
      </div>
    </div>
  );
}

function Counter({ n, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-[55.8px] w-[55.8px] items-center justify-center rounded-full text-[19.8px] font-semibold tabular-nums" style={{ color, background: `${color}26` }}>
        {n}
      </span>
      <span className="text-[12.6px] font-medium leading-tight" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function fmtDay(ts) {
  try {
    return ts && ts.toDate ? ts.toDate().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '—';
  } catch (e) {
    return '—';
  }
}

const TONE = {
  ricevuta: 'border-l-[#3b82f6] bg-[#1c3158]',
  in_lavorazione: 'border-l-[#f5b946] bg-[#3a3016]',
  in_attesa: 'border-l-[#9a7bf0] bg-[#2b2550]',
  conclusa: 'border-l-[#34d17f] bg-[#173a28]',
  respinta: 'border-l-[#ff6b7d] bg-[#3d1d24]',
};
const TEXT = { ricevuta: '#7ea4ee', in_lavorazione: '#f5b946', in_attesa: '#b7a0ff', conclusa: '#4ade80', respinta: '#ff8a98' };

export function DashboardView({ profile, pratiche }) {
  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() : '';
  const n = (st) => (pratiche || []).filter((p) => p.stato === st).length;
  const total = (pratiche || []).length;
  const done = n('conclusa');
  const pct = total ? Math.round((done / total) * 100) : 0;
  const daPrendere = n('ricevuta');

  // ultimi aggiornamenti (da tutte le pratiche, i più recenti)
  const attivita = useMemo(() => {
    const list = [];
    for (const p of pratiche || []) {
      for (const a of p.aggiornamenti || []) list.push({ code: p.id, tipo: p.tipo, ...a });
    }
    return list
      .sort((a, b) => (b.data?.seconds || 0) - (a.data?.seconds || 0))
      .slice(0, 4);
  }, [pratiche]);

  const inAttesa = (pratiche || []).filter((p) => p.stato === 'in_attesa').slice(0, 3);
  const ricevute = (pratiche || []).filter((p) => p.stato === 'ricevuta').slice(0, 5);

  return (
    <div className="px-5 py-7 sm:px-8">
      <h1 className="text-[22.5px] font-normal">Home</h1>
      <p className="mt-0.5 text-sm text-muted">{profile ? `${nome || 'Agente'} · ${profile.grado || 'Agente'}` : 'Caricamento…'}</p>

      <div className="mt-6 grid items-start gap-5 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        {/* colonna 1: riepilogo + da prendere in carico */}
        <div className="space-y-5">
          <section className={`rounded-2xl border ${BORDER} p-6`}>
            <div className="grid gap-6 sm:grid-cols-[1fr_1fr]">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="text-sm font-semibold uppercase tracking-wide">Concluse</div>
                <Ring value={pct} label={`${done} su ${total}`} />
                <div className="text-sm text-muted">Pratiche chiuse sulle ultime {total || 0}</div>
              </div>
              <div className={`flex flex-col items-center justify-center gap-3 border-t pt-6 text-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 ${BORDER}`}>
                <div className="text-sm font-semibold uppercase tracking-wide">Sportello oggi</div>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface2 text-link">
                  <Icon name="radio" size={30} strokeWidth={1.4} />
                </span>
                <div className="text-sm leading-snug text-link">
                  {pratiche === null ? 'Caricamento…' : daPrendere ? `${daPrendere} richieste in attesa di presa in carico` : 'Nessuna richiesta in attesa'}
                </div>
              </div>
            </div>

            <div className={`mt-6 grid grid-cols-4 gap-2 border-t pt-6 ${BORDER}`}>
              <Counter n={n('ricevuta')} label="Ricevute" color="#7ea4ee" />
              <Counter n={n('in_lavorazione')} label="In lavorazione" color="#f5b946" />
              <Counter n={n('in_attesa')} label="In attesa" color="#b7a0ff" />
              <Counter n={n('respinta')} label="Respinte" color="#ff8a98" />
            </div>

            <Link href="/pratiche" className="mt-6 flex items-center gap-4 rounded-2xl bg-primary/10 px-5 py-4 text-link transition hover:bg-primary/15">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-primary-fg">
                <Icon name="info" size={20} />
              </span>
              <span className="text-[13.5px] leading-snug">{daPrendere ? `${daPrendere} pratiche da prendere in carico.` : 'Tutte le pratiche sono state prese in carico.'} Apri la gestione.</span>
            </Link>
          </section>

          <Widget icon="clipboard" title="Da prendere in carico" href="/pratiche">
            {pratiche === null ? (
              <p className="py-8 text-center text-sm text-muted">Caricamento…</p>
            ) : ricevute.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">Nessuna pratica in attesa.</p>
            ) : (
              <ul className="divide-y divide-line">
                {ricevute.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div>
                      <div className="font-mono text-[13.5px]">#{p.id}</div>
                      <div className="text-xs text-muted">{TIPI_PRATICA[p.tipo] || p.tipo}</div>
                    </div>
                    <span className="text-sm text-muted">{fmtDay(p.creatoIl)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Widget>
        </div>

        {/* colonna 2: bacheca (comunicati) */}
        <Bacheca />

        {/* colonna 3: promemoria + attività */}
        <div className="space-y-5">
          <Widget icon="bell" title="Promemoria" href="/pratiche">
            {pratiche === null ? (
              <p className="py-6 text-center text-sm text-muted">Caricamento…</p>
            ) : inAttesa.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Nessuna pratica in attesa di documenti.</p>
            ) : (
              <ul className="divide-y divide-line">
                {inAttesa.map((p) => (
                  <li key={p.id} className="py-3.5">
                    <div className="flex items-center gap-2 text-[13.5px]">
                      <Icon name="user" size={15} /> {TIPI_PRATICA[p.tipo] || p.tipo}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm">
                      <span className="font-mono text-[#ff8a98]">#{p.id}</span>
                      <span className="flex items-center gap-1.5 text-muted">
                        <Icon name="clock" size={14} /> da {fmtDay(p.creatoIl)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted">{STATI.in_attesa.label}</div>
                  </li>
                ))}
              </ul>
            )}
          </Widget>

          <Widget icon="clock" title="Attività recenti" href="/pratiche">
            {pratiche === null ? (
              <p className="py-6 text-center text-sm text-muted">Caricamento…</p>
            ) : attivita.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Nessuna attività registrata.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {attivita.map((a, i) => (
                  <div key={i} className={`rounded-xl border-l-[3px] px-4 py-3 ${TONE[a.stato] || TONE.ricevuta}`}>
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: TEXT[a.stato] || '#7ea4ee' }}>
                      <span>{STATI[a.stato]?.label || a.stato}</span>
                      <span className="flex items-center gap-1.5 font-normal text-fg/90">
                        <Icon name="user" size={14} /> {a.agente || 'Agente'}
                      </span>
                    </div>
                    <div className="mt-1 text-[12.6px]">{a.nota || `Pratica #${a.code}`}</div>
                    <div className="mt-1 text-xs text-fg/70">
                      {fmtDay(a.data)} · #{a.code}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Widget>
        </div>
      </div>
    </div>
  );
}
