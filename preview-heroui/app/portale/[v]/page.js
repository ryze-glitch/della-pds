import { Portale } from '../portale';

export function generateStaticParams() {
  return ['l1', 'l2', 'l3'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Portale v={params.v} />;
}
