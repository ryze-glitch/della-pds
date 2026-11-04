import { Corpo5 } from '../corpo5';

export function generateStaticParams() {
  return ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Corpo5 v={params.v} />;
}
