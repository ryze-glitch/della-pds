'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { ThemeToggle } from './ThemeToggle';
import { useQuesturaStatus } from './useQuesturaStatus';
import { useSportelloConfig } from './forms/useSportelloConfig';
import { useGoogleUser } from './forms/useGoogleUser';
import { clearGoogleUser } from '../lib/googleAuth';
import { LoginModal } from './LoginModal';

const ITEMS = [
  { href: '/', label: 'Home', icon: 'dashboard' },
  { href: '/sportello/denuncia', label: 'Denuncia online', icon: 'file-text' },
  { href: '/sportello/porto-darmi', label: "Porto d'armi", icon: 'shield-check' },
  { href: '/sportello/colloquio', label: 'Colloquio', icon: 'calendar-check' },
  { href: '/sportello/pratica', label: 'Le mie pratiche', icon: 'search' },
];
const INFO = [
  { href: '/notizie', label: 'Comunicati', icon: 'news' },
  { href: '/reclutamento', label: 'Reclutamento', icon: 'briefcase' },
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
];
const AREA = { href: '/login', label: 'Area Agenti', icon: 'lock' };
const KEY = 'pds-sidebar';

// Guscio del sito per i cittadini: sidebar comprimibile + barra superiore, stile registro.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const st = useQuesturaStatus();
  const cfg = useSportelloConfig();
  const user = useGoogleUser();
  const [loginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    if (user) setLoginOpen(false);
  }, [user]);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === '1');
    } catch (e) {
      /* storage non disponibile */
    }
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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

  const isOn = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));
  const item = (it) => (
    <Link
      key={it.href}
      href={it.href}
      title={collapsed ? it.label : undefined}
      aria-label={it.label}
      aria-current={isOn(it.href) ? 'page' : undefined}
      className={`flex h-12 items-center gap-4 rounded-full px-4 text-[13.5px] transition-colors ${collapsed ? 'lg:w-12 lg:justify-center lg:px-0' : ''} ${isOn(it.href) ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'}`}
    >
      <Icon name={it.icon} size={22} strokeWidth={1.5} className="flex-none" />
      <span className={collapsed ? 'lg:hidden' : ''}>{it.label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-[color:var(--sh-page)] text-fg">
      <aside
        aria-label="Menu principale"
        className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[243px] flex-col overflow-y-auto border-r border-[color:var(--sh-side-line)] bg-[color:var(--sh-side)] transition-[width] duration-300 lg:sticky lg:top-0 lg:flex lg:h-screen ${collapsed ? 'lg:w-[82.8px]' : 'lg:w-[243px]'}`}
      >
        <Link href="/" className={`flex h-[79.2px] flex-none items-center gap-3 px-5 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`} aria-label="Polizia di Stato, Questura IPRP: home">
          <img src="/assets/crest-md.png" alt="" className="h-11 w-auto flex-none" />
          <span className={`leading-tight text-white ${collapsed ? 'lg:hidden' : ''}`}>
            <span className="block whitespace-nowrap text-[13.5px] font-semibold uppercase tracking-[0.14em]">Polizia di Stato</span>
            <span className="block text-[9.9px] uppercase tracking-[0.2em] text-white/70">Questura IPRP</span>
          </span>
        </Link>
        <div className={`mx-[18px] border-b border-white/15 pb-4 pt-3 ${collapsed ? 'lg:flex lg:justify-center' : ''}`}>
          {user ? (
            <>
              <div className={`flex items-center gap-3.5 ${collapsed ? 'lg:justify-center' : ''}`}>
                {user.picture ? (
                  <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-[37.8px] w-[37.8px] flex-none rounded-full" title={collapsed ? user.name || user.email : undefined} />
                ) : (
                  <span className="flex h-[37.8px] w-[37.8px] flex-none items-center justify-center rounded-full bg-white/15 text-[12px] font-semibold" title={collapsed ? user.name || user.email : undefined}>
                    {(user.name || user.email || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className={`min-w-0 leading-snug ${collapsed ? 'lg:hidden' : ''}`}>
                  <span className="block truncate text-[12.2px] font-semibold text-white">{user.name || 'Account Google'}</span>
                  <span className="block truncate text-[11.7px] text-white/75">{user.email}</span>
                </span>
              </div>
              <button type="button" onClick={() => clearGoogleUser()} className={`mt-2.5 text-[12px] text-white/70 transition hover:text-white ${collapsed ? 'lg:hidden' : ''}`}>
                Esci dall'account
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              title={collapsed ? 'Accedi' : undefined}
              aria-label="Accedi con Google"
              className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#17a8bd] text-[14px] font-semibold text-[#04222a] transition hover:brightness-110 ${collapsed ? 'lg:w-12' : ''}`}
            >
              <Icon name="user" size={19} className="flex-none" />
              <span className={collapsed ? 'lg:hidden' : ''}>Accedi con Google</span>
            </button>
          )}
        </div>
        <nav className={`flex flex-1 flex-col gap-0.5 px-4 pt-4 ${collapsed ? 'lg:items-center lg:px-0' : ''}`} aria-label="Navigazione principale">
          {ITEMS.map(item)}
          <hr className={`my-2 border-white/15 ${collapsed ? 'lg:w-10' : ''}`} />
          {INFO.map(item)}
          <hr className={`my-2 border-white/15 ${collapsed ? 'lg:w-10' : ''}`} />
          {item(AREA)}
        </nav>
        <div
            title={collapsed ? `Centrale Operativa: ${st.centrale || '—'}` : undefined}
            className={`m-3 flex h-12 flex-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-black/25 text-[11.7px] font-medium text-white ${collapsed ? 'lg:mx-auto lg:w-12' : ''}`}
          >
            <Icon name="radio" size={18} />
            <span className={collapsed ? 'lg:hidden' : ''}>Centrale · {st.centrale || '—'}</span>
          </div>
      </aside>
      {loginOpen ? <LoginModal clientId={cfg && cfg.googleClientId} onClose={() => setLoginOpen(false)} /> : null}
      {open ? <button aria-label="Chiudi il menu" className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="shell-main flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[79.2px] flex-none items-center gap-4 border-b border-[color:var(--sh-line)] bg-[color:var(--sh-bar)] px-5 backdrop-blur sm:gap-5 sm:px-6">
          <button type="button" onClick={toggle} aria-label="Mostra o nascondi il menu" className="flex h-[41px] w-[41px] flex-none items-center justify-center rounded-full border border-[color:var(--sh-in)] bg-white/5 text-fg transition hover:bg-white/10">
            <Icon name="menu" size={22} />
          </button>
          <span className="truncate text-[13.1px] font-medium">Sportello Telematico</span>
          <span className="flex-1" />
          <div className="hidden text-[13px] leading-snug text-[color:var(--sh-sec)] md:block">
            <div>Questura IPRP</div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${st.centrale ? (st.centraleOk ? 'bg-[#34d17f]' : 'bg-[#ff6b7d]') : 'bg-[#4b5668]'}`} /> Centrale Operativa: {st.centrale || '—'}
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${st.sportello ? (st.sportelloOk ? 'bg-[#34d17f]' : 'bg-[#ff6b7d]') : 'bg-[#4b5668]'}`} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}
            </div>
          </div>
          <ThemeToggle />
          {user ? (
            <Link href="/sportello/pratica" aria-label="Le mie pratiche" title={user.email} className="flex h-[41.4px] w-[41.4px] flex-none items-center justify-center overflow-hidden rounded-full bg-[#12b3c4] text-[#04222a] transition hover:brightness-110">
              {user.picture ? <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <span className="text-sm font-semibold">{(user.name || user.email || '?').slice(0, 1).toUpperCase()}</span>}
            </Link>
          ) : (
            <button type="button" onClick={() => setLoginOpen(true)} className="flex h-[43px] flex-none items-center gap-2 rounded-full bg-[#17a8bd] px-6 text-[14px] font-semibold text-[#04222a] transition hover:brightness-110">
              <Icon name="user" size={18} /> Accedi
            </button>
          )}
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-[color:var(--sh-line)] px-5 py-6 text-[11.7px] leading-relaxed text-muted sm:px-8">
          Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
          <strong className="font-medium text-fg">In caso di emergenza reale chiama il 112.</strong>
          <span className="mt-1 block text-xs">© 2026 Questura IPRP — Italian Paradise XI.</span>
        </footer>
      </div>
    </div>
  );
}
