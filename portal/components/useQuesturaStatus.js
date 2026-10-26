'use client';

import { useEffect, useState } from 'react';

// Stato della Questura: se esiste il documento Firestore config/status lo
// usa (gestibile da console), altrimenti ricava l'orario dello sportello.
export function useQuesturaStatus() {
  const [remote, setRemote] = useState(null);
  const [hour, setHour] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', hour: 'numeric', hour12: false });
    const tick = () => setHour(parseInt(fmt.format(new Date()), 10) % 24);
    tick();
    const id = setInterval(tick, 60000);
    let unsub = () => {};
    let cancelled = false;
    import('../lib/firebase')
      .then(async ({ db }) => {
        const { doc, onSnapshot } = await import('firebase/firestore');
        if (cancelled) return;
        unsub = onSnapshot(
          doc(db, 'config', 'status'),
          (snap) => setRemote(snap.exists() ? snap.data() : null),
          () => setRemote(null)
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      clearInterval(id);
      unsub();
    };
  }, []);

  const apertoOra = hour === null ? true : hour >= 8 && hour < 23;
  const centrale = (remote && remote.centrale) || 'ATTIVA';
  const sportello = (remote && remote.sportello) || (apertoOra ? 'APERTO AL PUBBLICO' : 'CHIUSO');
  return { centrale, sportello, centraleOk: centrale.toUpperCase().startsWith('ATTIV'), sportelloOk: sportello.toUpperCase().startsWith('APERT') };
}
