import { Corpo2 } from '../corpo2';

export function generateStaticParams() {
  return ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Corpo2 v={params.v} />;
}
