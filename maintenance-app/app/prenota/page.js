import { Btn, Container, CtaBand, Label, PageHero, SectionTitle } from '../../components/ui';

export const metadata = { title: 'Prenota — Polizia di Stato — Italian Paradise RP' };

const SERVICES = [
  ['Appuntamento in Questura', 'Richiedi un incontro diretto con un agente per pratiche, segnalazioni o colloqui informativi.', ['Pratiche e segnalazioni', 'Colloqui informativi', 'Incontro con un agente']],
  ['URP', "L'Ufficio Relazioni Pubbliche risponde a domande generali e indirizza la tua richiesta al reparto giusto.", ['Informazioni generali', 'Orientamento ai reparti', 'Richieste dei cittadini']],
  ["Porto d'armi", "Prenota un appuntamento dedicato per l'iter di richiesta o rinnovo del porto d'armi.", ['Nuova richiesta', 'Rinnovo', 'Verifica requisiti']],
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
        label="Servizi al cittadino"
        title="Prenota un servizio."
        text="Alcuni servizi della Questura richiedono un appuntamento. Scegli quello che ti serve e contattaci per fissare un orario."
        img="/assets/hero-slide-2.jpg"
        pos="center 60%"
      />

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="Cosa puoi prenotare" title="I nostri servizi." />
          <ul className="mt-12 border-t-2 border-ink">
            {SERVICES.map(([t, d, pts], i) => (
              <li key={t} className="grid gap-6 border-b-2 border-ink py-10 md:grid-cols-12 md:items-start">
                <span className="mono text-sm font-bold text-accent md:col-span-1">0{i + 1}</span>
                <h3 className="display text-[clamp(2.2rem,4.2vw,4.2rem)] md:col-span-5 [overflow-wrap:normal]">{t}</h3>
                <p className="text-lg text-mute md:col-span-3">{d}</p>
                <ul className="mono space-y-2 text-xs font-bold md:col-span-3">
                  {pts.map((p) => (
                    <li key={p} className="border-b border-ink/20 pb-2">
                      + {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-ink py-16 text-paper md:py-28">
        <Container>
          <Label n="02" className="text-paper/70">
            Come funziona
          </Label>
          <h2 className="display mt-8 text-[clamp(2.6rem,7vw,7rem)]">Prenotare è semplice.</h2>
          <ol className="mt-14 grid border-2 border-paper md:grid-cols-3">
            {STEPS.map(([n, t, d], i) => (
              <li key={t} className={`p-6 md:p-10 ${i > 0 ? 'border-t-2 border-paper md:border-l-2 md:border-t-0' : ''}`}>
                <div className="display text-[clamp(4rem,9vw,9rem)] text-accent">{n}</div>
                <h3 className="mt-6 text-3xl font-extrabold">{t}</h3>
                <p className="mt-3 text-lg text-paper/70">{d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand
        label="Serve altro?"
        title="Scrivici su Discord."
        text="Per fissare un appuntamento o avere informazioni, il modo più rapido è passare dal nostro server Discord."
        action={
          <Btn href="#" variant="paper" size="lg" icon="arrow-up-right">
            Vai al Discord IPRP
          </Btn>
        }
      />
    </>
  );
}
