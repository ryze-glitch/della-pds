'use client';
import { Card, CardBody, Chip, Progress } from '@heroui/react';
import '../manutenzione.css';

function Barriera() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute left-1/2 top-[-62px] -translate-x-1/2"><div className="mz-lamp" /><div className="mx-auto h-4 w-16 rounded-b-lg bg-[#2b3140]" /></div>
      <div className="mz-slat" />
      <div className="mz-slat mt-5" />
      <div className="absolute -bottom-[120px] left-[14%] flex gap-24"><div className="mz-leg" style={{ transform: 'rotate(12deg)' }} /><div className="mz-leg" style={{ transform: 'rotate(-12deg)' }} /></div>
      <div className="absolute -bottom-[120px] right-[14%] flex gap-24"><div className="mz-leg" style={{ transform: 'rotate(12deg)' }} /><div className="mz-leg" style={{ transform: 'rotate(-12deg)' }} /></div>
      <div className="absolute inset-x-0 -bottom-[150px] mx-auto h-10 w-[90%] rounded-[50%] bg-warning/25 blur-2xl" />
    </div>
  );
}

export default function Page() {
  return (
    <div className="mz">
      <div className="mz-glow absolute inset-0" /><div className="mz-grid absolute inset-0" />
      <div className="mz-hz-s absolute inset-x-0 top-0 h-3" />
      <header className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-8">
        <div className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-content1/90 px-5 font-extrabold uppercase tracking-wide"><img src="/crest.png" alt="" className="h-8" />Polizia di Stato</div>
        <Chip color="warning" variant="flat" className="h-10 font-bold uppercase tracking-widest" startContent={<span className="ml-1 h-2 w-2 rounded-full bg-warning" />}>Lavori in corso</Chip>
      </header>
      <main className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-16 px-6 pb-24 pt-24 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[.3em] text-warning"><span className="h-px w-10 bg-warning/60" />Aggiornamento in corso</div>
          <h1 className="text-6xl font-extrabold uppercase leading-[1.02] tracking-tight md:text-7xl">Torniamo <span className="text-warning">presto</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-default-400">Stiamo lavorando al rilascio della nuova versione del sito. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
          <Card className="mt-8 max-w-lg border border-white/10 bg-content1" radius="lg" shadow="none"><CardBody className="gap-3 p-6">
            <div className="flex justify-between text-sm"><span className="font-semibold">Avanzamento lavori</span><span className="text-warning">62%</span></div>
            <Progress aria-label="Avanzamento" value={62} color="warning" size="md" />
            <div className="mt-2 flex flex-wrap gap-2"><Chip size="sm" variant="flat" color="success">Sito pubblico</Chip><Chip size="sm" variant="flat" color="warning">Area Personale</Chip><Chip size="sm" variant="flat" color="default">Dashboard</Chip></div>
          </CardBody></Card>
        </div>
        <div className="pt-20 pb-40"><Barriera /></div>
      </main>
    </div>
  );
}
