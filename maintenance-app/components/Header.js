'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { NAV, AREA } from './nav';

export function Header() {
  const pathname = usePathname();
  const areaActive = pathname === '/login' || pathname === '/dashboard' || pathname === '/candidature';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Polizia di Stato, vai alla home">
          <img src="/assets/crest-sm.png" width="26" height="40" alt="" className="h-8 w-auto" />
          <span className="text-[15px] font-semibold tracking-tight">Polizia di Stato</span>
        </Link>

        <nav aria-label="Navigazione principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active ? 'font-medium text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={AREA.href}
            aria-current={areaActive ? 'page' : undefined}
            className="hidden h-8 items-center rounded-md border border-line2 px-3 text-sm font-medium hover:bg-bg2 sm:inline-flex"
          >
            {AREA.label}
          </Link>
          <Link
            href="/concorso"
            className="hidden h-8 items-center rounded-md border border-fg bg-fg px-3 text-sm font-medium text-bg hover:opacity-85 sm:inline-flex"
          >
            Candidati
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu di navigazione'}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line2 lg:hidden"
          >
            <Icon name={open ? 'x' : 'menu'} size={16} />
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Menu mobile" className="border-t border-line bg-bg px-5 pb-6 pt-2 lg:hidden">
          {[...NAV, AREA].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center justify-between border-b border-line py-4 text-lg ${
                pathname === n.href ? 'font-semibold' : 'text-muted'
              }`}
            >
              {n.label}
              <Icon name="chevron" size={18} />
            </Link>
          ))}
          <Link href="/concorso" className="mt-5 flex h-12 items-center justify-center rounded-md bg-fg font-medium text-bg">
            Candidati
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
