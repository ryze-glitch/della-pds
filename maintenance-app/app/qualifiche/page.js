import Link from 'next/link';
import { Btn, CtaBox, Inner, Mono, PageHero, Section } from '../../components/ui';
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
        <ol aria-label="Gradi in ordine di carriera">
          {GRADI.map(([title, text], i) => (
            <li key={title} className="grid gap-2 border-b border-line px-5 py-7 last:border-b-0 md:grid-cols-[5rem_1fr_1.4fr] md:items-baseline md:gap-6 md:px-12 md:py-8">
              <Mono>{String(i + 1).padStart(2, '0')}</Mono>
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="text-muted">{text}</p>
            </li>
          ))}
        </ol>
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
