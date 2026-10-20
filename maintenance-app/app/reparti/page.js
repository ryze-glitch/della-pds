import Link from 'next/link';
import { Btn, CtaBox, DeptCards, PageHero, Section } from '../../components/ui';
import { DEPTS } from '../../lib/data';

export const metadata = { title: 'Reparti — Polizia di Stato — Italian Paradise RP' };

export default function RepartiPage() {
  return (
    <>
      <PageHero
        badge="I nostri reparti"
        title="Sei reparti, una missione."
        text="Ogni reparto risponde a una parte specifica della sicurezza cittadina, con procedure e catena di comando dedicate."
      />
      <Section>
        <DeptCards depts={DEPTS} href="/concorso" />
      </Section>
      <CtaBox
        title="Trova il tuo posto nel Corpo."
        text="Ogni reparto forma le proprie reclute: il primo passo, per tutti, è lo stesso modulo di candidatura."
        action={
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Vai al concorso
          </Btn>
        }
      />
    </>
  );
}
