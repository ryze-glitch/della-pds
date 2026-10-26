'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { ThemeToggle } from './ThemeToggle';
import { useAgentProfile } from './useAgentProfile';

const ITEMS = [
  { href: '/dashboard', label: 'Home', icon: 'dashboard' },
  { href: '/pratiche', label: 'Pratiche', icon: 'file-text' },
  { href: '/candidature', label: 'Candidature', icon: 'clipboard' },
  { href: '/comunicati', label: 'Comunicati', icon: 'megaphone' },
  { href: '/impostazioni', label: 'Impostazioni', icon: 'shield' },
];

const SITE = [
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
  { href: '/', label: 'Torna al sito', icon: 'landmark' },
];

const KEY = 'pds-sidebar';

// Guscio dell'area riservata: sidebar comprimibile + barra superiore, stile registro.
export function AgentShell({ children, preview = false }) {
  const pathname = usePathname();
  const { profile: realProfile, logout } = useAgentProfile(preview);
  const profile = preview ? { nome: 'Marco', cognome: 'Ferrari', grado: 'Ispettore' } : realProfile;
  const [open, setOpen] = useState(false); // drawer mobile
  const [collapsed, setCollapsed] = useState(false); // sidebar solo icone (desktop)
  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : '…';
  const initials = profile ? (((profile.nome || '')[0] || '') + ((profile.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === '1');
    } catch (e) {
      /* storage non disponibile */
    }
  }, []);

  function toggle() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setCollapsed((c) => {
        try {
          localStorage.setItem(KEY, c ? '0' : '1');
        } catch (e) {
          /* ignora */
        }
        return !c;
      });
    } else {
      setOpen((o) => !o);
    }
  }

  const item = (it) => {
    const on = pathname === it.href || pathname.startsWith(it.href + '/');
    return (
      <Link
        key={it.href}
        href={it.href}
        title={collapsed ? it.label : undefined}
        aria-label={it.label}
        onClick={() => setOpen(false)}
        className={`flex h-12 items-center gap-4 rounded-full text-[13.5px] transition-colors ${collapsed ? 'lg:w-12 lg:justify-center lg:px-0' : ''} px-4 ${on ? 'bg-[color:var(--sh-active)] text-white' : 'text-white/90 hover:bg-white/10'}`}
      >
        <Icon name={it.icon} size={22} strokeWidth={1.5} className="flex-none" />
        <span className={collapsed ? 'lg:hidden' : ''}>{it.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[color:var(--sh-page)] text-fg">
      <header className="shell-main sticky top-0 z-40 flex h-[72px] items-stretch border-b border-[color:var(--sh-line)] bg-[color:var(--sh-bar)]">
        <Link href="/" className={`flex flex-none items-center gap-3 px-4 sm:px-5 lg:border-r lg:border-[color:var(--sh-line)] ${collapsed ? 'lg:w-[82.8px] lg:justify-center lg:px-0' : 'lg:w-[243px]'} transition-[width] duration-300`} aria-label="Questura IPRP, torna al sito">
          <img src="/assets/crest-md.png" alt="" className="h-10 w-auto flex-none" />
          <span className={`hidden leading-tight sm:block ${collapsed ? 'lg:hidden' : ''}`}>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.14em]">Questura</span>
            <span className="block text-[9.9px] uppercase tracking-[0.2em] text-[color:var(--sh-sec)]">Area agenti</span>
          </span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-4 px-4 sm:gap-5 sm:px-6">
          <button type="button" onClick={toggle} aria-label="Mostra o nascondi il menu" className="flex h-[41px] w-[41px] flex-none items-center justify-center rounded-full border border-[color:var(--sh-in)] bg-white/5 text-fg transition hover:bg-white/10">
            <Icon name="menu" size={22} />
          </button>
          <span className="truncate text-[13.1px] font-medium">Area Riservata Agenti</span>
          <span className="flex-1" />
          <span className="hidden text-right text-[11.7px] leading-snug text-[color:var(--sh-sec)] sm:block">
            Questura IPRP
            <br />
            Italian Paradise XI
          </span>
          <ThemeToggle />
          <span className="flex h-[41.4px] w-[41.4px] items-center justify-center rounded-full bg-[#12b3c4] text-white">
            <Icon name="user" size={22} />
          </span>
        </div>
      </header>
      <div className="flex">
      <aside
        aria-label="Menu area riservata"
        className={`${open ? 'flex' : 'hidden'} fixed bottom-0 left-0 top-[72px] z-30 w-[243px] flex-none flex-col overflow-y-auto border-r border-[color:var(--sh-side-line)] bg-[color:var(--sh-side)] transition-[width] duration-300 lg:sticky lg:flex lg:h-[calc(100vh-72px)] lg:self-start ${collapsed ? 'lg:w-[82.8px]' : 'lg:w-[243px]'}`}
      >
        <div className={`mx-[18px] flex items-center gap-3.5 border-b border-white/15 pb-4 pt-5 ${collapsed ? 'lg:justify-center' : ''}`}>
          <span className="flex h-[37.8px] w-[37.8px] flex-none items-center justify-center rounded-full bg-white/15 text-[11.7px] font-semibold" title={collapsed ? nome : undefined}>
            {initials || <Icon name="user" size={18} />}
          </span>
          <span className={`min-w-0 leading-snug ${collapsed ? 'lg:hidden' : ''}`}>
            <span className="block truncate text-[12.2px] font-semibold uppercase text-white">{nome}</span>
            <span className="block truncate text-[11.7px] text-white/75">{profile?.grado || 'Agente'}</span>
          </span>
        </div>
        <nav className={`flex flex-1 flex-col gap-0.5 px-4 pt-4 ${collapsed ? 'lg:items-center lg:px-0' : ''}`} aria-label="Area riservata">
          {ITEMS.map(item)}
          <hr className={`my-2 border-white/15 ${collapsed ? 'lg:w-10' : ''}`} />
          {SITE.map(item)}
        </nav>
        <button
          type="button"
          onClick={logout}
          title={collapsed ? 'Esci' : undefined}
          aria-label="Esci"
          className={`m-3 flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#17a8bd] text-[11.7px] font-medium text-white transition hover:brightness-110 ${collapsed ? 'lg:mx-auto lg:w-12' : ''}`}
        >
          <Icon name="logout" size={18} />
          <span className={collapsed ? 'lg:hidden' : ''}>Esci</span>
        </button>
      </aside>
      {open ? <button aria-label="Chiudi il menu" className="fixed inset-0 top-[72px] z-20 bg-black/50 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="shell-main flex min-w-0 flex-1 flex-col">
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
      </div>
    </div>
  );
}
