import { Gest } from './gest';

export function generateStaticParams() {
  return ['g1', 'g2', 'g3', 'g4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Gest v={params.v} />;
}
