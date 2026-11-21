'use client';
import { Card, CardBody, Chip, Progress, Button, Avatar } from '@heroui/react';
import '../manutenzione.css';

export default function Page() {
  return (
    <div className="mz">
      <div className="mz-glow absolute inset-0" /><div className="mz-grid absolute inset-0" />
      <main className="relative z-10 mx-auto grid min-h-screen max-w-[1100px] grid-cols-6 content-center gap-4 px-6 py-16">
        <Card className="col-span-6 overflow-hidden border border-white/10 bg-content1 lg:col-span-4 lg:row-span-2" radius="lg" shadow="none">
          <div className="mz-hz-s h-3" />
          <CardBody className="justify-center gap-4 p-10">
            <Chip color="warning" variant="flat" size="sm" className="font-bold uppercase tracking-widest" startContent={<span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-warning" />}>Aggiornamento in corso</Chip>
            <h1 className="text-5xl font-extrabold uppercase leading-[1.02] tracking-tight md:text-6xl">Stiamo <span className="text-warning">rinnovando</span> il sito</h1>
            <p className="max-w-lg text-default-400">Stiamo lavorando al rilascio della nuova versione. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
          </CardBody>
        </Card>
        <Card className="col-span-3 border border-white/10 bg-content1 lg:col-span-2" radius="lg" shadow="none"><CardBody className="items-center justify-center gap-3 p-6"><img src="/crest.png" alt="" className="h-20" /><div className="text-xs font-bold uppercase tracking-widest text-default-400">Polizia di Stato</div></CardBody></Card>
        <Card className="col-span-3 border border-warning/40 bg-warning/10 lg:col-span-2" radius="lg" shadow="none"><CardBody className="justify-center gap-2 p-6"><div className="text-4xl font-black text-warning">62%</div><Progress aria-label="Avanzamento" value={62} color="warning" size="sm" /><div className="text-xs text-default-400">Avanzamento lavori</div></CardBody></Card>
        <Card className="col-span-6 border border-white/10 bg-content1 lg:col-span-3" radius="lg" shadow="none"><CardBody className="flex-row items-center gap-4 p-6"><Avatar isBordered color="warning" name="D" /><div className="flex-1"><div className="font-bold">Aggiornamenti sul Discord</div><div className="text-sm text-default-400">Ti avvisiamo noi appena riapriamo.</div></div><Button color="warning" variant="flat" radius="full" className="font-semibold">Entra</Button></CardBody></Card>
        <Card className="col-span-6 border border-white/10 bg-content1 lg:col-span-3" radius="lg" shadow="none"><CardBody className="gap-2 p-6"><div className="text-xs font-bold uppercase tracking-widest text-default-400">In aggiornamento</div><div className="flex flex-wrap gap-2"><Chip size="sm" variant="flat" color="warning">Sito pubblico</Chip><Chip size="sm" variant="flat" color="warning">Area Personale</Chip><Chip size="sm" variant="flat" color="warning">Dashboard IPRP</Chip></div></CardBody></Card>
      </main>
    </div>
  );
}
