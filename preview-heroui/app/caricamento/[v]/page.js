import { Caric } from './caric';

export function generateStaticParams() {
  return ['c1', 'c2', 'c3', 'c4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Caric v={params.v} />;
}
