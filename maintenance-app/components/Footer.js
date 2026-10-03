import Link from 'next/link';
import { NAV } from './nav';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-container px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display font-semibold">
              <img src="/assets/crest-sm.png" width="22" height="34" alt="" loading="lazy" />
              <span>Polizia di Stato</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-dim">
              Sito ufficiale della Polizia di Stato — Italian Paradise RP. Progetto portfolio, contenuti a scopo
              dimostrativo per la community FiveM.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Esplora</h2>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ink-dim hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Servizi</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/prenota" className="text-ink-dim hover:text-ink">
                  Prenotazioni
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="text-ink-dim hover:text-ink">
                  URP
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="text-ink-dim hover:text-ink">
                  Porto d&apos;armi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Community</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-ink-dim hover:text-ink">
                  Discord IPRP
                </a>
              </li>
              <li>
                <a href="#" className="text-ink-dim hover:text-ink">
                  Regolamento
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-dim sm:flex-row sm:justify-between">
          <span>© 2026 Polizia di Stato — Italian Paradise RP. Server FiveM, contenuti fittizi.</span>
          <span>Termini &amp; Privacy</span>
        </div>
      </div>
    </footer>
  );
}
