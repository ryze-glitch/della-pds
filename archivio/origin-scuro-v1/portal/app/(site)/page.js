import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Reveal } from '../../components/Reveal';
import { DEPTS } from '../../lib/data';

// Un colore per categoria: il colore è l'unica differenza tra le schede.
const SERVIZI = [
  { icon: 'file-text', title: 'Denuncia online', text: 'Furto, rapina, aggressione, truffa. Compilazione guidata in tre passi.', href: '/sportello/denuncia', cls: 'bg-iris text-black' },
  { icon: 'shield-check', title: "Porto d'armi", text: 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', href: '/sportello/porto-darmi', cls: 'bg-orchid text-black' },
  { icon: 'calendar-check', title: 'Colloquio con i dirigenti', text: 'Prenota un appuntamento con la dirigenza della Questura.', href: '/sportello/colloquio', cls: 'bg-periwinkle text-black' },
  { icon: 'briefcase', title: 'Bandi e reclutamento', text: 'Selezioni sempre aperte per entrare nei reparti.', href: '/reclutamento', cls: 'bg-deep-iris text-white' },
  { icon: 'search', title: 'Stato della pratica', text: 'Controlla l’avanzamento con il codice che hai ricevuto.', href: '/sportello/pratica', cls: 'bg-pale-iris text-black' },
  { icon: 'users', title: 'Organigramma', text: 'Dirigenti, gradi e reparti della Questura.', href: '/organigramma', cls: 'bg-silver text-black' },
];

const PASSI = [
  ['01', 'Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['02', 'Ricevi il codice', 'Ottieni un codice pratica e la ricevuta.'],
  ['03', 'Segui la pratica', 'Controlla lo stato quando vuoi.'],
];

export default function HomePage() {
  return (
    <>
      {/* Apertura: fotografia della Questura, titolo centrato in serif leggero */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <img src="/assets/hero-slide-1.webp" alt="" className="kb absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: '55% 62%' }} />
        <div className="absolute inset-0 -z-10 bg-bg/80" />
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
          <span className="chip hero-in">Italian Paradise XI · Questura</span>
          <h1 className="h1 hero-in mt-8 max-w-[980px] text-[#f5f5f7]" style={{ '--d': '80ms' }}>
            Lo sportello della Polizia di <em className="italic">Stato</em>, online.
          </h1>
          <p className="hero-in mt-7 max-w-[560px] text-lg font-light leading-relaxed text-muted" style={{ '--d': '180ms' }}>
            Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
          </p>
          <div className="hero-in mt-9 flex flex-wrap justify-center gap-3" style={{ '--d': '260ms' }}>
            <Link href="/sportello/denuncia" className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-[18px] text-[15px] text-black transition-colors hover:bg-white/85">
              Presenta una denuncia <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/sportello/porto-darmi" className="inline-flex h-12 items-center rounded-lg border border-white px-[18px] text-[15px] text-white transition-colors hover:bg-white/10">
              Richiedi porto d’armi
            </Link>
          </div>
          <div className="hero-in mt-10 w-full max-w-[520px] text-left" style={{ '--d': '340ms' }}>
            <HeroTrack />
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Hai un codice pratica? Inseriscilo qui</p>
          </div>
        </div>
      </section>

      {/* Servizi: schede a colore pieno */}
      <section className="mx-auto max-w-[1200px] px-4 pt-20 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <span className="label">Sportello cittadino</span>
          <h2 className="h2 mt-4">Cosa puoi fare online</h2>
        </Reveal>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVIZI.map((s, i) => (
            <Reveal key={s.href} className="h-full" delay={(i % 3) * 70}>
              <Link href={s.href} className={`group flex h-full min-h-[300px] flex-col rounded-tile p-8 transition-transform duration-200 hover:-translate-y-1 ${s.cls}`}>
                <Icon name={s.icon} size={30} strokeWidth={1.3} />
                <h3 className="mt-auto pt-12 font-display text-[34px] font-normal leading-[0.95]">{s.title}</h3>
                <p className="mt-3 text-[15px] font-normal leading-normal opacity-80">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.08em]">
                  Apri <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Le tue pratiche e bacheca */}
      <section className="mx-auto mt-20 grid max-w-[1200px] items-start gap-3.5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
        </Widget>
        <Bacheca />
      </section>

      {/* Come funziona: scheda invertita, usata una sola volta */}
      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-tile bg-silver p-8 text-black sm:p-12">
          <h2 className="h2 text-black">Come funziona</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {PASSI.map(([n, t, d]) => (
              <li key={n} className="border-t border-black/25 pt-5">
                <span className="font-mono text-[12px] tracking-[0.12em]">{n}</span>
                <div className="mt-3 font-display text-[28px] leading-none">{t}</div>
                <p className="mt-3 text-[15px] font-normal text-black/75">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reparti */}
      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <span className="label">La Questura</span>
          <h2 className="h2 mt-4">I reparti</h2>
        </Reveal>
        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {DEPTS.map((d) => (
            <li key={d.name} className="rounded-2xl border border-line bg-surface p-7">
              <Icon name={d.icon} size={22} strokeWidth={1.4} className="text-muted" />
              <div className="mt-6 font-display text-[26px] leading-[1.05]">{d.name}</div>
              <div className="label mt-2">{d.tag}</div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link href="/organigramma" className="inline-flex h-11 items-center gap-2 rounded-lg border border-white px-[18px] text-[15px] transition-colors hover:bg-white/10">
            Vedi l’organigramma <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      {/* Reclutamento */}
      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Link href="/reclutamento" className="group relative isolate block overflow-hidden rounded-tile border border-white/10">
          <img src="/assets/hero-slide-2.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: '30% 60%' }} />
          <div className="absolute inset-0 -z-10 bg-bg/75" />
          <div className="px-8 py-16 text-center sm:px-16 sm:py-24">
            <span className="chip">Reclutamento</span>
            <h2 className="h2 mx-auto mt-6 max-w-2xl text-[#f5f5f7]">Entra nella Polizia di Stato</h2>
            <p className="mx-auto mt-4 max-w-md text-lg font-light text-muted">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</p>
            <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-[18px] text-[15px] text-black transition-colors group-hover:bg-white/85">
              Scopri i bandi <Icon name="arrow-right" size={17} />
            </span>
          </div>
        </Link>
      </section>
    </>
  );
}
