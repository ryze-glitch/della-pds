'use client';

import { SEZIONI } from '../servizi';

export function Sezione({ v }) {
  const S = SEZIONI[v];
  return <S />;
}
