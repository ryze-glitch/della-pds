'use client';

import {
  Accordion, AccordionItem, Avatar, Button, Card, CardBody, CardHeader, Chip, Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Progress, Radio, RadioGroup, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs,
} from '@heroui/react';

const STATI = {
  corso: { color: 'primary', label: 'In corso' },
  ambra: { color: 'warning', label: 'Pratica da prenotare' },
  ok: { color: 'success', label: 'Completato' },
  bloccato: { color: 'default', label: 'Bloccato' },
};
const CORSI = [
  { n: '01', titolo: 'Posto di blocco e fermo veicolo', sub: '2 moduli su 3 completati', stato: 'corso' },
  { n: '02', titolo: 'Comunicazioni radio e codici', sub: 'Quiz superati · prenota l’esame pratico', stato: 'ambra' },
  { n: '03', titolo: 'Procedure di base', sub: 'Abilitazione ottenuta', stato: 'ok' },
  { n: '04', titolo: 'Arresto e perquisizione', sub: 'Richiede il grado Assistente', stato: 'bloccato' },
];
const FASI = [
  ['01 Moduli', 'In corso', 66],
  ['02 Quiz', 'Da fare', 0],
  ['03 Pratica', 'Da fare', 0],
  ['04 Abilitazione', 'Da fare', 0],
];

export default function Corsi() {
  return (
    <div className="min-h-screen">
      <Navbar maxWidth="xl" isBordered className="bg-content1/70" classNames={{ wrapper: 'px-6' }}>
        <NavbarBrand className="gap-3">
          <img src="/crest.png" alt="" className="h-8 w-auto" />
          <p className="font-bold uppercase tracking-wide">Polizia IPRP</p>
        </NavbarBrand>
        <NavbarContent className="hidden gap-6 sm:flex" justify="center">
          <NavbarItem isActive><span className="font-semibold text-primary">I miei corsi</span></NavbarItem>
          <NavbarItem><span className="text-default-500">Il mio percorso</span></NavbarItem>
          <NavbarItem><span className="text-default-500">Istruttori</span></NavbarItem>
          <NavbarItem><span className="text-default-500">Gestione</span></NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-semibold">Mario Rossi</p>
              <p className="text-xs text-default-500">Agente</p>
            </div>
            <Avatar name="MR" size="sm" color="primary" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide sm:text-5xl">
          I miei <span className="text-primary">corsi</span>
        </h1>

        <Card className="mt-8 border border-primary/50 bg-content1" shadow="lg">
          <CardBody className="gap-6 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-default-500">Prossimo passo</p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Posto di blocco e fermo veicolo</h2>
                <p className="mt-2 text-default-500">Modulo 2 di 3 · Controllo dei documenti</p>
              </div>
              <Button color="primary" radius="full" size="lg" className="h-14 px-8 font-semibold">Continua il modulo →</Button>
            </div>
            <ol className="grid gap-5 sm:grid-cols-4">
              {FASI.map(([t, s, v], i) => (
                <li key={t} className="flex flex-col gap-2">
                  <Progress aria-label={t} value={v} size="sm" color={i === 0 ? 'primary' : 'default'} />
                  <span className={`text-lg ${i === 0 ? 'font-bold' : 'font-medium text-default-500'}`}>{t}</span>
                  <span className="text-sm text-default-500">{s}</span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <h2 className="mb-3 mt-12 text-xs font-bold uppercase tracking-[0.12em] text-default-500">Tutti i corsi</h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {CORSI.map((c) => (
            <div key={c.n} className="flex flex-wrap items-center gap-x-8 gap-y-3 px-2 py-6">
              <span className={`w-14 text-4xl font-extrabold ${c.stato === 'bloccato' ? 'text-default-400' : 'text-primary'}`}>{c.n}</span>
              <div className="min-w-[240px] flex-1">
                <p className={`text-xl font-semibold ${c.stato === 'bloccato' ? 'text-default-500' : ''}`}>{c.titolo}</p>
                <p className="text-sm text-default-500">{c.sub}</p>
              </div>
              <Chip color={STATI[c.stato].color} variant="flat" classNames={{ content: 'font-semibold' }}>{STATI[c.stato].label}</Chip>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="border border-white/10 bg-content1">
            <CardHeader className="flex-col items-start gap-1 px-6 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-default-500">Domanda 2 di 5 · situazione</p>
              <h3 className="text-xl font-bold">Il conducente rifiuta l’alcoltest. Cosa fai?</h3>
            </CardHeader>
            <CardBody className="gap-5 px-6 pb-6">
              <RadioGroup aria-label="Risposta" defaultValue="b" classNames={{ wrapper: 'gap-3' }}>
                {['Lo lascio andare senza dire niente', 'Verbalizzo il rifiuto, spiego le conseguenze e lo comunico alla Centrale', 'Gli tolgo le chiavi e me ne vado'].map((t, i) => (
                  <Radio key={t} value={'abc'[i]} classNames={{ base: 'm-0 max-w-full rounded-large border border-white/15 px-4 py-4 data-[selected=true]:border-primary data-[selected=true]:bg-primary/15' }}>{t}</Radio>
                ))}
              </RadioGroup>
              <div className="flex gap-2" aria-label="Avanzamento">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`flex h-11 w-11 items-center justify-center rounded-medium border text-sm font-semibold ${n === 2 ? 'border-white bg-white text-black' : n < 2 ? 'border-primary bg-primary/25' : 'border-white/20'}`}>{n}</span>
                ))}
              </div>
              <Button color="primary" radius="full" size="lg" className="h-14 font-semibold">Conferma e continua</Button>
            </CardBody>
          </Card>

          <Card className="border border-white/10 bg-content1">
            <CardHeader className="px-6 pt-6"><h3 className="text-xl font-bold">Area istruttori · coda richieste</h3></CardHeader>
            <CardBody className="px-4 pb-4">
              <Table aria-label="Coda delle richieste" removeWrapper classNames={{ th: 'bg-transparent text-xs uppercase tracking-wide', td: 'py-4' }}>
                <TableHeader>
                  <TableColumn>Allievo</TableColumn>
                  <TableColumn>Corso</TableColumn>
                  <TableColumn>Stato</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1"><TableCell>Mario Rossi</TableCell><TableCell>Posto di blocco</TableCell><TableCell><Chip size="sm" color="warning" variant="flat">Richiesta</Chip></TableCell></TableRow>
                  <TableRow key="2"><TableCell>Anna Verdi</TableCell><TableCell>Radio e codici</TableCell><TableCell><Chip size="sm" color="primary" variant="flat">In valutazione</Chip></TableCell></TableRow>
                  <TableRow key="3"><TableCell>Luca Neri</TableCell><TableCell>Posto di blocco</TableCell><TableCell><Chip size="sm" color="success" variant="flat">Superata</Chip></TableCell></TableRow>
                </TableBody>
              </Table>
              <Accordion variant="light" className="mt-2 px-2">
                <AccordionItem key="1" aria-label="Criteri" title="Criteri di valutazione" classNames={{ title: 'font-semibold' }}>
                  <p className="pb-4 text-sm text-default-500">Si presenta · Comunica il motivo del fermo · Usa correttamente la radio · Rispetta i diritti del conducente. Ogni criterio: Non svolto, Parziale, Corretto.</p>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
