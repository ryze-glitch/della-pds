import { Hero } from './hero';

export function generateStaticParams() {
  return ['a', 'b', 'c', 'd', 'e', 'f'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Hero v={params.v} />;
}
