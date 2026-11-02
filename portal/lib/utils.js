import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilità standard di shadcn/ui: unisce le classi risolvendo i conflitti di Tailwind.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
