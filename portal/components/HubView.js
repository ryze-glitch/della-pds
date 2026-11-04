'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from '@heroui/react';
import { auth } from '../lib/firebase';
import { azzeraSessione, caricaIo, sessioneLocale, sessioneValida } from '../lib/hub';
import { Icon } from './icons';

const NAV = [['Home', '/home'], ['Notizie', '/notizie'], ['Chi Siamo', '/chi-siamo'], ['Qualifiche', '/qualifiche'], ['Prenota', '/prenota'], ['Concorso', '/concorso']];

// Aree della dashboard. `href` assente = non ancora disponibile («In arrivo»).
const AREE = [
  { k: 'gestione', tag: 'GESTIONE', t: 'Gestione', d: 'Pratiche dei cittadini, candidature al concorso e comunicati ufficiali.', img: '/assets/aree/denuncia.jpg', btn: 'Apri la gestione', href: '/gestione/pratiche' },
  { k: 'funzionari', tag: 'FUNZIONARI', t: 'Funzionari', d: 'Area riservata ai funzionari: uffici, ordini di servizio e documenti.', img: '/assets/aree/ufficidesk.jpg' },
  { k: 'addetti', tag: 'ADDETTI', t: 'Addetti', d: 'Sportello e servizi al pubblico: richieste, appuntamenti e licenze.', img: '/assets/aree/porto-darmi.jpg' },
  { k: 'organigramma', tag: 'ORGANIGRAMMA', t: 'Organigramma', d: 'La struttura della Questura, i reparti e chi ne fa parte.', img: '/assets/aree/bando.jpg', btn: 'Consulta', href: '/organigramma' },
];

function saluto() {
  const h = new Date().getHours();
  return h < 13 ? 'Buongiorno' : h < 19 ? 'Buon pomeriggio' : 'Buonasera';
}

