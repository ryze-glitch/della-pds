'use client';

import { useState } from 'react';
import { Icon } from './icons';

// Copia il link diretto alla pratica ("Le mie pratiche" → codice nell'URL).
export function CopiaLink({ code }) {
  const [ok, setOk] = useState(false);
  async function copy(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/sportello/pratica?codice=${code}`);
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    } catch (err) {
      /* clipboard non disponibile */
    }
  }
  return (
    <button type="button" onClick={copy} aria-label={`Copia il link della pratica ${code}`} title="Copia link" className="rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-fg">
      <Icon name={ok ? 'check' : 'copy'} size={15} />
    </button>
  );
}
