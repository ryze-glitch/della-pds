import { Sezione } from './sezione';

export function generateStaticParams() {
  return ['s1', 's2', 's3', 's4', 's5', 's6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Sezione v={params.v} />;
}
