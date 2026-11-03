'use client';

import { useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, Chip, CircularProgress, Divider, Input, Kbd, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalHeader, Progress, ScrollShadow, Tab, Tabs, Tooltip, useDisclosure } from '@heroui/react';
import { CORSI, Etichetta, Ic, MODULI, P, Quiz, StatoChip, UTENTE } from './comune';

const iniz = 'GM';
const Torna = ({ testo = 'Torna al sito' }) => <Button as="a" href="#" size="sm" variant="light" radius="full" startContent={<Ic d={P.home} s={15} />}>{testo}</Button>;
const Logo = ({ h = 'h-9' }) => <img src="/logo-iprp.png" alt="IPRP" className={`${h} w-auto`} />;
const Vetro = 'border border-white/10 bg-content1/60 backdrop-blur-xl';

// =====================================================================
// V5 · Bento: tutta la formazione in riquadri di misure diverse
// =====================================================================
export function V5() {
  const [vista, setVista] = useState('home');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(37,99,235,0.2),transparent_50%),radial-gradient(ellipse_at_100%_100%,rgba(124,58,237,0.12),transparent_50%)]" />
      <header className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5"><div className="flex items-center gap-3"><Logo h="h-10" /><span className="text-sm font-extrabold uppercase tracking-[0.18em]">SISFOR+</span></div><div className="flex items-center gap-2"><Torna /><Avatar name={iniz} color="primary" size="sm" isBordered /></div></header>
      <main className="relative z-10 mx-auto max-w-[1200px] px-6 pb-20">
        {vista === 'quiz' ? (<><Button variant="light" radius="full" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></>) : (
          <>
            <h1 className="text-4xl font-extrabold sm:text-5xl">Ciao, {UTENTE.nome}.</h1>
            <p className="mt-2 text-default-500">{UTENTE.qualifica} · {UTENTE.matricola}</p>
            <div className="mt-8 grid auto-rows-[150px] gap-4 md:grid-cols-4">
              <Card shadow="none" isPressable onPress={() => setVista('quiz')} className="relative overflow-hidden border border-primary/40 bg-gradient-to-br from-blue-600/40 via-content1 to-content1 text-left md:col-span-2 md:row-span-2"><CardBody className="justify-between p-7">
                <div><Chip size="sm" color="primary" variant="flat">Continua</Chip><p className="mt-3 text-3xl font-extrabold leading-tight">{CORSI[0].titolo}</p><p className="mt-2 max-w-sm text-sm text-default-500">Prossimo passo: quiz del modulo 2.</p></div>
                <div className="flex items-end justify-between"><CircularProgress aria-label="Avanzamento" value={43} size="lg" color="primary" showValueLabel classNames={{ svg: 'h-24 w-24', value: 'text-xl font-bold', track: 'stroke-white/10' }} /><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary"><Ic d={P.play} s={18} /></span></div>
              </CardBody></Card>
              {[['Corsi', '4', P.book, 'text-primary'], ['Abilitazioni', '1', P.award, 'text-success']].map(([t, n, d, c]) => (<Card key={t} shadow="none" className={Vetro}><CardBody className="justify-between p-5"><span className={c}><Ic d={d} s={22} /></span><div><p className="text-4xl font-extrabold leading-none">{n}</p><p className="mt-1 text-sm text-default-500">{t}</p></div></CardBody></Card>))}
              <Card shadow="none" className={`${Vetro} md:col-span-2`}><CardBody className="justify-center gap-3 p-6"><div className="flex items-center justify-between"><p className="font-semibold">Quiz superati</p><span className="text-sm text-default-500">4 su 6</span></div><Progress aria-label="Quiz" value={66} color="success" size="md" /><p className="text-xs text-default-500">Media 82% · ultimo tentativo ieri</p></CardBody></Card>
              <Card shadow="none" className={`${Vetro} md:col-span-2`}><CardBody className="justify-center gap-2 p-6"><p className="text-xs font-semibold uppercase tracking-widest text-default-500">Prossimo esame pratico</p><p className="text-xl font-bold">Nessuna sessione prenotata</p><p className="text-sm text-default-500">Si sblocca dopo aver superato tutti i quiz del corso.</p></CardBody></Card>
              {CORSI.slice(1).map((c) => (<Card key={c.id} isPressable isHoverable shadow="none" className={`${Vetro} text-left md:col-span-1`}><div className={`h-16 bg-gradient-to-br ${c.grad}`} /><CardBody className="gap-1 p-4"><p className="text-sm font-semibold leading-snug">{c.titolo}</p><p className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</p></CardBody></Card>))}
              <Card shadow="none" className={`${Vetro} md:col-span-1`}><CardBody className="items-center justify-center gap-2 p-4 text-center"><span className="text-success"><Ic d={P.award} s={30} /></span><p className="text-sm font-semibold">Primo soccorso</p><Chip size="sm" color="success" variant="flat">Abilitato</Chip></CardBody></Card>
            </div>
          </>
        )}
      </main>
      <Etichetta v="V5 · Bento" />
    </div>
  );
}

