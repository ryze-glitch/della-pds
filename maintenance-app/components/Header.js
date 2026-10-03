'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { NAV, AREA } from './nav';

const THEME_ORDER = ['auto', 'light', 'dark'];
const THEME_META = {
  auto: { icon: 'brightness_auto', label: 'automatico' },
  light: { icon: 'light_mode', label: 'chiaro' },
  dark: { icon: 'dark_mode', label: 'scuro' },
};

export function Header() {
  const pathname = usePathname();
  const areaActive = pathname === '/login' || pathname === '/dashboard' || pathname === '/candidature';
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('auto');
  const dialogRef = useRef(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setMode(current === 'light' || current === 'dark' ? current : 'auto');
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function cycleTheme() {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length];
    setMode(next);
    try {
      if (next === 'auto') localStorage.removeItem('pds-theme');
      else localStorage.setItem('pds-theme', next);
    } catch (e) {
      /* storage non disponibile */
    }
    if (next === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
  }

  const themeMeta = THEME_META[mode];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center gap-2 px-6 py-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Apri il menu di navigazione"
            className="-ml-2 p-2 text-ink hover:text-primary lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <Link href="/" className="flex items-center gap-3 font-display text-[15px] font-semibold tracking-tight">
            <img src="/assets/crest-sm.png" width="22" height="34" alt="" />
            <span className="hidden sm:inline">Polizia di Stato</span>
          </Link>
          <nav aria-label="Navigazione principale" className="ml-10 hidden flex-1 items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? 'page' : undefined}
                className={`relative py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                  pathname === n.href ? 'text-primary' : 'text-ink-dim hover:text-ink'
                }`}
              >
                {n.label}
                {pathname === n.href ? <span className="absolute -bottom-1 left-0 h-px w-full bg-primary" /> : null}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Tema ${themeMeta.label}. Tocca per cambiare tema`}
              title={`Tema ${themeMeta.label}`}
              className="p-2 text-ink-dim hover:text-primary"
            >
              <Icon name={themeMeta.icon} />
            </button>
            <Link
              href={AREA.href}
              aria-current={areaActive ? 'page' : undefined}
              className={`ml-2 hidden items-center gap-2 border px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.08em] sm:flex ${
                areaActive ? 'border-primary text-primary' : 'border-line-strong text-ink hover:border-primary hover:text-primary'
              }`}
            >
              <Icon name="person" filled={areaActive} className="text-base" />
              {AREA.label}
            </Link>
            <Link href={AREA.href} aria-label={AREA.label} className="p-2 text-ink-dim hover:text-primary sm:hidden">
              <Icon name="person" filled={areaActive} />
            </Link>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-label="Menu di navigazione"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
          if (outside) setOpen(false);
        }}
        className="m-0 h-full max-h-full w-80 max-w-[85vw] border-none border-r border-line bg-bg p-0 text-ink backdrop:bg-black/60 open:fixed open:inset-y-0 open:left-0"
      >
        <div className="flex items-center gap-3 border-b border-line p-5 font-display font-semibold">
          <img src="/assets/crest-sm.png" width="22" height="34" alt="" />
          <span>Polizia di Stato</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi il menu" className="ml-auto p-2 text-ink-dim hover:text-primary">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Navigazione principale" className="flex flex-col p-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === n.href ? 'page' : undefined}
              className={`flex items-center gap-3 border-b border-line px-3 py-4 font-mono text-xs font-medium uppercase tracking-[0.08em] ${
                pathname === n.href ? 'text-primary' : 'text-ink-dim hover:text-ink'
              }`}
            >
              <Icon name={n.icon} className="text-base" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim">Riservato agli agenti</div>
        <Link
          href={AREA.href}
          onClick={() => setOpen(false)}
          aria-current={areaActive ? 'page' : undefined}
          className="mx-3 mt-3 flex items-center gap-3 px-3 py-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink-dim hover:text-primary"
        >
          <Icon name={AREA.icon} className="text-base" />
          {AREA.label}
        </Link>
      </dialog>
    </>
  );
}
