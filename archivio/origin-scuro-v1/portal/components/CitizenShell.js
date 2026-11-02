'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useQuesturaStatus } from './useQuesturaStatus';

const NAV = [
  { href: '/sportello/denuncia', label: 'Denuncia' },
  { href: '/sportello/porto-darmi', label: "Porto d'armi" },
  { href: '/sportello/colloquio', label: 'Colloquio' },
];
const MORE = [
  { href: '/notizie', label: 'Comunicati' },
  { href: '/reclutamento', label: 'Reclutamento' },
  { href: '/organigramma', label: 'Organigramma' },
];

function Dot({ ok, on }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-fog'}`} />;
}

// Guscio del sito pubblico: barra in vetro smerigliato, contenuto centrato, piè di pagina a colonne.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const on = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/70 backdrop-blur-[24px]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-none items-center gap-3" aria-label="Polizia di Stato, Questura IPRP: home">
            <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
            <span className="hidden leading-tight sm:block">
              <span className="block font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-white">Polizia di Stato</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Questura IPRP</span>
            </span>
          </Link>

          <nav aria-label="Navigazione principale" className="ml-6 hidden items-center gap-2 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on(n.href) ? 'page' : undefined}
                className={`rounded-lg border px-3 py-[9px] font-mono text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${on(n.href) ? 'border-white bg-white/10 text-white' : 'border-white/30 text-white hover:border-white hover:bg-white/10'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <span className="flex-1" />

          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted xl:flex" title="Stato della Centrale Operativa">
            <Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale · {st.centrale || '—'}
          </span>
          <Link href="/login" className="hidden px-2 text-[15px] font-normal text-white/90 transition-colors hover:text-white sm:block">
            Area Agenti
          </Link>
          <Link href="/sportello/pratica" className="hidden h-10 items-center gap-2 rounded-lg bg-white px-[18px] text-[15px] font-normal text-black transition-colors hover:bg-white/85 sm:inline-flex">
            Le mie pratiche <Icon name="arrow-right" size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Apri il menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
          </button>
        </div>

        {open ? (
          <nav aria-label="Menu" className="border-t border-white/10 bg-bg px-4 pb-6 pt-3 lg:hidden">
            <ul className="mx-auto max-w-[1200px] divide-y divide-line">
              {[...NAV, { href: '/sportello/pratica', label: 'Le mie pratiche' }, ...MORE, { href: '/login', label: 'Area Agenti' }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="flex items-center justify-between py-3.5 text-[16px] text-white">
                    {n.label} <Icon name="chevron" size={18} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main">{children}</main>

      <footer className="mt-24 border-t border-white/10 bg-surface">
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/assets/crest-md.png" alt="" className="h-10 w-auto" />
              <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em]">Polizia di Stato · Questura IPRP</span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted">
              Sportello telematico della Questura IPRP: denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
            </p>
            <div className="mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              <div className="flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale Operativa: {st.centrale || '—'}</div>
              <div className="flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}</div>
            </div>
          </div>
          <div>
            <div className="label">Servizi</div>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {[...NAV, { href: '/sportello/pratica', label: 'Stato della pratica' }].map((n) => (
                <li key={n.href}><Link href={n.href} className="text-white/90 transition-colors hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label">Questura</div>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {[...MORE, { href: '/login', label: 'Area Agenti' }].map((n) => (
                <li key={n.href}><Link href={n.href} className="text-white/90 transition-colors hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-[1200px] px-4 py-6 text-[12px] leading-relaxed text-muted sm:px-6 lg:px-8">
            Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
            <strong className="font-medium text-white">In caso di emergenza reale chiama il 112.</strong> © 2026 Questura IPRP — Italian Paradise XI.
          </p>
        </div>
      </footer>
    </div>
  );
}
