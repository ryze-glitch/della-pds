import Link from 'next/link';
import { Btn, Container, Eyebrow } from '../../components/ui';
import { Icon } from '../../components/icons';
import { Reveal } from '../../components/Reveal';
import { Crest3D } from '../../components/Crest3D';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { COMUNICATI, DEPTS, SERVIZI } from '../../lib/data';

const TIPO_COLOR = { Ordinanza: 'text-link', Allerta: 'text-bad', Comunicato: 'text-gold-ink' };

const PASSI = [
  ['1', 'Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['2', 'Ricevi il codice', 'Ottieni un codice pratica e la ricevuta stampabile.'],
  ['3', 'Segui la pratica', 'Controlla lo stato quando vuoi, anche da qui.'],
];

function fmtData(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }).replace('.', '');
}

export default function HomePage() {
  const dock = SERVIZI.slice(0, 3);
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/assets/hero-slide-1.jpg" alt="" className="kb h-full w-full object-cover" style={{ objectPosition: '55% 70%' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/10 to-transparent" style={{ backgroundSize: '70% 100%', backgroundRepeat: 'no-repeat' }} />
        <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block">
          <div className="mx-auto h-full max-w-page px-8">
            <div className="relative h-full">
              <Crest3D className="hero-in absolute right-[3%] top-[19%] h-[400px] w-[320px]" fallbackClass="h-[330px] w-auto" />
            </div>
          </div>
        </div>
        <Container className="relative z-10 pt-32 lg:pt-36">
          <Eyebrow className="hero-in">Italian Paradise XI · Questura</Eyebrow>
          <h1 style={{ '--d': '140ms' }} className="hero-in mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Lo sportello della Polizia di Stato, online.
          </h1>
          <p style={{ '--d': '300ms' }} className="hero-in mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
          </p>
          <div style={{ '--d': '460ms' }} className="hero-in mt-8 flex flex-wrap gap-3">
            <Btn as={Link} href="/sportello/denuncia" variant="light" size="lg" icon="arrow-right">
              Presenta una denuncia
            </Btn>
            <Btn as={Link} href="/sportello/porto-darmi" variant="outline-light" size="lg">
              Richiedi porto d’armi
            </Btn>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-2 lg:mt-44 lg:grid-cols-4">
            {dock.map((s, i) => (
              <Link key={s.href} href={s.href} style={{ '--d': `${640 + i * 110}ms` }} className="hero-in group flex flex-col gap-2 bg-surface p-7 transition hover:bg-surface2">
                <Icon name={s.icon} size={28} strokeWidth={1.5} className="text-link transition-transform duration-300 group-hover:scale-110" />
                <h2 className="mt-3 text-lg font-semibold leading-snug">{s.title.replace(' Online', '')}</h2>
                <p className="flex-1 text-sm text-muted">{s.text.split('.')[0]}.</p>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium">
                  Vai al servizio <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
            <div style={{ '--d': '970ms' }} className="hero-in flex flex-col gap-2 bg-surface2 p-7">
              <Icon name="search" size={28} strokeWidth={1.5} className="text-link" />
              <h2 className="mt-3 text-lg font-semibold">Traccia la pratica</h2>
              <p className="flex-1 text-sm text-muted">Inserisci il codice che hai ricevuto.</p>
              <HeroTrack />
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-6">
        <Reveal>
          <ol className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-3">
            {PASSI.map(([n, t, d]) => (
              <li key={n} className="flex items-center gap-4 bg-surface px-6 py-5">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold-soft font-semibold text-gold-ink">{n}</span>
                <div>
                  <div className="font-semibold">{t}</div>
                  <p className="text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="grid gap-6 pt-20 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">Ultimi comunicati</h2>
              <Link href="/notizie" className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline">
                Vedi tutti <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-surface">
              {COMUNICATI.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/notizie#c${c.id}`} className="group flex items-center gap-5 border-b border-line px-6 py-5 transition last:border-b-0 hover:bg-surface2">
                  <time dateTime={c.data} className="w-14 flex-none text-center font-mono text-[13px] uppercase leading-tight text-muted">
                    {fmtData(c.data)}
                  </time>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] font-medium uppercase tracking-[0.16em] ${TIPO_COLOR[c.tipo]}`}>{c.tipo}</span>
                    <h3 className="mt-0.5 font-medium leading-snug">{c.titolo}</h3>
                  </div>
                  <Icon name="arrow-right" size={18} className="flex-none text-muted transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">Reparti</h2>
              <Link href="/organigramma" className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline">
                Organigramma <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-surface">
              {DEPTS.map((d) => (
                <div key={d.name} className="flex items-center gap-4 border-b border-line px-5 py-3.5 last:border-b-0">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold-soft text-gold-ink">
                    <Icon name={d.icon} size={19} strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium">{d.name}</div>
                    <div className="truncate text-xs text-muted">{d.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="pt-20">
          <div className="relative overflow-hidden rounded-[24px] border border-line">
            <img src="/assets/hero-slide-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '30% 60%' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/30" />
            <div className="relative flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <Eyebrow>Bandi &amp; Reclutamento</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Entra nella Polizia di Stato.</h2>
                <p className="mt-3 text-white/75">Selezioni sempre aperte: candidati, supera il colloquio e completa l’accademia.</p>
              </div>
              <Btn as={Link} href="/reclutamento" variant="light" size="lg" icon="arrow-right">
                Scopri i bandi
              </Btn>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
