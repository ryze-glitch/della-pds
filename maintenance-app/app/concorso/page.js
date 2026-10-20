import { Btn, Cell, Cells, CtaBox, Inner, Mono, PageHero, Section, SectionHead } from '../../components/ui';
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
        badge="Concorso pubblico"
        title="Entra a far parte del Corpo."
        text="Le selezioni per diventare agente sono aperte tutto l'anno. Compila il modulo di candidatura ufficiale per iniziare il tuo percorso."
      >
        <div className="mt-8 flex flex-col items-center gap-3">
          <Btn href={FORM_URL} target="_blank" rel="noopener" size="lg" icon="external">
            Vai al modulo di candidatura
          </Btn>
          <Mono className="normal-case">Si apre in una nuova scheda, su Google Forms.</Mono>
        </div>
      </PageHero>

      <Section>
        <Inner className="!pb-12">
          <SectionHead badge="Il percorso" title="Come funziona la selezione." />
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

      <Section>
        <Inner className="!pb-12">
          <SectionHead badge="Prima di candidarti" title="Cosa cerchiamo." />
        </Inner>
        <Cells cols="md:grid-cols-2" className="border-t border-line">
          {REQS.map(([t, d]) => (
            <Cell key={t} className="p-6 md:p-8">
              <h3 className="text-lg font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
            </Cell>
          ))}
        </Cells>
      </Section>

      <CtaBox
        title="Pronto a partire?"
        text="Il primo passo è il modulo di candidatura: il resto lo scopri strada facendo."
        action={
          <Btn href={FORM_URL} target="_blank" rel="noopener" size="lg" icon="external">
            Vai al modulo
          </Btn>
        }
      />
    </>
  );
}
