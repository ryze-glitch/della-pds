'use client';

import { useState } from 'react';
import { Avatar, Button, ButtonGroup, Card, CardBody, Chip, Divider, Input, Kbd, Listbox, ListboxItem, Progress, Tab, Tabs } from '@heroui/react';
import { Ic, P, SERVIZI, Sfondo, glass } from './heroes';

// ---- M: cinematografica, stemma enorme sfumato dietro il titolo
function M() {
  return (
    <Sfondo v="M · Cinematografica">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-28 text-center">
        <img src="/crest.png" alt="" aria-hidden="true" className="absolute left-1/2 top-1/2 h-[900px] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.1]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-default-500">Questura IPRP</p>
          <h1 className="mt-4 text-6xl font-black uppercase leading-[0.95] tracking-wide sm:text-9xl">Polizia<br />di Stato</h1>
          <p className="mx-auto mt-6 max-w-md text-default-500">Sub lege libertas. Via dei Peccatori N°761 · Tel. 113</p>
          <ButtonGroup radius="full" className="mt-9" size="lg">
            <Button color="primary" className="px-8 font-semibold">Scopri i servizi</Button>
            <Button variant="bordered" className="border-white/20 px-8 font-semibold">Chi siamo</Button>
          </ButtonGroup>
        </div>
        <Chip variant="flat" className="absolute bottom-20 bg-white/5" startContent={<Ic d={P.down} s={14} />}>Scorri</Chip>
      </section>
    </Sfondo>
  );
}