// =====================================================================
// V6 · Due colonne: elenco "da fare" + pannello laterale con riepilogo
// =====================================================================
export function V6() {
  const [vista, setVista] = useState('home');
  const cose = [['Quiz del modulo 2', 'Posto di blocco · 5 domande', P.list, 'quiz'], ['Leggi il modulo 3', 'Si sblocca dopo il quiz', P.lock, ''], ['Avvia “Comunicazioni radio”', '4 moduli · 1 h', P.book, '']];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-background/80 px-5 backdrop-blur-xl"><Logo /><span className="text-sm font-extrabold uppercase tracking-[0.18em]">SISFOR+</span><div className="ml-6 hidden max-w-xs flex-1 sm:block"><Input aria-label="Cerca" size="sm" radius="full" variant="bordered" placeholder="Cerca un corso…" endContent={<Kbd keys={['command']}>K</Kbd>} startContent={<Ic d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" s={15} />} /></div><div className="flex-1" /><Torna /><Avatar name={iniz} color="primary" size="sm" /></header>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0">
          {vista === 'quiz' ? (<><Button variant="light" radius="full" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></>) : (
            <>
              <h1 className="text-2xl font-bold">Oggi</h1><p className="text-sm text-default-500">Cosa fare per portare avanti la tua formazione.</p>
              <Card shadow="none" className={`mt-5 ${Vetro}`}><CardBody className="p-2">
                <Listbox aria-label="Da fare" onAction={(k) => k === 'quiz' && setVista('quiz')} itemClasses={{ base: 'gap-4 rounded-2xl px-3 py-3.5 data-[hover=true]:bg-white/10', description: 'text-default-500' }}>
                  {cose.map(([t, d, ic, k]) => (<ListboxItem key={k || t} description={d} isDisabled={!k} startContent={<span className={`flex h-10 w-10 items-center justify-center rounded-xl ${k ? 'bg-primary/15 text-primary' : 'bg-white/5 text-default-400'}`}><Ic d={ic} /></span>} endContent={k ? <Ic d={P.arrow} s={16} /> : null}>{t}</ListboxItem>))}
                </Listbox>
              </CardBody></Card>
              <h2 className="mb-3 mt-9 text-lg font-semibold">I miei corsi</h2>
              <Tabs aria-label="Filtri" variant="underlined" classNames={{ tabList: 'gap-6 border-b border-white/10 w-full', cursor: 'bg-primary' }}><Tab key="t" title="Tutti" /><Tab key="c" title="In corso" /><Tab key="f" title="Completati" /></Tabs>
              <div className="mt-2 divide-y divide-white/10">
                {CORSI.map((c) => (<div key={c.id} className="flex items-center gap-4 py-4"><span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad}`}><Ic d={P.shield} s={20} /></span><div className="min-w-0 flex-1"><p className="font-semibold">{c.titolo}</p><p className="truncate text-sm text-default-500">{c.desc}</p></div><div className="hidden w-32 sm:block"><Progress aria-label="Avanzamento" value={c.pc} size="sm" color={c.pc === 100 ? 'success' : 'primary'} /></div><StatoChip k={c.stato} /></div>))}
              </div>
            </>
          )}
        </main>
        <aside className="flex flex-col gap-4">
          <Card shadow="none" className={Vetro}><CardBody className="items-center gap-3 p-6 text-center"><Badge isOneChar content="" color="success" placement="bottom-right" shape="circle"><Avatar name={iniz} color="primary" className="h-16 w-16 text-xl" /></Badge><div><p className="font-bold">{UTENTE.nome} {UTENTE.cognome}</p><p className="text-sm text-default-500">{UTENTE.qualifica}</p><p className="font-mono text-xs text-default-400">{UTENTE.matricola}</p></div></CardBody></Card>
          <Card shadow="none" className={Vetro}><CardBody className="gap-4 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-default-500">La tua formazione</p>{[['Completamento medio', 36, 'primary'], ['Quiz superati', 66, 'success']].map(([t, v, c]) => (<div key={t}><div className="mb-1 flex justify-between text-sm"><span>{t}</span><span className="text-default-500">{v}%</span></div><Progress aria-label={t} value={v} size="sm" color={c} /></div>))}<Divider /><div className="flex items-center justify-between"><span className="text-sm">Abilitazioni</span><Chip size="sm" color="success" variant="flat">1 ottenuta</Chip></div></CardBody></Card>
          <Card shadow="none" className={Vetro}><CardBody className="gap-3 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-default-500">Prossimi esami pratici</p><p className="text-sm text-default-500">Nessuna sessione in calendario.</p></CardBody></Card>
        </aside>
      </div>
      <Etichetta v="V6 · Oggi + pannello" />
    </div>
  );
}

// =====================================================================
// V7 · Dock in basso (stile app) con schede a tutta larghezza
// =====================================================================
export function V7() {
  const [tab, setTab] = useState('home');
  const [vista, setVista] = useState('home');
  return (
    <div className="min-h-screen bg-background pb-28 text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(37,99,235,0.3),transparent_55%)]" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5"><div className="flex items-center gap-3"><Logo h="h-10" /><div className="leading-tight"><p className="text-xs text-default-500">Bentornato</p><p className="font-bold">{UTENTE.nome} {UTENTE.cognome}</p></div></div><Torna testo="Sito" /></header>
      <main className="relative z-10 mx-auto max-w-[900px] px-6">
        {vista === 'quiz' ? (<><Button variant="light" radius="full" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></>) : tab === 'home' ? (
          <>
            <Card shadow="none" className="overflow-hidden border border-primary/40 bg-gradient-to-br from-blue-600 to-indigo-900"><CardBody className="gap-4 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-white/70">Riprendi</p><p className="text-3xl font-extrabold leading-tight">{CORSI[0].titolo}</p><Progress aria-label="Avanzamento" value={43} size="sm" classNames={{ indicator: 'bg-white', track: 'bg-white/25' }} /><div className="flex items-center justify-between"><span className="text-sm text-white/80">43% · modulo 2 di 3</span><Button radius="full" className="bg-white font-semibold text-black" onPress={() => setVista('quiz')} endContent={<Ic d={P.arrow} s={16} />}>Vai al quiz</Button></div></CardBody></Card>
            <h2 className="mb-3 mt-8 text-lg font-semibold">Corsi per te</h2>
            <div className="grid gap-4 sm:grid-cols-2">{CORSI.slice(1).map((c) => (<Card key={c.id} isPressable isHoverable shadow="none" className={`${Vetro} text-left`}><CardBody className="flex-row items-center gap-4 p-4"><span className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad}`}><Ic d={P.shield} s={22} /></span><div className="min-w-0"><p className="font-semibold leading-snug">{c.titolo}</p><p className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</p></div></CardBody></Card>))}</div>
          </>
        ) : (<div className="rounded-3xl border border-white/10 bg-content1/60 p-8 text-center text-default-500">Sezione “{tab}”</div>)}
      </main>
      <nav aria-label="Navigazione" className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"><div className="flex items-center gap-1 rounded-full border border-white/10 bg-content1/80 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl">
        {[['home', 'Home', P.grid], ['corsi', 'Corsi', P.book], ['perc', 'Percorso', P.route], ['ist', 'Istruttori', P.list]].map(([k, t, d]) => (<button key={k} type="button" onClick={() => { setTab(k); setVista('home'); }} className={`flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ${tab === k ? 'bg-primary text-white' : 'text-default-500 hover:text-foreground'}`}><Ic d={d} s={18} /><span className={tab === k ? '' : 'hidden sm:inline'}>{t}</span></button>))}
        <Divider orientation="vertical" className="mx-1 h-6" /><Tooltip content="Esci"><Button isIconOnly variant="light" radius="full" aria-label="Esci"><Ic d={P.out} s={18} /></Button></Tooltip>
      </div></nav>
      <Etichetta v="V7 · Dock in basso" />
    </div>
  );
}

