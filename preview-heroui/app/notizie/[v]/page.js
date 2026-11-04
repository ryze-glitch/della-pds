import { Notizie } from '../notizie';

export function generateStaticParams() {
  return ['n1', 'n2', 'n3', 'n4', 'n5'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Notizie v={params.v} />;
}
