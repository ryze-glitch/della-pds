import Link from 'next/link';
import { Btn, Container, Eyebrow } from '../../components/ui';
import { Icon } from '../../components/icons';
import { Reveal } from '../../components/Reveal';
import { Parallax } from '../../components/Parallax';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { COMUNICATI, DEPTS, SERVIZI } from '../../lib/data';

const TIPO_COLOR = { Ordinanza: 'text-link', Allerta: 'text-bad', Comunicato: 'text-gold-ink' };

const PASSI = [
  ['01', 'Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti: i controlli ti guidano passo dopo passo.'],
  ['02', 'Ricevi il codice', 'All’invio ottieni il codice pratica, ad esempio #POL-2026-K7M2QX, e la ricevuta stampabile.'],
  ['03', 'Segui la pratica', 'Verifica lo stato quando vuoi. Per le comunicazioni urgenti ti contatta lo staff su Discord.'],
];

function fmtData(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }).replaceAll('/', '.');
}

export default function HomePage() {
  const dock = SERVIZI.slice(0, 3);
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <Parallax speed={0.22}>
            <img src="/assets/hero-slide-1.jpg" alt="" className="kb h-full w-full object-cover" style={{ objectPosition: '62% 62%' }} />
          </Parallax>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/20 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/30 to-transparent" />
        <Container className="relative pt-48 lg:pt-52">
          <Eyebrow className="hero-in">Italian Paradise XI · Questura</Eyebrow>
          <h1 style={{ '--d': '140ms' }} className="hero-in mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[4rem]">
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

          <div className="mt-16 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-2 lg:mt-24 lg:grid-cols-4">
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

      <Container>
        <div className="grid items-center gap-14 pt-28 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <Eyebrow>Come funziona</Eyebrow>
            <h2 className="h2 mt-4 max-w-md">Tre passi, nessuna coda.</h2>
            <p className="mt-4 max-w-md text-muted">
              Lo sportello online ti permette di rivolgerti alla Questura senza recarti in sede, a qualsiasi ora.
            </p>
            <ol className="mt-8 overflow-hidden rounded-[20px] border border-line bg-surface">
              {PASSI.map(([n, t, d]) => (
                <li key={n} className="flex gap-5 border-b border-line p-5 last:border-b-0">
                  <span className="font-mono text-sm text-gold-ink">{n}</span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <p className="mt-1 text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative">
              <img src="/assets/hero-slide-2.jpg" alt="Sede della Questura con le volanti nel piazzale" className="aspect-[4/3] w-full rounded-[20px] object-cover" style={{ objectPosition: '40% 55%' }} />
              
            </div>
          </Reveal>
        </div>

        <div className="pt-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Comunicati</Eyebrow>
              <h2 className="h2 mt-4">Ordinanze, allerte e avvisi.</h2>
            </div>
            <Btn as={Link} href="/notizie" variant="outline" icon="arrow-right">
              Tutti i comunicati
            </Btn>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-[20px] border border-line bg-surface">
            {COMUNICATI.slice(0, 4).map((c) => (
              <Reveal key={c.id}>
                <Link href="/notizie" className="group grid items-center gap-x-6 gap-y-1 border-b border-line px-6 py-5 transition last:border-b-0 hover:bg-surface2 sm:grid-cols-[130px_130px_1fr_24px]">
                  <time dateTime={c.data} className="font-mono text-[13px] text-muted">
                    {fmtData(c.data)}
                  </time>
                  <span className={`text-xs font-medium uppercase tracking-[0.16em] ${TIPO_COLOR[c.tipo]}`}>{c.tipo}</span>
                  <h3 className="text-lg font-medium leading-snug">{c.titolo}</h3>
                  <Icon name="arrow-right" size={18} className="hidden text-muted transition-transform group-hover:translate-x-1 sm:block" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="pt-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>La Questura</Eyebrow>
              <h2 className="h2 mt-4">Reparti operativi.</h2>
            </div>
            <Btn as={Link} href="/organigramma" variant="outline" icon="arrow-right">
              Organigramma
            </Btn>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {DEPTS.map((d, i) => (
              <Reveal key={d.name} delay={(i % 3) * 60}>
                <div className="flex h-full min-h-[190px] flex-col justify-between bg-surface p-7">
                  <span className="font-mono text-[13px] text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug">{d.name}</h3>
                    <p className="mt-1.5 text-sm text-muted">{d.tag}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <section className="relative mt-28 overflow-hidden">
        <img src="/assets/hero-slide-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '30% 60%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/40" />
        <Container className="relative py-20">
          <Eyebrow>Bandi &amp; Reclutamento</Eyebrow>
          <h2 className="h2 mt-4 max-w-xl">Entra nella Polizia di Stato.</h2>
          <p className="mt-4 max-w-lg text-lg text-white/75">Le selezioni per Agente sono aperte tutto l’anno: candidati, supera il colloquio e completa l’accademia.</p>
          <div className="mt-8">
            <Btn as={Link} href="/reclutamento" variant="light" size="lg" icon="arrow-right">
              Scopri i bandi
            </Btn>
          </div>
        </Container>
      </section>
    </>
  );
}
