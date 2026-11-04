import { Dash2 } from '../dash2';

export function generateStaticParams() {
  return ['k1', 'k2', 'k3', 'k4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Dash2 v={params.v} />;
}
