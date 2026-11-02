import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Container } from '../../components/ui';
import { DEPTS } from '../../lib/data';

const SERVIZI = [
  { titolo: 'Denuncia online', testo: 'Furto, rapina, aggressione, truffa: compilazione guidata in tre passi.', href: '/sportello/denuncia' },
  { titolo: "Porto d'armi (PDA)", testo: 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', href: '/sportello/porto-darmi' },
  { titolo: 'Colloquio con i dirigenti', testo: 'Prenota un appuntamento con la dirigenza della Questura.', href: '/sportello/colloquio' },
  { titolo: 'Stato della pratica', testo: 'Controlla l’avanzamento con il codice che hai ricevuto.', href: '/sportello/pratica' },
  { titolo: 'Bandi e reclutamento', testo: 'Selezioni sempre aperte per entrare nei reparti.', href: '/reclutamento' },
  { titolo: 'Organigramma', testo: 'Dirigenti, gradi e reparti della Questura.', href: '/organigramma' },
];

const PASSI = [
  ['01', 'Compila', 'Scegli il servizio'],
  ['02', 'Invia', 'Conferma i dati'],
  ['03', 'Codice', 'Ricevi la ricevuta'],
  ['04', 'Esito', 'Segui lo stato'],
];

const num = (i) => String(i + 1).padStart(2, '0');

export default function HomePage() {
  return (
    <>
      <section className="bg-primary text-white" aria-labelledby="titolo-home">
        <Container className="flex flex-col gap-11 pb-12 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-[1_1_520px] flex-col gap-5">
              <span className="hero-in text-[14px] font-bold uppercase tracking-[0.08em] text-on-accent">Sportello telematico · Italian Paradise XI</span>
              <h1 id="titolo-home" className="h1 hero-in" style={{ '--d': '80ms' }}>Lo sportello della Polizia di Stato, online.</h1>
              <p className="hero-in max-w-xl text-[19px] leading-snug text-on-accent" style={{ '--d': '170ms' }}>
                Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
              </p>
            </div>
            <Link href="/sportello/denuncia" className="btn-light hero-in h-[60px] text-[17px]" style={{ '--d': '250ms' }}>
              Presenta una denuncia <Icon name="arrow-right" size={20} strokeWidth={2.6} />
            </Link>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PASSI.map(([n, t, d], i) => (
              <li key={n} className="flex flex-col gap-3">
                <div className={`h-1.5 ${i === 0 ? 'bg-white' : 'bg-[#6f84ff]'}`} aria-hidden="true" />
                <span className="text-[20px] font-extrabold tracking-[-0.01em]">{n} {t}</span>
                <span className="text-[15px] text-on-accent">{d}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="pb-4 pt-14">
        <h2 className="label mb-4">Tutti i servizi</h2>
        <div>
          {SERVIZI.map((s, i) => (
            <Link key={s.href} href={s.href} className="riga group">
              <span className="w-[72px] flex-none text-[40px] font-extrabold tracking-[-0.03em] text-primary">{num(i)}</span>
              <span className="flex min-w-[260px] flex-1 flex-col gap-1">
                <span className="text-[28px] font-extrabold leading-tight tracking-[-0.02em]">{s.titolo}</span>
                <span className="text-[16px] text-muted">{s.testo}</span>
              </span>
              <Icon name="arrow-right" size={28} strokeWidth={2.2} className="flex-none transition-transform group-hover:translate-x-1.5" />
            </Link>
          ))}
          <div className="border-t border-line" />
        </div>
      </Container>

      <Container className="mt-14 grid items-start gap-x-16 gap-y-14 lg:grid-cols-2">
        <Widget title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
          <div className="mt-4 border-t border-line pt-5">
            <div className="mb-3 text-[16px] font-bold">Hai un codice? Inseriscilo qui.</div>
            <HeroTrack />
          </div>
        </Widget>
        <Bacheca />
      </Container>

      <Container className="mt-14">
        <Widget title="I reparti" href="/organigramma">
          <ul>
            {DEPTS.map((d, i) => (
              <li key={d.name} className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-t border-line py-5 first:border-t-0">
                <span className="w-[72px] flex-none text-[24px] font-extrabold tracking-[-0.02em] text-primary">{num(i)}</span>
                <span className="min-w-[220px] flex-1 text-[22px] font-extrabold tracking-[-0.02em]">{d.name}</span>
                <span className="text-[15px] text-muted">{d.tag}</span>
              </li>
            ))}
          </ul>
        </Widget>
      </Container>

      <section className="mt-20 bg-primary text-white">
        <Container className="flex flex-wrap items-end justify-between gap-8 py-14">
          <div className="max-w-2xl">
            <span className="text-[14px] font-bold uppercase tracking-[0.08em] text-on-accent">Reclutamento</span>
            <h2 className="h2 mt-3 !text-[44px] sm:!text-[56px]">Entra nella Polizia di Stato.</h2>
            <p className="mt-4 text-[19px] leading-snug text-on-accent">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</p>
          </div>
          <Link href="/reclutamento" className="btn-light h-[60px]">
            Scopri i bandi <Icon name="arrow-right" size={20} strokeWidth={2.6} />
          </Link>
        </Container>
      </section>
    </>
  );
}
