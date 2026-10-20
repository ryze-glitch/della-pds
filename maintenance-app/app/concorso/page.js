import { Btn, Container, CtaBand, Label, PageHero, SectionTitle } from '../../components/ui';
import { FORM_URL } from '../../lib/data';

export const metadata = { title: 'Concorso — Polizia di Stato — Italian Paradise RP' };

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
      <PageHero
        label="Concorso pubblico"
        title="Entra a far parte del Corpo."
        text="Le selezioni per diventare agente sono aperte tutto l'anno. Compila il modulo di candidatura ufficiale per iniziare il tuo percorso in uno dei nostri reparti."
        img="/assets/hero-slide-2.jpg"
        pos="center 45%"
      >
        <div className="mt-10">
          <Btn href={FORM_URL} target="_blank" rel="noopener" size="lg" variant="accent" icon="arrow-up-right">
            Vai al modulo di candidatura
          </Btn>
          <p className="mono mt-4 text-xs text-mute">Si apre in una nuova scheda, su Google Forms.</p>
        </div>
      </PageHero>

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="Il percorso" title="Come funziona la selezione." />
          <ol className="mt-12 grid border-2 border-ink md:grid-cols-3">
            {STEPS.map(([n, t, d], i) => (
              <li key={t} className={`p-6 md:p-10 ${i > 0 ? 'border-t-2 border-ink md:border-l-2 md:border-t-0' : ''}`}>
                <div className="display text-[clamp(4rem,9vw,9rem)] text-accent">{n}</div>
                <h3 className="mt-6 text-3xl font-extrabold">{t}</h3>
                <p className="mt-3 text-lg text-mute">{d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-ink py-16 text-paper md:py-28">
        <Container>
          <Label n="02" className="text-paper/70">
            Prima di candidarti
          </Label>
          <h2 className="display mt-8 text-[clamp(2.6rem,7vw,7rem)]">Cosa cerchiamo.</h2>
          <ul className="mt-14 border-t-2 border-paper">
            {REQS.map(([t, d], i) => (
              <li key={t} className="grid gap-3 border-b-2 border-paper/30 py-7 md:grid-cols-12 md:items-baseline">
                <span className="mono text-xs font-bold text-accent md:col-span-1">0{i + 1}</span>
                <h3 className="text-3xl font-extrabold md:col-span-5">{t}</h3>
                <p className="text-lg text-paper/70 md:col-span-6">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        label="Pronto a partire?"
        title="Candidati ora."
        text="Le selezioni sono aperte tutto l'anno. Il primo passo è il modulo di candidatura: il resto lo scopri strada facendo."
        action={
          <Btn href={FORM_URL} target="_blank" rel="noopener" variant="paper" size="lg" icon="arrow-up-right">
            Vai al modulo
          </Btn>
        }
      />
    </>
  );
}
