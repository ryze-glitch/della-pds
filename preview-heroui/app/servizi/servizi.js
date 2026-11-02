'use client';

import { useState } from 'react';
import {
  Accordion, AccordionItem, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Link, ScrollShadow, Tab, Tabs,
} from '@heroui/react';

export const Ic = ({ d, s = 18 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const ARROW = 'M5 12h14M13 6l6 6-6 6';
export const CHECK = 'm5 12 5 5 9-10';

export const SV = [
  { k: 'urp', t: 'Ufficio Relazioni col Pubblico', n: 'URP', img: '/foto/ufficidesk.jpg', href: 'urp.html',
    s: "L'Ufficio URP della Polizia di Stato di Roma svolge diverse funzioni fondamentali per il servizio al cittadino.",
    extra: [] },
  { k: 'arm', t: "Porto d'armi", n: 'Licenze', img: '/foto/porto-darmi.jpg', href: 'porto-armi.html',
    s: 'Requisiti e procedura per ottenere il porto d’armi.',
    extra: ['Fedina penale pulita, sia al ritiro che al rilascio', 'Essere maggiorenni', 'Idoneità: certificato anamnestico e test balistico', 'Una ragione valida e motivata che giustifichi il bisogno di andare armati'] },
  { k: 'den', t: 'Denuncia, querela, esposto', n: 'Denuncia', img: '/foto/denuncia.jpg', href: 'denuncia.html',
    s: 'Recati al desk della Questura di Roma: gli operatori accoglieranno la tua deposizione.',
    extra: ['In assenza di operatori prendi una prenotazione.', 'Se la prenotazione viene confermata, recati in Questura nella data prestabilita.'] },
  { k: 'con', t: 'Bando di concorso', n: 'Concorso', img: '/foto/bando.jpg', href: 'concorso.html',
    s: 'Prenota un colloquio o recati in Questura specificando intenzione, motivazioni e persona con cui vuoi parlare.',
    extra: [] },
];
export const FAQ = [
  ["Come richiedere l'autorizzazione per un evento", 'prenotazioni.html'],
  ['Come faccio la licenza armi?', 'porto-armi.html'],
  ['Come faccio a candidarmi?', 'concorso.html'],
];

export const glass = 'border border-white/10 bg-content1/60 shadow-xl shadow-black/40 backdrop-blur-2xl';
const Titolo = () => (
  <h2 className="mb-10 text-center text-4xl font-extrabold uppercase tracking-wide sm:text-5xl">I nostri <span className="text-primary">servizi</span></h2>
);
export const Pagina = ({ children, v }) => (
  <div className="relative min-h-screen overflow-hidden px-6 py-20">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.18),transparent_55%)]" />
    <div className="relative mx-auto max-w-[1200px]"><Titolo />{children}</div>
    <p className="relative mx-auto mt-12 w-fit rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">{v}</p>
  </div>
);
export const FaqBox = ({ className = '' }) => (
  <Card className={`${glass} ${className}`}><CardBody className="gap-3 p-5">
    <p className="font-bold">Domande più frequenti</p>
    {FAQ.map(([q, h]) => <Link key={q} href={h} size="sm" className="justify-between text-foreground">{q}<Ic d={ARROW} s={14} /></Link>)}
  </CardBody></Card>
);

// ---- S1: schede uniformi con foto, descrizione breve e pulsante
function S1() {
  return (
    <Pagina v="S1 · Schede uniformi">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SV.map((s) => (
          <Card key={s.k} isHoverable className={`${glass} overflow-hidden`}>
            <Image removeWrapper alt={s.t} src={s.img} className="z-0 h-44 w-full object-cover" radius="none" />
            <CardBody className="gap-3 p-5">
              <Chip size="sm" variant="flat" color="primary">{s.n}</Chip>
              <p className="text-lg font-bold leading-snug">{s.t}</p>
              <p className="text-sm text-default-500">{s.s}</p>
            </CardBody>
            <CardFooter className="px-5 pb-5 pt-0"><Button as={Link} href={s.href} color="primary" variant="flat" radius="full" size="sm" className="font-semibold" endContent={<Ic d={ARROW} s={14} />}>Apri la pagina</Button></CardFooter>
          </Card>
        ))}
      </div>
      <FaqBox className="mt-4" />
    </Pagina>
  );
}

// ---- S2: bento con foto a tutta scheda e testo sovrapposto
function S2() {
  const f = (s, cls) => (
    <Card key={s.k} isFooterBlurred isPressable className={`${cls} border border-white/10`}>
      <Image removeWrapper alt={s.t} src={s.img} className="z-0 h-full w-full object-cover" radius="none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <CardFooter className="absolute inset-x-0 bottom-0 z-10 flex-col items-start gap-1 border-0 bg-transparent p-5 text-left">
        <p className="text-xl font-bold">{s.t}</p>
        <p className="line-clamp-2 text-sm text-white/70">{s.s}</p>
      </CardFooter>
    </Card>
  );
  return (
    <Pagina v="S2 · Bento con foto">
      <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2">
        {f(SV[2], 'min-h-[260px] md:col-span-2 md:row-span-2')}
        {f(SV[0], 'min-h-[200px] md:col-span-2')}
        {f(SV[1], 'min-h-[200px]')}
        {f(SV[3], 'min-h-[200px]')}
      </div>
      <FaqBox className="mt-3" />
    </Pagina>
  );
}

