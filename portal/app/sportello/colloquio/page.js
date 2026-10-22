import { PageHeader } from '../../../components/ui';
import { Checklist, FormPage } from '../../../components/forms/FormPage';
import { SportelloForm } from '../../../components/forms/SportelloForm';

export const metadata = { title: 'Colloquio con i Dirigenti — Questura IPRP' };

export default function ColloquioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Prenota un colloquio con i Dirigenti"
        text="Indica con chi vuoi parlare, il motivo e quando sei disponibile. La segreteria ti confermerà l’appuntamento."
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: 'Colloquio' }]}
      />
      <FormPage aside={<Checklist title="Come funziona" items={['Scegli l’ufficio e la data preferita', 'Descrivi brevemente il motivo', 'Ricevi il codice pratica e attendi la conferma']} />}>
        <SportelloForm formId="colloquio" />
      </FormPage>
    </>
  );
}
