'use client';

import { useState } from 'react';
import {
  Button, Card, CardBody, CardFooter, Chip, Divider, Image, Link, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure,
} from '@heroui/react';
import { ARROW, CHECK, FAQ, FaqBox, Ic, Pagina, SV, glass } from './servizi';

// ---- S7: colonne che si allargano al passaggio del mouse
function S7() {
  return (
    <Pagina v="S7 · Colonne che si espandono">
      <div className="flex flex-col gap-3 lg:h-[460px] lg:flex-row">
        {SV.map((s) => (
          <Card key={s.k} isPressable className="group relative min-h-[180px] flex-1 border border-white/10 transition-[flex-grow] duration-500 lg:hover:flex-[2.6]">
            <Image removeWrapper alt={s.t} src={s.img} className="z-0 h-full w-full object-cover" radius="none" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <CardFooter className="absolute inset-x-0 bottom-0 z-10 flex-col items-start gap-2 border-0 bg-transparent p-5 text-left">
              <Chip size="sm" color="primary">{s.n}</Chip>
              <p className="text-xl font-bold leading-snug">{s.t}</p>
              <p className="max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-500 lg:group-hover:max-h-24 lg:group-hover:opacity-100">{s.s}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <FaqBox className="mt-3" />
    </Pagina>
  );
}

// ---- S8: elenco editoriale numerato con titolo fisso a sinistra
function S8() {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(37,99,235,0.18),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[320px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-4xl font-extrabold uppercase leading-tight tracking-wide sm:text-5xl">I nostri <span className="text-primary">servizi</span></h2>
          <p className="mt-4 text-default-500">Tutto quello che puoi fare con la Questura, in un colpo d’occhio.</p>
        </div>
        <div>
          {SV.map((s, i) => (
            <div key={s.k}>
              <Link href={s.href} className="group flex w-full items-center gap-5 py-6 text-foreground">
                <span className="w-10 text-sm font-semibold text-default-500">0{i + 1}</span>
                <div className="flex-1"><p className="text-2xl font-bold group-hover:text-primary">{s.t}</p><p className="mt-1 text-sm text-default-500">{s.s}</p></div>
                <Image alt="" src={s.img} width={120} height={80} radius="lg" className="hidden object-cover sm:block" />
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:bg-primary"><Ic d={ARROW} s={18} /></span>
              </Link>
              <Divider />
            </div>
          ))}
          <FaqBox className="mt-8" />
        </div>
      </div>
      <p className="relative mx-auto mt-12 w-fit rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">S8 · Elenco editoriale</p>
    </div>
  );
}

// ---- S9: schede orizzontali + grande banner con la foto
function S9() {
  const [k, setK] = useState('den');
  const s = SV.find((x) => x.k === k) || SV[0];
  return (
    <Pagina v="S9 · Schede in alto + banner">
      <Tabs aria-label="Servizi" selectedKey={k} onSelectionChange={setK} radius="full" size="lg" className="mb-5 justify-center" classNames={{ base: 'justify-center', tabList: `${glass} p-1.5`, cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white font-semibold' }}>
        {SV.map((x) => <Tab key={x.k} title={x.n} />)}
      </Tabs>
      <Card className="relative min-h-[420px] overflow-hidden border border-white/10">
        <Image removeWrapper alt={s.t} src={s.img} className="z-0 h-full w-full object-cover" radius="none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <CardBody className="absolute inset-0 z-10 max-w-xl justify-center gap-4 p-8 sm:p-12">
          <p className="text-3xl font-extrabold sm:text-4xl">{s.t}</p>
          <p className="text-white/75">{s.s}</p>
          {s.extra.length ? <ul className="flex flex-col gap-2">{s.extra.map((e) => <li key={e} className="flex gap-2 text-sm"><span className="mt-0.5 text-primary"><Ic d={CHECK} s={16} /></span>{e}</li>)}</ul> : null}
          <Button as={Link} href={s.href} color="primary" radius="full" size="lg" className="w-fit font-semibold" endContent={<Ic d={ARROW} s={16} />}>Apri la pagina</Button>
        </CardBody>
      </Card>
      <FaqBox className="mt-4" />
    </Pagina>
  );
}

// ---- S10: servizio in evidenza + elenco con miniature
function S10() {
  const [grande, ...resto] = [SV[2], SV[0], SV[1], SV[3]];
  return (
    <Pagina v="S10 · In evidenza + elenco">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className={`${glass} overflow-hidden`}>
          <Image removeWrapper alt={grande.t} src={grande.img} className="h-64 w-full object-cover" radius="none" />
          <CardBody className="gap-3 p-6">
            <Chip size="sm" color="primary" variant="flat">Il più richiesto</Chip>
            <p className="text-2xl font-bold">{grande.t}</p>
            <p className="text-default-500">{grande.s}</p>
            <ul className="flex flex-col gap-1.5">{grande.extra.map((e) => <li key={e} className="flex gap-2 text-sm"><span className="mt-0.5 text-primary"><Ic d={CHECK} s={16} /></span>{e}</li>)}</ul>
          </CardBody>
          <CardFooter className="px-6 pb-6 pt-0"><Button as={Link} href={grande.href} color="primary" radius="full" className="font-semibold" endContent={<Ic d={ARROW} s={16} />}>Fai una denuncia</Button></CardFooter>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className={glass}><CardBody className="p-2">
            <Listbox aria-label="Altri servizi" itemClasses={{ base: 'gap-4 rounded-2xl px-3 py-3 data-[hover=true]:bg-white/10', title: 'font-semibold', description: 'line-clamp-2 text-default-500' }}>
              {resto.map((s) => (
                <ListboxItem key={s.k} href={s.href} description={s.s} startContent={<Image alt="" src={s.img} width={72} height={56} radius="md" className="object-cover" />} endContent={<Ic d={ARROW} s={16} />}>{s.t}</ListboxItem>
              ))}
            </Listbox>
          </CardBody></Card>
          <FaqBox />
        </div>
      </div>
    </Pagina>
  );
}

// ---- S11: schede piccole che aprono una finestra con i dettagli
function S11() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [s, setS] = useState(SV[0]);
  return (
    <Pagina v="S11 · Finestra con i dettagli (clicca una scheda)">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SV.map((x) => (
          <Card key={x.k} isPressable isHoverable onPress={() => { setS(x); onOpen(); }} className={`${glass} overflow-hidden`}>
            <Image removeWrapper alt={x.t} src={x.img} className="h-36 w-full object-cover" radius="none" />
            <CardBody className="gap-1 p-4 text-left"><p className="font-bold leading-snug">{x.t}</p><p className="flex items-center gap-1 text-sm text-primary">Dettagli <Ic d={ARROW} s={14} /></p></CardBody>
          </Card>
        ))}
      </div>
      <FaqBox className="mt-4" />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur" scrollBehavior="inside" classNames={{ base: 'border border-white/10 bg-content1' }}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex-col gap-1"><Chip size="sm" color="primary" variant="flat" className="w-fit">{s.n}</Chip>{s.t}</ModalHeader>
              <ModalBody>
                <Image alt={s.t} src={s.img} className="mb-2 h-52 w-full object-cover" radius="lg" removeWrapper />
                <p className="text-default-500">{s.s}</p>
                {s.extra.length ? <ul className="flex flex-col gap-2">{s.extra.map((e) => <li key={e} className="flex gap-2 text-sm"><span className="mt-0.5 text-primary"><Ic d={CHECK} s={16} /></span>{e}</li>)}</ul> : null}
              </ModalBody>
              <ModalFooter><Button variant="light" radius="full" onPress={close}>Chiudi</Button><Button as={Link} href={s.href} color="primary" radius="full" className="font-semibold">Apri la pagina</Button></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Pagina>
  );
}

// ---- S12: griglia minimale solo testo + icone, la foto compare nel riquadro grande
const ICONE = { urp: 'M4 21V9l8-5 8 5v12M9 21v-6h6v6', arm: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', den: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6', con: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a3 3 0 0 0 3 3M16 6h4v2a3 3 0 0 1-3 3M12 13v4M8 21h8' };
function S12() {
  return (
    <Pagina v="S12 · Griglia con icone">
      <div className="grid gap-4 md:grid-cols-2">
        {SV.map((s) => (
          <Card key={s.k} isPressable isHoverable className={glass}>
            <CardBody className="flex-row items-start gap-5 p-6 text-left">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ic d={ICONE[s.k]} s={26} /></span>
              <div className="flex-1"><p className="text-xl font-bold">{s.t}</p><p className="mt-1 text-default-500">{s.s}</p><p className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary">Apri la pagina <Ic d={ARROW} s={14} /></p></div>
            </CardBody>
          </Card>
        ))}
      </div>
      <FaqBox className="mt-4" />
    </Pagina>
  );
}

export const SEZIONI2 = { s7: S7, s8: S8, s9: S9, s10: S10, s11: S11, s12: S12 };
