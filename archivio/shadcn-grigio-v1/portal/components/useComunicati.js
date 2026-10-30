'use client';

import { useEffect, useState } from 'react';

// Comunicati pubblicati dagli agenti (Firestore, collezione "comunicati").
// null = in caricamento; [] = nessun comunicato (la UI non mostra nulla).
export function useComunicati(max = 20) {
  const [list, setList] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ db }, fs] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
        const snap = await fs.getDocs(fs.query(fs.collection(db, 'comunicati'), fs.orderBy('data', 'desc'), fs.limit(max)));
        if (!cancelled) setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        if (!cancelled) setList([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [max]);
  return list;
}
