import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Reveal } from '../../components/Reveal';
import { DEPTS } from '../../lib/data';

const SERVIZI = [
  { icon: 'file-text', title: 'Denuncia online', text: 'Furto, rapina, aggressione, truffa. Compilazione guidata in tre passi.', href: '/sportello/denuncia', cta: 'Presenta' },
  { icon: 'shield-check', title: "Porto d'armi", text: 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', href: '/sportello/porto-darmi', cta: 'Richiedi' },
  { icon: 'calendar-check', title: 'Colloquio con i dirigenti', text: 'Prenota un appuntamento con la dirigenza della Questura.', href: '/sportello/colloquio', cta: 'Prenota' },
];

const PASSI = [
  ['Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['Ricevi il codice', 'Ottieni un codice pratica e la ricevuta.'],
  ['Segui la pratica', 'Controlla lo stato quando vuoi.'],
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Reveal>
        <span className="chip">Italian Paradise XI · Questura</span>
        <h1 className="h1 mt-4 max-w-[760px]">Lo sportello della Polizia di Stato, online.</h1>
        <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-muted">
          Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/sportello/denuncia" className="inline-flex h-10 items-center gap-2 rounded-[18px] bg-primary px-4 text-[14px] font-medium text-primary-fg transition-colors hover:bg-primary/90">
            Presenta una denuncia <Icon name="arrow-right" size={16} />
          </Link>
          <Link href="/sportello/porto-darmi" className="inline-flex h-10 items-center rounded-[18px] border border-line bg-white px-4 text-[14px] font-medium transition-colors hover:bg-black/5">
            Richiedi il porto d’armi
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {SERVIZI.map((s, i) => (
          <Reveal key={s.href} className="h-full" delay={i * 60}>
            <Link href={s.href} className="card group flex h-full flex-col p-5 transition-colors hover:border-fg/20">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-bg">
                <Icon name={s.icon} size={20} strokeWidth={1.6} />
              </span>
              <h2 className="mt-8 text-[18px] font-medium tracking-[-0.025em]">{s.title}</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.text}</p>
              <span className="mt-5 inline-flex h-8 w-fit items-center gap-1.5 rounded-[18px] border border-line px-3 text-[13px] font-medium transition-colors group-hover:bg-bg">
                {s.cta} <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-3">
        <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
          <div className="border-t border-line pt-4">
            <div className="mb-2 text-[13px] text-muted">Hai un codice? Inseriscilo qui.</div>
            <HeroTrack />
          </div>
        </Widget>
        <Bacheca />
        <Widget icon="clipboard" title="Come funziona">
          <ol className="divide-y divide-line">
            {PASSI.map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3.5 py-3.5">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-[12px] font-medium text-primary-fg">{i + 1}</span>
                <div>
                  <div className="text-[14px] font-medium">{t}</div>
                  <p className="text-[13px] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Widget>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <Widget icon="users" title="Reparti" href="/organigramma">
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {DEPTS.map((d) => (
              <li key={d.name} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-bg text-muted">
                  <Icon name={d.icon} size={16} strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium">{d.name}</span>
                  <span className="block truncate text-[12px] text-muted">{d.tag}</span>
                </span>
              </li>
            ))}
          </ul>
        </Widget>
        <section className="card flex flex-col p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-bg">
            <Icon name="briefcase" size={20} strokeWidth={1.6} />
          </span>
          <h2 className="mt-8 text-[18px] font-medium tracking-[-0.025em]">Entra nella Polizia di Stato</h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</p>
          <Link href="/reclutamento" className="mt-5 inline-flex h-9 w-fit items-center gap-2 rounded-[18px] bg-primary px-4 text-[14px] font-medium text-primary-fg transition-colors hover:bg-primary/90">
            Scopri i bandi <Icon name="arrow-right" size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}
