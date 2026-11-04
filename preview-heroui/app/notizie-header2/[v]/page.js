import { HeaderFoto } from '../header';

export function generateStaticParams() {
  return ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <HeaderFoto v={params.v} />;
}
