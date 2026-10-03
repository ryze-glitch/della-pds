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
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center gap-2 px-6 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Apri il menu di navigazione"
            className="rounded-full p-2 hover:bg-surface-alt lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <Link href="/" className="flex items-center gap-2.5 font-display font-semibold">
            <img src="/assets/crest-sm.png" width="22" height="34" alt="" />
            <span className="hidden sm:inline">Polizia di Stato</span>
          </Link>
          <nav aria-label="Navigazione principale" className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === n.href ? 'bg-surface-alt text-ink' : 'text-ink-dim hover:bg-surface-alt hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Tema ${themeMeta.label}. Tocca per cambiare tema`}
              title={`Tema ${themeMeta.label}`}
              className="rounded-full p-2 hover:bg-surface-alt"
            >
              <Icon name={themeMeta.icon} />
            </button>
            <Link
              href={AREA.href}
              aria-current={areaActive ? 'page' : undefined}
              className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:flex ${
                areaActive ? 'bg-primary text-on-primary' : 'bg-primary-soft text-on-primary-soft'
              }`}
            >
              <Icon name="person" filled={areaActive} />
              {AREA.label}
            </Link>
            <Link href={AREA.href} aria-label={AREA.label} className="rounded-full p-2 hover:bg-surface-alt sm:hidden">
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
        className="m-0 h-full max-h-full w-72 max-w-[85vw] border-none bg-surface p-0 text-ink backdrop:bg-black/40 open:fixed open:inset-y-0 open:left-0"
      >
        <div className="flex items-center gap-2.5 border-b border-line p-5 font-display font-semibold">
          <img src="/assets/crest-sm.png" width="22" height="34" alt="" />
          <span>Polizia di Stato</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi il menu" className="ml-auto rounded-full p-2 hover:bg-surface-alt">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Navigazione principale" className="flex flex-col gap-1 p-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === n.href ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium ${
                pathname === n.href ? 'bg-surface-alt text-ink' : 'text-ink-dim hover:bg-surface-alt hover:text-ink'
              }`}
            >
              <Icon name={n.icon} />
              {n.label}
            </Link>
          ))}
        </nav>
        <hr className="mx-5 border-line" />
        <div className="px-5 pt-4 font-mono text-xs uppercase tracking-wide text-ink-dim">Riservato agli agenti</div>
        <Link
          href={AREA.href}
          onClick={() => setOpen(false)}
          aria-current={areaActive ? 'page' : undefined}
          className="mx-3 mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-ink-dim hover:bg-surface-alt hover:text-ink"
        >
          <Icon name={AREA.icon} />
          {AREA.label}
        </Link>
      </dialog>
    </>
  );
}
