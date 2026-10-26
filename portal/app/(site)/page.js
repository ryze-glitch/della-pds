import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { DEPTS } from '../../lib/data';
import { Bacheca } from '../../components/Bacheca';

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
      <section className="hero-in relative mt-5 overflow-hidden rounded-[20px] border border-[#242d3b]">
        <img src="/assets/hero-slide-1.jpg" alt="" className="kb absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '55% 62%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141a24] via-[#141a24]/80 to-[#141a24]/10" />
        <div className="relative px-7 py-9 sm:px-10 sm:py-12">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#17a8bd]">Italian Paradise XI · Questura</div>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Lo sportello della Polizia di Stato, online.</h2>
          <p className="mt-3 max-w-lg text-[14.4px] text-white/80">Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sportello/denuncia" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#17a8bd] px-6 text-[13.5px] font-semibold text-[#04222a] transition hover:brightness-110">
              Presenta una denuncia <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/sportello/porto-darmi" className="inline-flex h-12 items-center rounded-full border border-white/40 bg-[#141a24]/40 px-6 text-[13.5px] font-medium backdrop-blur-sm transition hover:bg-white/10">
              Richiedi porto d’armi
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        <div className="space-y-5">
          <Widget icon="landmark" title="Servizi" href="/sportello/denuncia">
            <ul className="divide-y divide-[#1e2735]">
              {SERVIZI.map(([icon, title, text, href]) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-4 py-4">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#0f3947] text-[#17a8bd]">
                      <Icon name={icon} size={21} strokeWidth={1.5} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14.4px] font-medium">{title}</span>
                      <span className="block text-[11.7px] text-muted">{text}</span>
                    </span>
                    <Icon name="chevron" size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
            <MiePratiche compact />
            <div className="mt-4 border-t border-[#242d3b] pt-4">
              <p className="mb-2 text-sm text-muted">Hai un codice? Inseriscilo qui.</p>
              <HeroTrack />
            </div>
          </Widget>
        </div>

        <Bacheca />

        <div className="space-y-5">
          <Widget icon="clipboard" title="Come funziona">
            <ol className="divide-y divide-[#1e2735]">
              {PASSI.map(([n, t, d]) => (
                <li key={n} className="flex items-start gap-4 py-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#0f3947] font-semibold text-[#17a8bd]">{n}</span>
                  <div>
                    <div className="font-medium">{t}</div>
                    <p className="text-[12.2px] text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Widget>

          <Widget icon="users" title="Reparti" href="/organigramma">
            <ul className="divide-y divide-[#1e2735]">
              {DEPTS.map((d) => (
                <li key={d.name} className="flex items-center gap-3.5 py-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#0f3947] text-[#17a8bd]">
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

          <Link href="/reclutamento" className="group relative block overflow-hidden rounded-[20px] border border-[#242d3b]">
            <img src="/assets/hero-slide-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '30% 60%' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141a24] via-[#141a24]/85 to-[#141a24]/30" />
            <div className="relative p-6">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-[#17a8bd]">Reclutamento</div>
              <div className="mt-2 text-xl font-semibold">Entra nella Polizia di Stato</div>
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
