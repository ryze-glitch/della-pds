import { Ver } from './ver';

export function generateStaticParams() {
  return ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Ver v={params.v} />;
}
