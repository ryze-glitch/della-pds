import { Container, PageHeader } from '../../../components/ui';
import { NotizieList } from '../../../components/NotizieList';

export const metadata = { title: 'Comunicati e avvisi — Questura IPRP' };

export default function NotiziePage() {
  return (
    <>
      <PageHeader
        eyebrow="Avvisi & Comunicati"
        title="Comunicati e avvisi"
        text="Ordinanze di sicurezza pubblica, allerte e comunicati stampa ufficiali della Questura."
        crumbs={[{ label: 'Comunicati' }]}
      />
      <Container className="py-10 md:py-14">
        <NotizieList />
      </Container>
    </>
  );
}