// ---- N: stile “palette comandi” (Spotlight)
function N() {
  const voci = [...SERVIZI, { k: 'sta', t: 'Stato della pratica', s: 'Controlla una richiesta già inviata', i: P.search }];
  return (
    <Sfondo v="N · Palette comandi">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 pb-16 pt-28">
        <img src="/crest.png" alt="" className="h-16 w-auto" />
        <h1 className="mt-4 text-center text-4xl font-extrabold uppercase tracking-wide sm:text-6xl">Polizia di Stato</h1>
        <Card className={`${glass} mt-8 w-full`}>
          <CardBody className="p-0">
            <Input aria-label="Cerca" placeholder="Cosa cerchi?" size="lg" variant="underlined" startContent={<Ic d={P.search} s={18} />} endContent={<Kbd>Esc</Kbd>} classNames={{ inputWrapper: 'h-14 px-5 border-white/10', input: 'text-base' }} />
            <Listbox aria-label="Risultati" className="p-2" itemClasses={{ base: 'rounded-xl px-3 py-2.5 gap-3 data-[hover=true]:bg-white/10', description: 'text-default-500' }}>
              {voci.map((s, i) => (
                <ListboxItem key={s.k} description={s.s} startContent={<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Ic d={s.i} s={18} /></span>} endContent={<Kbd keys={['command']}>{i + 1}</Kbd>}>{s.t}</ListboxItem>
              ))}
            </Listbox>
            <Divider />
            <p className="px-5 py-3 text-xs text-default-500">Via dei Peccatori N°761 · Tel. 113 · Emergenza 112</p>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

// ---- O: come funziona, in tre passi
const PASSI = [
  { n: '1', t: 'Compila', d: 'Racconta i fatti dal modulo online.' },
  { n: '2', t: 'Invia', d: 'Alleghi le prove e ricevi un codice.' },
  { n: '3', t: 'Segui', d: 'Controlli lo stato fino alla risposta.' },
];
function O() {
  return (
    <Sfondo v="O · Tre passi">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-[1fr_1.1fr]">
        <div>
          <img src="/crest.png" alt="" className="h-20 w-auto" />
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-7xl">Polizia<br />di Stato</h1>
          <p className="mt-4 text-default-500">Denunciare è semplice: bastano tre passi, senza code.</p>
          <Button color="primary" radius="full" size="lg" className="mt-8 font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Fai una denuncia</Button>
        </div>
        <div className="flex flex-col gap-3">
          {PASSI.map((p) => (
            <Card key={p.n} className={glass}>
              <CardBody className="flex-row items-center gap-5 p-5">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-lg font-extrabold">{p.n}</span>
                <div><p className="text-lg font-bold">{p.t}</p><p className="text-default-500">{p.d}</p></div>
              </CardBody>
            </Card>
          ))}
          <Progress aria-label="Avanzamento" value={66} color="primary" size="sm" className="mt-1" />
        </div>
      </section>
    </Sfondo>
  );
}

// ---- P: anteprima del servizio con schede fluttuanti
function Pp() {
  return (
    <Sfondo v="P · Schede fluttuanti">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-2">
        <div>
          <Chip color="primary" variant="flat" className="mb-5">Servizi online 24 ore su 24</Chip>
          <h1 className="text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-7xl">Polizia<br />di Stato</h1>
          <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
          <div className="mt-8 flex gap-3">
            <Button color="primary" radius="full" size="lg" className="font-semibold">Scopri i servizi</Button>
            <Button variant="light" radius="full" size="lg" className="font-semibold">Area Personale</Button>
          </div>
        </div>
        <div className="relative hidden h-[420px] md:block">
          <Card className={`${glass} absolute left-0 top-4 w-72`}>
            <CardBody className="gap-3 p-5">
              <div className="flex items-center justify-between"><p className="font-bold">Denuncia #0042</p><Chip size="sm" color="warning" variant="flat">In lavorazione</Chip></div>
              <Progress aria-label="Pratica" value={60} color="primary" size="sm" />
              <p className="text-xs text-default-500">Presa in carico da un agente</p>
            </CardBody>
          </Card>
          <Card className={`${glass} absolute right-0 top-36 w-72`}>
            <CardBody className="flex-row items-center gap-3 p-4">
              <Avatar name="MR" color="primary" /><div><p className="font-semibold">Quiz superato</p><p className="text-xs text-default-500">Posto di blocco · modulo 2</p></div>
            </CardBody>
          </Card>
          <Card className={`${glass} absolute bottom-0 left-10 w-72`}>
            <CardBody className="flex-row items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={P.cal} /></span>
              <div><p className="font-semibold">Colloquio prenotato</p><p className="text-xs text-default-500">Giovedì, ore 18:00</p></div>
            </CardBody>
          </Card>
        </div>
      </section>
    </Sfondo>
  );
}

// ---- Q: titolo centrato + striscia di servizi che scorre
function Q() {
  const voci = ['Denuncia online', "Porto d'armi", 'Prenota un colloquio', 'Concorso pubblico', 'Stato della pratica', 'Formazione SISFOR+', 'Notizie'];
  const riga = [...voci, ...voci];
  return (
    <Sfondo v="Q · Striscia che scorre">
      <section className="flex min-h-screen flex-col items-center justify-center overflow-hidden pb-16 pt-28 text-center">
        <img src="/crest.png" alt="" className="h-24 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 px-6 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 px-6 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <Button color="primary" radius="full" size="lg" className="mt-8 font-semibold">Scopri i servizi</Button>
        <div className="mt-14 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="scorri flex w-max gap-3">
            {riga.map((t, i) => <Chip key={i} variant="bordered" size="lg" className="border-white/15">{t}</Chip>)}
          </div>
        </div>
      </section>
    </Sfondo>
  );
}

// ---- R: unica grande scheda con sezioni (Servizi · Contatti · Notizie)
function R() {
  const [k, setK] = useState('servizi');
  return (
    <Sfondo v="R · Scheda unica con sezioni">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <img src="/crest.png" alt="" className="h-20 w-auto drop-shadow-2xl" />
        <h1 className="mt-4 text-5xl font-extrabold uppercase tracking-wide sm:text-6xl">Polizia di Stato</h1>
        <Card className={`${glass} mt-8 w-full text-left`}>
          <CardBody className="gap-4 p-4">
            <Tabs aria-label="Sezioni" fullWidth radius="full" selectedKey={k} onSelectionChange={setK} classNames={{ cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white font-semibold' }}>
              <Tab key="servizi" title="Servizi" /><Tab key="contatti" title="Contatti" /><Tab key="agenti" title="Agenti" />
            </Tabs>
            {k === 'servizi' ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVIZI.map((s) => (
                  <Button key={s.k} variant="flat" className="h-16 justify-start gap-3 rounded-2xl bg-white/5 px-4" startContent={<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={s.i} s={18} /></span>}>
                    <span className="font-semibold">{s.t}</span>
                  </Button>
                ))}
              </div>
            ) : k === 'contatti' ? (
              <div className="grid gap-3 p-2 sm:grid-cols-3">
                {[['Indirizzo', 'Via dei Peccatori N°761', P.pin], ['Telefono', '113', P.phone], ['Emergenza', 'Chiama il 112', P.alert]].map(([t, v, i]) => (
                  <div key={t} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={i} /></span><div><p className="text-xs uppercase tracking-widest text-default-500">{t}</p><p className="font-semibold">{v}</p></div></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 p-2">
                <p className="text-default-500">Corsi di formazione SISFOR+, percorso di crescita e gestione delle pratiche.</p>
                <Button color="primary" radius="full" className="font-semibold">Area Personale</Button>
              </div>
            )}
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

export const HEROES3 = { m: M, n: N, o: O, p: Pp, q: Q, r: R };
