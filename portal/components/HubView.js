'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Avatar, Button, Card, CardBody, Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, Skeleton, Tooltip } from '@heroui/react';
import { auth } from '../lib/firebase';
import { azzeraSessione, caricaIo, sessioneLocale, sessioneValida } from '../lib/hub';
import { Icon } from './icons';

// Aree della dashboard. `href` assente = non ancora disponibile (compare come «In arrivo»).
const AREE = [
  { k: 'gestione', t: 'Gestione', d: 'Pratiche, candidature e comunicati', icona: 'file-text', colore: 'warning', href: '/gestione/pratiche' },
  { k: 'funzionari', t: 'Funzionari', d: 'Area riservata ai funzionari', icona: 'shield-check', colore: 'primary' },
  { k: 'addetti', t: 'Addetti', d: 'Sportello e servizi al pubblico', icona: 'users', colore: 'success' },
  { k: 'organigramma', t: 'Organigramma', d: 'La struttura della Questura', icona: 'landmark', colore: 'secondary', href: '/organigramma' },
];
const TINTA = { warning: 'bg-warning/15 text-warning', primary: 'bg-primary/15 text-primary', success: 'bg-success/15 text-success', secondary: 'bg-secondary/15 text-secondary', danger: 'bg-danger/15 text-danger' };

function saluto() {
  const h = new Date().getHours();
  return h < 13 ? 'Buongiorno' : h < 19 ? 'Buon pomeriggio' : 'Buonasera';
}

