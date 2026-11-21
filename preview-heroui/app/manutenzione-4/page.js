'use client';
import { Card, CardBody, Chip, Progress, Button } from '@heroui/react';
import '../manutenzione.css';

export default function Page() {
  return (
    <div className="mz">
      <img src="/foto/polizia.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090f]/60 to-[#07090f]" /><div className="mz-glow absolute inset-0" />
      <header className="relative z-10 mx-auto flex max-w-[1300px] items-center justify-between px-6 pt-8">
        <div className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-content1/90 px-5 font-extrabold uppercase tracking-wide"><img src="/crest.png" alt="" className="h-8" />Polizia di Stato</div>
        <Chip color="warning" variant="bordered" className="h-10 font-bold uppercase tracking-widest" startContent={<span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-warning" />}>Lavori in corso</Chip>
      </header>
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-[1300px] flex-col justify-center px-6 pb-16">
        <div className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[.3em] text-warning"><span className="h-px w-10 bg-warning/60" />Aggiornamento in corso</div>
        <h1 className="mz-txt-hz text-[clamp(2.4rem,8.6vw,9rem)] font-black uppercase leading-[.92] tracking-tight">In manutenzione</h1>
        <div className="mz-hz-s mt-6 h-5 w-full rounded-full" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <p className="max-w-xl text-lg leading-relaxed text-default-300">Stiamo lavorando al rilascio della nuova versione del sito. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
          <Card className="border border-white/10 bg-content1/90" radius="lg" shadow="none"><CardBody className="gap-3 p-6">
            <div className="flex justify-between text-sm"><span className="font-semibold">Avanzamento lavori</span><span className="text-warning">62%</span></div>
            <Progress aria-label="Avanzamento" value={62} color="warning" />
            <Button as="a" href="#" color="warning" variant="flat" radius="full" className="mt-2 w-fit font-semibold">Entra nel Discord</Button>
          </CardBody></Card>
        </div>
      </main>
    </div>
  );
}
