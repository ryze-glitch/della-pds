import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Crest3D } from '../../components/Crest3D';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { DEPTS } from '../../lib/data';
import { Bacheca } from '../../components/Bacheca';
import { HomePratiche } from '../../components/HomeDashboard';

const TILE = [
  ['file-text', 'Denuncia online', 'Furto, rapina, aggressione, truffa. Compilazione guidata.', '/sportello/denuncia', '--tt-blue', '--tn-blue', 'Presenta'],
  ['shield-check', "Porto d'armi (PDA)", 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', '/sportello/porto-darmi', '--tt-amber', '--tn-amber', 'Richiedi'],
  ['calendar-check', 'Colloquio con i dirigenti', 'Prenota un appuntamento con la dirigenza.', '/sportello/colloquio', '--tt-green', '--tn-green', 'Prenota'],
  ['briefcase', 'Bandi e reclutamento', 'Selezioni sempre aperte per entrare nei reparti.', '/reclutamento', '--tt-violet', '--tn-violet', 'Scopri'],
];

const SERVIZI = [
  ['file-text', 'Denuncia online', 'Furto, rapina, aggressione, truffa', '/sportello/denuncia'],
  ['shield-check', "Porto d'armi (PDA)", 'Nuovo, rinnovo, uso sportivo', '/sportello/porto-darmi'],
  ['calendar-check', 'Colloquio con i dirigenti', 'Prenota un appuntamento', '/sportello/colloquio'],
  ['search', 'Stato della pratica', 'Verifica con il codice', '/sportello/pratica'],
];

const PASSI = [
  ['1', 'Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['2', 'Ricevi il codice', 'Ottieni un codice pratica e la ricevuta.'],
  ['3', 'Segui la pratica', 'Controlla lo stato quando vuoi.'],
];

export default function HomePage() {
  return (
    <div className="px-5 py-7 sm:px-8">
      <h1 className="text-[22.5px] font-normal">Home</h1>

      {/* banner con la foto della Questura */}
      <section className="hero-in relative mt-5 overflow-hidden sh-card rounded-[20px] border border-[color:var(--sh-line)]">
        <img src="/assets/hero-slide-1.webp" alt="" className="kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '55% 62%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141a24] via-[#141a24]/80 to-[#141a24]/10" />
        <div className="pointer-events-none absolute right-[5%] top-1/2 hidden h-[280px] w-[220px] -translate-y-1/2 lg:block">
          <Crest3D className="hero-in relative h-full w-full" fallbackClass="h-[210px] w-auto" />
        </div>
        <div className="relative px-7 py-9 sm:px-10 sm:py-12">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#3fc4d6]">Italian Paradise XI · Questura</div>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Lo sportello della Polizia di Stato, online.</h2>
          <p className="mt-3 max-w-lg text-[14.4px] text-white/80">Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sportello/denuncia" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#17a8bd] px-6 text-[13.5px] font-semibold text-[#04222a] transition hover:brightness-110">
              Presenta una denuncia <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/sportello/porto-darmi" className="inline-flex h-12 items-center rounded-full border border-white/40 bg-[#141a24]/40 px-6 text-white text-[13.5px] font-medium backdrop-blur-sm transition hover:bg-white/10">
              Richiedi porto d’armi
            </Link>
          </div>
        </div>
      </section>

      {/* servizi: blocchi colorati */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TILE.map(([icon, title, text, href, tt, tn, cta], i) => (
          <Link
            key={href}
            href={href}
            style={{ background: `var(${tn})`, borderLeftColor: `var(${tt})`, '--d': `${i * 80}ms` }}
            className="hero-in group flex min-h-[170px] flex-col rounded-[20px] border-l-[4px] p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20" style={{ color: `var(${tt})` }}>
              <Icon name={icon} size={24} strokeWidth={1.5} />
            </span>
            <span className="mt-4 text-[17px] font-semibold leading-snug" style={{ color: `var(${tt})` }}>{title}</span>
            <span className="mt-1 flex-1 text-[13px] leading-snug text-fg/80">{text}</span>
            <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: `var(${tt})` }}>
              {cta} <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        <HomePratiche />

        <Bacheca />

        <div className="space-y-5">
          <Widget icon="clipboard" title="Come funziona">
            <ol className="divide-y divide-[color:var(--sh-div)]">
              {PASSI.map(([n, t, d]) => (
                <li key={n} className="flex items-start gap-4 py-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color:var(--sh-soft)] font-semibold text-[color:var(--sh-acc)]">{n}</span>
                  <div>
                    <div className="font-medium">{t}</div>
                    <p className="text-[12.2px] text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Widget>

          <Widget icon="users" title="Reparti" href="/organigramma">
            <ul className="divide-y divide-[color:var(--sh-div)]">
              {DEPTS.map((d) => (
                <li key={d.name} className="flex items-center gap-3.5 py-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color:var(--sh-soft)] text-[color:var(--sh-acc)]">
                    <Icon name={d.icon} size={17} strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px]">{d.name}</span>
                    <span className="block truncate text-xs text-muted">{d.tag}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Widget>

          <Link href="/reclutamento" className="group relative block overflow-hidden sh-card rounded-[20px] border border-[color:var(--sh-line)]">
            <img src="/assets/hero-slide-2.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '30% 60%' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141a24] via-[#141a24]/85 to-[#141a24]/30" />
            <div className="relative p-6">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-[#3fc4d6]">Reclutamento</div>
              <div className="mt-2 text-xl font-semibold text-white">Entra nella Polizia di Stato</div>
              <p className="mt-1 text-sm text-white/75">Selezioni sempre aperte.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#3fc4d6]">
                Scopri i bandi <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
