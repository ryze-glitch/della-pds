'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

const OPTIONS = [
  ['system', 'Sistema', 'monitor'],
  ['light', 'Chiaro', 'sun'],
  ['dark', 'Scuro', 'moon'],
];

export function ThemeSwitch() {
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
    <div role="radiogroup" aria-label="Tema" className="inline-flex items-center rounded-full border border-line p-0.5">
      {OPTIONS.map(([key, label, icon]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={mode === key}
          aria-label={label}
          title={label}
          onClick={() => choose(key)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            mode === key ? 'bg-line text-fg' : 'text-muted hover:text-fg'
          }`}
        >
          <Icon name={icon} size={14} />
        </button>
      ))}
    </div>
  );
}
