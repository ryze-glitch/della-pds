'use client';

import Link from 'next/link';
import { Btn, Container, Label } from '../../components/ui';
import { useAgentProfile } from '../../components/useAgentProfile';

const TURNI = [
  ['Lun 31 Ago', 'Reparto Volanti — Centro Città, 18:00–22:00', true],
  ['Mer 2 Set', 'Polizia Stradale — Zona Industriale, 09:00–13:00', true],
  ['Ven 4 Set', 'Reparto Volanti — Porto Vecchio, 20:00–00:00', false],
];

const BACHECA = [
  ['Avviso', '27 Ago 2026', 'Nuova turnazione Polizia Stradale', 'Da questa settimana la copertura serale del fine settimana passa a due pattuglie invece di una. Controllate i vostri turni aggiornati.'],
  ['Formazione', '24 Ago 2026', 'Corso di aggiornamento NOS', 'Le iscrizioni al corso di aggiornamento tattico del Nucleo Operativo Speciale sono aperte fino al 5 settembre.'],
  ['Generale', '20 Ago 2026', 'Nuovo regolamento equipaggiamento', "È stato aggiornato il regolamento per la richiesta e la restituzione dell'equipaggiamento di reparto. Consultatelo in Questura."],
];

const QUICK_LINKS = [
  ['Prenotazioni', 'Richiedi un intervento', '/prenota'],
  ['Candidature', 'Gestisci candidature', '/candidature'],
  ['Reparti', 'Vedi tutti i reparti', '/reparti'],
  ['Notizie', 'Ultimi comunicati', '/notizie'],
];

export default function DashboardPage() {
  const { loading, profile, logout } = useAgentProfile();

  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : 'Caricamento…';

  return (
    <>
      <section className="border-b-2 border-ink">
        <Container className={`py-12 md:py-20 ${loading ? 'opacity-60' : ''}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Label>Area personale</Label>
            <Btn as="button" type="button" variant="outline" onClick={logout}>
              Esci dall&apos;account
            </Btn>
          </div>
          <h1 className="display mt-8 text-[clamp(3rem,9vw,9rem)]">{nome}</h1>
          {profile ? (
            <span className="mono mt-8 inline-block border-2 border-accent px-3 py-1.5 text-sm font-bold text-accent">
              {profile.grado || 'Agente'}
            </span>
          ) : null}
        </Container>
      </section>

      <Container className="grid gap-16 py-16 md:py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="space-y-16">
          <section>
            <Label n="01">Prossimi turni</Label>
            <h2 className="display mt-6 text-5xl">I tuoi turni.</h2>
            <ul className="mt-8 border-t-2 border-ink">
              {TURNI.map(([day, desc, ok]) => (
                <li key={day} className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink py-5">
                  <div>
                    <div className="text-2xl font-extrabold">{day}</div>
                    <div className="text-mute">{desc}</div>
                  </div>
                  <span className={`mono border-2 px-3 py-1 text-xs font-bold ${ok ? 'border-ok text-ok' : 'border-accent text-accent'}`}>
                    {ok ? 'Confermato' : 'Da confermare'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Label n="02">Bacheca</Label>
            <h2 className="display mt-6 text-5xl">Comunicazioni.</h2>
            <ul className="mt-8 border-t-2 border-ink">
              {BACHECA.map(([tag, date, title, text]) => (
                <li key={title} className="border-b-2 border-ink py-6">
                  <div className="mono flex items-center gap-3 text-xs">
                    <span className="border border-ink px-2 py-0.5 font-bold">{tag}</span>
                    <span className="text-mute">{date}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-extrabold">{title}</h3>
                  <p className="mt-1 text-mute">{text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <Label n="03">Accesso rapido</Label>
          <h2 className="display mt-6 text-5xl">Strumenti.</h2>
          <div className="mt-8 border-t-2 border-ink">
            {QUICK_LINKS.map(([label, title, href]) => (
              <Link key={title} href={href} className="group flex items-center justify-between gap-4 border-b-2 border-ink py-5 transition-colors hover:bg-accent hover:px-4 hover:text-white">
                <span>
                  <span className="mono block text-xs text-mute group-hover:text-white/80">{label}</span>
                  <span className="block text-xl font-extrabold">{title}</span>
                </span>
                <span className="text-2xl font-extrabold">→</span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
