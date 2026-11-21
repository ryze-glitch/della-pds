'use client';
import { Chip, Progress } from '@heroui/react';
import '../manutenzione.css';

export default function Page() {
  return (
    <div className="mz">
      <div className="mz-glow absolute inset-0" /><div className="mz-grid absolute inset-0" />
      <div className="mz-hz absolute inset-x-0 bottom-0 h-5" />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        <div className="mz-sign"><div><div className="text-sm tracking-[.3em]">Attenzione</div><div className="mt-2 text-5xl">Lavori</div><div className="text-5xl">in corso</div></div></div>
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3"><img src="/crest.png" alt="" className="h-10" /><span className="text-sm font-extrabold uppercase tracking-widest text-default-300">Polizia di Stato</span></div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight md:text-5xl">Sito in <span className="text-warning">manutenzione</span></h1>
          <p className="max-w-md text-default-400">Stiamo lavorando al rilascio della nuova versione del sito. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
          <Progress aria-label="Avanzamento" isIndeterminate color="warning" size="sm" className="mt-2 w-72" />
          <Chip size="sm" variant="flat" color="warning" className="mt-1 font-semibold">Torniamo online a breve</Chip>
        </div>
      </main>
    </div>
  );
}
