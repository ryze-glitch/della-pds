'use client';

import { VERSIONI } from '../versioni';

export function Ver({ v }) {
  const V = VERSIONI[v];
  return <V />;
}
