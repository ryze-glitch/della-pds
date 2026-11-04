import { Corpo4 } from '../corpo4';

export function generateStaticParams() {
  return ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Corpo4 v={params.v} />;
}
