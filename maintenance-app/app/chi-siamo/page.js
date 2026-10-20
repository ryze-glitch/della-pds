import Link from 'next/link';
import { Btn, Container, CtaBand, Label, PageHero, SectionTitle } from '../../components/ui';
import { DeptGrid } from '../../components/DeptGrid';

export const metadata = { title: 'Chi Siamo — Polizia di Stato — Italian Paradise RP' };

const PERKS = [
  ['Formazione continua', 'Corsi di aggiornamento periodici e affiancamento diretto da agenti esperti in ogni reparto.'],
  ['Percorso di carriera', 'Otto gradi che riconoscono impegno, esperienza sul campo e capacità di comando.'],
  ['Equipaggiamento dedicato', "Ogni reparto fornisce l'equipaggiamento e i veicoli necessari per operare in sicurezza."],
  ['Comunità di colleghi', 'Entri a far parte di un gruppo affiatato, con briefing regolari e attività di reparto.'],
  ['Il tuo referente', "Un superiore diretto ti segue dal primo giorno in accademia fino all'assegnazione finale."],
  ['Turni flessibili', 'Organizzazione dei turni pensata per conciliare servizio attivo e vita privata.'],
  ['Mobilità tra reparti', "Possibilità di richiedere il trasferimento ad altri reparti una volta maturata l'esperienza."],
  ['Riconoscimenti di servizio', 'Encomi e riconoscimenti ufficiali per gli interventi che si distinguono per merito.'],
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        label="Chi siamo"
        title="Entra nella Questura."
        text="Dalle strade del centro alle indagini più complesse, la Questura Centrale riunisce sei reparti con una missione comune: la sicurezza della città e di chi la vive ogni giorno."
        img="/assets/hero-slide-1.jpg"
        pos="center 55%"
      >
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Invia candidatura
          </Btn>
          <span className="mono text-sm font-bold">concorsi@iprp-polizia.it</span>
        </div>
      </PageHero>

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="I nostri reparti" title="Il tuo posto nel Corpo." />
          <div className="mt-12">
            <DeptGrid />
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-ink py-16 text-paper md:py-28">
        <Container>
          <Label n="02" className="text-paper/70">
            Vantaggi del Corpo
          </Label>
          <h2 className="display mt-8 text-[clamp(2.6rem,7vw,7rem)]">Cosa trovi entrando in Polizia.</h2>
          <ul className="mt-14 grid border-t-2 border-paper md:grid-cols-2 md:gap-x-16">
            {PERKS.map(([t, d], i) => (
              <li key={t} className="border-b-2 border-paper/30 py-6">
                <div className="flex items-baseline gap-4">
                  <span className="mono text-xs font-bold text-accent">0{i + 1}</span>
                  <h3 className="text-2xl font-extrabold">{t}</h3>
                </div>
                <p className="mt-2 pl-9 text-paper/70">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Label>In arrivo</Label>
            <h2 className="display mt-6 text-[clamp(2.6rem,7vw,7rem)]">Nuova sezione cinofila.</h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-lg leading-relaxed text-mute">
              È in fase di costituzione un nuovo reparto dedicato alle unità cinofile, per il supporto nelle ricerche
              e nel controllo del territorio. Resta aggiornato per le prime candidature.
            </p>
            <Btn as={Link} href="/concorso" variant="outline" icon="arrow-right" className="mt-6">
              Resta aggiornato
            </Btn>
          </div>
        </Container>
      </section>

      <CtaBand
        label="Il momento è adesso"
        title="Trova il tuo posto."
        action={
          <Btn as={Link} href="/concorso" variant="paper" size="lg" icon="arrow-right">
            Candidati ora
          </Btn>
        }
      />
    </>
  );
}
