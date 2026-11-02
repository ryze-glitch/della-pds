'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from './icons';
import { useQuesturaStatus } from './useQuesturaStatus';

const TABS = [
  { href: '/', label: 'Home', icon: 'dashboard' },
  { href: '/sportello', label: 'Servizi', icon: 'file-text', match: (p) => p === '/sportello' || /^\/sportello\/(denuncia|porto-darmi|colloquio)/.test(p) },
  { href: '/sportello/pratica', label: 'Pratiche', icon: 'search' },
];
const ALTRO = [
  { href: '/notizie', label: 'Comunicati', icon: 'news' },
  { href: '/reclutamento', label: 'Reclutamento', icon: 'briefcase' },
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
  { href: '/login', label: 'Area Agenti', icon: 'lock' },
];

function Dot({ ok, on }) {
  return <span aria-hidden="true" className={`h-2 w-2 flex-none rounded-full ${on ? (ok ? 'bg-ok' : 'bg-bad') : 'bg-fog'}`} />;
}

// Guscio dell'app: colonna centrata con dissolvenza blu in cima, barra in alto, tab in basso.
export function CitizenShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const st = useQuesturaStatus();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menu]);

  const home = pathname === '/';
  const tabOn = (t) => (t.match ? t.match(pathname) : t.href === '/' ? home : pathname === t.href || pathname.startsWith(t.href + '/'));
  const altroOn = ALTRO.some((a) => pathname === a.href || pathname.startsWith(a.href + '/'));

  function indietro() {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/');
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-black">
      <div className="app-fade pointer-events-none absolute inset-x-0 top-0 h-[560px]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[640px] flex-col pb-[96px]">
        <header className="flex h-[72px] flex-none items-center justify-between px-5">
          {home ? (
            <Link href="/" className="flex min-h-[44px] items-center gap-3" aria-label="Polizia di Stato, Questura IPRP: home">
              <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
              <span className="text-[17px] font-semibold tracking-[-0.01em]">Questura IPRP</span>
            </Link>
          ) : (
            <button type="button" onClick={indietro} aria-label="Indietro" className="-ml-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10">
              <Icon name="arrow-left" size={26} strokeWidth={1.8} />
            </button>
          )}
          <Link href="/login" aria-label="Area agenti" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
            <Icon name="lock" size={20} strokeWidth={1.8} />
          </Link>
        </header>

        <main id="main" className="flex-1">{children}</main>

        <footer className="px-5 pb-6 pt-12 text-[13px] leading-relaxed text-muted">
          <div className="mb-4 space-y-1.5">
            <div className="flex items-center gap-2"><Dot on={!!st.centrale} ok={st.centraleOk} /> Centrale Operativa: {st.centrale || '—'}</div>
            <div className="flex items-center gap-2"><Dot on={!!st.sportello} ok={st.sportelloOk} /> Sportello: {st.sportello ? st.sportello.toLowerCase() : '—'}</div>
          </div>
          Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi.{' '}
          <strong className="text-white">In caso di emergenza reale chiama il 112.</strong> © 2026 Questura IPRP — Italian Paradise XI.
        </footer>
      </div>

      <nav aria-label="Navigazione principale" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-black/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="mx-auto grid max-w-[640px] grid-cols-4">
          {TABS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} aria-current={tabOn(t) ? 'page' : undefined} className={`flex min-h-[64px] flex-col items-center justify-center gap-1 text-[12px] font-medium ${tabOn(t) ? 'text-white' : 'text-muted hover:text-white'}`}>
                <Icon name={t.icon} size={24} strokeWidth={tabOn(t) ? 2.2 : 1.6} />
                {t.label}
              </Link>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setMenu(true)} aria-haspopup="dialog" aria-expanded={menu} className={`flex min-h-[64px] w-full flex-col items-center justify-center gap-1 text-[12px] font-medium ${altroOn ? 'text-white' : 'text-muted hover:text-white'}`}>
              <Icon name="menu" size={24} strokeWidth={altroOn ? 2.2 : 1.6} />
              Altro
            </button>
          </li>
        </ul>
      </nav>

      {menu ? (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="app-fade fixed inset-0 z-50 overflow-y-auto bg-black">
          <div className="mx-auto flex min-h-full w-full max-w-[640px] flex-col px-5 pb-10">
            <div className="flex h-[72px] flex-none items-center justify-between">
              <span className="text-[17px] font-semibold">Menu</span>
              <button type="button" onClick={() => setMenu(false)} aria-label="Chiudi il menu" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <Icon name="x" size={22} strokeWidth={2} />
              </button>
            </div>
            <h2 className="h1 mt-6">Questura IPRP</h2>
            <ul className="mt-8">
              {ALTRO.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="riga min-h-[64px] text-[20px] font-medium">
                    <Icon name={a.icon} size={22} strokeWidth={1.7} className="text-muted" />
                    <span className="flex-1">{a.label}</span>
                    <Icon name="chevron" size={20} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-[20px] bg-surface p-4 text-[15px] text-muted">In caso di emergenza reale chiama il <strong className="text-white">112</strong>.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
