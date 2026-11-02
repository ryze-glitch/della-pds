'use client';

import { SEZIONI } from '../servizi';
import { SEZIONI2 } from '../servizi2';

export function Sezione({ v }) {
  const S = SEZIONI[v] || SEZIONI2[v];
  return <S />;
}