function Tessera({ a }) {
  const attiva = Boolean(a.href);
  return (
    <Card as={attiva ? 'a' : 'div'} href={attiva ? a.href : undefined} isPressable={attiva} className={`border border-white/10 bg-content1/70 text-left ${attiva ? 'transition-colors hover:border-white/25' : 'opacity-60'}`} radius="lg" shadow="none">
      <CardBody className="gap-5 p-6">
        <div className="flex items-start justify-between">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TINTA[a.colore]}`}><Icon name={a.icona} size={24} strokeWidth={1.8} /></span>
          {attiva ? <Icon name="arrow-right" size={20} className="text-default-500" /> : <Chip size="sm" variant="flat">In arrivo</Chip>}
        </div>
        <div><div className="text-lg font-extrabold">{a.t}</div><div className="mt-0.5 text-sm text-default-500">{a.d}</div></div>
      </CardBody>
    </Card>
  );
}

function SchedaSisfor({ aperto }) {
  const corpo = (
    <Card as={aperto ? 'a' : 'div'} href={aperto ? '/sisfor' : undefined} isPressable={aperto} fullWidth className={`relative w-full max-w-none overflow-hidden border text-left ${aperto ? 'border-primary/40' : 'border-white/10'}`} radius="lg" shadow="none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-indigo-700/30 to-background" />
      <img src="/assets/hero-slide-1.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-25 ${aperto ? '' : 'grayscale'}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <CardBody className="relative gap-4 p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} startContent={<span className="pl-1"><Icon name={aperto ? 'graduation' : 'lock'} size={13} /></span>}>{aperto ? 'Sbloccato' : 'Riservato'}</Chip>
          <span className="text-xs text-default-400">Solo per gli Allievi Agenti</span>
        </div>
        <div>
          <div className="text-4xl font-extrabold tracking-tight md:text-5xl">SISFOR<span className="text-primary">+</span></div>
          <p className="mt-1 max-w-lg text-default-400">Il sistema di formazione: corsi, quiz, esami e percorso verso l’abilitazione.</p>
        </div>
        {aperto ? (
          <div><Button as="a" href="/sisfor" color="primary" radius="full" size="lg" className="font-semibold" endContent={<Icon name="arrow-right" size={18} />}>Entra nel SISFOR</Button></div>
        ) : (
          <div className="flex flex-wrap items-center gap-4"><Button isDisabled radius="full" size="lg" startContent={<Icon name="lock" size={17} />}>Accesso non disponibile</Button><span className="max-w-xs text-sm text-default-500">Si sblocca con il grado di Allievo Agente.</span></div>
        )}
      </CardBody>
    </Card>
  );
  return aperto ? corpo : <Tooltip content="Disponibile solo agli Allievi Agenti" placement="top" showArrow>{corpo}</Tooltip>;
}

export function HubView() {
  const [stato, setStato] = useState({ fase: 'carico', io: null, errore: '' });
  const foto = typeof window !== 'undefined' ? (sessioneLocale() || {}).avatar : '';

  useEffect(() => {
    // Modalità prova (?demo=allievo oppure ?demo=altro): dati finti, nessun accesso reale, come nel SISFOR.
    const demo = new URLSearchParams(window.location.search).get('demo');
    if (demo === 'allievo' || demo === 'altro') {
      setStato({ fase: 'pronto', io: { nome: 'Mario', cognome: 'Rossi', qualifica: demo === 'allievo' ? 'Allievo Agente' : 'Agente Scelto', matricola: 'PDS - 0042', sisfor: demo === 'allievo' }, errore: '' });
      return undefined;
    }
    const stop = onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.replace('/login?next=/dashboard'); return; }
      if (!sessioneValida()) { // sessione oltre le 12 ore (o senza registro): serve un nuovo accesso
        azzeraSessione();
        try { await signOut(auth); } catch (e) { /* già uscito */ }
        window.location.replace('/login?next=/dashboard');
        return;
      }
      try {
        const io = await caricaIo(user);
        setStato({ fase: 'pronto', io, errore: '' });
      } catch (e) {
        if (e.status === 401 || e.status === 403) {
          azzeraSessione();
          try { await signOut(auth); } catch (x) { /* già uscito */ }
          window.location.replace('/login?denied=1');
          return;
        }
        setStato({ fase: 'errore', io: null, errore: e.message });
      }
    });
    return stop;
  }, []);

  async function esci() {
    azzeraSessione();
    try { await signOut(auth); } catch (e) { /* già uscito */ }
    window.location.href = '/';
  }

  const { io, fase } = stato;
  const nome = io ? `${io.nome} ${io.cognome}`.trim() || 'Agente' : '';
  const iniziali = io ? (((io.nome || '')[0] || '') + ((io.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar maxWidth="xl" isBordered classNames={{ base: 'bg-background/95' }}>
        <NavbarBrand className="gap-3">
          <img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />
          <span className="leading-tight"><span className="block font-extrabold">Area Personale</span><span className="block text-[11px] text-default-500">Polizia di Stato · IPRP</span></span>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex"><Button as="a" href="/" size="sm" variant="flat" radius="full">Torna al sito</Button></NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger><button type="button" aria-label="Menu del profilo"><Avatar src={foto || undefined} name={iniziali} isBordered color="primary" size="sm" className="cursor-pointer" /></button></DropdownTrigger>
              <DropdownMenu aria-label="Profilo" onAction={(k) => { if (k === 'esci') esci(); }}>
                <DropdownItem key="sito" href="/" startContent={<Icon name="landmark" size={16} />}>Torna al sito</DropdownItem>
                <DropdownItem key="esci" color="danger" className="text-danger" startContent={<Icon name="logout" size={16} />}>Esci</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        {fase === 'errore' && (
          <Card className="border border-danger/30 bg-danger/5" radius="lg" shadow="none"><CardBody className="flex-row flex-wrap items-center gap-4 p-6"><Icon name="alert" size={22} className="text-danger" /><span className="flex-1">{stato.errore} Riprova tra poco.</span><Button color="danger" variant="flat" radius="full" onPress={() => window.location.reload()}>Riprova</Button></CardBody></Card>
        )}
        {fase === 'carico' && (<div className="flex flex-col gap-3"><Skeleton className="h-4 w-32 rounded-lg" /><Skeleton className="h-10 w-80 rounded-lg" /><Skeleton className="mt-6 h-64 w-full rounded-3xl" /></div>)}
        {fase === 'pronto' && (
          <>
            <div className="mb-8">
              <p className="text-sm text-default-500">{saluto()}</p>
              <h1 className="text-4xl font-extrabold tracking-tight">{nome}</h1>
              <p className="mt-1 text-default-500">{[io.qualifica || io.grado, io.matricola].filter(Boolean).join(' · ')}</p>
            </div>
            <SchedaSisfor aperto={Boolean(io.sisfor)} />
            <div className="mb-4 mt-12 flex items-center gap-4"><h2 className="text-sm font-bold uppercase tracking-widest text-default-500">Le tue aree</h2><Divider className="flex-1" /></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{AREE.map((a) => <Tessera key={a.k} a={a} />)}</div>
          </>
        )}
      </main>
    </div>
  );
}
