'use client';

import Link from 'next/link';
import { Badge, Btn, Card, Container, IconTile } from '../../components/ui';
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

const QUICK = [
  ['file-text', 'Sportello', 'Gestione pratiche', '/pratiche'],
  ['clipboard', 'Reclutamento', 'Gestione candidature', '/candidature'],
  ['users', 'Questura', 'Organigramma', '/organigramma'],
  ['news', 'Comunicazioni', 'Comunicati', '/notizie'],
];

export default function DashboardPage() {
  const { loading, profile, logout } = useAgentProfile();
  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : 'Caricamento…';
  const initials = profile ? (((profile.nome || '')[0] || '') + ((profile.cognome || '')[0] || '')).toUpperCase() || '?' : '';

  return (
    <Container className="py-10 md:py-14">
      <Card className={`flex flex-col gap-5 p-6 sm:flex-row sm:items-center ${loading ? 'opacity-60' : ''}`}>
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-fg">{initials}</div>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">Area riservata</div>
          <h1 className="h2 mt-0.5">{nome}</h1>
          {profile ? (
            <Badge tone="gold" className="mt-2">
              <Icon name="medal" size={13} /> {profile.grado || 'Agente'}
            </Badge>
          ) : null}
        </div>
        <Btn as="button" type="button" variant="outline" iconStart="logout" onClick={logout}>
          Esci
        </Btn>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="border-b border-line px-6 py-4 font-bold">I tuoi turni di servizio</div>
            <ul className="divide-y divide-line">
              {TURNI.map(([day, desc, ok]) => (
                <li key={day} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm text-muted">{desc}</div>
                  </div>
                  <Badge tone={ok ? 'ok' : 'warn'}>{ok ? 'Confermato' : 'Da confermare'}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="border-b border-line px-6 py-4 font-bold">Comunicazioni di reparto</div>
            <ul className="divide-y divide-line">
              {BACHECA.map(([tag, date, title, text]) => (
                <li key={title} className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Badge tone="blue">{tag}</Badge>
                    <span className="text-xs text-muted">{date}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="h-fit">
          <div className="border-b border-line px-6 py-4 font-bold">Strumenti</div>
          <div className="divide-y divide-line">
            {QUICK.map(([icon, label, title, href]) => (
              <Link key={title} href={href} className="group flex items-center gap-4 px-6 py-4 transition hover:bg-surface">
                <IconTile name={icon} tone="soft" />
                <span className="flex-1">
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="block font-semibold">{title}</span>
                </span>
                <Icon name="chevron" size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}
