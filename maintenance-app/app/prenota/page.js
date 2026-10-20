import { Btn, Cell, Cells, CtaBox, Inner, Mono, PageHero, Section, SectionHead } from '../../components/ui';
import { Icon } from '../../components/icons';

export const metadata = { title: 'Prenota — Polizia di Stato — Italian Paradise RP' };

const SERVICES = [
  ['calendar-check', 'Appuntamento in Questura', 'Richiedi un incontro diretto con un agente per pratiche, segnalazioni o colloqui informativi.', ['Pratiche e segnalazioni', 'Colloqui informativi', 'Incontro con un agente']],
  ['headset', 'URP', "L'Ufficio Relazioni Pubbliche risponde a domande generali e indirizza la tua richiesta al reparto giusto.", ['Informazioni generali', 'Orientamento ai reparti', 'Richieste dei cittadini']],
  ['shield-check', "Porto d'armi", "Prenota un appuntamento dedicato per l'iter di richiesta o rinnovo del porto d'armi.", ['Nuova richiesta', 'Rinnovo', 'Verifica requisiti']],
];

const STEPS = [
  ['01', 'Scegli il servizio', 'Individua qui sopra il servizio di cui hai bisogno.'],
  ['02', 'Contattaci su Discord', 'Apri una richiesta nel nostro server: il modo più rapido per fissare un orario.'],
  ['03', 'Ricevi la conferma', 'Un agente ti risponde con data e ora dell’appuntamento.'],
];

export default function PrenotaPage() {
  return (
    <>
      <PageHero
        badge="Servizi al cittadino"
        title="Prenota un servizio."
        text="Alcuni servizi della Questura richiedono un appuntamento. Scegli quello che ti serve e contattaci per fissare un orario."
      />

      <Section>
        <Cells cols="md:grid-cols-3">
          {SERVICES.map(([icon, t, d, pts]) => (
            <Cell key={t} className="flex flex-col p-6 md:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line2">
                <Icon name={icon} size={20} />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{d}</p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm">
                {pts.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <Icon name="check" size={15} className="text-ok" />
                    {p}
                  </li>
                ))}
              </ul>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner className="!pb-12">
          <SectionHead badge="Come funziona" title="Prenotare è semplice." />
        </Inner>
        <Cells cols="md:grid-cols-3" className="border-t border-line">
          {STEPS.map(([n, t, d]) => (
            <Cell key={t} className="p-6 md:p-8">
              <Mono>{n}</Mono>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
            </Cell>
          ))}
        </Cells>
      </Section>

      <CtaBox
        title="Scrivici su Discord."
        text="Per fissare un appuntamento o avere informazioni, il modo più rapido è passare dal nostro server Discord."
        action={
          <Btn href="#" size="lg" icon="arrow-up-right">
            Vai al Discord IPRP
          </Btn>
        }
      />
    </>
  );
}
