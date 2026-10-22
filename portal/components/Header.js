'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { NAV, AREA } from './nav';
import { ThemeSwitch } from './ThemeSwitch';

// Stato della Questura: se esiste il documento Firestore config/status lo
// usa (gestibile da console), altrimenti ricava l'orario dello sportello.
function useQuesturaStatus() {
  const [remote, setRemote] = useState(null);
  const [hour, setHour] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', hour: 'numeric', hour12: false });
    const tick = () => setHour(parseInt(fmt.format(new Date()), 10) % 24);
    tick();
    const id = setInterval(tick, 60000);
    let unsub = () => {};
    let cancelled = false;
    import('../lib/firebase')
      .then(async ({ db }) => {
        const { doc, onSnapshot } = await import('firebase/firestore');
        if (cancelled) return;
        unsub = onSnapshot(
          doc(db, 'config', 'status'),
          (snap) => setRemote(snap.exists() ? snap.data() : null),
          () => setRemote(null)
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      clearInterval(id);
      unsub();
    };
  }, []);

  const apertoOra = hour === null ? true : hour >= 8 && hour < 23;
  const centrale = (remote && remote.centrale) || 'ATTIVA';
  const sportello = (remote && remote.sportello) || (apertoOra ? 'APERTO AL PUBBLICO' : 'CHIUSO');
  return { centrale, sportello, centraleOk: centrale.toUpperCase().startsWith('ATTIV'), sportelloOk: sportello.toUpperCase().startsWith('APERT') };
}

function Dot({ ok }) {
  return (
    <span className="relative flex h-2 w-2 flex-none">
      {ok ? <span className="ping-soft absolute inset-0 rounded-full bg-[#4ade80]" /> : null}
      <span className={`relative h-2 w-2 rounded-full ${ok ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`} />
    </span>
  );
}

function TopBar() {
  const st = useQuesturaStatus();
  return (
    <div className="bg-primary text-primary-fg">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-4 py-2 text-[12px] sm:px-6 lg:px-8">
        <span className="hidden font-medium tracking-wide opacity-90 md:block">
          Repubblica Italiana <span className="mx-1.5 opacity-50">·</span> Polizia di Stato <span className="mx-1.5 opacity-50">·</span> Questura IPRP
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-2 font-semibold uppercase tracking-wide">
            <Dot ok={st.centraleOk} /> Centrale Operativa: {st.centrale}
          </span>
          <span className="flex items-center gap-2 font-semibold uppercase tracking-wide">
            <Dot ok={st.sportelloOk} /> Sportello: {st.sportello}
          </span>
        </div>
        <ThemeSwitch compact />
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
    setSub(false);
  }, [pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const isActive = (item) => (item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/'));
  const areaActive = ['/login', '/dashboard', '/candidature', '/pratiche'].includes(pathname);

  return (
    <>
      <TopBar />
      <header className={`sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-card' : ''}`}>
        <div className="gold-rule" />
        <div className="mx-auto flex max-w-page items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Polizia di Stato — Questura IPRP, vai alla home">
            <img src="/assets/crest-md.png" width="60" height="95" alt="" className="h-12 w-auto" />
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold uppercase tracking-[0.04em] text-primary">Polizia di Stato</span>
              <span className="block whitespace-nowrap text-[12px] font-medium text-muted">Questura IPRP · Italian Paradise XI</span>
            </span>
          </Link>

          <nav aria-label="Navigazione principale" className="ml-6 hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-surface ${isActive(item) ? 'text-link' : 'text-fg'}`}
                  >
                    {item.label} <Icon name="chevron-down" size={15} />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 w-80 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-lg border border-line bg-bg shadow-pop">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="flex items-start gap-3 px-4 py-3 hover:bg-surface">
                          <Icon name={c.icon} size={19} className="mt-0.5 text-link" />
                          <span>
                            <span className="block text-sm font-semibold">{c.label}</span>
                            <span className="block text-xs text-muted">{c.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item) ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-[14px] font-semibold transition-colors hover:bg-surface ${isActive(item) ? 'text-link' : 'text-fg'}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={AREA.href}
              aria-current={areaActive ? 'page' : undefined}
              className="hidden items-center gap-2 whitespace-nowrap rounded-md border border-primary bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-fg transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              <Icon name="lock" size={15} /> {AREA.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Chiudi il menu' : 'Apri il menu di navigazione'}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-line xl:hidden"
            >
              <Icon name={open ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        {open ? (
          <nav aria-label="Menu mobile" className="max-h-[75vh] overflow-y-auto border-t border-line bg-bg px-4 pb-6 pt-2 xl:hidden">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.href} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setSub((s) => !s)}
                    aria-expanded={sub}
                    className="flex w-full items-center justify-between py-4 text-left text-[17px] font-semibold"
                  >
                    {item.label} <Icon name="chevron-down" size={18} className={`transition-transform ${sub ? 'rotate-180' : ''}`} />
                  </button>
                  {sub ? (
                    <div className="pb-3 pl-2">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="flex items-center gap-3 py-2.5 text-[15px] text-muted hover:text-fg">
                          <Icon name={c.icon} size={18} className="text-link" /> {c.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="block border-b border-line py-4 text-[17px] font-semibold">
                  {item.label}
                </Link>
              )
            )}
            <Link href={AREA.href} className="mt-5 flex h-12 items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-fg">
              <Icon name="lock" size={17} /> {AREA.label}
            </Link>
          </nav>
        ) : null}
      </header>
    </>
  );
}