function Isole({ foto, iniziali, esci }) {
  return (
    <div className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 pt-6 sm:px-6">
      <a href="/home" className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-content1/90 px-5 font-extrabold uppercase tracking-wide"><img src="/assets/crest-md.png" alt="" className="h-8 w-auto" /><span className="hidden sm:inline">Polizia di Stato</span></a>
      <nav aria-label="Sito" className="hidden h-14 items-center gap-1 rounded-full border border-white/10 bg-content1/90 px-2 text-sm lg:flex">
        {NAV.map(([t, h]) => <a key={h} href={h} className="rounded-full px-4 py-2 text-default-400 transition-colors hover:text-white">{t}</a>)}
      </nav>
      <div className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-content1/90 pl-3 pr-2">
        <Badge content="" color="danger" size="sm" isInvisible><Button as="a" href="/notizie" isIconOnly variant="light" radius="full" size="sm" aria-label="Notizie"><Icon name="bell" size={18} /></Button></Badge>
        <Dropdown placement="bottom-end">
          <DropdownTrigger><button type="button" aria-label="Menu del profilo"><Avatar src={foto || undefined} name={iniziali} isBordered color="primary" size="sm" className="cursor-pointer" /></button></DropdownTrigger>
          <DropdownMenu aria-label="Profilo" onAction={(k) => { if (k === 'esci') esci(); }}>
            <DropdownItem key="sito" href="/home" startContent={<Icon name="landmark" size={16} />}>Torna al sito</DropdownItem>
            <DropdownItem key="esci" color="danger" className="text-danger" startContent={<Icon name="logout" size={16} />}>Esci</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

function Titolo({ children }) {
  return <h2 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-wide md:text-4xl">{children}</h2>;
}

function Scheda({ a }) {
  const attiva = Boolean(a.href);
  return (
    <Card className={`overflow-hidden border border-white/10 bg-content1 ${attiva ? '' : 'opacity-70'}`} radius="lg" shadow="none">
      <div className="relative h-44 flex-none">
        <img src={a.img} alt="" loading="lazy" className={`h-full w-full object-cover ${attiva ? '' : 'grayscale'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-content1 to-transparent" />
        <Chip size="sm" color="primary" radius="sm" className="absolute bottom-3 left-4 font-bold uppercase tracking-wider" classNames={{ content: 'text-[10px]' }}>{a.tag}</Chip>
      </div>
      <CardBody className="gap-2 px-6 pb-2 pt-3"><h3 className="text-xl font-extrabold leading-snug">{a.t}</h3><p className="text-sm leading-relaxed text-default-400">{a.d}</p></CardBody>
      <CardFooter className="px-6 pb-6 pt-3">
        {attiva ? <Button as="a" href={a.href} radius="full" color="primary" variant="flat" className="font-semibold">{a.btn}</Button>
          : <Button isDisabled radius="full" size="sm" startContent={<Icon name="lock" size={14} />}>In arrivo</Button>}
      </CardFooter>
    </Card>
  );
}

function Eroe({ aperto, nome }) {
  return (
    <header className="relative mt-6 overflow-hidden">
      <img src="/assets/aree/sisfor.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-40 ${aperto ? '' : 'grayscale'}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-20">
        <Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} startContent={<span className="pl-1"><Icon name={aperto ? 'graduation' : 'lock'} size={13} /></span>}>{aperto ? 'Sbloccato' : 'Riservato agli Allievi Agenti'}</Chip>
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-tight sm:text-6xl md:text-8xl">SISFOR<span className="text-primary">+</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-default-300">Corsi, quiz, esami e percorso verso l’abilitazione. {saluto()}{nome ? `, ${nome}` : ''}.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {aperto ? (
            <><Button as="a" href="/sisfor" color="primary" radius="full" size="lg" className="font-semibold" endContent={<Icon name="arrow-right" size={18} />}>Entra nel SISFOR</Button>
              <Button as="a" href="/sisfor" radius="full" size="lg" variant="bordered" className="border-white/25">Riprendi il corso</Button></>
          ) : (
            <Button isDisabled radius="full" size="lg" startContent={<Icon name="lock" size={16} />}>Si sblocca con il grado di Allievo Agente</Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Piede() {
  const col = 'py-1 text-sm text-default-400 transition-colors hover:text-white';
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-content1/50">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div><div className="mb-3 flex items-center gap-3 font-extrabold uppercase"><img src="/assets/crest-md.png" alt="" className="h-9 w-auto" />Polizia di Stato</div><p className="text-sm text-default-400">Sito ufficiale della Polizia di Stato del server IPRP. Solo a scopo roleplay.</p></div>
        <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Navigazione</div>{NAV.map(([t, h]) => <a key={h} href={h} className={`block ${col}`}>{t}</a>)}</div>
        <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Area Personale</div><a href="/dashboard" className={`block ${col}`}>Dashboard</a><a href="/gestione/pratiche" className={`block ${col}`}>Gestione</a><a href="/sisfor" className={`block ${col}`}>SISFOR+</a></div>
        <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Contatti</div><div className="flex items-center gap-3 py-1 text-sm text-default-400"><span className="text-primary"><Icon name="pin" size={16} /></span>Via dei Peccatori N°761</div><div className="flex items-center gap-3 py-1 text-sm text-default-400"><span className="text-primary"><Icon name="phone" size={16} /></span>Tel. 113</div></div>
      </div>
    </footer>
  );
}

export function HubView() {
  const [stato, setStato] = useState({ fase: 'carico', io: null, errore: '' });
  const [foto, setFoto] = useState('');

  useEffect(() => { setFoto((sessioneLocale() || {}).avatar || ''); }, []);

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
    window.location.href = '/home';
  }

  const { io, fase } = stato;
  const nome = io ? (io.nome || '').trim() : '';
  const iniziali = io ? (((io.nome || '')[0] || '') + ((io.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(37,99,235,0.18),transparent_60%)]" />
      <Isole foto={foto} iniziali={iniziali} esci={esci} />

      {fase === 'carico' && (
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 pb-24 pt-28"><Skeleton className="h-6 w-40 rounded-full" /><Skeleton className="h-24 w-[min(520px,90%)] rounded-2xl" /><Skeleton className="h-6 w-80 rounded-lg" /><Skeleton className="mt-6 h-12 w-56 rounded-full" /></div>
      )}
      {fase === 'errore' && (
        <div className="relative mx-auto max-w-2xl px-6 pb-24 pt-28">
          <Card className="border border-danger/30 bg-danger/5" radius="lg" shadow="none"><CardBody className="flex-row flex-wrap items-center gap-4 p-6"><Icon name="alert" size={22} className="text-danger" /><span className="flex-1">{stato.errore} Riprova tra poco.</span><Button color="danger" variant="flat" radius="full" onPress={() => window.location.reload()}>Riprova</Button></CardBody></Card>
        </div>
      )}
      {fase === 'pronto' && (
        <>
          <Eroe aperto={Boolean(io.sisfor)} nome={nome} />
          <main className="relative mx-auto max-w-[1200px] px-6">
            <Titolo>{io.sisfor ? 'Le altre' : 'Le tue'} <span className="text-primary">aree</span></Titolo>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{AREE.map((a) => <Scheda key={a.k} a={a} />)}</div>
          </main>
        </>
      )}
      <Piede />
    </div>
  );
}
