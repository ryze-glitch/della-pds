'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Avatar, AvatarGroup, Badge, Breadcrumbs, BreadcrumbItem, Button, Card, CardBody, CardFooter, CardHeader, Chip, CircularProgress, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Listbox, ListboxItem, Navbar, NavbarBrand, NavbarContent, NavbarItem, Progress, ScrollShadow, Tab, Tabs, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from '@heroui/react';
import { CORSI, Etichetta, Ic, MODULI, P, Quiz, StatoChip, UTENTE } from './comune';

const nomeCompleto = `${UTENTE.nome} ${UTENTE.cognome}`;
const iniz = 'GM';
const Marchio = ({ piccolo }) => (<a href="#" className="flex items-center gap-3"><img src="/logo-iprp.png" alt="IPRP" className={piccolo ? 'h-9 w-auto' : 'h-11 w-auto'} /><span className="leading-tight"><span className="block text-sm font-extrabold uppercase tracking-[0.14em]">SISFOR+</span><span className="block text-[10px] uppercase tracking-[0.2em] text-default-500">IPRP</span></span></a>);
const Torna = () => <Button as="a" href="#" size="sm" variant="light" radius="full" startContent={<Ic d={P.home} s={15} />}>Torna al sito</Button>;
const Bg = () => <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(37,99,235,0.16),transparent_55%)]" />;

