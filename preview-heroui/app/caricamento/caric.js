'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Chip, CircularProgress, Progress, Skeleton, Spinner } from '@heroui/react';

const MSG = ['Verifica dell’identità…', 'Controllo della registrazione…', 'Preparazione dell’area personale…'];

// avanzamento "finto" ma credibile: parte veloce e rallenta, i messaggi cambiano a soglie
function useFinto(durata = 3200) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      const x = Math.min(1, (performance.now() - t0) / durata);
      setP(Math.round((1 - Math.pow(1 - x, 2.2)) * 100));
    }, 60);
    return () => clearInterval(id);
  }, [durata]);
  return { p, msg: MSG[p < 34 ? 0 : p < 70 ? 1 : 2], passo: p < 34 ? 0 : p < 70 ? 1 : p < 100 ? 2 : 3 };
}

const Sfondo = ({ children, v }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(37,99,235,0.28),transparent_60%)]" />
    <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
    <p className="absolute bottom-4 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">{v}</p>
  </div>
);

const Logo = ({ s = 'h-32', pulsa = true }) => (
  <img src="/logo-iprp.png" alt="IPRP" className={`${s} w-auto drop-shadow-[0_0_40px_rgba(37,99,235,0.45)] ${pulsa ? 'animate-pulse' : ''}`} />
);

// ---- C1: logo che pulsa + barra e messaggi
function C1() {
  const { p, msg } = useFinto();
  return (
    <Sfondo v="C1 · Logo con barra">
      <Logo s="h-40" />
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-default-500">Area riservata</p>
      <Progress aria-label="Accesso in corso" value={p} color="primary" size="sm" radius="full" className="mt-6 max-w-xs" />
      <p className="mt-4 h-5 text-sm text-default-500">{msg}</p>
    </Sfondo>
  );
}

// ---- C2: logo dentro un anello di avanzamento
function C2() {
  const { p, msg } = useFinto();
  return (
    <Sfondo v="C2 · Anello attorno al logo">
      <div className="relative flex h-60 w-60 items-center justify-center">
        <CircularProgress aria-label="Accesso in corso" value={p} strokeWidth={2} size="lg" color="primary" classNames={{ svg: 'h-60 w-60', track: 'stroke-white/10' }} />
        <img src="/logo-iprp.png" alt="IPRP" className="absolute h-36 w-auto" />
      </div>
      <p className="mt-6 text-3xl font-bold tabular-nums">{p}%</p>
      <p className="mt-2 text-sm text-default-500">{msg}</p>
    </Sfondo>
  );
}

// ---- C3: passaggi che si completano uno dopo l'altro
function C3() {
  const { passo } = useFinto(3600);
  const voci = ['Identità verificata con Discord', 'Registrazione e ruolo controllati', 'Area personale pronta'];
  return (
    <Sfondo v="C3 · Passaggi">
      <Logo s="h-28" pulsa={false} />
      <Card shadow="none" className="mt-8 w-full max-w-sm border border-white/10 bg-content1/60 backdrop-blur-2xl">
        <CardBody className="gap-4 p-6">
          {voci.map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              {i < passo ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg></span>
              ) : i === passo ? (
                <Spinner size="sm" color="primary" className="h-6 w-6" />
              ) : (
                <span className="h-6 w-6 rounded-full border border-white/15" />
              )}
              <p className={`text-sm ${i <= passo ? 'text-foreground' : 'text-default-400'}`}>{t}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </Sfondo>
  );
}

// ---- C4: schermata d'avvio con l'area che "prende forma" dietro
function C4() {
  const { p, msg } = useFinto(3400);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="absolute inset-0 flex gap-6 p-10 opacity-40">
        <div className="hidden w-72 flex-none flex-col gap-4 lg:flex"><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-12 rounded-2xl" /></div>
        <div className="flex flex-1 flex-col gap-4"><Skeleton className="h-12 w-72 rounded-xl" /><div className="grid grid-cols-3 gap-4"><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" /></div><Skeleton className="h-40 rounded-2xl" /><div className="grid grid-cols-3 gap-4"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /></div></div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center">
        <Logo s="h-36" />
        <Chip variant="flat" color="primary" className="mt-6" startContent={<Spinner size="sm" color="primary" className="ml-1 scale-75" />}>Accesso con Discord</Chip>
        <p className="mt-4 text-sm text-default-500">{msg}</p>
      </div>
      <Progress aria-label="Accesso" value={p} size="sm" radius="none" color="primary" className="absolute inset-x-0 bottom-0 z-10" />
      <p className="absolute bottom-6 z-10 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">C4 · Area che prende forma</p>
    </div>
  );
}

export const CARICAMENTI = { c1: C1, c2: C2, c3: C3, c4: C4 };
