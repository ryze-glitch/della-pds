'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Alert, Button, Card, CardBody, Chip, Code, Divider, Snippet, Spinner, Tooltip, User } from '@heroui/react';

const Ic = ({ d, s = 20 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const P = {
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  home: 'M4 21V9l8-5 8 5v12M9 21v-6h6v6',
  check: 'm5 12 5 5 9-10',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
};
const ID = '1387684968536477756';

const Pagina = ({ v, children }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(37,99,235,0.22),transparent_60%)]" />
    <Button as="a" href="#" variant="bordered" radius="full" size="sm" className="absolute left-5 top-5 border-white/15 bg-content1/70 font-semibold backdrop-blur-xl">← Torna al sito</Button>
    <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
    <p className="absolute bottom-4 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">{v}</p>
  </div>
);
const Logo = ({ h = 'h-20' }) => <img src="/logo-iprp.png" alt="IPRP" className={`${h} w-auto`} />;
const Azioni = ({ className = '' }) => (
  <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
    <Button color="primary" radius="full" className="font-semibold" startContent={<Ic d={P.refresh} s={17} />}>Riprova</Button>
    <Button variant="bordered" radius="full" className="border-white/20 font-semibold">Usa un altro account</Button>
  </div>
);

// ---- A1: scheda centrata con icona e ID (versione di oggi, rifinita)
function A1() {
  return (
    <Pagina v="A1 · Scheda centrata">
      <Card shadow="none" className="w-full max-w-md border border-white/10 bg-content1/70 backdrop-blur-2xl"><CardBody className="items-center gap-4 p-9 text-center">
        <Logo h="h-20" />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning"><Ic d={P.lock} s={24} /></span>
        <h1 className="text-2xl font-bold">Accesso non ancora abilitato</h1>
        <p className="text-sm leading-relaxed text-default-500">Il tuo account Discord è stato riconosciuto, ma non risulta tra gli agenti registrati. L’accesso si attiva da solo dopo l’aggiornamento della gerarchia.</p>
        <Snippet symbol="ID" size="sm" variant="flat" className="w-full justify-between">{ID}</Snippet>
        <Azioni />
      </CardBody></Card>
    </Pagina>
  );
}

