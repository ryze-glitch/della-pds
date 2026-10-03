import { Btn, BackHome, Container, Eyebrow, Rule, Section } from '../../components/ui';

export const metadata = { title: 'Concorso — Polizia di Stato — Italian Paradise RP' };

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf7Ck4wRotaSwyLMEK0IJjAJdEMai2AfloMtVeLnV6FQPGkTA/viewform?usp=sharing&ouid=115833658762827349976';

const STEPS = [
  ['01', 'Compila il modulo', 'Inserisci i tuoi dati e rispondi al quiz di ingresso direttamente sul modulo Google.'],
  ['02', 'Colloquio IC', 'Un agente valuta la candidatura e ti contatta per il colloquio in-character.'],
  ['03', 'Accademia', 'Superato il colloquio, completi la formazione e vieni assegnato a un reparto.'],
];

const REQS = [
  ['Microfono funzionante', 'Il roleplay si svolge in voce: serve un microfono chiaro e un ambiente senza troppo rumore di fondo.'],
  ['Conoscenza del regolamento', 'Prima di candidarti, leggi il regolamento del server e quello specifico del corpo di polizia.'],
  ['Disponibilità e costanza', 'Non serve essere online tutti i giorni, ma una presenza regolare aiuta la formazione e il reparto.'],
  ['Voglia di fare roleplay serio', 'Cerchiamo persone interessate a interpretare il ruolo con impegno, non solo a "vestire la divisa".'],
];

export default function ConcorsoPage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-2.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>Concorso pubblico</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Entra a far parte del Corpo</h1>
          <p className="mt-4 max-w-xl text-ink-dim">
            Le selezioni per diventare agente sono aperte tutto l&apos;anno. Compila il modulo di candidatura
            ufficiale per iniziare il tuo percorso in uno dei nostri reparti.
          </p>
        </Container>
      </section>

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="aspect-[4/3] w-full border border-line object-cover grayscale" />
          <div>
            <Eyebrow>Candidati ora</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold">Il tuo posto è nel Corpo</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-dim">
              La candidatura si svolge interamente tramite un modulo online. Ti verranno chieste alcune informazioni
              di base e le risposte al quiz di ingresso: bastano pochi minuti.
            </p>
            <Btn href={FORM_URL} target="_blank" rel="noopener" lg iconEnd="open_in_new" className="mt-7">
              Vai al modulo di candidatura
            </Btn>
            <p className="mt-4 font-mono text-xs uppercase tracking-wide text-ink-dim">Si apre in una nuova scheda, su Google Forms.</p>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="01">Il percorso</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Come funziona la selezione</h2>
          <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {STEPS.map(([n, title, text]) => (
              <li key={title} className="bg-bg p-7">
                <span className="font-display text-2xl font-semibold text-primary">{n}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="02">Prima di candidarti</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Cosa cerchiamo</h2>
          <div className="mt-10 grid gap-px border-t border-line bg-line sm:grid-cols-2">
            {REQS.map(([title, text]) => (
              <div key={title} className="bg-bg py-6 pr-6">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="grain border-t border-line bg-surface-alt py-16">
        <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Pronto a partire?</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold">Entra a far parte della Questura</h2>
            <p className="mt-2 text-ink-dim">
              Le selezioni sono aperte tutto l&apos;anno. Il primo passo è il modulo di candidatura: il resto lo
              scopri strada facendo.
            </p>
          </div>
          <Btn href={FORM_URL} target="_blank" rel="noopener" iconEnd="open_in_new">
            Vai al modulo di candidatura
          </Btn>
        </Container>
      </section>
      <BackHome />
    </>
  );
}
