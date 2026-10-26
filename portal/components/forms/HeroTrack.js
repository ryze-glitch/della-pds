'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroTrack() {
  const router = useRouter();
  const [v, setV] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/sportello/pratica?codice=${encodeURIComponent(v.trim())}`);
      }}
      className="flex overflow-hidden rounded-full border border-[color:var(--sh-in)]"
    >
      <label htmlFor="hero-code" className="sr-only">
        Codice pratica
      </label>
      <input
        id="hero-code"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="#POL-2026-"
        autoComplete="off"
        spellCheck="false"
        className="min-w-0 flex-1 bg-transparent pl-4 pr-2 py-2.5 font-mono text-[12.6px] uppercase tracking-wide text-fg outline-none placeholder:text-muted/60"
      />
      <button type="submit" className="bg-primary px-5 text-sm font-medium text-primary-fg transition hover:bg-primary/90">
        Cerca
      </button>
    </form>
  );
}
