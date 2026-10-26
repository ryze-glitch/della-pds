'use client';

import { useEffect, useState } from 'react';
import { SPORTELLO_API } from '../../lib/sportello';

// Configurazione pubblica del Worker: anti-bot (Turnstile) e client ID di Google.
// null = in caricamento; { turnstileSiteKey, googleClientId } (anche null) = pronta.
export function useSportelloConfig() {
  const [cfg, setCfg] = useState(null);
  useEffect(() => {
    let off = false;
    fetch(`${SPORTELLO_API}/config`)
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((d) => {
        if (!off) setCfg({ turnstileSiteKey: (d && d.turnstileSiteKey) || null, googleClientId: (d && d.googleClientId) || null });
      });
    return () => {
      off = true;
    };
  }, []);
  return cfg;
}
