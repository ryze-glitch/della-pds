import Link from 'next/link';
import { Btn, BackHome, Card, Container, Overline, Section } from '../../components/ui';

export const metadata = { title: 'Reparti — Polizia di Stato — Italian Paradise RP' };

const DEPTS = [
  ['Centro Città', 'Reparto Volanti', 'Pattugliamento continuo del territorio e risposta rapida alle emergenze cittadine.', '/assets/hero-slide-1.jpg'],
  ['Uffici Investigativi', 'Squadra Investigativa', "Indagini su reati complessi e raccolta prove in collaborazione con l'autorità giudiziaria.", '/assets/hero-slide-2.jpg'],
  ['Interventi ad Alto Rischio', 'Nucleo Operativo Speciale', "Formazione d'élite per le situazioni più critiche e gli scenari a massimo rischio.", '/assets/hero-slide-1.jpg'],
  ['Viabilità & Sicurezza', 'Polizia Stradale', 'Controllo della rete viaria e gestione degli incidenti sul territorio cittadino ed extraurbano.', '/assets/hero-slide-2.jpg'],
  ['Contatto Cittadino', 'Ufficio Relazioni Pubbliche', 'Punto di riferimento diretto tra Questura e cittadinanza per segnalazioni e informazioni.', '/assets/hero-slide-1.jpg'],
  ['Nuove Reclute', 'Accademia & Formazione', "Percorso strutturato di addestramento dalle basi teoriche all'affiancamento sul campo.", '/assets/hero-slide-2.jpg'],
];

export default function RepartiPage() {
  return (
    <>
      <section className="relative flex h-80 items-end overflow-hidden">
        <img src="/assets/hero-slide-1.jpg" alt="Questura Centrale, veduta notturna" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <Container className="relative z-10 pb-10 text-white">
          <Overline>
            <span className="text-primary-soft">I nostri reparti</span>
          </Overline>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Sei reparti, una missione</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Ogni reparto risponde a una parte specifica della sicurezza cittadina, con procedure e catena di comando
            dedicate.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Overline>Cosa facciamo</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">I reparti della Questura</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DEPTS.map(([overline, title, text, img]) => (
              <Card key={title}>
                <img src={img} alt={title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <Overline>{overline}</Overline>
                  <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-ink-dim">{text}</p>
                  <Btn as={Link} href="/concorso" variant="text" iconEnd="arrow_forward" className="mt-3 !px-0">
                    Candidati per questo reparto
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pb-24 pt-0">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-surface-alt p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <Overline>Entra in un reparto</Overline>
              <h2 className="mt-2 font-display text-2xl font-semibold">Trova il tuo posto nel Corpo</h2>
              <p className="mt-2 text-ink-dim">Ogni reparto forma le proprie reclute: il primo passo è lo stesso modulo di candidatura.</p>
            </div>
            <Btn as={Link} href="/concorso" iconEnd="arrow_forward">
              Vai alla pagina Concorso
            </Btn>
          </div>
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