// ---- A2: passaggi "cosa succede ora"
function A2() {
  const passi = [
    ['Account riconosciuto', 'Hai effettuato l’accesso con Discord.', 'ok'],
    ['Verifica nella gerarchia', 'Il tuo ID non è ancora nel foglio degli agenti.', 'att'],
    ['Attivazione automatica', 'Appena sarai in gerarchia, l’accesso si apre da solo.', 'next'],
  ];
  return (
    <Pagina v="A2 · Passaggi">
      <Logo h="h-16" />
      <h1 className="mt-5 text-center text-3xl font-bold">Ci sei quasi</h1>
      <p className="mt-2 max-w-md text-center text-sm text-default-500">Il tuo account non è ancora abilitato all’Area Personale.</p>
      <Card shadow="none" className="mt-7 w-full max-w-md border border-white/10 bg-content1/70"><CardBody className="gap-5 p-6">
        {passi.map(([t, d, st]) => (
          <div key={t} className="flex gap-4">
            <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${st === 'ok' ? 'bg-success/20 text-success' : st === 'att' ? 'bg-warning/20 text-warning' : 'border border-white/15 text-default-400'}`}>
              {st === 'ok' ? <Ic d={P.check} s={16} /> : st === 'att' ? <Spinner size="sm" color="warning" /> : <Ic d={P.clock} s={15} />}
            </span>
            <div><p className="font-semibold">{t}</p><p className="text-sm text-default-500">{d}</p></div>
          </div>
        ))}
      </CardBody></Card>
      <Azioni className="mt-6" />
    </Pagina>
  );
}

// ---- A3: allerta HeroUI + dettagli a fisarmonica
function A3() {
  return (
    <Pagina v="A3 · Avviso + dettagli">
      <div className="flex w-full max-w-lg flex-col items-center gap-5">
        <Logo h="h-16" />
        <Alert color="warning" variant="faded" title="Accesso non ancora abilitato" description="Il tuo account Discord non risulta tra gli agenti registrati." className="w-full" />
        <Card shadow="none" className="w-full border border-white/10 bg-content1/70"><CardBody className="p-2">
          <Accordion variant="light" itemClasses={{ title: 'text-sm font-semibold', content: 'pb-4 text-sm text-default-500', trigger: 'px-3 py-3' }}>
            <AccordionItem key="1" aria-label="Perché" title="Perché vedo questo messaggio?" startContent={<span className="text-primary"><Ic d={P.shield} s={18} /></span>}>L’Area Personale è riservata agli agenti presenti nella gerarchia della Polizia di Stato. Il tuo ID Discord non è ancora tra quelli registrati.</AccordionItem>
            <AccordionItem key="2" aria-label="Cosa fare" title="Cosa posso fare?" startContent={<span className="text-primary"><Ic d={P.list} s={18} /></span>}>Se sei un agente, attendi qualche minuto: la gerarchia si aggiorna da sola. Se il problema continua, manda il tuo ID Discord a un amministratore.</AccordionItem>
            <AccordionItem key="3" aria-label="ID" title="Il mio ID Discord" startContent={<span className="text-primary"><Ic d={P.user} s={18} /></span>}><Snippet symbol="ID" size="sm" variant="flat">{ID}</Snippet></AccordionItem>
          </Accordion>
        </CardBody></Card>
        <Azioni />
      </div>
    </Pagina>
  );
}

// ---- A4: schermo diviso (messaggio + riepilogo account)
function A4() {
  return (
    <div className="relative grid min-h-screen overflow-hidden bg-background text-foreground lg:grid-cols-2">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(37,99,235,0.22),transparent_55%)]" />
      <Button as="a" href="#" variant="bordered" radius="full" size="sm" className="absolute left-5 top-5 z-20 border-white/15 bg-content1/70 font-semibold backdrop-blur-xl">← Torna al sito</Button>
      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-8 py-24 text-center lg:items-start lg:px-16 lg:text-left">
        <Logo h="h-24" />
        <Chip color="warning" variant="flat" startContent={<Ic d={P.lock} s={14} />}>Accesso non abilitato</Chip>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Non sei ancora<br />in gerarchia</h1>
        <p className="max-w-md text-default-500">L’Area Personale è riservata agli agenti registrati. Appena il tuo ID Discord compare nella gerarchia, l’accesso si attiva da solo.</p>
        <Azioni className="!justify-start" />
      </div>
      <div className="relative z-10 flex items-center justify-center px-6 pb-24 lg:py-24">
        <Card shadow="none" className="w-full max-w-sm border border-white/10 bg-content1/70 backdrop-blur-2xl"><CardBody className="gap-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-default-500">Il tuo account</p>
          <User name="dxrk.ryze" description="Account Discord" avatarProps={{ name: 'D', color: 'primary' }} className="justify-start" />
          <Divider />
          <div><p className="mb-1 text-xs text-default-500">ID Discord</p><Snippet symbol="" size="sm" variant="flat" className="w-full justify-between">{ID}</Snippet></div>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"><span className="text-sm text-default-500">Stato</span><Chip size="sm" color="warning" variant="flat">Non registrato</Chip></div>
        </CardBody></Card>
      </div>
    </div>
  );
}

// ---- A5: minimale, solo testo grande
function A5() {
  return (
    <Pagina v="A5 · Minimale">
      <Logo h="h-14" />
      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.4em] text-default-500">Area riservata</p>
      <h1 className="mt-4 max-w-2xl text-center text-4xl font-extrabold leading-tight sm:text-6xl">Il tuo accesso<br />non è ancora attivo</h1>
      <p className="mt-5 max-w-md text-center text-default-500">Riprova tra qualche minuto: la gerarchia si aggiorna da sola.</p>
      <Azioni className="mt-8" />
      <Tooltip content="Copialo e invialo a un amministratore"><div className="mt-8"><Code className="cursor-copy select-all">ID Discord · {ID}</Code></div></Tooltip>
    </Pagina>
  );
}

// ---- A6: tessera/badge “in attesa di abilitazione”
function A6() {
  return (
    <Pagina v="A6 · Tessera in attesa">
      <Card shadow="none" className="w-full max-w-sm overflow-hidden border border-white/10 bg-gradient-to-b from-content2 to-content1"><CardBody className="gap-0 p-0">
        <div className="flex items-center justify-between bg-primary/15 px-6 py-4"><span className="text-xs font-bold uppercase tracking-[0.25em]">Polizia di Stato</span><Chip size="sm" color="warning" variant="flat">In attesa</Chip></div>
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <Logo h="h-24" />
          <p className="text-lg font-bold">Tessera non ancora attiva</p>
          <p className="text-sm text-default-500">Il tuo account non è ancora stato associato a una matricola.</p>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-px bg-white/5 text-left">
          <div className="bg-content1 px-6 py-4"><p className="text-[11px] uppercase tracking-widest text-default-500">Matricola</p><p className="font-mono text-sm">PDS - ————</p></div>
          <div className="bg-content1 px-6 py-4"><p className="text-[11px] uppercase tracking-widest text-default-500">Qualifica</p><p className="text-sm">—</p></div>
        </div>
        <div className="px-6 py-5"><Snippet symbol="ID" size="sm" variant="flat" className="w-full justify-between">{ID}</Snippet></div>
      </CardBody></Card>
      <Azioni className="mt-6" />
    </Pagina>
  );
}

export const ACCESSI = { a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6 };
