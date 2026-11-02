import { Container, Notice, PageHeader } from '../../../../components/ui';
import { TrackLookup } from '../../../../components/forms/TrackLookup';
import { MiePratiche } from '../../../../components/MiePratiche';
import { Widget } from '../../../../components/Widget';

export const metadata = { title: 'Stato della pratica — Questura IPRP' };

export default function PraticaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Le mie pratiche"
        text="Inserisci il codice univoco che hai ricevuto all’invio della richiesta."
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: 'Stato pratica' }]}
      />
      <Container className="max-w-3xl py-10 md:py-14">
        <Widget icon="file-text" title="Le tue pratiche" className="mb-8">
          <MiePratiche />
        </Widget>
        <h2 className="mb-4 text-xl font-medium">Cerca con il codice</h2>
        <TrackLookup />
        <Notice tone="info" className="mt-8">
          Il codice ha il formato <strong>POL-2026-K7M2QX</strong>. Per tutelare la tua privacy, qui compare solo lo stato:
          i dettagli della pratica sono trattati dal personale della Questura.
        </Notice>
      </Container>
    </>
  );
}
