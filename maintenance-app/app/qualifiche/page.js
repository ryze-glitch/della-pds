import Link from 'next/link';
import { Btn, CtaBox, PageHero, Section } from '../../components/ui';
import { RankTimeline } from '../../components/motion';
import { GRADI } from '../../lib/data';

export const metadata = { title: 'Qualifiche — Polizia di Stato — Italian Paradise RP' };

export default function QualifichePage() {
  return (
    <>
      <PageHero
        badge="Carriera nel Corpo"
        title="Otto gradi, una scalata."
        text="Dalla prima divisa alla guida della Questura: ogni grado riconosce esperienza, impegno e capacità di comando."
      />
      <Section>
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-0 md:py-28">
          <RankTimeline items={GRADI} />
        </div>
      </Section>
      <CtaBox
        title="Ogni grado parte da qui."
        text="La carriera comincia con la candidatura: supera il colloquio, completa l'accademia e indossa la prima divisa."
        action={
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Scopri come candidarti
          </Btn>
        }
      />
    </>
  );
}
