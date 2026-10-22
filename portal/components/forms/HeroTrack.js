'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '../icons';

export function HeroTrack() {
  const router = useRouter();
  const [v, setV] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/sportello/pratica?codice=${encodeURIComponent(v.trim())}`);
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label htmlFor="hero-code" className="sr-only">
          Codice pratica
        </label>
        <input
          id="hero-code"
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="Codice pratica, es. POL-2026-K7M2QX"
          autoComplete="off"
          spellCheck="false"
          className="input h-12 font-mono uppercase tracking-wide"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:bg-primary/90"
      >
        <Icon name="search" size={17} /> Verifica stato
      </button>
    </form>
  );
}
