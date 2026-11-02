import { Hero } from './hero';

export function generateStaticParams() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Hero v={params.v} />;
}
