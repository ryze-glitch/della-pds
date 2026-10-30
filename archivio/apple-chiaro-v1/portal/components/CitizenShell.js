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
  return <span className={`h-1.5 w-1.5 rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-fog'}`} />;
}

// Guscio del sito pubblico: barra globale sottile, barra del servizio con i comandi, piè di pagina grigio chiaro.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const on = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40">
        <div className="border-b border-[#e6e6e8] bg-white/80 backdrop-blur-[20px]">
          <div className="mx-auto flex h-11 w-full max-w-[1200px] items-center gap-2 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex flex-none items-center" aria-label="Polizia di Stato, Questura IPRP: home">
              <img src="/assets/crest-md.png" alt="" className="h-[26px] w-auto" />
            </Link>
            <nav aria-label="Navigazione principale" className="hidden flex-1 items-center justify-between pl-6 text-[12px] lg:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} aria-current={on(n.href) ? 'page' : undefined} className={`px-2 py-3 tracking-[-0.01em] transition-colors ${on(n.href) ? 'text-fg' : 'text-fg/80 hover:text-fg'}`}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <span className="flex-1 lg:hidden" />
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Apri il menu" className="flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-black/5 lg:hidden">
              <Icon name={open ? 'x' : 'menu'} size={20} />
            </button>
          </div>
          {open ? (
            <nav aria-label="Menu" className="border-t border-[#e6e6e8] bg-[#fafafc] px-4 pb-6 pt-2 lg:hidden">
              <ul className="mx-auto max-w-[1200px] divide-y divide-line">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="flex items-center justify-between py-3.5 text-[17px] font-medium text-fg">
                      {n.label} <Icon name="chevron" size={18} className="text-fog" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className="hidden border-b border-line bg-white/90 backdrop-blur-[20px] sm:block">
          <div className="mx-auto flex h-[52px] w-full max-w-[1200px] items-center gap-3 px-6 lg:px-8">
            <Link href="/" className="text-[19px] font-semibold tracking-[0.012em]">Sportello Telematico</Link>
            <span className="hidden items-center gap-2 pl-3 text-[12px] text-muted md:flex" title="Stato della Centrale Operativa">
              <Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale · {st.centrale || '—'}
            </span>
            <span className="flex-1" />
            <Link href="/sportello/pratica" className="inline-flex h-8 items-center rounded-full border border-fog px-4 text-[12px] text-fg transition-colors hover:bg-black/5">
              Le mie pratiche
            </Link>
            <Link href="/sportello/denuncia" className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-[12px] text-primary-fg transition-colors hover:bg-[#0077ed]">
              Presenta denuncia
            </Link>
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="mt-24 bg-surface text-[12px] text-muted">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-fg">
              <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
              <span className="text-[14px] font-semibold">Polizia di Stato · Questura IPRP</span>
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed">Sportello telematico: denunce, porto d’armi e colloqui con i dirigenti, con un codice e uno stato sempre consultabile.</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale Operativa: {st.centrale || '—'}</div>
              <div className="flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-fg">Servizi</div>
            <ul className="mt-3 space-y-2">
              {NAV.slice(0, 4).map((n) => (<li key={n.href}><Link href={n.href} className="hover:text-fg hover:underline">{n.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-fg">Questura</div>
            <ul className="mt-3 space-y-2">
              {NAV.slice(4).map((n) => (<li key={n.href}><Link href={n.href} className="hover:text-fg hover:underline">{n.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-fg">Emergenza</div>
            <p className="mt-3 leading-relaxed">In caso di emergenza reale chiama il <strong className="text-fg">112</strong>.</p>
          </div>
        </div>
        <div className="border-t border-line">
          <p className="mx-auto max-w-[1200px] px-4 py-5 leading-relaxed sm:px-6">
            Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi. © 2026 Questura IPRP — Italian Paradise XI.
          </p>
        </div>
      </footer>
    </div>
  );
}
