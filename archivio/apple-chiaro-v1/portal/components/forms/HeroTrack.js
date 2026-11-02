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
      className="flex items-center gap-2 rounded-full border border-fog bg-white py-1.5 pl-6 pr-1.5"
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
        className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-fg outline-none placeholder:text-muted"
      />
      <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-fg transition-colors hover:bg-[#0077ed]">
        <span className="sr-only">Cerca</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
    </form>
  );
}
