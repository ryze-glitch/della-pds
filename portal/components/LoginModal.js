'use client';

import { useEffect } from 'react';
import { Icon } from './icons';
import { GoogleGate } from './forms/GoogleGate';

// Finestra di accesso con Google (accounts.google.com).
export function LoginModal({ clientId, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Accedi">
      <button type="button" aria-label="Chiudi" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-[20px] bg-[#141a24]">
        <button type="button" onClick={onClose} aria-label="Chiudi" className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-fg">
          <Icon name="x" size={18} />
        </button>
        {clientId ? (
          <GoogleGate clientId={clientId} onLogin={onClose} />
        ) : (
          <div className="rounded-[20px] border border-[#242d3b] p-8 text-center">
            <h2 className="text-xl font-medium">Accesso non ancora attivo</h2>
            <p className="mt-2 text-[15px] text-muted">L'accesso con Google verrà attivato a breve. Nel frattempo puoi inviare e seguire le richieste senza account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
