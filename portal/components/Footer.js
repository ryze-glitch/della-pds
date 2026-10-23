import Link from 'next/link';
import { Container } from './ui';

const COLS = [
  {
    title: 'Sportello',
    links: [
      ['/sportello/denuncia', 'Denuncia online'],
      ['/sportello/porto-darmi', "Porto d'armi (PDA)"],
      ['/sportello/colloquio', 'Colloquio con i Dirigenti'],
      ['/sportello/pratica', 'Stato della pratica'],
    ],
  },
  {
    title: 'Questura',
    links: [
      ['/organigramma', 'Organigramma'],
      ['/reclutamento', 'Bandi & Reclutamento'],
      ['/notizie', 'Comunicati e avvisi'],
    ],
  },
  {
    title: 'Area riservata',
    links: [
      ['/login', 'Accesso agenti'],
      ['/dashboard', 'Dashboard'],
      ['/candidature', 'Candidature'],
      ['/pratiche', 'Gestione pratiche'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-[#070d19]">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/assets/crest-md.png" width="60" height="95" alt="" loading="lazy" className="h-16 w-auto" />
              <div className="leading-tight">
                <div className="text-[15px] font-semibold uppercase tracking-[0.14em]">Polizia di Stato</div>
                <div className="text-[11.5px] uppercase tracking-[0.2em] text-muted">Questura IPRP</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Portale telematico del cittadino del server roleplay Italian Paradise XI. Tutti i servizi sono in-character.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-fg">{col.title}</h2>
              <ul className="space-y-2.5 text-sm text-muted">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-fg">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
          Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla Polizia di Stato né ad alcuna
          istituzione reale. Nomi, cariche e procedure sono fittizi. <strong className="font-medium text-fg">In caso di emergenza reale chiama il 112.</strong>
          <div className="mt-3 text-xs">© 2026 Questura IPRP — Italian Paradise XI.</div>
        </div>
      </Container>
    </footer>
  );
}
