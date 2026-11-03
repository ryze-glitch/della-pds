'use client';

import { CARICAMENTI } from '../caric';

export function Caric({ v }) {
  const C = CARICAMENTI[v];
  return <C />;
}
