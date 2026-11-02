'use client';

import { useEffect, useRef } from 'react';

// Verifica anti-bot (Cloudflare Turnstile): compare solo se il Worker la ha attivata.
export function TurnstileWidget({ siteKey, onToken }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!siteKey || !ref.current) return undefined;
    let widgetId = null;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || !ref.current) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (t) => onToken(t),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };
    if (window.turnstile) render();
    else {
      let s = document.querySelector('script[data-turnstile]');
      if (!s) {
        s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.defer = true;
        s.dataset.turnstile = '1';
        document.head.appendChild(s);
      }
      s.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
      if (widgetId !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          /* già rimosso */
        }
      }
    };
  }, [siteKey, onToken]);
  return <div ref={ref} className="mt-6" />;
}
