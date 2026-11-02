import { PageHeader } from '../../../../components/ui';
import { Checklist, FormPage } from '../../../../components/forms/FormPage';
import { SportelloForm } from '../../../../components/forms/SportelloForm';

export const metadata = { title: 'Denuncia online — Questura IPRP' };

export default function DenunciaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Presenta una denuncia online"
        text="Compila il modulo con i dati dei fatti. Al termine riceverai un codice pratica per seguirne l’avanzamento."
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: 'Denuncia online' }]}
      />
      <FormPage
        aside={
          <Checklist
            title="Prima di iniziare"
            items={['Nome e cognome del tuo personaggio (IC)', 'Numero di telefono e documento IC', 'Luogo, data e ora dei fatti', 'Eventuali testimoni e link a screenshot o clip']}
          />
        }
      >
        <SportelloForm formId="denuncia" />
      </FormPage>
    </>
  );
}
