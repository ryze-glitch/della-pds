'use client';

import { Accordion, AccordionItem, Button, ButtonGroup, Card, CardBody, CardFooter, Chip, Divider, Input, Link } from '@heroui/react';
import { Ic, P, SERVIZI, Sfondo, glass } from './heroes';

// ---- G: bento (titolo grande + riquadri di dimensioni diverse)
function G() {
  return (
    <Sfondo v="G · Bento">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center px-6 pb-20 pt-28">
        <div className="grid gap-3 md:grid-cols-4 md:grid-rows-[auto_auto_auto]">
          <Card className={`${glass} md:col-span-3 md:row-span-2`}>
            <CardBody className="justify-between gap-10 p-8">
              <img src="/crest.png" alt="" className="h-20 w-auto self-start" />
              <div>
                <h1 className="text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-7xl">Polizia<br />di Stato</h1>
                <p className="mt-3 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
              </div>
            </CardBody>
          </Card>
          <Card isPressable isHoverable className="bg-primary text-white shadow-xl shadow-primary/20">
            <CardBody className="justify-between gap-6 p-5"><Ic d={P.file} s={26} /><p className="text-lg font-bold leading-tight">Denuncia online</p></CardBody>
          </Card>
          <Card isPressable isHoverable className={glass}>
            <CardBody className="justify-between gap-6 p-5"><span className="text-primary"><Ic d={P.cal} s={26} /></span><p className="text-lg font-bold leading-tight">Prenota un colloquio</p></CardBody>
          </Card>
          <Card isPressable isHoverable className={glass}>
            <CardBody className="gap-3 p-5"><span className="text-primary"><Ic d={P.shield} s={24} /></span><p className="font-bold">Porto d’armi</p></CardBody>
          </Card>
          <Card isPressable isHoverable className={glass}>
            <CardBody className="gap-3 p-5"><span className="text-primary"><Ic d={P.trophy} s={24} /></span><p className="font-bold">Concorso</p></CardBody>
          </Card>
          <Card className="border border-danger/30 bg-danger/10 md:col-span-2">
            <CardBody className="flex-row items-center gap-4 p-5"><span className="text-danger"><Ic d={P.alert} s={26} /></span><div><p className="text-xs uppercase tracking-widest text-danger">Emergenza reale</p><p className="text-lg font-bold">Chiama il 112</p></div></CardBody>
          </Card>
        </div>
      </section>
    </Sfondo>
  );
}

