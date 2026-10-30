'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useQuesturaStatus } from './useQuesturaStatus';

const SPORTELLO = [
  { href: '/', label: 'Home', icon: 'dashboard' },
  { href: '/sportello/denuncia', label: 'Denuncia online', icon: 'file-text' },
  { href: '/sportello/porto-darmi', label: "Porto d'armi", icon: 'shield-check' },
  { href: '/sportello/colloquio', label: 'Colloquio', icon: 'calendar-check' },
  { href: '/sportello/pratica', label: 'Le mie pratiche', icon: 'search' },
];
const QUESTURA = [
  { href: '/notizie', label: 'Comunicati', icon: 'news' },
  { href: '/reclutamento', label: 'Reclutamento', icon: 'briefcase' },
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
];

function Dot({ ok, on }) {
  return <span className={`h-1.5 w-1.5 flex-none rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-fog/60'}`} />;
}

// Guscio del sito pubblico: barra laterale chiara su fondo grigio, schede bianche.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isOn = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));
  const item = (it) => (
    <Link
      key={it.href}
      href={it.href}
      aria-current={isOn(it.href) ? 'page' : undefined}
      className={`flex h-9 items-center gap-2.5 rounded-[10px] px-3 text-[14px] font-medium transition-colors ${isOn(it.href) ? 'bg-bg text-fg' : 'text-fg/75 hover:bg-bg hover:text-fg'}`}
    >
      <Icon name={it.icon} size={18} strokeWidth={1.6} className="flex-none" />
      {it.label}
    </Link>
  );

  return (
    <div className="flex min-h-screen">
      <aside
        aria-label="Menu principale"
        className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[256px] flex-col overflow-y-auto border-r border-line bg-side lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-none`}
      >
        <Link href="/" className="flex h-16 flex-none items-center gap-3 px-5" aria-label="Polizia di Stato, Questura IPRP: home">
          <img src="/assets/crest-md.png" alt="" className="h-9 w-auto flex-none" />
          <span className="leading-tight">
            <span className="block text-[14px] font-semibold tracking-[-0.01em]">Polizia di Stato</span>
            <span className="block text-[12px] text-muted">Questura IPRP</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4" aria-label="Navigazione principale">
          <div className="label px-3 pb-1.5 pt-3">Sportello</div>
          {SPORTELLO.map(item)}
          <div className="label px-3 pb-1.5 pt-5">Questura</div>
          {QUESTURA.map(item)}
          <div className="label px-3 pb-1.5 pt-5">Riservato</div>
          {item({ href: '/login', label: 'Area Agenti', icon: 'lock' })}
        </nav>
        <div className="m-3 space-y-1.5 rounded-[14px] border border-line bg-white p-3.5 text-[12px] text-muted">
          <div className="flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale: <span className="text-fg">{st.centrale || '—'}</span></div>
          <div className="flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: <span className="text-fg">{st.sportello ? st.sportello.toLowerCase() : '—'}</span></div>
        </div>
      </aside>
      {open ? <button aria-label="Chiudi il menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 flex-none items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Apri il menu" className="flex h-9 w-9 flex-none items-center justify-center rounded-[14px] text-fg transition-colors hover:bg-black/5 lg:hidden">
            <Icon name="menu" size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2.5 lg:hidden" aria-label="Home">
            <img src="/assets/crest-md.png" alt="" className="h-7 w-auto" />
          </Link>
          <span className="hidden text-[14px] text-muted sm:block">Sportello Telematico</span>
          <span className="flex-1" />
          <Link
            href="/sportello/pratica"
            className="hidden h-9 w-[260px] items-center gap-2.5 rounded-[18px] bg-white px-3.5 text-[14px] text-muted ring-1 ring-line transition-colors hover:text-fg md:flex"
          >
            <Icon name="search" size={16} /> <span className="flex-1">Cerca una pratica…</span>
            <kbd className="rounded-md bg-bg px-1.5 py-0.5 text-[11px] font-medium text-muted">Codice</kbd>
          </Link>
          <Link href="/sportello/denuncia" className="inline-flex h-9 items-center gap-2 rounded-[18px] bg-primary px-4 text-[14px] font-medium text-primary-fg transition-colors hover:bg-primary/90">
            Presenta denuncia
          </Link>
        </header>

        <main id="main" className="flex-1">{children}</main>

        <footer className="px-4 pb-8 pt-12 text-[12px] leading-relaxed text-muted sm:px-8">
          Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
          <strong className="font-medium text-fg">In caso di emergenza reale chiama il 112.</strong>
          <span className="mt-1 block">© 2026 Questura IPRP — Italian Paradise XI.</span>
        </footer>
      </div>
    </div>
  );
}
