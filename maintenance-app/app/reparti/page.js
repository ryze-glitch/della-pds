import Link from 'next/link';
import { Btn, BackHome, Container, Eyebrow, Section } from '../../components/ui';

export const metadata = { title: 'Reparti — Polizia di Stato — Italian Paradise RP' };

const DEPTS = [
  ['01', 'Centro Città', 'Reparto Volanti', 'Pattugliamento continuo del territorio e risposta rapida alle emergenze cittadine.', '/assets/hero-slide-1.jpg'],
  ['02', 'Uffici Investigativi', 'Squadra Investigativa', "Indagini su reati complessi e raccolta prove in collaborazione con l'autorità giudiziaria.", '/assets/hero-slide-2.jpg'],
  ['03', 'Interventi ad Alto Rischio', 'Nucleo Operativo Speciale', "Formazione d'élite per le situazioni più critiche e gli scenari a massimo rischio.", '/assets/hero-slide-1.jpg'],
  ['04', 'Viabilità & Sicurezza', 'Polizia Stradale', 'Controllo della rete viaria e gestione degli incidenti sul territorio cittadino ed extraurbano.', '/assets/hero-slide-2.jpg'],
  ['05', 'Contatto Cittadino', 'Ufficio Relazioni Pubbliche', 'Punto di riferimento diretto tra Questura e cittadinanza per segnalazioni e informazioni.', '/assets/hero-slide-1.jpg'],
  ['06', 'Nuove Reclute', 'Accademia & Formazione', "Percorso strutturato di addestramento dalle basi teoriche all'affiancamento sul campo.", '/assets/hero-slide-2.jpg'],
];

export default function RepartiPage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-1.jpg" alt="Questura Centrale, veduta notturna" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>I nostri reparti</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Sei reparti, una missione</h1>
          <p className="mt-4 max-w-xl text-ink-dim">
            Ogni reparto risponde a una parte specifica della sicurezza cittadina, con procedure e catena di comando
            dedicate.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Eyebrow n="01">Cosa facciamo</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">I reparti della Questura</h2>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {DEPTS.map(([n, overline, title, text, img]) => (
              <div key={title} className="bg-bg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt={title} className="h-full w-full object-cover opacity-60 grayscale" />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <Eyebrow>{overline}</Eyebrow>
                    <span className="font-mono text-xs text-ink-dim">{n}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
                  <Btn as={Link} href="/concorso" variant="text" iconEnd="arrow_forward" className="mt-5">
                    Candidati per questo reparto
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="grain border-t border-line bg-surface-alt py-16">
        <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Entra in un reparto</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold">Trova il tuo posto nel Corpo</h2>
            <p className="mt-2 text-ink-dim">Ogni reparto forma le proprie reclute: il primo passo è lo stesso modulo di candidatura.</p>
          </div>
          <Btn as={Link} href="/concorso" iconEnd="arrow_forward">
            Vai alla pagina Concorso
          </Btn>
        </Container>
      </section>
      <BackHome />
    </>
  );
}
