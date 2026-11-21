'use client';
import { Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import '../manutenzione.css';

const LOG = [['ok', 'Backup dei dati completato'], ['ok', 'Nuova versione caricata'], ['run', 'Aggiornamento di Area Personale e Dashboard'], ['wait', 'Verifica degli accessi Discord'], ['wait', 'Riapertura del sito']];
const COL = { ok: 'text-success', run: 'text-warning', wait: 'text-default-500' };
const SIM = { ok: '✓', run: '›', wait: '·' };

export default function Page() {
  return (
    <div className="mz">
      <div className="mz-glow absolute inset-0" /><div className="mz-grid absolute inset-0" />
      <div className="mz-hz-s absolute inset-x-0 top-0 h-3" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-[980px] flex-col justify-center gap-8 px-6 py-20">
        <div className="flex items-center gap-4"><img src="/crest.png" alt="" className="h-14" /><div><div className="text-xs font-bold uppercase tracking-[.3em] text-warning">Polizia di Stato · IPRP XI</div><h1 className="text-5xl font-extrabold uppercase tracking-tight">Sito in <span className="text-warning">manutenzione</span></h1></div></div>
        <Card className="border border-white/10 bg-[#0b0d12]" radius="lg" shadow="lg">
          <CardHeader className="flex items-center justify-between border-b border-white/10 px-6 py-3">
            <div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-danger/80" /><span className="h-3 w-3 rounded-full bg-warning/80" /><span className="h-3 w-3 rounded-full bg-success/80" /></div>
            <span className="mz-term text-xs text-default-500">aggiornamento.log</span>
            <Chip size="sm" color="warning" variant="flat">in corso</Chip>
          </CardHeader>
          <CardBody className="mz-term gap-2 px-6 py-6 text-sm">
            {LOG.map(([s, t], i) => <div key={i} className={`flex gap-3 ${COL[s]}`}><span className="w-4">{SIM[s]}</span><span className={s === 'wait' ? '' : 'text-foreground'}>{t}{s === 'run' && <span className="ml-1 animate-pulse text-warning">▍</span>}</span></div>)}
            <Progress aria-label="Avanzamento" value={62} color="warning" size="sm" className="mt-4" />
            <div className="text-xs text-default-500">62% · il ritorno online è previsto a breve, grazie per la pazienza.</div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
