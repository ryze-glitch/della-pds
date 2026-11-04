import { Dash } from '../dash';

export function generateStaticParams() {
  return ['j1', 'j2', 'j3', 'j4'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Dash v={params.v} />;
}
