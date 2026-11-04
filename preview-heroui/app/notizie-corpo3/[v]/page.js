import { Corpo3 } from '../corpo3';

export function generateStaticParams() {
  return ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Corpo3 v={params.v} />;
}
