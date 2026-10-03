import { Btn, BackHome, Container, Overline, Section } from '../../components/ui';

export const metadata = { title: 'Concorso — Polizia di Stato — Italian Paradise RP' };

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf7Ck4wRotaSwyLMEK0IJjAJdEMai2AfloMtVeLnV6FQPGkTA/viewform?usp=sharing&ouid=115833658762827349976';

const STEPS = [
  ['01', 'Compila il modulo', 'Inserisci i tuoi dati e rispondi al quiz di ingresso direttamente sul modulo Google.'],
  ['02', 'Colloquio IC', 'Un agente valuta la candidatura e ti contatta per il colloquio in-character.'],
  ['03', 'Accademia', 'Superato il colloquio, completi la formazione e vieni assegnato a un reparto.'],
];

const REQS = [
  ['mic', 'Microfono funzionante', 'Il roleplay si svolge in voce: serve un microfono chiaro e un ambiente senza troppo rumore di fondo.'],
  ['menu_book', 'Conoscenza del regolamento', 'Prima di candidarti, leggi il regolamento del server e quello specifico del corpo di polizia.'],
  ['schedule', 'Disponibilità e costanza', 'Non serve essere online tutti i giorni, ma una presenza regolare aiuta la formazione e il reparto.'],
  ['theater_comedy', 'Voglia di fare roleplay serio', 'Cerchiamo persone interessate a interpretare il ruolo con impegno, non solo a "vestire la divisa".'],
];

export default function ConcorsoPage() {
  return (
    <>
      <section className="relative flex h-80 items-end overflow-hidden">
        <img src="/assets/hero-slide-2.jpg" alt="Volanti della Polizia schierate davanti alla Questura" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <Container className="relative z-10 pb-10 text-white">
          <Overline>
            <span className="text-primary-soft">Concorso pubblico</span>
          </Overline>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Entra a far parte del Corpo</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Le selezioni per diventare agente sono aperte tutto l&apos;anno. Compila il modulo di candidatura
            ufficiale per iniziare il tuo percorso in uno dei nostri reparti.
          </p>
        </Container>
      </section>

      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="rounded-3xl object-cover" />
          <div>
            <Overline>Candidati ora</Overline>
            <h2 className="mt-2 font-display text-3xl font-semibold">Il tuo posto è nel Corpo</h2>
            <p className="mt-4 text-lg text-ink-dim">
              La candidatura si svolge interamente tramite un modulo online. Ti verranno chieste alcune informazioni
              di base e le risposte al quiz di ingresso: bastano pochi minuti.
            </p>
            <Btn href={FORM_URL} target="_blank" rel="noopener" lg iconEnd="open_in_new" className="mt-6">
              Vai al modulo di candidatura
            </Btn>
            <p className="mt-3 text-sm text-ink-dim">Si apre in una nuova scheda, su Google Forms.</p>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>Il percorso</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">Come funziona la selezione</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map(([n, title, text]) => (
              <li key={title} className="rounded-3xl bg-surface-alt p-6">
                <span className="font-display text-2xl font-semibold text-primary">{n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>Prima di candidarti</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">Cosa cerchiamo</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {REQS.map(([, title, text]) => (
              <div key={title} className="flex gap-4">
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink-dim">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pb-24 pt-0">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-surface-alt p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <Overline>Pronto a partire?</Overline>
              <h2 className="mt-2 font-display text-2xl font-semibold">Entra a far parte della Questura</h2>
              <p className="mt-2 text-ink-dim">
                Le selezioni sono aperte tutto l&apos;anno. Il primo passo è il modulo di candidatura: il resto lo
                scopri strada facendo.
              </p>
            </div>
            <Btn href={FORM_URL} target="_blank" rel="noopener" iconEnd="open_in_new">
              Vai al modulo di candidatura
            </Btn>
          </div>
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
