'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useAgentProfile } from './useAgentProfile';

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/pratiche', label: 'Gestione pratiche', icon: 'file-text' },
  { href: '/candidature', label: 'Candidature', icon: 'clipboard' },
];

const SITE = [
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
  { href: '/notizie', label: 'Comunicati', icon: 'news' },
  { href: '/', label: 'Torna al sito', icon: 'landmark' },
];

// Guscio dell'area riservata: sidebar + barra superiore, stile registro.
export function AgentShell({ children }) {
  const pathname = usePathname();
  const { profile, logout } = useAgentProfile();
  const [open, setOpen] = useState(false);
  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : '…';
  const initials = profile ? (((profile.nome || '')[0] || '') + ((profile.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  const item = (it) => {
    const on = pathname === it.href || pathname.startsWith(it.href + '/');
    return (
      <Link
        key={it.href}
        href={it.href}
        onClick={() => setOpen(false)}
        className={`flex h-12 items-center gap-4 rounded-full px-4 text-[15px] transition-colors ${on ? 'bg-[#0f3947] text-[#17a8bd]' : 'text-fg hover:bg-white/5'}`}
      >
        <Icon name={it.icon} size={22} strokeWidth={1.5} /> {it.label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#141a24] text-fg">
      <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[262px] flex-col border-r border-[#242d3b] bg-[#121821] lg:static lg:flex`}>
        <Link href="/" className="flex h-[88px] items-center gap-3 px-5">
          <img src="/assets/crest-md.png" alt="" className="h-11 w-auto" />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold uppercase tracking-[0.14em]">Questura</span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Area agenti</span>
          </span>
        </Link>
        <div className="mx-[18px] flex items-center gap-3.5 border-b border-[#242d3b] pb-4 pt-3">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#2c3441] text-[13px] font-semibold">{initials || <Icon name="user" size={18} />}</span>
          <span className="min-w-0 leading-snug">
            <span className="block truncate text-[13.5px] font-semibold uppercase">{nome}</span>
            <span className="block truncate text-[13px] text-[#c9d2e0]">{profile?.grado || 'Agente'}</span>
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-4 pt-4" aria-label="Area riservata">
          {ITEMS.map(item)}
          <hr className="my-2 border-[#242d3b]" />
          {SITE.map(item)}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-3 flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#17a8bd] text-[13px] font-medium text-white transition hover:brightness-110"
        >
          <Icon name="logout" size={17} /> Esci
        </button>
      </aside>
      {open ? <button aria-label="Chiudi il menu" className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[88px] flex-none items-center gap-5 border-b border-[#242d3b] bg-[#121821] px-5 sm:px-6">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Apri il menu" className="lg:hidden">
            <Icon name="menu" size={24} />
          </button>
          <span className="text-[14.5px] font-medium">Area Riservata Agenti</span>
          <span className="flex-1" />
          <span className="hidden text-right text-[13px] leading-snug text-[#c9d2e0] sm:block">
            Questura IPRP
            <br />
            Italian Paradise XI
          </span>
          <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#12b3c4] text-white">
            <Icon name="user" size={22} />
          </span>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
