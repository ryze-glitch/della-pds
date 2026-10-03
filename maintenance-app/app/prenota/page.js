import { Btn, BackHome, Card, Container, Overline, Section } from '../../components/ui';

export const metadata = { title: 'Prenota — Polizia di Stato — Italian Paradise RP' };

const SERVICES = [
  ['event', 'Appuntamento in Questura', 'Richiedi un incontro diretto con un agente per pratiche, segnalazioni o colloqui informativi.'],
  ['support_agent', 'URP', "L'Ufficio Relazioni Pubbliche risponde a domande generali e indirizza la tua richiesta al reparto giusto."],
  ['shield', "Porto d'armi", "Prenota un appuntamento dedicato per l'iter di richiesta o rinnovo del porto d'armi."],
];

export default function PrenotaPage() {
  return (
    <>
      <section className="relative flex h-80 items-end overflow-hidden">
        <img src="/assets/hero-slide-2.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <Container className="relative z-10 pb-10 text-white">
          <Overline>
            <span className="text-primary-soft">Servizi al cittadino</span>
          </Overline>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Prenota un servizio</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Alcuni servizi della Questura richiedono un appuntamento. Scegli quello che ti serve e contattaci per
            fissare un orario.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Overline>Cosa puoi prenotare</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">I nostri servizi</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {SERVICES.map(([, title, text]) => (
              <Card key={title} className="p-6">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pb-24 pt-0">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-surface-alt p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <Overline>Serve altro?</Overline>
              <h2 className="mt-2 font-display text-2xl font-semibold">Contattaci su Discord</h2>
              <p className="mt-2 text-ink-dim">
                Per fissare un appuntamento o avere informazioni, il modo più rapido è passare dal nostro server
                Discord.
              </p>
            </div>
            <Btn href="#" iconEnd="arrow_forward">
              Vai al Discord IPRP
            </Btn>
          </div>
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
