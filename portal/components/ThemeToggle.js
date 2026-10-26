'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

const KEY = 'pds-theme';

// Interruttore chiaro/scuro (luna/sole). La scelta resta nel browser.
export function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);
  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#ffffff' : '#121821');
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* storage non disponibile */
    }
    setTheme(next);
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Passa al tema scuro' : 'Passa al tema chiaro'}
      title={theme === 'light' ? 'Tema scuro' : 'Tema chiaro'}
      className="flex h-[41px] w-[41px] flex-none items-center justify-center rounded-full text-fg transition hover:bg-[color:var(--sh-soft)]"
    >
      <Icon name={theme === 'light' ? 'moon' : 'sun'} size={21} strokeWidth={1.6} />
    </button>
  );
}
