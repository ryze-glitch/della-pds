'use client';

import { HEROES } from '../heroes';
import { HEROES2 } from '../heroes2';
import { HEROES3 } from '../heroes3';

export function Hero({ v }) {
  const H = HEROES[v] || HEROES2[v] || HEROES3[v];
  return <H />;
}
