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
      className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-5 pr-1.5 focus-within:bg-white/[0.16]"
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
        className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-[16px] font-medium uppercase tracking-[0.04em] text-fg outline-none placeholder:text-muted"
      />
      <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/85">
        <span className="sr-only">Cerca</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
    </form>
  );
}
