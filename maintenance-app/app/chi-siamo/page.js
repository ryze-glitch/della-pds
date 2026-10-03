import Link from 'next/link';
import { Btn, BackHome, Container, Eyebrow, Rule, Section } from '../../components/ui';
import { DeptGrid } from '../../components/DeptGrid';

export const metadata = { title: 'Chi Siamo — Polizia di Stato — Italian Paradise RP' };

const PERKS = [
  ['Formazione Continua', 'Corsi di aggiornamento periodici e affiancamento diretto da agenti esperti in ogni reparto.'],
  ['Percorso di Carriera', 'Otto gradi che riconoscono impegno, esperienza sul campo e capacità di comando.'],
  ['Equipaggiamento Dedicato', "Ogni reparto fornisce l'equipaggiamento e i veicoli necessari per operare in sicurezza."],
  ['Comunità di Colleghi', 'Entri a far parte di un gruppo affiatato, con briefing regolari e attività di reparto.'],
  ['Il Tuo Referente', "Un superiore diretto ti segue dal primo giorno in accademia fino all'assegnazione finale."],
  ['Turni Flessibili', 'Organizzazione dei turni pensata per conciliare servizio attivo e vita privata.'],
  ['Mobilità tra Reparti', "Possibilità di richiedere il trasferimento ad altri reparti una volta maturata l'esperienza."],
  ['Riconoscimenti di Servizio', 'Encomi e riconoscimenti ufficiali per gli interventi che si distinguono per merito.'],
];

export default function ChiSiamoPage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-1.jpg" alt="Questura Centrale, veduta notturna" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>Polizia di Stato — Italian Paradise RP</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Entra nella Questura</h1>
        </Container>
      </section>

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/assets/hero-slide-1.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="aspect-[4/3] w-full border border-line object-cover grayscale" />
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
              Dalle strade del centro alle indagini più complesse, la Questura Centrale riunisce sette reparti con
              una missione comune: la sicurezza della città e di chi la vive ogni giorno.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-8 border border-line p-6">
              <div>
                <span className="block font-mono text-xs uppercase tracking-[0.08em] text-ink-dim">Candidati ora</span>
                <Btn as={Link} href="/concorso" className="mt-3">
                  Invia candidatura
                </Btn>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.08em] text-ink-dim">Contatto</div>
                <div className="mt-1 font-medium">concorsi@iprp-polizia.it</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="01">I Nostri Reparti</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Il tuo posto nel Corpo</h2>
          <div className="mt-10">
            <DeptGrid />
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="02">Vantaggi del Corpo</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Cosa trovi entrando in Polizia</h2>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(([title, text]) => (
              <div key={title} className="bg-bg p-6">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="lg:order-2">
            <Eyebrow>In Arrivo</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold">Nuova Sezione Cinofila</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-dim">
              È in fase di costituzione un nuovo reparto dedicato alle unità cinofile, per il supporto nelle ricerche
              e nel controllo del territorio. Resta aggiornato per le prime candidature.
            </p>
            <Btn as={Link} href="/concorso" variant="outlined" iconEnd="arrow_forward" className="mt-7">
              Resta aggiornato
            </Btn>
          </div>
          <img src="/assets/hero-slide-1.jpg" alt="Nuova sede della Questura in costruzione" className="aspect-[4/3] w-full border border-line object-cover grayscale lg:order-1" />
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
