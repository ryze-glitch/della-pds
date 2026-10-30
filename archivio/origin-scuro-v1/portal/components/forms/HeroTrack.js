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
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black py-2 pl-[22px] pr-2"
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
        className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-[13px] uppercase tracking-[0.08em] text-[#fafafa] outline-none placeholder:text-muted"
      />
      <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
        <span className="sr-only">Cerca</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
    </form>
  );
}
