import Link from 'next/link';
import { Btn, Container, CtaBand, PageHero, SectionTitle } from '../../components/ui';
import { GRADI } from '../../lib/data';

export const metadata = { title: 'Qualifiche — Polizia di Stato — Italian Paradise RP' };

export default function QualifichePage() {
  return (
    <>
      <PageHero
        label="Carriera nel Corpo"
        title="Otto gradi, una scalata."
        text="Dalla prima divisa alla guida della Questura: ogni grado riconosce esperienza, impegno e capacità di comando."
        img="/assets/hero-slide-2.jpg"
        pos="center 35%"
      />
      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="Il percorso di carriera" />
          <ol className="mt-10 border-t-2 border-ink" aria-label="Gradi in ordine di carriera">
            {GRADI.map(([title, text], i) => {
              const top = i === GRADI.length - 1;
              return (
                <li
                  key={title}
                  className={`grid gap-3 border-b-2 border-ink py-8 md:grid-cols-12 md:items-baseline md:py-10 ${top ? 'bg-accent px-4 text-white' : ''}`}
                >
                  <span className={`mono text-sm font-bold md:col-span-1 ${top ? 'text-white' : 'text-accent'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="display text-[clamp(2.4rem,6vw,6rem)] md:col-span-6">{title}</h3>
                  <p className={`text-lg md:col-span-5 ${top ? 'text-white/90' : 'text-mute'}`}>{text}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
      <CtaBand
        label="Vuoi iniziare la scalata?"
        title="Ogni grado parte da qui."
        text="La carriera comincia con la candidatura: supera il colloquio, completa l'accademia e indossa la prima divisa."
        action={
          <Btn as={Link} href="/concorso" variant="paper" size="lg" icon="arrow-right">
            Scopri come candidarti
          </Btn>
        }
      />
    </>
  );
}
