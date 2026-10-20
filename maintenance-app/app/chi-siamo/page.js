import Link from 'next/link';
import { Btn, Cell, Cells, CtaBox, Inner, Mono, PageHero, Section, SectionHead } from '../../components/ui';
import { Icon } from '../../components/icons';
import { DeptGrid } from '../../components/DeptGrid';

export const metadata = { title: 'Chi Siamo — Polizia di Stato — Italian Paradise RP' };

const PERKS = [
  ['graduation', 'Formazione continua', 'Corsi di aggiornamento periodici e affiancamento diretto da agenti esperti in ogni reparto.'],
  ['trend', 'Percorso di carriera', 'Otto gradi che riconoscono impegno, esperienza sul campo e capacità di comando.'],
  ['shield-check', 'Equipaggiamento dedicato', "Ogni reparto fornisce l'equipaggiamento e i veicoli necessari per operare in sicurezza."],
  ['users', 'Comunità di colleghi', 'Entri a far parte di un gruppo affiatato, con briefing regolari e attività di reparto.'],
  ['user-check', 'Il tuo referente', "Un superiore diretto ti segue dal primo giorno in accademia fino all'assegnazione finale."],
  ['clock', 'Turni flessibili', 'Organizzazione dei turni pensata per conciliare servizio attivo e vita privata.'],
  ['repeat', 'Mobilità tra reparti', "Possibilità di richiedere il trasferimento ad altri reparti una volta maturata l'esperienza."],
  ['award', 'Riconoscimenti di servizio', 'Encomi e riconoscimenti ufficiali per gli interventi che si distinguono per merito.'],
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        badge="Chi siamo"
        title="Entra nella Questura."
        text="Dalle strade del centro alle indagini più complesse, la Questura Centrale riunisce sei reparti con una missione comune: la sicurezza della città e di chi la vive ogni giorno."
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Invia candidatura
          </Btn>
          <Mono className="normal-case">concorsi@iprp-polizia.it</Mono>
        </div>
      </PageHero>

      <Section>
        <div className="border-b border-line p-3 md:p-6">
          <img src="/assets/hero-slide-1.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="h-[260px] w-full rounded-lg border border-line object-cover object-[50%_55%] md:h-[440px]" />
        </div>
        <Inner className="!pb-12">
          <SectionHead badge="I nostri reparti" title="Il tuo posto nel Corpo." />
        </Inner>
        <div className="border-t border-line pb-12">
          <DeptGridWrap />
        </div>
      </Section>

      <Section>
        <Inner className="!pb-12">
          <SectionHead badge="Vantaggi del Corpo" title="Cosa trovi entrando in Polizia." />
        </Inner>
        <Cells cols="sm:grid-cols-2 lg:grid-cols-4" className="border-t border-line">
          {PERKS.map(([icon, t, d]) => (
            <Cell key={t} className="p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line2">
                <Icon name={icon} size={18} />
              </span>
              <h3 className="mt-5 font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <SectionHead badge="In arrivo" title="Nuova sezione cinofila." />
          <div>
            <p className="leading-relaxed text-muted">
              È in fase di costituzione un nuovo reparto dedicato alle unità cinofile, per il supporto nelle ricerche
              e nel controllo del territorio. Resta aggiornato per le prime candidature.
            </p>
            <Btn as={Link} href="/concorso" variant="secondary" icon="arrow-right" className="mt-6">
              Resta aggiornato
            </Btn>
          </div>
        </Inner>
      </Section>

      <CtaBox
        title="Trova il tuo posto nella Questura."
        action={
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Candidati ora
          </Btn>
        }
      />
    </>
  );
}

function DeptGridWrap() {
  return (
    <div className="px-0">
      <DeptGrid />
    </div>
  );
}
