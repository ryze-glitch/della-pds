import { Corpo } from '../corpo';

export function generateStaticParams() {
  return ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Corpo v={params.v} />;
}
