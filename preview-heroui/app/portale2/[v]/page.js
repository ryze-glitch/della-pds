import { Portale2 } from '../portale2';

export function generateStaticParams() {
  return ['m1', 'm2', 'm3', 'm4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Portale2 v={params.v} />;
}
