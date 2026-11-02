import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Reveal } from '../../components/Reveal';
import { DEPTS } from '../../lib/data';

const SERVIZI = [
  { icon: 'file-text', title: 'Denuncia online', text: 'Furto, rapina, aggressione, truffa. Compilazione guidata in tre passi.', href: '/sportello/denuncia' },
  { icon: 'shield-check', title: "Porto d'armi", text: 'Nuovo, rinnovo e uso sportivo, con tariffe e visita medica.', href: '/sportello/porto-darmi' },
  { icon: 'calendar-check', title: 'Colloquio con i dirigenti', text: 'Prenota un appuntamento con la dirigenza della Questura.', href: '/sportello/colloquio' },
  { icon: 'search', title: 'Stato della pratica', text: 'Controlla l’avanzamento con il codice che hai ricevuto.', href: '/sportello/pratica' },
  { icon: 'briefcase', title: 'Bandi e reclutamento', text: 'Selezioni sempre aperte per entrare nei reparti.', href: '/reclutamento' },
  { icon: 'users', title: 'Organigramma', text: 'Dirigenti, gradi e reparti della Questura.', href: '/organigramma' },
];

const PASSI = [
  ['Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti.'],
  ['Ricevi il codice', 'Ottieni un codice pratica e la ricevuta.'],
  ['Segui la pratica', 'Controlla lo stato quando vuoi.'],
];

function TextLink({ href, children }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[17px] text-link hover:underline">
      {children} <Icon name="chevron" size={16} />
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Apertura: etichetta, titolo centrato, immagine grande senza scheda attorno */}
      <section className="bg-white pt-14 text-center sm:pt-20">
        <div className="mx-auto max-w-[1024px] px-4 sm:px-6">
          <div className="chip hero-in">Questura IPRP · Italian Paradise XI</div>
          <h1 className="h1 hero-in mx-auto mt-3 max-w-[900px]" style={{ '--d': '80ms' }}>
            Lo sportello della Polizia di Stato, online.
          </h1>
          <p className="hero-in mx-auto mt-6 max-w-[560px] text-[19px] leading-snug text-muted" style={{ '--d': '170ms' }}>
            Denunce, porto d’armi e colloqui con i dirigenti. Ogni pratica ha un codice e uno stato sempre consultabile.
          </p>
          <div className="hero-in mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={{ '--d': '250ms' }}>
            <Link href="/sportello/denuncia" className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-[17px] text-primary-fg transition-colors hover:bg-[#0077ed]">
              Presenta una denuncia
            </Link>
            <TextLink href="/sportello/porto-darmi">Richiedi il porto d’armi</TextLink>
          </div>
        </div>
        <div className="relative mx-auto mt-14 max-w-[1200px] px-4 sm:px-6">
          <div className="hero-in overflow-hidden rounded-tile bg-mist" style={{ '--d': '340ms' }}>
            <img src="/assets/hero-slide-1.webp" alt="La Questura IPRP con le volanti" className="kb aspect-[16/8] w-full object-cover" style={{ objectPosition: '55% 62%' }} />
          </div>
          <div className="relative mx-auto -mt-12 w-full max-w-[560px] rounded-tile bg-white p-5 text-left sm:-mt-14">
            <div className="mb-3 text-[14px] font-semibold">Hai un codice pratica?</div>
            <HeroTrack />
          </div>
        </div>
      </section>

      {/* Servizi su fascia grigio chiaro: schede bianche, niente ombre */}
      <section className="mt-24 bg-mist py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="h2">Cosa puoi fare online.</h2>
            <TextLink href="/sportello">Tutti i servizi</TextLink>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVIZI.map((s, i) => (
              <Reveal key={s.href} className="h-full" delay={(i % 3) * 70}>
                <Link href={s.href} className="group flex h-full min-h-[280px] flex-col rounded-tile bg-white p-7 transition-transform duration-200 hover:scale-[1.015]">
                  <Icon name={s.icon} size={30} strokeWidth={1.4} className="text-fg" />
                  <h3 className="mt-auto pt-10 text-[28px] font-semibold leading-[1.14] tracking-[0.007em]">{s.title}</h3>
                  <p className="mt-2.5 text-[17px] leading-snug text-muted">{s.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[17px] text-link group-hover:underline">
                    Apri <Icon name="chevron" size={16} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editoriale: come funziona + pratiche personali */}
      <section className="mx-auto grid max-w-[1200px] items-start gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="text-[21px] font-semibold tracking-[0.011em]">Come funziona</div>
          <h2 className="h2 mt-3 max-w-md">Tre passi, un codice, nessuna coda.</h2>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {PASSI.map(([t, d], i) => (
              <li key={t} className="flex gap-5 py-5">
                <span className="text-[17px] font-semibold text-fog">{i + 1}</span>
                <div>
                  <div className="text-[19px] font-semibold">{t}</div>
                  <p className="mt-1 text-[17px] leading-snug text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
        </Widget>
      </section>

      {/* Bacheca e reparti */}
      <section className="bg-mist py-20">
        <div className="mx-auto grid max-w-[1200px] items-start gap-5 px-4 sm:px-6 lg:grid-cols-2">
          <Bacheca tone="white" />
          <Widget icon="users" title="Reparti" href="/organigramma" tone="white">
            <ul className="divide-y divide-line">
              {DEPTS.map((d) => (
                <li key={d.name} className="flex items-center gap-4 py-3.5">
                  <Icon name={d.icon} size={20} strokeWidth={1.5} className="flex-none text-fog" />
                  <span className="min-w-0">
                    <span className="block truncate text-[17px] font-medium">{d.name}</span>
                    <span className="block truncate text-[13px] text-muted">{d.tag}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </section>

      {/* Reclutamento: testo a sinistra, immagine che entra da destra */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="text-[21px] font-semibold tracking-[0.011em]">Reclutamento</div>
          <h2 className="h2 mt-3 max-w-md">Entra nella Polizia di Stato.</h2>
          <p className="mt-5 max-w-md text-[19px] leading-snug text-muted">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</p>
          <div className="mt-7">
            <Link href="/reclutamento" className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-[17px] text-primary-fg transition-colors hover:bg-[#0077ed]">
              Scopri i bandi
            </Link>
          </div>
        </Reveal>
        <div className="overflow-hidden rounded-tile bg-mist">
          <img src="/assets/hero-slide-2.webp" alt="Agenti e volanti davanti alla Questura" className="aspect-[4/3] w-full object-cover" style={{ objectPosition: '30% 60%' }} />
        </div>
      </section>
    </>
  );
}
