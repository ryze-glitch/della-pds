'use client';

import { GESTIONI } from '../gest';

export function Gest({ v }) {
  const G = GESTIONI[v];
  return <G />;
}