// ---- S3: elenco a schede verticali + dettaglio
function S3() {
  const [k, setK] = useState('den');
  const s = SV.find((x) => x.k === k) || SV[0];
  return (
    <Pagina v="S3 · Schede laterali + dettaglio">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Tabs aria-label="Servizi" isVertical selectedKey={k} onSelectionChange={setK} radius="lg" size="lg" classNames={{ base: 'w-full', tabList: `${glass} w-full p-2`, tab: 'h-12 justify-start px-4', cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white font-semibold' }}>
          {SV.map((x) => <Tab key={x.k} title={x.n} />)}
        </Tabs>
        <Card className={`${glass} overflow-hidden`}>
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <Image removeWrapper alt={s.t} src={s.img} className="h-full min-h-[260px] w-full object-cover" radius="none" />
            <CardBody className="gap-4 p-7">
              <p className="text-2xl font-bold">{s.t}</p>
              <p className="text-default-500">{s.s}</p>
              {s.extra.length ? <ul className="flex flex-col gap-2">{s.extra.map((e) => <li key={e} className="flex gap-2 text-sm"><span className="mt-0.5 text-primary"><Ic d={CHECK} s={16} /></span>{e}</li>)}</ul> : null}
              <Button as={Link} href={s.href} color="primary" radius="full" className="mt-auto w-fit font-semibold" endContent={<Ic d={ARROW} s={16} />}>Apri la pagina</Button>
            </CardBody>
          </div>
        </Card>
      </div>
      <FaqBox className="mt-4" />
    </Pagina>
  );
}

// ---- S4: fisarmonica a sinistra, foto a destra
function S4() {
  const [k, setK] = useState('den');
  const s = SV.find((x) => x.k === k) || SV[0];
  return (
    <Pagina v="S4 · Fisarmonica + foto">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className={glass}><CardBody className="p-2">
          <Accordion variant="light" selectedKeys={new Set([k])} onSelectionChange={(sel) => { const v = [...sel][0]; if (v) setK(v); }} itemClasses={{ title: 'font-semibold', trigger: 'px-3 py-4', content: 'pb-4 text-default-500' }}>
            {SV.map((x) => (
              <AccordionItem key={x.k} aria-label={x.t} title={x.t}>
                <p>{x.s}</p>
                {x.extra.length ? <ul className="mt-2 list-disc pl-5 text-sm">{x.extra.map((e) => <li key={e}>{e}</li>)}</ul> : null}
                <Button as={Link} href={x.href} size="sm" color="primary" radius="full" className="mt-3 font-semibold">Apri la pagina</Button>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody></Card>
        <Card className="overflow-hidden border border-white/10 lg:sticky lg:top-8">
          <Image removeWrapper alt={s.t} src={s.img} className="aspect-[4/3] w-full object-cover" radius="none" />
        </Card>
      </div>
      <FaqBox className="mt-4" />
    </Pagina>
  );
}

// ---- S5: carosello orizzontale di schede alte
function S5() {
  return (
    <Pagina v="S5 · Carosello">
      <ScrollShadow orientation="horizontal" hideScrollBar className="-mx-6 px-6">
        <div className="flex w-max gap-4 pb-2">
          {[...SV, { k: 'faq', faq: true }].map((s) => s.faq ? (
            <Card key="faq" className={`${glass} h-[420px] w-[300px] flex-none`}><CardBody className="justify-between p-6">
              <div><Chip size="sm" variant="flat" color="primary">FAQ</Chip><p className="mt-4 text-2xl font-bold leading-snug">Domande più frequenti</p></div>
              <div className="flex flex-col gap-3">{FAQ.map(([q, h]) => <Link key={q} href={h} size="sm" className="justify-between text-foreground">{q}<Ic d={ARROW} s={14} /></Link>)}</div>
            </CardBody></Card>
          ) : (
            <Card key={s.k} isPressable className="h-[420px] w-[300px] flex-none border border-white/10">
              <Image removeWrapper alt={s.t} src={s.img} className="z-0 h-full w-full object-cover" radius="none" />
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <CardFooter className="absolute inset-x-0 bottom-0 z-10 flex-col items-start gap-2 border-0 bg-transparent p-5 text-left">
                <Chip size="sm" color="primary">{s.n}</Chip>
                <p className="text-xl font-bold leading-snug">{s.t}</p>
                <p className="line-clamp-3 text-sm text-white/70">{s.s}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollShadow>
    </Pagina>
  );
}

// ---- S6: righe alternate foto / testo
function S6() {
  return (
    <Pagina v="S6 · Righe alternate">
      <div className="flex flex-col gap-6">
        {SV.map((s, i) => (
          <Card key={s.k} className={`${glass} overflow-hidden`}>
            <div className={`grid md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <Image removeWrapper alt={s.t} src={s.img} className="h-full min-h-[220px] w-full object-cover" radius="none" />
              <CardBody className="justify-center gap-3 p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">0{i + 1} · {s.n}</p>
                <p className="text-2xl font-bold">{s.t}</p>
                <p className="text-default-500">{s.s}</p>
                {s.extra.length ? <ul className="flex flex-col gap-1.5">{s.extra.map((e) => <li key={e} className="flex gap-2 text-sm"><span className="mt-0.5 text-primary"><Ic d={CHECK} s={16} /></span>{e}</li>)}</ul> : null}
                <Button as={Link} href={s.href} color="primary" radius="full" className="mt-2 w-fit font-semibold" endContent={<Ic d={ARROW} s={16} />}>Apri la pagina</Button>
              </CardBody>
            </div>
          </Card>
        ))}
        <FaqBox />
      </div>
    </Pagina>
  );
}

export const SEZIONI = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6 };
