'use client';
import { Card, CardBody, Chip, Divider } from '@heroui/react';
import '../manutenzione.css';

const RIGHE = [['Sito pubblico', 'In aggiornamento'], ['Area Personale', 'In aggiornamento'], ['Dashboard IPRP', 'In aggiornamento']];

export default function Page() {
  return (
    <div className="mz flex flex-col">
      <div className="mz-glow absolute inset-0" /><div className="mz-grid absolute inset-0" />
      <div className="mz-hz h-6 w-full" />
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-2xl border-2 border-warning/70 bg-content1" radius="lg" shadow="lg">
          <div className="mz-hz-s h-3 w-full" />
          <CardBody className="gap-6 p-10">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-warning text-black">
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
              </div>
              <div><div className="text-xs font-bold uppercase tracking-[.3em] text-warning">Aggiornamento in corso</div><h1 className="mt-1 text-4xl font-extrabold uppercase tracking-tight">Sito in manutenzione</h1></div>
            </div>
            <p className="text-default-400">Stiamo lavorando al rilascio della nuova versione del sito. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
            <Divider />
            <ul className="flex flex-col gap-3">
              {RIGHE.map(([n, s]) => (
                <li key={n} className="flex items-center justify-between rounded-xl bg-content2 px-5 py-3.5"><span className="font-semibold">{n}</span><Chip color="warning" variant="flat" size="sm" startContent={<span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />}>{s}</Chip></li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-default-500"><span>Polizia di Stato — Italian Paradise RP</span><img src="/crest.png" alt="" className="h-7 opacity-80" /></div>
          </CardBody>
          <div className="mz-hz-s h-3 w-full" />
        </Card>
      </main>
      <div className="mz-hz h-6 w-full" />
    </div>
  );
}
