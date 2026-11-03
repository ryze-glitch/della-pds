import { Ver } from './ver';

export function generateStaticParams() {
  return ['v1', 'v2', 'v3', 'v4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Ver v={params.v} />;
}
