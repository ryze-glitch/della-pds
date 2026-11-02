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
  { href: '/sportello/pratica', label: 'Le mie pratiche' },
  { href: '/notizie', label: 'Comunicati' },
  { href: '/reclutamento', label: 'Reclutamento' },
  { href: '/organigramma', label: 'Organigramma' },
];

function Dot({ ok, on }) {
  return <span aria-hidden="true" className={`h-2 w-2 rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-fog'}`} />;
}

// Guscio del sito pubblico: barra bianca con logo e link, contenuto, piè di pagina.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const on = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-40 bg-white">
        <div className="mx-auto flex min-h-[76px] w-full max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex min-h-[44px] items-center gap-3" aria-label="Polizia di Stato, Questura IPRP: home">
            <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
            <span className="text-[18px] font-extrabold tracking-[-0.02em]">Questura IPRP</span>
          </Link>
          <nav aria-label="Navigazione principale" className="hidden flex-wrap items-center gap-x-6 xl:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={on(n.href) ? 'page' : undefined} className={`inline-flex min-h-[44px] items-center text-[15px] hover:underline hover:underline-offset-[6px] ${on(n.href) ? 'font-extrabold text-primary' : 'font-semibold'}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden min-h-[44px] items-center text-[15px] font-semibold hover:underline hover:underline-offset-[6px] sm:inline-flex">Area Agenti</Link>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-fg xl:hidden">
              <Icon name={open ? 'x' : 'menu'} size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        {open ? (
          <nav id="menu-mobile" aria-label="Menu" className="border-t-2 border-fg bg-white px-5 pb-4 xl:hidden">
            <ul className="divide-y divide-line">
              {[...NAV, { href: '/login', label: 'Area Agenti' }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`flex min-h-[52px] items-center justify-between text-[18px] ${on(n.href) ? 'font-extrabold text-primary' : 'font-bold'}`}>
                    {n.label} <Icon name="arrow-right" size={20} strokeWidth={2.4} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main">{children}</main>

      <footer className="border-t-2 border-fg">
        <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-12">
          <div>
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-3">
              <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
              <span className="text-[18px] font-extrabold tracking-[-0.02em]">Questura IPRP</span>
            </Link>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">Sportello telematico della Polizia di Stato del server Italian Paradise XI.</p>
            <div className="mt-4 space-y-1.5 text-[14px] font-semibold text-muted">
              <div className="flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale Operativa: {st.centrale || '—'}</div>
              <div className="flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}</div>
            </div>
          </div>
          <div>
            <div className="label">Servizi</div>
            <ul className="mt-3">
              {NAV.slice(0, 4).map((n) => (<li key={n.href}><Link href={n.href} className="inline-flex min-h-[44px] items-center text-[16px] font-semibold hover:underline">{n.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <div className="label">Questura</div>
            <ul className="mt-3">
              {[...NAV.slice(4), { href: '/login', label: 'Area Agenti' }].map((n) => (<li key={n.href}><Link href={n.href} className="inline-flex min-h-[44px] items-center text-[16px] font-semibold hover:underline">{n.label}</Link></li>))}
            </ul>
          </div>
        </div>
        <p className="mx-auto max-w-[1360px] border-t border-line px-5 py-6 text-[14px] leading-relaxed text-muted sm:px-8 lg:px-12">
          Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
          <strong className="text-fg">In caso di emergenza reale chiama il 112.</strong> © 2026 Questura IPRP — Italian Paradise XI.
        </p>
      </footer>
    </div>
  );
}
