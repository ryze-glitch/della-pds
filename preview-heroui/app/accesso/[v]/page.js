import { Acc } from './acc';

export function generateStaticParams() {
  return ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Acc v={params.v} />;
}
