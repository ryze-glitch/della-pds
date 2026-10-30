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
  { href: '/sportello/pratica', label: 'Pratiche' },
  { href: '/notizie', label: 'Comunicati' },
  { href: '/reclutamento', label: 'Reclutamento' },
  { href: '/organigramma', label: 'Organigramma' },
  { href: '/login', label: 'Area Agenti' },
];

function Dot({ ok, on }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-white/30'}`} />;
}

// Guscio del sito pubblico: barra fluttuante a pillola, contenuto centrato, piè di pagina scuro.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const on = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen">
      <div className="sticky top-3 z-40 flex justify-center px-3 pt-3 sm:top-5 sm:pt-5">
        <header className="w-full max-w-[1000px] rounded-[10px] border border-line bg-surface/95 backdrop-blur lg:w-fit">
          <div className="flex items-center gap-1 px-[11px] py-[7px] lg:gap-0 lg:px-[22px]">
            <Link href="/" className="mr-2 flex flex-none items-center gap-2.5 lg:mr-5" aria-label="Polizia di Stato, Questura IPRP: home">
              <img src="/assets/crest-md.png" alt="" className="h-7 w-auto" />
              <span className="text-[14px] tracking-[-0.02em] lg:hidden">Questura IPRP</span>
            </Link>
            <nav aria-label="Navigazione principale" className="hidden items-center lg:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} aria-current={on(n.href) ? 'page' : undefined} className={`px-3 py-2 text-[15px] transition-colors hover:underline ${on(n.href) ? 'text-primary' : 'text-fg'}`}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <span className="flex-1 lg:hidden" />
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Apri il menu" className="flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-black/5 lg:hidden">
              <Icon name={open ? 'x' : 'menu'} size={20} strokeWidth={1.4} />
            </button>
          </div>
          {open ? (
            <nav aria-label="Menu" className="border-t border-line px-4 pb-3 pt-1 lg:hidden">
              <ul className="divide-y divide-line">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={`flex items-center justify-between py-3 text-[16px] ${on(n.href) ? 'text-primary' : ''}`}>
                      {n.label} <Icon name="chevron" size={16} className="text-fog" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </header>
      </div>

      <main id="main">{children}</main>

      <footer className="mt-[100px] bg-dark text-white">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-[50px] sm:px-6 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <img src="/assets/crest-md.png" alt="" className="h-12 w-auto" />
            <div className="mt-5 text-[18px] tracking-[-0.02em]">Polizia di Stato · Questura IPRP</div>
            <p className="mt-2 max-w-md text-[13px] leading-snug text-white/60">Sportello telematico: denunce, porto d’armi e colloqui con i dirigenti.</p>
            <nav aria-label="Piè di pagina" className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px]">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-white/85 transition-colors hover:text-white hover:underline">{n.label}</Link>
              ))}
            </nav>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] text-white/60">
              <span className="inline-flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale Operativa: {st.centrale || '—'}</span>
              <span className="inline-flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}</span>
            </div>
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] leading-relaxed text-white/50">
            Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
            <span className="text-white/80">In caso di emergenza reale chiama il 112.</span> © 2026 Questura IPRP — Italian Paradise XI.
          </p>
        </div>
      </footer>
    </div>
  );
}