// ---- H: titolo centrato + ultime notizie
const NOTIZIE = [
  { t: 'Nuovo concorso pubblico', d: 'Aperte le iscrizioni', c: 'Concorso' },
  { t: 'Posto di blocco: nuovo corso', d: 'Formazione SISFOR+', c: 'Formazione' },
  { t: 'Colloqui in sede', d: 'Prenotazioni attive', c: 'Servizi' },
];
function H() {
  return (
    <Sfondo v="H · Titolo + ultime notizie">
      <section className="mx-auto flex min-h-screen max-w-[1100px] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <img src="/crest.png" alt="" className="h-20 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <div className="mt-10 flex w-full items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-default-500">Ultime notizie</p><Link href="#" size="sm" className="text-primary">Vedi tutte →</Link></div>
        <div className="mt-3 grid w-full gap-3 md:grid-cols-3">
          {NOTIZIE.map((n) => (
            <Card key={n.t} isPressable isHoverable className={`${glass} text-left`}>
              <CardBody className="gap-3 p-5">
                <Chip size="sm" variant="flat" color="primary">{n.c}</Chip>
                <p className="text-lg font-bold leading-snug">{n.t}</p>
                <p className="text-sm text-default-500">{n.d}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-default-400">(titoli di esempio)</p>
      </section>
    </Sfondo>
  );
}

// ---- I: tipografica, titolo gigante
function I() {
  return (
    <Sfondo v="I · Tipografica gigante">
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-20 pt-28">
        <img src="/crest.png" alt="" aria-hidden="true" className="absolute -right-10 top-1/2 hidden h-[640px] w-auto -translate-y-1/2 opacity-[0.12] md:block" />
        <div className="relative mx-auto w-full max-w-[1300px]">
          <Chip variant="bordered" className="border-white/20" startContent={<img src="/crest.png" alt="" className="ml-1 h-4 w-auto" />}>Questura IPRP · Italian Paradise XI</Chip>
          <h1 className="mt-6 text-[clamp(3.5rem,13vw,11rem)] font-black uppercase leading-[0.9] tracking-tight">Polizia<br /><span className="text-primary">di Stato</span></h1>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Scopri i servizi</Button>
            <span className="text-sm text-default-500">Via dei Peccatori N°761 · Tel. 113</span>
          </div>
        </div>
      </section>
    </Sfondo>
  );
}

// ---- J: titolo + servizi a fisarmonica
function J() {
  const dettagli = {
    den: 'Compila il modulo, allega le prove e ricevi un codice per seguire la pratica.',
    arm: 'Richiedi il porto d’armi o il rinnovo: requisiti, documenti e stato della richiesta.',
    col: 'Scegli il giorno e l’orario del colloquio con un agente della Questura.',
    con: 'Requisiti, prove e iscrizione al concorso pubblico per entrare in Polizia.',
  };
  return (
    <Sfondo v="J · Servizi a fisarmonica">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-2">
        <div>
          <img src="/crest.png" alt="" className="h-20 w-auto" />
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-6xl">Polizia<br />di Stato</h1>
          <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        </div>
        <Card className={glass}>
          <CardBody className="p-2">
            <Accordion variant="light" selectionMode="single" defaultExpandedKeys={['den']} itemClasses={{ title: 'font-semibold', content: 'pb-4 text-default-500', trigger: 'px-3 py-3' }}>
              {SERVIZI.map((s) => (
                <AccordionItem key={s.k} aria-label={s.t} title={s.t} startContent={<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={s.i} s={18} /></span>}>
                  <p>{dettagli[s.k]}</p>
                  <Button color="primary" size="sm" radius="full" className="mt-3 font-semibold">Vai al servizio</Button>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

// ---- K: due porte (Cittadini / Agenti) + banner emergenza
function K() {
  return (
    <Sfondo v="K · Due porte + emergenza">
      <section className="mx-auto flex min-h-screen max-w-[1000px] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <Chip color="danger" variant="flat" size="lg" startContent={<Ic d={P.alert} s={16} />} className="mb-8">In caso di emergenza reale chiama il 112</Chip>
        <img src="/crest.png" alt="" className="h-20 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <div className="mt-10 grid w-full gap-3 md:grid-cols-2">
          <Card isPressable isHoverable className={`${glass} text-left`}>
            <CardBody className="gap-2 p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Sono un cittadino</p><p className="text-2xl font-bold">Denunce, colloqui, pratiche</p><p className="text-default-500">Tutti i servizi della Questura, online.</p></CardBody>
            <CardFooter className="px-6 pb-6 pt-0"><Button color="primary" radius="full" className="font-semibold" endContent={<Ic d={P.arrow} s={16} />}>Entra nei servizi</Button></CardFooter>
          </Card>
          <Card isPressable isHoverable className={`${glass} text-left`}>
            <CardBody className="gap-2 p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Sono un agente</p><p className="text-2xl font-bold">Area personale e formazione</p><p className="text-default-500">Corsi SISFOR+, percorso e gestione pratiche.</p></CardBody>
            <CardFooter className="px-6 pb-6 pt-0"><Button variant="bordered" radius="full" className="border-white/20 font-semibold" endContent={<Ic d={P.arrow} s={16} />}>Area Personale</Button></CardFooter>
          </Card>
        </div>
      </section>
    </Sfondo>
  );
}

// ---- L: controlla lo stato della pratica
function L() {
  return (
    <Sfondo v="L · Stato della pratica">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-[1.1fr_1fr]">
        <div>
          <img src="/crest.png" alt="" className="h-24 w-auto drop-shadow-2xl" />
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-7xl">Polizia<br />di Stato</h1>
          <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
          <ButtonGroup radius="full" className="mt-8">
            <Button color="primary" className="font-semibold">Denuncia</Button>
            <Button variant="bordered" className="border-white/20 font-semibold">Porto d’armi</Button>
            <Button variant="bordered" className="border-white/20 font-semibold">Colloquio</Button>
          </ButtonGroup>
        </div>
        <Card className={glass}>
          <CardBody className="gap-4 p-6">
            <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Hai già una pratica?</p><p className="mt-1 text-2xl font-bold">Controlla lo stato</p></div>
            <Input aria-label="Codice pratica" label="Codice pratica" placeholder="es. PDS-2026-0042" variant="bordered" radius="lg" classNames={{ inputWrapper: 'border-white/20' }} startContent={<Ic d={P.search} s={16} />} />
            <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Controlla</Button>
            <Divider />
            <p className="text-xs text-default-500">Il codice ti viene mostrato al momento dell’invio della denuncia o della richiesta.</p>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

export const HEROES2 = { g: G, h: H, i: I, j: J, k: K, l: L };
