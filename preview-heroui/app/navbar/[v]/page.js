import { Demo } from './demo';

export function generateStaticParams() {
  return ['a', 'b', 'c', 'd', 'e'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Demo v={params.v} />;
}
