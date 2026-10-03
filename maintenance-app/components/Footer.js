import Link from 'next/link';
import { NAV } from './nav';

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display text-base font-semibold">
              <img src="/assets/crest-sm.png" width="22" height="34" alt="" loading="lazy" />
              <span>Polizia di Stato</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-dim">
              Sito ufficiale della Polizia di Stato — Italian Paradise RP. Progetto portfolio, contenuti a scopo
              dimostrativo per la community FiveM.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-dim">Esplora</h2>
            <ul className="space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-ink hover:text-primary">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-dim">Servizi</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/prenota" className="text-ink hover:text-primary">
                  Prenotazioni
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="text-ink hover:text-primary">
                  URP
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="text-ink hover:text-primary">
                  Porto d&apos;armi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-dim">Community</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-ink hover:text-primary">
                  Discord IPRP
                </a>
              </li>
              <li>
                <a href="#" className="text-ink hover:text-primary">
                  Regolamento
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-wide text-ink-dim sm:flex-row sm:justify-between">
          <span>© 2026 Polizia di Stato — Italian Paradise RP. Server FiveM, contenuti fittizi.</span>
          <span>Termini &amp; Privacy</span>
        </div>
      </div>
    </footer>
  );
}
