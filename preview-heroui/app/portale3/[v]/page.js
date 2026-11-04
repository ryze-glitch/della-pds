import { Portale3 } from '../portale3';

export function generateStaticParams() {
  return ['n1', 'n2', 'n3', 'n4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Portale3 v={params.v} />;
}
