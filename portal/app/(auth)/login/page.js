'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { Crest3D } from '../../../components/Crest3D';
import { Badge, Container, Notice } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { auth, DISCORD_AUTH_WORKER_URL, DISCORD_CLIENT_ID } from '../../../lib/firebase';

// Aspetto del vecchio accesso (tema scuro con accento teal), applicato solo a questa pagina.
const SCURO = {
  colorScheme: 'dark',
  '--bg': '20 26 36', '--surface': '18 24 33', '--surface2': '25 33 46', '--fg': '238 242 248', '--muted': '160 172 190',
  '--fog': '120 130 150', '--line': '36 45 59', '--primary': '23 168 189', '--primary-fg': '4 34 42', '--link': '63 196 214',
  '--gold': '23 168 189', '--gold-soft': '15 57 71', '--gold-ink': '63 196 214',
};

export default function LoginPage() {
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('denied') === '1') {
      setStatus({
        msg: 'Il tuo account Discord non risulta registrato tra gli agenti. Contatta un amministratore per essere abilitato.',
        type: 'error',
      });
    }

    // Non si resta mai bloccati su «Verifica dell'accesso…»: se Firebase non risponde entro poco
    // (rete lenta, blocco dei contenuti nel browser) compare comunque il pulsante di accesso.
    const sblocca = setTimeout(() => setChecking(false), 1500);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(sblocca);
      if (user) {
        // Dopo l'accesso si torna dove si voleva andare (solo percorsi del sito); di base all'Area Personale.
        let next = new URLSearchParams(window.location.search).get('next');
        try {
          next = next || sessionStorage.getItem('pds-next');
          sessionStorage.removeItem('pds-next');
        } catch (e) {
          /* storage non disponibile */
        }
        window.location.href = ['/sisfor', '/dashboard', '/gestione/pratiche'].includes(next) ? next : '/sisfor';
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

    return () => {
      clearTimeout(sblocca);
      unsubscribe();
    };
  }, []);

  function handleDiscordLogin() {
    try {
      const next = new URLSearchParams(window.location.search).get('next');
      if (next) sessionStorage.setItem('pds-next', next); // il giro su Discord perde la query
    } catch (e) {
      /* storage non disponibile */
    }
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
  <div className="min-h-screen bg-bg text-fg" style={SCURO}>
    <Container className="relative flex min-h-screen items-center justify-center py-14">
      <a href="/" className="absolute left-4 top-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:text-fg sm:left-8">
        ← Torna al sito
      </a>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface ">
        <div style={{ height: 3, background: 'rgb(var(--gold))' }} />
        <div className="p-7 text-center sm:p-9">
          <Crest3D className="relative mx-auto h-36 w-28" fallbackClass="h-32 w-auto" glow={false} />
          <div className="mt-5">
            <Badge tone="gold">
              <Icon name="lock" size={13} /> Accesso riservato
            </Badge>
          </div>
          <h1 className="h2 mt-4">Area Riservata Agenti</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Accedi con il tuo account Discord per consultare il profilo, i turni, le candidature e le pratiche dello Sportello.
          </p>
          {!checking ? (
            <>
              <button
                type="button"
                onClick={handleDiscordLogin}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2] text-[13.5px] font-semibold text-white transition hover:brightness-110"
              >
                <svg width="20" height="20" viewBox="0 0 24 18" fill="none" aria-hidden="true">
                  <path fill="currentColor" d="M20.3 1.8A19.5 19.5 0 0 0 15.6.3a.07.07 0 0 0-.08.04c-.2.36-.43.83-.59 1.2a18 18 0 0 0-5.4 0 12 12 0 0 0-.6-1.2.08.08 0 0 0-.08-.04A19.4 19.4 0 0 0 3.9 1.8a.07.07 0 0 0-.03.03C.9 6.3.1 10.6.5 14.9a.08.08 0 0 0 .03.06 19.6 19.6 0 0 0 5.9 3 .08.08 0 0 0 .08-.03c.46-.62.86-1.28 1.2-1.97a.08.08 0 0 0-.04-.1 12.9 12.9 0 0 1-1.85-.88.08.08 0 0 1 0-.13c.12-.1.25-.2.37-.29a.07.07 0 0 1 .08 0c3.9 1.77 8.1 1.77 11.94 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .13c-.59.34-1.21.63-1.85.87a.08.08 0 0 0-.04.11c.35.68.76 1.34 1.2 1.96a.08.08 0 0 0 .08.03 19.5 19.5 0 0 0 5.93-3 .08.08 0 0 0 .03-.05c.5-4.97-.83-9.24-3.5-13.06a.06.06 0 0 0-.03-.03zM8.02 12.3c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.95 2.41-2.15 2.41zm7.97 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.94 2.41-2.15 2.41z" />
                </svg>
                Continua con Discord
              </button>
              {status.msg ? (
                <div className="mt-4 text-left">
                  <Notice tone={status.type === 'error' ? 'bad' : status.type === 'success' ? 'info' : 'info'}>{status.msg}</Notice>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-7 text-sm text-muted">Verifica dell&apos;accesso…</p>
          )}
        </div>
      </div>
    </Container>
  </div>
  );
}
