import Link from 'next/link';
import { NAV } from './nav';
import { ThemeSwitch } from './ThemeSwitch';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/assets/crest-sm.png" width="26" height="40" alt="" loading="lazy" className="h-8 w-auto" />
              <span className="font-semibold tracking-tight">Polizia di Stato</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Sito ufficiale della Polizia di Stato — Italian Paradise RP. Progetto portfolio, contenuti a scopo
              dimostrativo per la community FiveM.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-medium">Esplora</h2>
            <ul className="space-y-3 text-sm text-muted">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-medium">Servizi</h2>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <Link href="/prenota" className="hover:text-fg">
                  Prenotazioni
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="hover:text-fg">
                  URP
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="hover:text-fg">
                  Porto d&apos;armi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-medium">Community</h2>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a href="#" className="hover:text-fg">
                  Discord IPRP
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-fg">
                  Regolamento
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-16 select-none bg-gradient-to-b from-fg/25 to-transparent bg-clip-text text-center font-semibold leading-[0.85] tracking-tighter text-transparent"
          style={{ fontSize: 'clamp(3rem, 14.5vw, 13rem)' }}
        >
          POLIZIA DI STATO
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Polizia di Stato — Italian Paradise RP. Server FiveM, contenuti fittizi.</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
