'use client';

import { VERSIONI } from '../versioni';
import { VERSIONI2 } from '../versioni2';

export function Ver({ v }) {
  const V = VERSIONI[v] || VERSIONI2[v];
  return <V />;
}