// =====================================================================
// V1 · Barra laterale + schede dei corsi
// =====================================================================
export function V1() {
  const [vista, setVista] = useState('home');
  const [corso, setCorso] = useState(CORSI[0]);
  const voci = [['home', 'Dashboard', P.grid], ['percorso', 'Il mio percorso', P.route], ['istruttori', 'Area istruttori', P.list], ['admin', 'Amministrazione', P.shield]];
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Bg />
      <aside className="relative z-10 hidden w-64 flex-none flex-col gap-3 border-r border-white/10 bg-content1/50 p-4 lg:flex">
        <div className="px-2 py-2"><Marchio /></div>
        <User name={nomeCompleto} description={UTENTE.qualifica} avatarProps={{ name: iniz, color: 'primary', size: 'sm' }} className="justify-start px-2" classNames={{ description: 'text-xs' }} />
        <Divider />
        <Listbox aria-label="Menu" onAction={(k) => setVista(k === 'home' ? 'home' : vista)} itemClasses={{ base: 'h-11 gap-3 rounded-xl px-3 data-[hover=true]:bg-white/10', title: 'text-sm' }}>
          {voci.map(([k, t, d]) => <ListboxItem key={k} startContent={<Ic d={d} />} className={vista === k || (vista !== 'home' && k === 'home' && false) ? 'bg-primary/15 text-primary' : ''}>{t}</ListboxItem>)}
        </Listbox>
        <div className="mt-auto flex flex-col gap-2"><Torna /><Button variant="bordered" radius="full" className="border-white/20" startContent={<Ic d={P.out} s={16} />}>Esci</Button></div>
      </aside>
      <main className="relative z-10 min-w-0 flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-[1100px]">
          {vista === 'home' ? (
            <>
              <h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-1 text-default-500">Bentornato, {UTENTE.nome}. Ecco la tua formazione.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[['Corsi disponibili', 4, P.book], ['In corso', 1, P.clock], ['Abilitazioni', 1, P.award]].map(([t, n, d]) => (<Card key={t} shadow="none" className="border border-white/10 bg-content1/60"><CardBody className="flex-row items-center gap-4 p-5"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ic d={d} s={22} /></span><div><p className="text-3xl font-bold leading-none">{n}</p><p className="mt-1 text-sm text-default-500">{t}</p></div></CardBody></Card>))}
              </div>
              <Card shadow="none" className="mt-6 border border-primary/40 bg-primary/5"><CardBody className="flex-row flex-wrap items-center justify-between gap-5 p-6">
                <div className="min-w-[260px] flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Continua da dove eri rimasto</p><p className="mt-1 text-xl font-bold">{CORSI[0].titolo}</p><Progress aria-label="Completamento" value={43} size="sm" color="primary" className="mt-3" label="43% completato" classNames={{ label: 'text-xs text-default-500' }} /></div>
                <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={16} />} onPress={() => { setCorso(CORSI[0]); setVista('corso'); }}>Continua il corso</Button>
              </CardBody></Card>
              <div className="mt-8 flex items-center justify-between"><h2 className="text-lg font-semibold">Panoramica dei corsi</h2><Tabs aria-label="Filtro" size="sm" radius="full"><Tab key="t" title="Tutti" /><Tab key="c" title="In corso" /><Tab key="f" title="Completati" /></Tabs></div>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {CORSI.map((c) => (
                  <Card key={c.id} isPressable isHoverable shadow="none" onPress={() => { setCorso(c); setVista('corso'); }} className="border border-white/10 bg-content1/60 text-left">
                    <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${c.grad}`}><Ic d={P.shield} s={40} /></div>
                    <CardBody className="gap-3 p-5"><p className="font-semibold leading-snug">{c.titolo}</p><p className="line-clamp-2 text-sm text-default-500">{c.desc}</p><Progress aria-label="Avanzamento" value={c.pc} size="sm" color={c.pc === 100 ? 'success' : 'primary'} /></CardBody>
                    <CardFooter className="justify-between px-5 pb-5 pt-0"><span className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</span><StatoChip k={c.stato} /></CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : vista === 'corso' ? (
            <>
              <Breadcrumbs size="sm" className="mb-3"><BreadcrumbItem onPress={() => setVista('home')}>Dashboard</BreadcrumbItem><BreadcrumbItem>{corso.titolo}</BreadcrumbItem></Breadcrumbs>
              <h1 className="text-3xl font-bold">{corso.titolo}</h1><p className="mt-2 max-w-2xl text-default-500">{corso.desc}</p>
              <Card shadow="none" className="mt-6 border border-white/10 bg-content1/60"><CardBody className="flex-row flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold">Completamento del corso</p><p className="text-sm text-default-500">3 attività su 7</p></div><Progress aria-label="Completamento" value={corso.pc} color="primary" className="max-w-sm" showValueLabel /></CardBody></Card>
              <Accordion variant="splitted" defaultExpandedKeys={['2']} className="mt-6 px-0" itemClasses={{ base: 'border border-white/10 bg-content1/60 shadow-none', title: 'font-semibold', trigger: 'py-4' }}>
                {MODULI.map((m) => (
                  <AccordionItem key={String(m.id)} aria-label={m.titolo} title={`0${m.id} · ${m.titolo}`} subtitle={<StatoChip k={m.stato} />} isDisabled={m.stato === 'bloccato'}>
                    <div className="flex flex-col gap-2 pb-3">
                      <Button variant="flat" radius="lg" className="h-14 justify-start gap-3" startContent={<Ic d={P.book} />} endContent={<span className="ml-auto text-xs text-default-500">Letto</span>}>Contenuto del modulo</Button>
                      <Button variant="flat" radius="lg" className="h-14 justify-start gap-3" startContent={<Ic d={P.list} />} onPress={() => setVista('quiz')} endContent={<span className="ml-auto text-xs text-default-500">{m.quiz}</span>}>Quiz di verifica</Button>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          ) : (<><Button variant="light" radius="full" onPress={() => setVista('corso')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Torna al corso</Button><h1 className="mb-6 text-2xl font-bold">Quiz di verifica</h1><Quiz onFine={() => setVista('home')} /></>)}
        </div>
      </main>
      <Etichetta v="V1 · Barra laterale" />
    </div>
  );
}

// =====================================================================
// V2 · Barra in alto con schede + anello di avanzamento
// =====================================================================
export function V2() {
  const [vista, setVista] = useState('home');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Bg />
      <Navbar maxWidth="xl" isBordered classNames={{ base: 'bg-background/70 border-white/10 backdrop-blur-xl' }}>
        <NavbarBrand><Marchio piccolo /></NavbarBrand>
        <NavbarContent justify="center" className="hidden gap-1 sm:flex">
          <Tabs aria-label="Sezioni" radius="full" selectedKey="dash" classNames={{ cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white' }}><Tab key="dash" title="Dashboard" /><Tab key="corsi" title="Corsi" /><Tab key="perc" title="Percorso" /><Tab key="ist" title="Istruttori" /></Tabs>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem><Torna /></NavbarItem>
          <Dropdown placement="bottom-end"><DropdownTrigger><button type="button" aria-label="Menu utente" className="rounded-full outline-none"><Avatar name={iniz} color="primary" size="sm" isBordered /></button></DropdownTrigger>
            <DropdownMenu aria-label="Utente"><DropdownItem key="p" isReadOnly description={UTENTE.qualifica} className="opacity-100">{nomeCompleto}</DropdownItem><DropdownItem key="a">Amministrazione</DropdownItem><DropdownItem key="e" color="danger" className="text-danger">Esci</DropdownItem></DropdownMenu></Dropdown>
        </NavbarContent>
      </Navbar>
      <main className="relative z-10 mx-auto max-w-[1100px] px-6 py-10">
        {vista === 'quiz' ? (<><Button variant="light" radius="full" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></>) : (
          <>
            <Card shadow="none" className="border border-white/10 bg-gradient-to-br from-primary/20 via-content1 to-content1"><CardBody className="flex-col items-center gap-8 p-8 sm:flex-row">
              <CircularProgress aria-label="Avanzamento" value={43} size="lg" color="primary" showValueLabel strokeWidth={3} classNames={{ svg: 'h-32 w-32', value: 'text-2xl font-bold', track: 'stroke-white/10' }} />
              <div className="flex-1 text-center sm:text-left"><p className="text-sm text-default-500">Bentornato, {UTENTE.nome}</p><h1 className="mt-1 text-3xl font-bold">Sei al 43% del corso “Posto di blocco”</h1><p className="mt-2 text-default-500">Ti manca il quiz del modulo 2 per sbloccare il modulo successivo.</p></div>
              <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.play} s={14} />} onPress={() => setVista('quiz')}>Riprendi</Button>
            </CardBody></Card>
            <h2 className="mb-3 mt-10 text-lg font-semibold">I tuoi corsi</h2>
            <Table aria-label="Corsi" removeWrapper className="rounded-2xl border border-white/10 bg-content1/40 p-2">
              <TableHeader><TableColumn>CORSO</TableColumn><TableColumn>MODULI</TableColumn><TableColumn>DURATA</TableColumn><TableColumn width={220}>AVANZAMENTO</TableColumn><TableColumn>STATO</TableColumn></TableHeader>
              <TableBody>{CORSI.map((c) => (<TableRow key={c.id} className="cursor-pointer hover:bg-white/5"><TableCell><div className="flex items-center gap-3"><span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${c.grad}`}><Ic d={P.shield} s={18} /></span><span className="font-semibold">{c.titolo}</span></div></TableCell><TableCell>{c.moduli}</TableCell><TableCell>{c.durata}</TableCell><TableCell><Progress aria-label="Avanzamento" value={c.pc} size="sm" color={c.pc === 100 ? 'success' : 'primary'} /></TableCell><TableCell><StatoChip k={c.stato} /></TableCell></TableRow>))}</TableBody>
            </Table>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[['Abilitazioni ottenute', '1', 'Primo soccorso sul campo'], ['Quiz superati', '4', 'Media 82%'], ['Prossima scadenza', '—', 'Nessuna']].map(([t, n, s]) => (<Card key={t} shadow="none" className="border border-white/10 bg-content1/60"><CardBody className="p-5"><p className="text-xs uppercase tracking-widest text-default-500">{t}</p><p className="mt-2 text-3xl font-bold">{n}</p><p className="text-sm text-default-500">{s}</p></CardBody></Card>))}
            </div>
          </>
        )}
      </main>
      <Etichetta v="V2 · Barra in alto + anello" />
    </div>
  );
}

