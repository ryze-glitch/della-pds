'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSaved } from '../lib/miePratiche';
import { cercaPratica } from '../lib/sportello';

// Pratiche salvate su questo dispositivo, con lo stato letto da Firestore.
export function usePratichePersonali() {
  const [items, setItems] = useState(null);
  const load = useCallback(async () => {
    const saved = getSaved();
    if (!saved.length) return setItems([]);
    const out = await Promise.all(
      saved.map(async (p) => {
        try {
          const r = await cercaPratica(p.code);
          return { ...p, stato: r.pratica ? r.pratica.stato : 'sconosciuta' };
        } catch (e) {
          return { ...p, stato: 'sconosciuta' };
        }
      })
    );
    setItems(out);
  }, []);
  useEffect(() => {
    load();
    window.addEventListener('pds-pratiche', load);
    return () => window.removeEventListener('pds-pratiche', load);
  }, [load]);
  return items;
}