// =====================================================================
// V8 · Lettura: indice del corso a sinistra e lezione a destra
// =====================================================================
export function V8() {
  const [sel, setSel] = useState('2');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-14 flex-none items-center gap-4 border-b border-white/10 px-5"><Logo /><span className="text-sm font-extrabold uppercase tracking-[0.18em]">SISFOR+</span><span className="text-default-500">/</span><span className="truncate text-sm">{CORSI[0].titolo}</span><div className="flex-1" /><div className="hidden w-40 sm:block"><Progress aria-label="Avanzamento" value={43} size="sm" color="primary" /></div><span className="text-xs text-default-500">43%</span><Torna /><Avatar name={iniz} color="primary" size="sm" /></header>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-80 flex-none overflow-y-auto border-r border-white/10 bg-content1/40 p-4 md:block">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-default-500">Indice del corso</p>
          <Listbox aria-label="Indice" selectionMode="single" disallowEmptySelection selectedKeys={new Set([sel])} onSelectionChange={(k) => setSel([...k][0] || sel)} itemClasses={{ base: 'rounded-xl p-3 data-[selected=true]:bg-primary/15', description: 'text-default-500' }}>
            {MODULI.map((m) => (<ListboxItem key={String(m.id)} textValue={m.titolo} isDisabled={m.stato === 'bloccato'} description={m.stato === 'fatto' ? 'Completato' : m.stato === 'corso' ? 'In corso' : 'Bloccato'} startContent={<span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${m.stato === 'fatto' ? 'bg-success/20 text-success' : m.stato === 'corso' ? 'bg-primary text-white' : 'bg-white/10 text-default-400'}`}>{m.stato === 'fatto' ? <Ic d={P.check} s={13} /> : m.stato === 'bloccato' ? <Ic d={P.lock} s={12} /> : m.id}</span>}>{m.titolo}</ListboxItem>))}
          </Listbox>
          <Divider className="my-4" /><p className="px-2 text-xs text-default-500">Dopo i moduli e i quiz si sblocca l’esame pratico con un istruttore.</p>
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto">
          <article className="mx-auto max-w-[720px] px-6 py-10">
            <Chip size="sm" variant="flat" color="primary">Modulo {sel} di 3</Chip>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight">{MODULI[Number(sel) - 1].titolo}</h1>
            <div className="mt-6 space-y-5 text-[17px] leading-8 text-foreground/85">
              <p>Un posto di blocco si imposta in un punto con buona visibilità, lontano da curve cieche e dossi, in modo che i conducenti vedano la segnalazione con largo anticipo.</p>
              <p>Le volanti vanno posizionate a “V” o in diagonale per proteggere gli agenti. Luci di emergenza accese, coni o strisce chiodate prima del punto di controllo, e almeno due agenti: uno controlla e l’altro copre.</p>
              <Card shadow="none" className="border border-primary/30 bg-primary/10"><CardBody className="flex-row items-start gap-3 p-4 text-sm"><span className="mt-0.5 text-primary"><Ic d={P.shield} s={18} /></span><p>Prima di iniziare comunica alla Centrale il luogo e l’orario di inizio del controllo.</p></CardBody></Card>
            </div>
            <Divider className="my-10" />
            <div className="flex flex-wrap items-center justify-between gap-3"><Button variant="bordered" radius="full" className="border-white/20" startContent={<Ic d={P.back} s={15} />}>Modulo precedente</Button><Button color="primary" radius="full" size="lg" className="font-semibold" onPress={onOpen} endContent={<Ic d={P.arrow} s={16} />}>Ho letto: vai al quiz</Button></div>
          </article>
        </main>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur" classNames={{ base: 'border border-white/10 bg-background' }}><ModalContent>{() => (<><ModalHeader>Quiz di verifica</ModalHeader><ModalBody className="pb-8"><Quiz onFine={onOpenChange} /></ModalBody></>)}</ModalContent></Modal>
      <Etichetta v="V8 · Lettura con indice" />
    </div>
  );
}

export const VERSIONI2 = { v5: V5, v6: V6, v7: V7, v8: V8 };
