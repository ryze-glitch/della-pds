'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

// Tariffe del porto d'armi: leggono Firestore config/tariffe (gestite dagli agenti).
// Se non ci sono, la sezione resta ma vuota.
export function TariffePda() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [{ db }, fs] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
        const snap = await fs.getDoc(fs.doc(db, 'config', 'tariffe'));
        if (!off) setItems(snap.exists() && Array.isArray(snap.data().items) ? snap.data().items : []);
      } catch (e) {
        if (!off) setItems([]);
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 font-medium">
        <Icon name="wallet" size={18} className="text-link" /> Tariffe (IC)
      </div>
      {items === null ? (
        <p className="px-5 py-6 text-sm text-muted">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">Le tariffe non sono ancora state pubblicate.</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((t, i) => (
            <li key={i} className="px-5 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{t.nome}</span>
                <span className="font-semibold text-link">{t.importo}</span>
              </div>
              {t.note ? <div className="mt-0.5 text-xs text-muted">{t.note}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
