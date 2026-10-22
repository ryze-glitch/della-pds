'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

const OPTIONS = [
  ['system', 'Tema del sistema', 'monitor'],
  ['light', 'Tema chiaro', 'sun'],
  ['dark', 'Tema scuro', 'moon'],
];

export function ThemeSwitch({ compact = false }) {
  const [mode, setMode] = useState('system');

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme');
    setMode(t === 'light' || t === 'dark' ? t : 'system');
  }, []);

  function choose(next) {
    setMode(next);
    try {
      if (next === 'system') localStorage.removeItem('pds-theme');
      else localStorage.setItem('pds-theme', next);
    } catch (e) {
      /* storage non disponibile */
    }
    if (next === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <div role="radiogroup" aria-label="Tema" className={`inline-flex items-center rounded-full border p-0.5 ${compact ? 'border-white/25' : 'border-line'}`}>
      {OPTIONS.map(([key, label, icon]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={mode === key}
          aria-label={label}
          title={label}
          onClick={() => choose(key)}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
            mode === key ? (compact ? 'bg-white/25 text-white' : 'bg-surface2 text-fg') : compact ? 'text-white/60 hover:text-white' : 'text-muted hover:text-fg'
          }`}
        >
          <Icon name={icon} size={13} />
        </button>
      ))}
    </div>
  );
}
