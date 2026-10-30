import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Reveal } from '../../components/Reveal';
import { Crest3D } from '../../components/Crest3D';
import { DEPTS } from '../../lib/data';

const SERVIZI = [
  { tag: 'Denuncia', title: 'Denuncia online', text: 'Furto, rapina, aggressione, truffa. Compilazione guidata in tre passi, con ricevuta e codice.', href: '/sportello/denuncia' },
  { tag: "Porto d'armi", title: 'Porto d’armi (PDA)', text: 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', href: '/sportello/porto-darmi' },
  { tag: 'Colloquio', title: 'Colloquio con i dirigenti', text: 'Prenota un appuntamento con la dirigenza della Questura.', href: '/sportello/colloquio' },
];

const PASSI = [
  ['Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['Ricevi il codice', 'Ottieni un codice pratica e la ricevuta.'],
  ['Segui la pratica', 'Controlla lo stato quando vuoi, con il codice.'],
];

function SectionHead({ label, title, text }) {
  return (
    <Reveal className="grid gap-4 lg:grid-cols-[1fr_2fr_1.4fr] lg:gap-10">
      <div className="label">{label}</div>
      <h2 className="h2 max-w-xl">{title}</h2>
      {text ? <p className="max-w-sm text-[15px] leading-snug text-muted">{text}</p> : <span />}
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Apertura: lo stemma in 3D come immagine unica, testo in basso a sinistra */}
      <section className="relative mx-auto -mt-14 min-h-[640px] max-w-[1200px] overflow-hidden px-4 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center md:inset-y-0 md:left-auto md:right-[4%] md:top-0 md:w-[46%] md:items-center">
          <Crest3D className="hero-in relative h-[240px] w-[190px] md:h-[460px] md:w-[360px]" fallbackClass="h-[220px] w-auto md:h-[400px]" glow={false} />
        </div>
        <div className="relative flex min-h-[640px] flex-col justify-end pb-14 pt-32">
          <div className="hero-in mb-5 flex flex-wrap gap-2">
            <Link href="/sportello/denuncia" className="chip">Denuncia</Link>
            <Link href="/sportello/porto-darmi" className="chip">Porto d’armi</Link>
            <Link href="/sportello/colloquio" className="chip">Colloquio</Link>
          </div>
          <h1 className="h1 hero-in max-w-[760px]" style={{ '--d': '80ms' }}>Lo sportello della Polizia di Stato, online.</h1>
          <p className="hero-in mt-5 max-w-[470px] text-[18px] leading-snug text-muted" style={{ '--d': '170ms' }}>
            Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
          </p>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ '--d': '250ms' }}>
            <Link href="/sportello/denuncia" className="pill">
              <Icon name="arrow-right" size={14} strokeWidth={1.5} className="text-primary" /> Presenta una denuncia
            </Link>
            <Link href="/sportello/pratica" className="text-[15px] text-primary hover:underline">Segui una pratica</Link>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="mx-auto mt-[94px] max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <SectionHead label="Sportello cittadino" title="Cosa puoi fare online" text="Tre servizi, un solo percorso: compili, ricevi un codice, segui lo stato." />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {SERVIZI.map((s, i) => (
            <Reveal key={s.href} className="h-full" delay={i * 70}>
              <Link href={s.href} className="card group flex h-full min-h-[340px] flex-col p-8 transition-colors hover:border-primary sm:p-10">
                <span className="chip w-fit">{s.tag}</span>
                <h3 className="mt-auto pt-16 text-[27px] font-normal leading-[1.2] tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-snug text-muted">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] text-primary group-hover:underline">
                  <Icon name="arrow-right" size={14} strokeWidth={1.5} /> Apri
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pratiche e bacheca */}
      <section className="mx-auto mt-[94px] grid max-w-[1200px] items-start gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
          <div className="border-t border-line pt-6">
            <div className="mb-3 text-[14px] text-fog">Hai un codice? Inseriscilo qui.</div>
            <HeroTrack />
          </div>
        </Widget>
        <Bacheca />
      </section>

      {/* Come funziona */}
      <section className="mx-auto mt-[94px] max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <SectionHead label="Come funziona" title="Tre passi, un codice, nessuna coda" />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {PASSI.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70}>
              <li className="border-t border-line pt-5">
                <span className="label">0{i + 1}</span>
                <div className="mt-6 text-[27px] leading-[1.2] tracking-[-0.02em]">{t}</div>
                <p className="mt-3 max-w-xs text-[15px] leading-snug text-muted">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Reparti */}
      <section className="mx-auto mt-[94px] max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <SectionHead label="La Questura" title="I reparti" text="Dal pronto intervento alla formazione: chi lavora dietro lo sportello." />
        <ul className="mt-12 flex flex-wrap gap-2.5">
          {DEPTS.map((d) => (
            <li key={d.name} className="chip px-4 py-1.5 text-[14px]">{d.name}</li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/organigramma" className="pill"><Icon name="arrow-right" size={14} strokeWidth={1.5} className="text-primary" /> Vedi l’organigramma</Link>
        </div>
      </section>

      {/* Reclutamento */}
      <section className="mx-auto mt-[94px] max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <div className="card grid items-end gap-8 p-8 sm:p-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="label">Reclutamento</div>
            <h2 className="h2 mt-5 max-w-lg">Entra nella Polizia di Stato</h2>
            <p className="mt-4 max-w-md text-[15px] leading-snug text-muted">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</p>
          </div>
          <div className="lg:justify-self-end">
            <Link href="/reclutamento" className="pill"><Icon name="arrow-right" size={14} strokeWidth={1.5} className="text-primary" /> Scopri i bandi</Link>
          </div>
        </div>
      </section>
    </>
  );
}
