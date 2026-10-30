'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icons';
import { saveCredential } from '../../lib/googleAuth';

// Schermata di accesso: mostra il pulsante ufficiale "Accedi con Google" (accounts.google.com).
export function GoogleGate({ clientId, onLogin }) {
  const ref = useRef(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    function init() {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => {
          const u = saveCredential(resp.credential);
          if (u) onLogin(u);
          else setErr('Accesso non riuscito. Riprova.');
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.renderButton(ref.current, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', locale: 'it', width: 280 });
    }
    if (window.google && window.google.accounts) init();
    else {
      let s = document.querySelector('script[data-gsi]');
      if (!s) {
        s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.dataset.gsi = '1';
        s.onerror = () => setErr('Impossibile caricare l’accesso con Google. Controlla la connessione.');
        document.head.appendChild(s);
      }
      s.addEventListener('load', init);
    }
    return () => {
      cancelled = true;
    };
  }, [clientId, onLogin]);

  return (
    <div className="rounded-2xl border border-line p-7 text-center sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2 text-link">
        <Icon name="user" size={26} strokeWidth={1.5} />
      </span>
      <h2 className="mt-5 text-xl font-medium">Accedi per continuare</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        Per presentare una richiesta devi accedere con il tuo account Google. L’accesso avviene direttamente su <strong className="font-medium text-fg">accounts.google.com</strong>: il sito non vede la tua password.
      </p>
      <div ref={ref} className="mt-6 flex min-h-[44px] justify-center" />
      {err ? <p className="mt-4 text-sm text-bad">{err}</p> : null}
      <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-muted">Nome ed e-mail dell’account vengono inviati alla Questura insieme alla richiesta, per identificare chi la presenta.</p>
    </div>
  );
}
