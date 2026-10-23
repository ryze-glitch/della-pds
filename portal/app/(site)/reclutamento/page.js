import { Badge, Btn, Container, Notice, PageHeader } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { Reveal } from '../../../components/Reveal';
import { BANDI, FORM_URL } from '../../../lib/data';

export const metadata = { title: 'Bandi & Reclutamento — Questura IPRP' };

const STEPS = [
  ['file-text', 'Candidatura', 'Compila il modulo ufficiale e rispondi al quiz di ingresso.'],
  ['users', 'Colloquio IC', 'Un agente valuta la candidatura e ti convoca per il colloquio in-character.'],
  ['graduation', 'Accademia', 'Completi la formazione e vieni assegnato a un reparto.'],
];

const REQ = [
  ['Microfono funzionante', 'Il roleplay è in voce: serve audio chiaro e ambiente senza troppo rumore.'],
  ['Conoscenza del regolamento', 'Leggi il regolamento del server e quello specifico del corpo di polizia.'],
  ['Disponibilità e costanza', 'Non serve essere online ogni giorno, ma una presenza regolare aiuta la formazione.'],
  ['Roleplay serio', 'Cerchiamo persone che interpretano il ruolo con impegno, non solo “vestire la divisa”.'],
];

export default function ReclutamentoPage() {
  return (
    <>
      <PageHeader
        title="Entra nella Polizia di Stato"
        text="Selezioni aperte tutto l’anno. Scegli il bando, candidati online e inizia il tuo percorso in Questura."
        crumbs={[{ label: 'Bandi & Reclutamento' }]}
      />
      <Container className="py-10 md:py-14">
        <h2 className="text-2xl font-semibold tracking-tight">Selezioni in corso</h2>
        <div className="mt-5 divide-y divide-line border-y border-line">
          {BANDI.map((b, i) => (
            <Reveal key={b.titolo} delay={i * 60}>
              <div className="grid items-center gap-x-8 gap-y-3 py-6 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={b.tone}>{b.stato}</Badge>
                    <span className="text-sm text-muted">{b.scadenza}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{b.titolo}</h3>
                  <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-muted">{b.testo}</p>
                </div>
                {b.stato === 'Aperto' ? (
                  <Btn href={FORM_URL} target="_blank" rel="noopener" variant="primary" icon="external">
                    Candidati
                  </Btn>
                ) : (
                  <span className="text-sm font-medium text-muted">Non ancora disponibile</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">Il modulo di candidatura si apre in una nuova scheda (Google Forms).</p>

        <h2 className="mt-16 text-2xl font-semibold tracking-tight">Come funziona</h2>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-3">
          {STEPS.map(([icon, t, d], i) => (
            <li key={t} className="bg-surface p-6">
              <span className="font-mono text-sm text-gold-ink">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-semibold tracking-tight">Cosa cerchiamo</h2>
        <ul className="mt-5 grid gap-x-14 border-t border-line md:grid-cols-2">
          {REQ.map(([t, d]) => (
            <li key={t} className="flex gap-3 border-b border-line py-5">
              <Icon name="check" size={18} className="mt-1 flex-none text-link" />
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ul>
        <Notice tone="gold" title="Servizio in-character" className="mt-8">
          Le selezioni riguardano il ruolo di gioco nel server Italian Paradise XI.
        </Notice>
      </Container>
    </>
  );
}
