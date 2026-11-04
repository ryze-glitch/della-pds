import { Header } from '../header';

export function generateStaticParams() {
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Header v={params.v} />;
}
