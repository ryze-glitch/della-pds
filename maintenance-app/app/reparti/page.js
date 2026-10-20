import Link from 'next/link';
import { Btn, Container, CtaBand, DeptRows, PageHero, SectionTitle } from '../../components/ui';
import { DEPTS } from '../../lib/data';

export const metadata = { title: 'Reparti — Polizia di Stato — Italian Paradise RP' };

export default function RepartiPage() {
  return (
    <>
      <PageHero
        label="I nostri reparti"
        title="Sei reparti, una missione."
        text="Ogni reparto risponde a una parte specifica della sicurezza cittadina, con procedure e catena di comando dedicate."
        img="/assets/hero-slide-1.jpg"
        pos="center 50%"
      />
      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="Cosa facciamo" title="I reparti della Questura." />
          <div className="mt-12">
            <DeptRows depts={DEPTS} href="/concorso" />
          </div>
        </Container>
      </section>
      <CtaBand
        label="Entra in un reparto"
        title="Candidati."
        text="Ogni reparto forma le proprie reclute: il primo passo, per tutti, è lo stesso modulo di candidatura."
        action={
          <Btn as={Link} href="/concorso" variant="paper" size="lg" icon="arrow-right">
            Vai al concorso
          </Btn>
        }
      />
    </>
  );
}
