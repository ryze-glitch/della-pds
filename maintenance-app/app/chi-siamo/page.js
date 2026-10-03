import Link from 'next/link';
import { Btn, BackHome, Container, Overline, Section } from '../../components/ui';
import { DeptGrid } from '../../components/DeptGrid';

export const metadata = { title: 'Chi Siamo — Polizia di Stato — Italian Paradise RP' };

const PERKS = [
  ['school', 'Formazione Continua', 'Corsi di aggiornamento periodici e affiancamento diretto da agenti esperti in ogni reparto.'],
  ['trending_up', 'Percorso di Carriera', 'Otto gradi che riconoscono impegno, esperienza sul campo e capacità di comando.'],
  ['shield', 'Equipaggiamento Dedicato', 'Ogni reparto fornisce l\'equipaggiamento e i veicoli necessari per operare in sicurezza.'],
  ['groups', 'Comunità di Colleghi', 'Entri a far parte di un gruppo affiatato, con briefing regolari e attività di reparto.'],
  ['assignment_ind', 'Il Tuo Referente', 'Un superiore diretto ti segue dal primo giorno in accademia fino all\'assegnazione finale.'],
  ['schedule', 'Turni Flessibili', 'Organizzazione dei turni pensata per conciliare servizio attivo e vita privata.'],
  ['swap_horiz', 'Mobilità tra Reparti', 'Possibilità di richiedere il trasferimento ad altri reparti una volta maturata l\'esperienza.'],
  ['workspace_premium', 'Riconoscimenti di Servizio', 'Encomi e riconoscimenti ufficiali per gli interventi che si distinguono per merito.'],
];

export default function ChiSiamoPage() {
  return (
    <>
      <section className="relative flex h-80 items-end overflow-hidden">
        <img src="/assets/hero-slide-1.jpg" alt="Questura Centrale, veduta notturna" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <Container className="relative z-10 pb-10 text-white">
          <Overline>
            <span className="text-primary-soft">Polizia di Stato — Italian Paradise RP</span>
          </Overline>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Entra nella Questura</h1>
        </Container>
      </section>

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <img src="/assets/hero-slide-1.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="rounded-3xl object-cover" />
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
              Dalle strade del centro alle indagini più complesse, la Questura Centrale riunisce sette reparti con
              una missione comune: la sicurezza della città e di chi la vive ogni giorno.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-surface-alt p-6">
              <div>
                <span className="block text-sm font-medium text-ink-dim">Candidati ora</span>
                <Btn as={Link} href="/concorso" className="mt-2">
                  Invia candidatura
                </Btn>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-dim">Contatto</div>
                <div className="font-medium">concorsi@iprp-polizia.it</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>I Nostri Reparti</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">Il tuo posto nel Corpo</h2>
          <div className="mt-8">
            <DeptGrid />
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="rounded-3xl bg-surface-alt p-8 sm:p-12">
            <Overline>Vantaggi del Corpo</Overline>
            <h2 className="mt-2 font-display text-3xl font-semibold">Cosa trovi entrando in Polizia</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PERKS.map(([, title, text]) => (
                <div key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink-dim">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="lg:order-2">
            <Overline>In Arrivo</Overline>
            <h2 className="mt-2 font-display text-3xl font-semibold">Nuova Sezione Cinofila</h2>
            <p className="mt-4 text-lg text-ink-dim">
              È in fase di costituzione un nuovo reparto dedicato alle unità cinofile, per il supporto nelle ricerche
              e nel controllo del territorio. Resta aggiornato per le prime candidature.
            </p>
            <Btn as={Link} href="/concorso" variant="tonal" iconEnd="arrow_forward" className="mt-6">
              Resta aggiornato
            </Btn>
          </div>
          <img src="/assets/hero-slide-1.jpg" alt="Nuova sede della Questura in costruzione" className="rounded-3xl object-cover lg:order-1" />
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
