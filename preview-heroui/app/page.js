'use client';

import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from '@heroui/react';

const Discord = (props) => (
  <svg viewBox="0 0 24 18" fill="none" aria-hidden="true" width="22" height="22" {...props}>
    <path fill="currentColor" d="M20.3 1.8A19.5 19.5 0 0 0 15.6.3a.07.07 0 0 0-.08.04c-.2.36-.43.83-.59 1.2a18 18 0 0 0-5.4 0 12 12 0 0 0-.6-1.2.08.08 0 0 0-.08-.04A19.4 19.4 0 0 0 3.9 1.8a.07.07 0 0 0-.03.03C.9 6.3.1 10.6.5 14.9a.08.08 0 0 0 .03.06 19.6 19.6 0 0 0 5.9 3 .08.08 0 0 0 .08-.03c.46-.62.86-1.28 1.2-1.97a.08.08 0 0 0-.04-.1 12.9 12.9 0 0 1-1.85-.88.08.08 0 0 1 0-.13c.12-.1.25-.2.37-.29a.07.07 0 0 1 .08 0c3.9 1.77 8.1 1.77 11.94 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .13c-.59.34-1.21.63-1.85.87a.08.08 0 0 0-.04.11c.35.68.76 1.34 1.2 1.96a.08.08 0 0 0 .08.03 19.5 19.5 0 0 0 5.93-3 .08.08 0 0 0 .03-.05c.5-4.97-.83-9.24-3.5-13.06a.06.06 0 0 0-.03-.03zM8.02 12.3c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.95 2.41-2.15 2.41zm7.97 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.33.95-2.41 2.15-2.41 1.21 0 2.17 1.09 2.15 2.4 0 1.33-.94 2.41-2.15 2.41z" />
  </svg>
);

export default function Login({ searchParams }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(37,99,235,0.35),transparent_60%)]" />
      <Card className="relative w-full max-w-md border border-white/10 bg-content1/80 backdrop-blur-xl" shadow="lg" radius="lg">
        <CardHeader className="flex-col items-center gap-4 px-8 pb-2 pt-10 text-center">
          <img src="/crest.png" alt="Stemma della Polizia di Stato IPRP" className="h-24 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]" />
          <Chip color="primary" variant="flat" size="sm" startContent={<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>} classNames={{ content: 'font-semibold' }}>
            Accesso riservato
          </Chip>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            Area <span className="text-primary">riservata</span>
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-default-500">
            Accedi con il tuo account Discord per studiare i corsi, seguire le tue abilitazioni e gestire le pratiche.
          </p>
        </CardHeader>
        <CardBody className="gap-4 px-8 py-6">
          <Alert color="danger" variant="faded" title="Account non registrato" description="Il tuo account Discord non risulta tra gli agenti. Contatta un amministratore." />
          <Button size="lg" radius="full" className="h-14 w-full bg-[#4752c4] text-base font-semibold text-white" startContent={<Discord />}>
            Continua con Discord
          </Button>
        </CardBody>
        <Divider className="mx-auto w-[85%]" />
        <CardFooter className="flex-col gap-1 px-8 pb-8 pt-4 text-center text-xs text-default-500">
          <p>Possono accedere solo gli agenti registrati dall’amministrazione.</p>
          <Link href="#" size="sm" className="mt-1">← Torna al sito</Link>
        </CardFooter>
      </Card>
    </main>
  );
}
