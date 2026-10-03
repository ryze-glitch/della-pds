'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { Btn, Container } from '../../components/ui';
import { auth, DISCORD_AUTH_WORKER_URL, DISCORD_CLIENT_ID } from '../../lib/firebase';

export default function LoginPage() {
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('denied') === '1') {
      setStatus({
        msg: "Il tuo account Discord non risulta registrato tra gli agenti. Contatta un amministratore per essere abilitato.",
        type: 'error',
      });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = '/dashboard';
      } else {
        setChecking(false);
      }
    });

    async function handleDiscordCallback() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) return;

      setStatus({ msg: 'Completamento accesso con Discord…', type: '' });
      try {
        const redirectUri = window.location.origin + window.location.pathname;
        const res = await fetch(
          `${DISCORD_AUTH_WORKER_URL}?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`
        );
        if (!res.ok) throw new Error('Worker error: ' + res.status);
        const data = await res.json();
        if (!data.token) throw new Error('Nessun token ricevuto');

        await signInWithCustomToken(auth, data.token);
        setStatus({ msg: 'Accesso con Discord riuscito.', type: 'success' });

        url.searchParams.delete('code');
        window.history.replaceState({}, '', url.pathname + url.hash);
      } catch (err) {
        console.error(err);
        setStatus({ msg: 'Accesso con Discord non riuscito. Riprova.', type: 'error' });
      }
    }
    handleDiscordCallback();

    return unsubscribe;
  }, []);

  function handleDiscordLogin() {
    const redirectUri = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email',
    });
    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  return (
    <section className="grain flex min-h-[80vh] items-center justify-center border-b border-line py-20">
      <Container className="max-w-md text-center">
        <img src="/assets/crest-md.png" width="52" height="82" alt="Stemma Polizia di Stato" className="mx-auto opacity-90" />
        <span className="mt-8 block font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">Accesso Riservato</span>
        <h1 className="mt-4 font-display text-4xl font-semibold">Area Personale</h1>
        <p className="mt-4 text-ink-dim">
          Accedi con il tuo account per consultare il tuo profilo, i turni assegnati e le comunicazioni di reparto.
        </p>

        {!checking ? (
          <div className="mt-10">
            <Btn as="button" type="button" variant="outlined" lg onClick={handleDiscordLogin} className="w-full">
              <svg width="18" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
                <path
                  fill="#5865F2"
                  d="M20.3 1.8A19.5 19.5 0 0 0 15.6.3a.07.07 0 0 0-.08.04c-.2.36-.43.83-.59 1.2a18 18 0 0 0-5.4 0 12 12 0 0 0-.6-1.2.08.08 0 0 0-.08-.04A19.4 19.4 0 0 0 3.9 1.8a.07.07 0 0 0-.03.03C.9 6.3.1 10.6.5 14.9a.08.08 0 0 0 .03.06 19.6 19.6 0 0 0 5.9 3 .08.08 0 0 0 .08-.03c.46-.62.86-1.28 1.2-1.97a.08.08 0 0 0-.04-.1 12.9 12.9 0 0 1-1.85-.88.08.08 0 0 1 0-.13c.12-.1.25-.2.37-.29a.07.07 0 0 1 .08 0c3.9 1.77 8.1 1.77 11.94 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .13c-.59.34-1.21.63-1.85.87a.08.08 0 0 0-.04.11c.35.68.76 1.34 1.2 1.96a.08.08 0 0 0 .08.03 19.5 19.5 0 0 0 5.93-3 .08.08 0 0 0 .03-.05c.5-4.97-.83-9.24-3.5-13.06a.06.06 0 0 0-.03-.03zM8.02 12.3c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.95 2.41-2.15 2.41zm7.97 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.94 2.41-2.15 2.41z"
                />
              </svg>
              Continua con Discord
            </Btn>
            {status.msg ? (
              <p
                role="status"
                aria-live="polite"
                className={`mt-5 text-sm ${status.type === 'error' ? 'text-danger' : status.type === 'success' ? 'text-success' : 'text-ink-dim'}`}
              >
                {status.msg}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-10 font-mono text-xs uppercase tracking-wide text-ink-dim">Verifica dell&apos;accesso…</p>
        )}
      </Container>
    </section>
  );
}
