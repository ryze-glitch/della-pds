import Link from 'next/link';
import { Badge, Btn, Card, Container, IconTile, Section, SectionHead } from '../components/ui';
import { Icon } from '../components/icons';
import { Reveal } from '../components/Reveal';
import { HeroTrack } from '../components/forms/HeroTrack';
import { COMUNICATI, DEPTS, SERVIZI } from '../lib/data';

const TIPO_TONE = { Ordinanza: 'blue', Allerta: 'warn', Comunicato: 'neutral' };

function fmtData(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-fg">
        <img src="/assets/hero-slide-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" style={{ objectPosition: '60% 55%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" />
        <Container className="relative py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              <span className="h-px w-8 bg-gold" /> Questura IPRP · Italian Paradise XI
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Sicurezza, legalità e vicinanza ai cittadini.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Lo Sportello Telematico della Questura: presenta una denuncia, richiedi il porto d’armi o prenota un
              colloquio con i dirigenti, e segui la tua pratica con un codice univoco.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn as={Link} href="/sportello/denuncia" variant="gold" size="lg" iconStart="file-text">
                Presenta una Denuncia
              </Btn>
              <Btn as={Link} href="/sportello/porto-darmi" variant="outline-light" size="lg" iconStart="shield-check">
                Richiedi Porto d’Armi
              </Btn>
              <Btn as={Link} href="/sportello/pratica" variant="outline-light" size="lg" iconStart="search">
                Verifica Stato Pratica
              </Btn>
            </div>
          </div>
        </Container>
        <div className="gold-rule relative" />
      </section>

      <Container className="relative z-10 -mt-7">
        <Card className="p-4 shadow-pop sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
            <div className="flex items-center gap-3">
              <IconTile name="search" tone="gold" />
              <div>
                <div className="font-bold leading-tight">Hai già una pratica?</div>
                <div className="text-sm text-muted">Inserisci il codice che hai ricevuto all’invio.</div>
              </div>
            </div>
            <HeroTrack />
          </div>
        </Card>
      </Container>

      <Section>
        <SectionHead eyebrow="Sportello Cittadino" title="Servizi rapidi" text="Accedi subito ai servizi più richiesti. Tutte le richieste ricevono un codice pratica per il tracciamento." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVIZI.map((s, i) => (
            <Reveal key={s.href} delay={i * 70}>
              <Link href={s.href} className="group flex h-full flex-col rounded-lg border border-line bg-bg p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-pop">
                <IconTile name={s.icon} />
                <h3 className="mt-5 text-lg font-bold leading-snug">{s.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                  {s.cta} <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Come funziona" title="Tre passi, nessuna coda" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['1', 'Compila il modulo', 'Scegli il servizio e inserisci i dati richiesti. I controlli ti guidano nella compilazione.'],
            ['2', 'Ricevi il codice', 'All’invio ottieni il codice pratica (es. #POL-2026-K7M2QX) e la ricevuta stampabile.'],
            ['3', 'Segui la pratica', 'Verifica lo stato in ogni momento: ricevuta, in lavorazione, conclusa.'],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="relative h-full rounded-lg border border-line bg-bg p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-fg">{n}</span>
                <h3 className="mt-4 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Avvisi & Comunicati"
          title="Ultime dalla Questura"
          action={
            <Btn as={Link} href="/notizie" variant="outline" icon="arrow-right">
              Tutti i comunicati
            </Btn>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {COMUNICATI.slice(0, 3).map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-bg p-6 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={TIPO_TONE[c.tipo]}>{c.tipo}</Badge>
                  <time className="text-xs text-muted" dateTime={c.data}>
                    {fmtData(c.data)}
                  </time>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug">{c.titolo}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{c.testo}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead
          eyebrow="La Questura"
          title="Reparti operativi"
          text="Sei reparti con competenze specifiche, coordinati dal Questore."
          action={
            <Btn as={Link} href="/organigramma" variant="outline" icon="arrow-right">
              Organigramma
            </Btn>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPTS.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 70}>
              <div className="flex h-full gap-4 rounded-lg border border-line bg-bg p-5">
                <IconTile name={d.icon} tone="soft" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gold-ink">{d.tag}</div>
                  <h3 className="mt-0.5 font-bold leading-snug">{d.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-primary text-primary-fg">
        <div className="gold-rule" />
        <Container className="flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Bandi & Reclutamento</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Entra a far parte della Polizia di Stato</h2>
            <p className="mt-3 text-lg text-white/80">Le selezioni per Agente sono aperte tutto l’anno. Candidati, supera il colloquio e completa l’accademia.</p>
          </div>
          <Btn as={Link} href="/reclutamento" variant="gold" size="lg" icon="arrow-right">
            Scopri i bandi
          </Btn>
        </Container>
      </section>
    </>
  );
}