// =====================================================================
// V3 · Stile catalogo (banner grande e file di corsi)
// =====================================================================
export function V3() {
  const [vista, setVista] = useState('home');
  const fila = (titolo, lista) => (
    <section className="mt-10"><h2 className="mb-3 px-6 text-lg font-semibold sm:px-10">{titolo}</h2>
      <ScrollShadow orientation="horizontal" hideScrollBar className="px-6 sm:px-10"><div className="flex w-max gap-4 pb-2">
        {lista.map((c) => (<Card key={c.id} isPressable isHoverable shadow="none" onPress={() => setVista('corso')} className="w-72 flex-none border border-white/10 bg-content1/60 text-left"><div className={`relative flex h-36 items-end bg-gradient-to-br ${c.grad} p-4`}><Ic d={P.shield} s={44} /><div className="absolute right-3 top-3"><StatoChip k={c.stato} /></div></div><CardBody className="gap-2 p-4"><p className="font-semibold leading-snug">{c.titolo}</p><p className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</p><Progress aria-label="Avanzamento" value={c.pc} size="sm" color={c.pc === 100 ? 'success' : 'primary'} /></CardBody></Card>))}
      </div></ScrollShadow></section>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 sm:px-10"><Marchio piccolo /><div className="flex items-center gap-2"><Torna /><Avatar name={iniz} color="primary" size="sm" isBordered /></div></header>
      {vista === 'home' ? (
        <>
          <section className="relative flex min-h-[460px] items-end overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-900 to-background p-6 pb-12 pt-28 sm:p-10 sm:pb-14">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="relative max-w-2xl"><Chip variant="flat" color="primary" className="mb-4">Continua da dove eri rimasto</Chip><h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{CORSI[0].titolo}</h1><p className="mt-3 text-foreground/80">{CORSI[0].desc}</p>
              <Progress aria-label="Avanzamento" value={43} size="sm" color="primary" className="mt-5 max-w-sm" label="43% completato" classNames={{ label: 'text-xs' }} />
              <div className="mt-6 flex gap-3"><Button color="primary" radius="full" size="lg" className="font-semibold" startContent={<Ic d={P.play} s={14} />} onPress={() => setVista('corso')}>Riprendi</Button><Button variant="bordered" radius="full" size="lg" className="border-white/30" onPress={() => setVista('corso')}>Dettagli</Button></div></div>
          </section>
          {fila('I miei corsi', CORSI.filter((c) => c.stato !== 'completato'))}
          {fila('Completati', CORSI.filter((c) => c.stato === 'completato'))}
          <section className="mt-10 px-6 pb-24 sm:px-10"><h2 className="mb-3 text-lg font-semibold">Le mie abilitazioni</h2><Card shadow="none" className="max-w-md border border-white/10 bg-content1/60"><CardBody className="flex-row items-center gap-4 p-5"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success"><Ic d={P.award} s={24} /></span><div><p className="font-semibold">Primo soccorso sul campo</p><p className="text-xs text-default-500">Ottenuta il 12 ottobre · valida 12 mesi</p></div></CardBody></Card></section>
        </>
      ) : vista === 'corso' ? (
        <>
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-900 to-background px-6 pb-8 pt-28 sm:px-10"><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="relative"><Button variant="light" radius="full" size="sm" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={14} />}>Catalogo</Button><h1 className="mt-3 max-w-3xl text-4xl font-extrabold">{CORSI[0].titolo}</h1></div></section>
          <div className="mx-auto max-w-[1000px] px-6 pb-24 sm:px-10">
            <Tabs aria-label="Corso" variant="underlined" classNames={{ tabList: 'gap-6 border-b border-white/10 w-full', cursor: 'bg-primary' }}>
              <Tab key="prog" title="Programma"><div className="mt-5 flex flex-col gap-3">{MODULI.map((m) => (<Card key={m.id} shadow="none" className="border border-white/10 bg-content1/60"><CardBody className="flex-row items-center gap-4 p-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white/5 text-sm font-bold">0{m.id}</span><div className="min-w-0 flex-1"><p className="font-semibold">{m.titolo}</p><p className="text-xs text-default-500">{m.quiz}</p></div><StatoChip k={m.stato} />{m.stato === 'corso' ? <Button size="sm" color="primary" radius="full" onPress={() => setVista('quiz')}>Quiz</Button> : null}</CardBody></Card>))}</div></Tab>
              <Tab key="info" title="Informazioni"><p className="mt-5 max-w-2xl text-default-500">{CORSI[0].desc}</p></Tab>
              <Tab key="pra" title="Esame pratico"><p className="mt-5 text-default-500">Si sblocca dopo aver superato tutti i quiz del corso.</p></Tab>
            </Tabs>
          </div>
        </>
      ) : (<div className="mx-auto max-w-[1000px] px-6 pb-24 pt-28"><Button variant="light" radius="full" onPress={() => setVista('corso')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></div>)}
      <Etichetta v="V3 · Catalogo" />
    </div>
  );
}

// =====================================================================
// V4 · Percorso a tappe (stile gioco, con livello e abilitazioni)
// =====================================================================
export function V4() {
  const [vista, setVista] = useState('home');
  const tappe = [['Moduli', 'Studia i contenuti', 'fatto'], ['Quiz', 'Supera i quiz di ogni modulo', 'corso'], ['Pratica', 'Esame con un istruttore', 'bloccato'], ['Abilitazione', 'Ottieni il titolo', 'bloccato']];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Bg />
      <header className="relative z-20 flex items-center justify-between border-b border-white/10 px-6 py-3 sm:px-10"><Marchio piccolo /><div className="flex items-center gap-3"><Torna /><Tooltip content={`${nomeCompleto} · ${UTENTE.matricola}`}><Avatar name={iniz} color="primary" size="sm" isBordered /></Tooltip></div></header>
      <main className="relative z-10 mx-auto max-w-[1100px] px-6 py-10">
        {vista === 'quiz' ? (<><Button variant="light" radius="full" onPress={() => setVista('home')} startContent={<Ic d={P.back} s={16} />} className="mb-4">Indietro</Button><Quiz onFine={() => setVista('home')} /></>) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-default-500">{UTENTE.qualifica}</p><h1 className="text-3xl font-bold">Il tuo percorso, {UTENTE.nome}</h1></div>
              <div className="flex items-center gap-4"><div className="text-right"><p className="text-xs uppercase tracking-widest text-default-500">Abilitazioni</p><p className="text-2xl font-bold">1 / 4</p></div><AvatarGroup isBordered max={3}><Avatar name="PS" color="success" /><Avatar name="PB" /><Avatar name="RD" /></AvatarGroup></div></div>
            <Card shadow="none" className="mt-8 border border-white/10 bg-content1/60"><CardHeader className="flex-col items-start gap-1 p-6 pb-2"><Chip size="sm" variant="flat" color="primary">Corso attuale</Chip><p className="text-xl font-bold">{CORSI[0].titolo}</p></CardHeader>
              <CardBody className="gap-6 p-6">
                <div className="grid gap-3 sm:grid-cols-4">{tappe.map(([t, d, st], i) => (<div key={t} className={`relative rounded-2xl border p-4 ${st === 'corso' ? 'border-primary bg-primary/10' : 'border-white/10'}`}><div className="mb-3 flex items-center justify-between"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${st === 'fatto' ? 'bg-success/20 text-success' : st === 'corso' ? 'bg-primary text-white' : 'bg-white/10 text-default-400'}`}>{st === 'fatto' ? <Ic d={P.check} s={15} /> : st === 'bloccato' ? <Ic d={P.lock} s={13} /> : i + 1}</span><StatoChip k={st} /></div><p className="font-semibold">{t}</p><p className="mt-1 text-xs text-default-500">{d}</p></div>))}</div>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/5 p-4"><div><p className="font-semibold">Prossimo passo: Quiz del modulo 2</p><p className="text-sm text-default-500">5 domande · soglia 70% · 30 minuti</p></div><Button color="primary" radius="full" className="font-semibold" onPress={() => setVista('quiz')} endContent={<Ic d={P.arrow} s={16} />}>Inizia il quiz</Button></div>
              </CardBody></Card>
            <h2 className="mb-3 mt-10 text-lg font-semibold">Altri corsi</h2>
            <div className="grid gap-4 md:grid-cols-3">{CORSI.slice(1).map((c) => (<Card key={c.id} isPressable isHoverable shadow="none" className="border border-white/10 bg-content1/60 text-left"><CardBody className="gap-3 p-5"><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.grad}`}><Ic d={P.shield} s={18} /></span><StatoChip k={c.stato} /></div><p className="font-semibold leading-snug">{c.titolo}</p><p className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</p></CardBody></Card>))}</div>
          </>
        )}
      </main>
      <Etichetta v="V4 · Percorso a tappe" />
    </div>
  );
}

export const VERSIONI = { v1: V1, v2: V2, v3: V3, v4: V4 };
