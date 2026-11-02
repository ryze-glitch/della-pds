import { Sezione } from './sezione';

export function generateStaticParams() {
  return ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Sezione v={params.v} />;
}
