import Link from 'next/link';

export const metadata = { title: 'Pagina non trovata — Questura IPRP' };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <img src="/assets/crest-md.png" alt="" className="h-24 w-auto" />
      <p className="mt-8 font-mono text-sm text-muted">Errore 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Pagina non trovata</h1>
      <p className="mt-3 max-w-md text-muted">Il fascicolo che cerchi non esiste o è stato spostato. Torna alla home e riparti da lì.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-fg transition hover:brightness-110">
        Torna alla home
      </Link>
    </main>
  );
}
