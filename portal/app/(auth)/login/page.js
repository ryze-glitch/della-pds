'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { Crest3D } from '../../../components/Crest3D';
import { ArrowLeft, Info, Loader2, Lock, TriangleAlert } from 'lucide-react';
import { Button } from '../../../components/shadcn/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/shadcn/card';
import { Badge } from '../../../components/shadcn/badge';
import { Alert, AlertDescription } from '../../../components/shadcn/alert';
import { auth, DISCORD_AUTH_WORKER_URL, DISCORD_CLIENT_ID } from '../../../lib/firebase';

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
    <div className="shadcn flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <Button asChild variant="ghost" size="sm" className="absolute left-4 top-4 text-muted-foreground sm:left-8 sm:top-6">
        <a href="/">
          <ArrowLeft aria-hidden="true" /> Torna al sito
        </a>
      </Button>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="items-center gap-3 text-center">
            <Crest3D className="relative h-32 w-24" fallbackClass="h-28 w-auto" glow={false} />
            <Badge variant="secondary" className="gap-1.5">
              <Lock className="size-3" aria-hidden="true" /> Accesso riservato
            </Badge>
            <CardTitle className="text-2xl">Area Riservata Agenti</CardTitle>
            <CardDescription>Accedi con il tuo account Discord per studiare i corsi, seguire le tue abilitazioni e gestire le pratiche.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {status.msg ? (
              <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                {status.type === 'error' ? <TriangleAlert aria-hidden="true" className="size-4" /> : <Info aria-hidden="true" className="size-4" />}
                <AlertDescription>{status.msg}</AlertDescription>
              </Alert>
            ) : null}
            {checking ? (
              <Button size="lg" className="w-full" disabled>
                <Loader2 className="animate-spin" aria-hidden="true" /> Verifica dell&apos;accesso…
              </Button>
            ) : (
              <Button size="lg" onClick={handleDiscordLogin} className="w-full bg-[#5865F2] text-white hover:bg-[#4752c4]">
                <svg viewBox="0 0 24 18" fill="none" aria-hidden="true" className="!size-5">
                  <path fill="currentColor" d="M20.3 1.8A19.5 19.5 0 0 0 15.6.3a.07.07 0 0 0-.08.04c-.2.36-.43.83-.59 1.2a18 18 0 0 0-5.4 0 12 12 0 0 0-.6-1.2.08.08 0 0 0-.08-.04A19.4 19.4 0 0 0 3.9 1.8a.07.07 0 0 0-.03.03C.9 6.3.1 10.6.5 14.9a.08.08 0 0 0 .03.06 19.6 19.6 0 0 0 5.9 3 .08.08 0 0 0 .08-.03c.46-.62.86-1.28 1.2-1.97a.08.08 0 0 0-.04-.1 12.9 12.9 0 0 1-1.85-.88.08.08 0 0 1 0-.13c.12-.1.25-.2.37-.29a.07.07 0 0 1 .08 0c3.9 1.77 8.1 1.77 11.94 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .13c-.59.34-1.21.63-1.85.87a.08.08 0 0 0-.04.11c.35.68.76 1.34 1.2 1.96a.08.08 0 0 0 .08.03 19.5 19.5 0 0 0 5.93-3 .08.08 0 0 0 .03-.05c.5-4.97-.83-9.24-3.5-13.06a.06.06 0 0 0-.03-.03zM8.02 12.3c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.95 2.41-2.15 2.41zm7.97 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.94 2.41-2.15 2.41z" />
                </svg>
                Continua con Discord
              </Button>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-center text-xs text-muted-foreground">Possono accedere solo gli agenti registrati dall&apos;amministrazione.</p>
          </CardFooter>
        </Card>
        <p className="text-balance px-6 text-center text-xs text-muted-foreground">
          Progetto di gioco di ruolo (FiveM), non affiliato ad alcuna istituzione reale. In caso di emergenza reale chiama il <strong className="text-foreground">112</strong>.
        </p>
      </div>
    </div>
  );
}
