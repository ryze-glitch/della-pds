'use client';

import Link from 'next/link';
import { Btn, Chip, Container } from '../../components/ui';
import { Icon } from '../../components/icons';
import { useAgentProfile } from '../../components/useAgentProfile';

const TURNI = [
  ['Lun 31 Ago', 'Reparto Volanti — Centro Città, 18:00–22:00', 'confermato'],
  ['Mer 2 Set', 'Polizia Stradale — Zona Industriale, 09:00–13:00', 'confermato'],
  ['Ven 4 Set', 'Reparto Volanti — Porto Vecchio, 20:00–00:00', 'da-confermare'],
];

const BACHECA = [
  ['Avviso', '27 Ago 2026', 'Nuova turnazione Polizia Stradale', 'Da questa settimana la copertura serale del fine settimana passa a due pattuglie invece di una. Controllate i vostri turni aggiornati.'],
  ['Formazione', '24 Ago 2026', 'Corso di aggiornamento NOS', 'Le iscrizioni al corso di aggiornamento tattico del Nucleo Operativo Speciale sono aperte fino al 5 settembre.'],
  ['Generale', '20 Ago 2026', 'Nuovo regolamento equipaggiamento', "È stato aggiornato il regolamento per la richiesta e la restituzione dell'equipaggiamento di reparto. Consultatelo in Questura."],
];

const QUICK_LINKS = [
  ['support_agent', 'Prenotazioni', 'Richiedi un intervento', '#'],
  ['assignment_ind', 'Candidature', 'Gestisci candidature', '/candidature'],
  ['groups', 'Reparti', 'Vedi tutti i reparti', '/reparti'],
  ['newspaper', 'Notizie', 'Ultimi comunicati', '/notizie'],
];

export default function DashboardPage() {
  const { loading, profile, logout } = useAgentProfile();

  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : 'Caricamento...';
  const initials = profile ? ((profile.nome || '')[0] || '' + (profile.cognome || '')[0] || '').toUpperCase() || '?' : '';

  return (
    <Container className="py-10">
      <section className={`flex flex-col gap-6 rounded-3xl bg-surface-alt p-6 sm:flex-row sm:items-center ${loading ? 'opacity-60' : ''}`}>
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary-soft font-display text-xl font-semibold text-on-primary-soft">
          {initials}
        </div>
        <div className="flex-1">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Area Personale</span>
          <h1 className="mt-1 font-display text-2xl font-semibold">{nome}</h1>
          {profile ? <Chip className="mt-2">{profile.grado || 'Agente'}</Chip> : null}
        </div>
        <Btn as="button" type="button" variant="outlined" iconStart="logout" onClick={logout}>
          Esci dall&apos;account
        </Btn>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <section>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Prossimi Turni</span>
            <h2 className="mt-1 font-display text-xl font-semibold">I tuoi turni di servizio</h2>
            <ul className="mt-4 space-y-3">
              {TURNI.map(([day, desc, state]) => (
                <li key={day} className="flex items-center justify-between gap-4 rounded-2xl bg-surface-alt p-4">
                  <div>
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm text-ink-dim">{desc}</div>
                  </div>
                  <Chip tone={state === 'confermato' ? 'success' : 'pending'}>
                    <Icon name={state === 'confermato' ? 'check_circle' : 'schedule'} className="text-base" />
                    {state === 'confermato' ? 'Confermato' : 'Da confermare'}
                  </Chip>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Bacheca</span>
            <h2 className="mt-1 font-display text-xl font-semibold">Comunicazioni di reparto</h2>
            <ul className="mt-4 space-y-3">
              {BACHECA.map(([tag, date, title, text]) => (
                <li key={title} className="rounded-2xl bg-surface-alt p-4">
                  <div className="flex items-center gap-2 text-xs text-ink-dim">
                    <Chip>{tag}</Chip>
                    <span>{date}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink-dim">{text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Accesso Rapido</span>
          <h2 className="mt-1 font-display text-xl font-semibold">Strumenti</h2>
          <div className="mt-4 space-y-2">
            {QUICK_LINKS.map(([icon, label, title, href]) => (
              <Link key={title} href={href} className="flex items-center gap-3 rounded-2xl bg-surface-alt p-4 hover:bg-surface-strong">
                <Icon name={icon} />
                <span className="flex-1">
                  <span className="block text-xs text-ink-dim">{label}</span>
                  <span className="block font-medium">{title}</span>
                </span>
                <Icon name="chevron_right" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
