'use client';
import { Card, CardBody, Chip, Progress, Button } from '@heroui/react';
import '../manutenzione.css';

const RIGA = 'Lavori in corso ✦ Area non accessibile ✦ Lavori in corso ✦ Area non accessibile ✦ Lavori in corso ✦ Area non accessibile ✦ Lavori in corso ✦ Area non accessibile ✦ ';

export default function Page() {
  return (
    <div className="mz">
      <img src="/foto/giuramento-header.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090f]/70 via-[#07090f]/85 to-[#07090f]" />
      <div className="mz-glow absolute inset-0" />
      <div className="mz-tape" style={{ top: '22%', transform: 'rotate(-5deg)' }}>{RIGA}</div>
      <div className="mz-tape" style={{ top: '74%', transform: 'rotate(4deg)' }}>{RIGA}</div>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-xl border border-white/10 bg-content1" radius="lg" shadow="lg">
          <CardBody className="items-center gap-4 px-10 py-12 text-center">
            <img src="/crest.png" alt="" className="h-20 w-auto" />
            <Chip color="warning" variant="flat" size="sm" className="font-bold uppercase tracking-widest" startContent={<span className="ml-1 h-2 w-2 rounded-full bg-warning" />}>Aggiornamento in corso</Chip>
            <h1 className="text-5xl font-extrabold uppercase tracking-tight">Sito in <span className="text-warning">manutenzione</span></h1>
            <p className="max-w-md text-default-400">Stiamo lavorando al rilascio della nuova versione del sito. Il ritorno online è previsto a breve: grazie per la pazienza.</p>
            <Progress aria-label="Avanzamento" isIndeterminate color="warning" size="sm" className="mt-2 max-w-xs" />
            <Button as="a" href="#" color="warning" variant="flat" radius="full" className="mt-2 font-semibold">Entra nel Discord</Button>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
