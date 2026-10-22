import Link from 'next/link';
import { Container } from './ui';

const COLS = [
  {
    title: 'Sportello Cittadino',
    links: [
      ['/sportello/denuncia', 'Denuncia online'],
      ['/sportello/porto-darmi', "Porto d'armi (PDA)"],
      ['/sportello/colloquio', 'Colloquio con i Dirigenti'],
      ['/sportello/pratica', 'Stato della pratica'],
    ],
  },
  {
    title: 'Istituzione',
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
    <footer className="mt-4 bg-primary text-primary-fg">
      <div className="gold-rule" />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/assets/crest-md.png" width="60" height="95" alt="" loading="lazy" className="h-14 w-auto" />
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold uppercase tracking-[0.04em]">Polizia di Stato</div>
                <div className="text-[12px] opacity-75">Questura IPRP · Italian Paradise XI</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-80">
              Portale della Questura del server roleplay Italian Paradise XI. Tutti i servizi sono <strong>in-character</strong>.
            </p>
            <a href="#" className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
              Server Discord IPRP
            </a>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold">{col.title}</h2>
              <ul className="space-y-2.5 text-sm">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="opacity-85 transition hover:opacity-100 hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-white/20 bg-white/5 p-4 text-[13px] leading-relaxed">
          <strong>Avviso importante.</strong> Questo sito è un progetto di gioco di ruolo (FiveM) e non è affiliato alla
          Polizia di Stato né ad alcuna istituzione reale. Nomi, cariche e procedure sono fittizi. <strong>In caso di
          emergenza reale chiama il 112.</strong>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/20 pt-6 text-xs opacity-70 sm:flex-row sm:justify-between">
          <span>© 2026 Questura IPRP — Italian Paradise XI. Contenuti di gioco.</span>
          <span>Termini &amp; Privacy</span>
        </div>
      </Container>
    </footer>
  );
}
