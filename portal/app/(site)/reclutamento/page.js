import { Badge, Btn, Card, Container, IconTile, Notice, PageHeader, Section, SectionHead } from '../../../components/ui';
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
        eyebrow="Bandi & Reclutamento"
        title="Entra nella Polizia di Stato"
        text="Selezioni aperte tutto l’anno. Scegli il bando, candidati online e inizia il tuo percorso in Questura."
        crumbs={[{ label: 'Bandi & Reclutamento' }]}
      />

      <Section>
        <SectionHead eyebrow="Bandi" title="Selezioni in corso" />
        <div className="grid gap-5 md:grid-cols-3">
          {BANDI.map((b, i) => (
            <Reveal key={b.titolo} delay={i * 80}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={b.tone}>{b.stato}</Badge>
                  <span className="text-xs text-muted">{b.scadenza}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{b.titolo}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{b.testo}</p>
                {b.stato === 'Aperto' ? (
                  <Btn href={FORM_URL} target="_blank" rel="noopener" variant="primary" icon="external" className="mt-5">
                    Candidati
                  </Btn>
                ) : (
                  <span className="mt-5 text-sm font-semibold text-muted">Non ancora disponibile</span>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Il modulo si apre in una nuova scheda, su Google Forms.</p>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Il percorso" title="Come funziona la selezione" />
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map(([icon, t, d], i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  <IconTile name={icon} />
                  <span className="text-3xl font-semibold text-gold">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Requisiti" title="Cosa cerchiamo" />
        <div className="grid gap-4 sm:grid-cols-2">
          {REQ.map(([t, d]) => (
            <div key={t} className="flex gap-3 rounded-2xl border border-line p-5">
              <Icon name="check-circle" size={22} className="mt-0.5 flex-none text-ok" />
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <Notice tone="gold" title="Servizio in-character" className="mt-8">
          Le selezioni riguardano il ruolo di gioco nel server Italian Paradise XI.
        </Notice>
      </Section>
    </>
  );
}
