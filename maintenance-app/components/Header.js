'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, AREA } from './nav';

export function Header() {
  const pathname = usePathname();
  const areaActive = pathname === '/login' || pathname === '/dashboard' || pathname === '/candidature';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
        <div className="mx-auto flex h-16 max-w-wide items-center gap-6 px-5 md:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="Polizia di Stato, vai alla home">
            <img src="/assets/crest-sm.png" width="26" height="40" alt="" className="h-9 w-auto" />
            <span className="display hidden text-xl sm:block">
              Polizia di Stato<span className="text-accent">.</span>
            </span>
          </Link>

          <nav aria-label="Navigazione principale" className="ml-auto hidden items-center gap-7 lg:flex">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={`mono border-b-2 py-1 text-xs font-bold transition-colors ${
                    active ? 'border-accent text-accent' : 'border-transparent hover:border-ink'
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={AREA.href}
            aria-current={areaActive ? 'page' : undefined}
            className={`mono ml-auto hidden border-2 px-4 py-2.5 text-xs font-bold transition-colors sm:block lg:ml-0 ${
              areaActive ? 'border-accent bg-accent text-white' : 'border-ink bg-ink text-paper hover:border-accent hover:bg-accent'
            }`}
          >
            {AREA.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu di navigazione'}
            className="mono ml-auto border-2 border-ink px-4 py-2.5 text-xs font-bold hover:bg-ink hover:text-paper sm:ml-0 lg:hidden"
          >
            {open ? 'Chiudi' : 'Menu'}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink text-paper lg:hidden ${open ? 'block' : 'hidden'}`}
        aria-hidden={!open}
      >
        <nav aria-label="Menu mobile" className="px-5 pb-12 pt-4">
          {[...NAV, AREA].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-baseline gap-4 border-b-2 border-paper/30 py-5 hover:text-accent"
            >
              <span className="mono text-xs text-accent">0{i + 1}</span>
              <span className="display text-5xl">{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
