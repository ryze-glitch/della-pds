'use client';

import { useEffect, useState } from 'react';

// Stato della Questura, letto da Firestore (config/status).
export function useQuesturaStatus() {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
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
      unsub();
    };
  }, []);

  // Solo dati reali: lo stato appare se esiste il documento Firestore config/status
  // ({ centrale: 'ATTIVA', sportello: 'APERTO AL PUBBLICO' }); altrimenti non si mostra nulla.
  const centrale = remote && remote.centrale ? String(remote.centrale) : null;
  const sportello = remote && remote.sportello ? String(remote.sportello) : null;
  return {
    centrale,
    sportello,
    centraleOk: !!centrale && centrale.toUpperCase().startsWith('ATTIV'),
    sportelloOk: !!sportello && sportello.toUpperCase().startsWith('APERT'),
  };
}
