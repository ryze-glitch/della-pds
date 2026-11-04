import { Pagina7 } from '../pagina';

export function generateStaticParams() {
  return ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'].map((v) => ({ v }));
}

export default function Page({ params }) {
  return <Pagina7 v={params.v} />;
}
