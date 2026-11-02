'use client';

import { HEROES } from '../heroes';
import { HEROES2 } from '../heroes2';

export function Hero({ v }) {
  const H = HEROES[v] || HEROES2[v];
  return <H />;
}
