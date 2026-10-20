import Link from 'next/link';
import { NAV } from './nav';
import { Container } from './ui';

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="pb-8 pt-16 md:pt-24">
        <div className="display text-[clamp(3rem,11.5vw,12rem)]">
          Polizia di Stato<span className="text-accent">.</span>
        </div>
        <div className="mt-14 grid gap-10 border-t-2 border-paper pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <p className="max-w-sm text-sm leading-relaxed text-paper/70">
            Sito ufficiale della Polizia di Stato — Italian Paradise RP. Progetto portfolio, contenuti a scopo
            dimostrativo per la community FiveM.
          </p>
          <div>
            <h2 className="mono mb-4 text-xs text-paper/50">Esplora</h2>
            <ul className="space-y-2 text-lg font-bold">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono mb-4 text-xs text-paper/50">Servizi</h2>
            <ul className="space-y-2 text-lg font-bold">
              <li>
                <Link href="/prenota" className="hover:text-accent">
                  Prenotazioni
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="hover:text-accent">
                  URP
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="hover:text-accent">
                  Porto d&apos;armi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mono mb-4 text-xs text-paper/50">Community</h2>
            <ul className="space-y-2 text-lg font-bold">
              <li>
                <a href="#" className="hover:text-accent">
                  Discord IPRP
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Regolamento
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mono mt-14 flex flex-col gap-2 border-t border-paper/30 pt-5 text-[11px] text-paper/50 sm:flex-row sm:justify-between">
          <span>© 2026 Polizia di Stato — Italian Paradise RP. Server FiveM, contenuti fittizi.</span>
          <span>Termini &amp; Privacy</span>
        </div>
      </Container>
    </footer>
  );
}
