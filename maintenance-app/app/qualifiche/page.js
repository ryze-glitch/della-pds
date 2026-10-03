import Link from 'next/link';
import { Btn, BackHome, Container, Eyebrow, Section } from '../../components/ui';

export const metadata = { title: 'Qualifiche — Polizia di Stato — Italian Paradise RP' };

const GRADI = [
  ['Agente', "Il primo grado dopo l'accademia. Pattugliamento, controlli di routine e primo contatto con la cittadinanza."],
  ['Agente Scelto', 'Maggiore autonomia operativa dopo i primi mesi di servizio sul campo.'],
  ['Assistente', 'Coordina piccoli interventi e affianca le nuove reclute in servizio.'],
  ['Assistente Capo', 'Responsabilità aggiuntive nella gestione delle pattuglie e dei turni.'],
  ['Sovrintendente', 'Supervisiona un gruppo di agenti e riporta direttamente ai superiori di reparto.'],
  ['Ispettore', 'Guida operazioni più complesse e coordina più reparti in interventi congiunti.'],
  ['Vice Commissario', 'Gestisce un intero reparto e ne definisce le priorità operative.'],
  ['Questore', 'Al vertice della Questura: definisce le strategie, rappresenta il Corpo e supervisiona ogni reparto.'],
];

export default function QualifichePage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-1.jpg" alt="Distintivo e uniforme della Polizia" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>Carriera nel Corpo</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Otto gradi, una scalata</h1>
          <p className="mt-4 max-w-xl text-ink-dim">
            Dalla prima divisa alla guida della Questura: ogni grado riconosce esperienza, impegno e capacità di
            comando.
          </p>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl">
          <Eyebrow>Il percorso di carriera</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Gli otto gradi del Corpo</h2>
          <ol className="mt-10 divide-y divide-line border-y border-line" aria-label="Gradi in ordine di carriera">
            {GRADI.map(([title, text], i) => (
              <li key={title} className="flex gap-6 py-6">
                <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-ink-dim">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <section className="grain border-t border-line bg-surface-alt py-16">
        <Container className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Vuoi iniziare la scalata?</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold">Ogni grado parte da qui</h2>
            <p className="mt-2 text-ink-dim">
              La carriera comincia con la candidatura: supera il colloquio, completa l&apos;accademia e indossa la
              prima divisa.
            </p>
          </div>
          <Btn as={Link} href="/concorso" iconEnd="arrow_forward">
            Scopri come candidarti
          </Btn>
        </Container>
      </section>
      <BackHome />
    </>
  );
}
