'use client';

import Link from 'next/link';
import { Btn, Badge, Mono } from '../../components/ui';
import { Icon } from '../../components/icons';
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
  ['headset', 'Prenotazioni', 'Richiedi un intervento', '/prenota'],
  ['clipboard', 'Candidature', 'Gestisci candidature', '/candidature'],
  ['users', 'Reparti', 'Vedi tutti i reparti', '/reparti'],
  ['news', 'Notizie', 'Ultimi comunicati', '/notizie'],
];

export default function DashboardPage() {
  const { loading, profile, logout } = useAgentProfile();

  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : 'Caricamento…';
  const initials = profile ? (((profile.nome || '')[0] || '') + ((profile.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-12 md:py-16">
      <section className={`flex flex-col gap-5 sm:flex-row sm:items-center ${loading ? 'opacity-60' : ''}`}>
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-line2 text-xl font-semibold">{initials}</div>
        <div className="flex-1">
          <Mono>Area personale</Mono>
          <h1 className="h-section mt-1 text-3xl md:text-4xl">{nome}</h1>
          {profile ? <Badge className="mt-3">{profile.grado || 'Agente'}</Badge> : null}
        </div>
        <Btn as="button" type="button" variant="secondary" onClick={logout}>
          Esci dall&apos;account
        </Btn>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-line">
            <div className="border-b border-line px-6 py-4">
              <h2 className="font-semibold">I tuoi turni di servizio</h2>
            </div>
            <ul className="divide-y divide-line">
              {TURNI.map(([day, desc, ok]) => (
                <li key={day} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <div className="font-medium">{day}</div>
                    <div className="text-sm text-muted">{desc}</div>
                  </div>
                  <Badge className={ok ? '!border-ok/50 !text-ok' : ''}>{ok ? 'Confermato' : 'Da confermare'}</Badge>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-line">
            <div className="border-b border-line px-6 py-4">
              <h2 className="font-semibold">Comunicazioni di reparto</h2>
            </div>
            <ul className="divide-y divide-line">
              {BACHECA.map(([tag, date, title, text]) => (
                <li key={title} className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Badge>{tag}</Badge>
                    <Mono>{date}</Mono>
                  </div>
                  <h3 className="mt-3 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="h-fit rounded-lg border border-line">
          <div className="border-b border-line px-6 py-4">
            <h2 className="font-semibold">Strumenti</h2>
          </div>
          <div className="divide-y divide-line">
            {QUICK_LINKS.map(([icon, label, title, href]) => (
              <Link key={title} href={href} className="group flex items-center gap-4 px-6 py-4 hover:bg-bg2">
                <Icon name={icon} size={18} className="text-muted" />
                <span className="flex-1">
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="block text-sm font-medium">{title}</span>
                </span>
                <Icon name="chevron" size={16} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
