import { HeaderFoto } from '../header';

export function generateStaticParams() {
  return ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <HeaderFoto v={params.v} />;
}
