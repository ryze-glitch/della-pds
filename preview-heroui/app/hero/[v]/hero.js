'use client';

import { HEROES } from '../heroes';

export function Hero({ v }) {
  const H = HEROES[v];
  return <H />;
}
