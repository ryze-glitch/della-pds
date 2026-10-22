import { Container, Notice, PageHeader } from '../../../components/ui';
import { TrackLookup } from '../../../components/forms/TrackLookup';

export const metadata = { title: 'Stato della pratica — Questura IPRP' };

export default function PraticaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Verifica lo stato della pratica"
        text="Inserisci il codice univoco che hai ricevuto all’invio della richiesta."
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: 'Stato pratica' }]}
      />
      <Container className="max-w-3xl py-10 md:py-14">
        <TrackLookup />
        <Notice tone="info" className="mt-8">
          Il codice ha il formato <strong>POL-2026-K7M2QX</strong>. Per tutelare la tua privacy, qui compare solo lo stato:
          i dettagli della pratica sono trattati dal personale della Questura.
        </Notice>
      </Container>
    </>
  );
}
