import { Btn, BackHome, Container, Eyebrow, Section } from '../../components/ui';

export const metadata = { title: 'Prenota — Polizia di Stato — Italian Paradise RP' };

const SERVICES = [
  ['01', 'Appuntamento in Questura', 'Richiedi un incontro diretto con un agente per pratiche, segnalazioni o colloqui informativi.'],
  ['02', 'URP', "L'Ufficio Relazioni Pubbliche risponde a domande generali e indirizza la tua richiesta al reparto giusto."],
  ['03', "Porto d'armi", "Prenota un appuntamento dedicato per l'iter di richiesta o rinnovo del porto d'armi."],
];

export default function PrenotaPage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-2.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>Servizi al cittadino</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Prenota un servizio</h1>
          <p className="mt-4 max-w-xl text-ink-dim">
            Alcuni servizi della Questura richiedono un appuntamento. Scegli quello che ti serve e contattaci per
            fissare un orario.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Eyebrow n="01">Cosa puoi prenotare</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">I nostri servizi</h2>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {SERVICES.map(([n, title, text]) => (
              <div key={title} className="bg-bg p-7">
                <span className="font-mono text-xs text-primary">{n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="grain border-t border-line bg-surface-alt py-16">
        <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Serve altro?</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold">Contattaci su Discord</h2>
            <p className="mt-2 text-ink-dim">
              Per fissare un appuntamento o avere informazioni, il modo più rapido è passare dal nostro server
              Discord.
            </p>
          </div>
          <Btn href="#" iconEnd="arrow_forward">
            Vai al Discord IPRP
          </Btn>
        </Container>
      </section>
      <BackHome />
    </>
  );
}
