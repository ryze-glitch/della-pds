import { Demo } from './demo';

export function generateStaticParams() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Demo v={params.v} />;
}
