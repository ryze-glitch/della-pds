import { Notice, PageHeader } from '../../../../components/ui';
import { Checklist, FormPage } from '../../../../components/forms/FormPage';
import { SportelloForm } from '../../../../components/forms/SportelloForm';
import { TariffePda } from '../../../../components/TariffePda';

export const metadata = { title: "Porto d'armi (PDA) — Questura IPRP" };

export default function PdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Porto d’armi: rilascio e rinnovo"
        text="Richiedi il porto d’armi (PDA) o rinnova quello in scadenza. "
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: "Porto d'armi" }]}
      />
      <FormPage
        aside={
          <>
            <TariffePda />
            <Checklist
              title="Visita medica"
              icon="stethoscope"
              items={[
                'Prima del rilascio serve il certificato di idoneità psicofisica.',
                'La visita si svolge in-character presso la struttura sanitaria della città.',
                'Porta il certificato in Questura al momento del ritiro.',
              ]}
            />
            <Notice tone="info" title="Requisiti">
              Maggiore età in-character e assenza di precedenti penali.
            </Notice>
          </>
        }
      >
        <SportelloForm formId="pda" />
      </FormPage>
    </>
  );
}
