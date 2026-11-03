'use client';

import { useRouter } from 'next/navigation';
import { HeroUIProvider } from '@heroui/react';

// Collega i link di HeroUI al router di Next (navigazione senza ricaricare la pagina).
export function Providers({ children }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push} locale="it-IT">
      {children}
    </HeroUIProvider>
  );
}
