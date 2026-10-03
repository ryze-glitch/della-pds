import Link from 'next/link';
import { Btn, Container, Eyebrow, Rule, Section } from '../components/ui';

export default function HomePage() {
  return (
    <>
      <section className="grain relative flex min-h-[86vh] items-end overflow-hidden border-b border-line">
        <img
          src="/assets/hero-slide-1.jpg"
          alt="Questura Centrale di notte, volanti in sosta"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/10" />
        <Container className="relative z-10 pb-20 pt-32">
          <Eyebrow>Polizia di Stato — Italian Paradise RP</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
            Al servizio della città, senza sosta
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <Btn as={Link} href="/concorso" iconEnd="arrow_forward">
              Invia candidatura
            </Btn>
            <Btn as={Link} href="/reparti" variant="outlined">
              Scopri i reparti
            </Btn>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Eyebrow n="01">Missione</Eyebrow>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Ordine, tutela e vicinanza al cittadino
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-dim">
              La Questura Centrale coordina reparti specializzati che operano ogni giorno sul territorio: dal
              pattugliamento urbano alle indagini più complesse, ogni agente porta avanti lo stesso impegno verso la
              sicurezza pubblica.
            </p>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <img src="/assets/hero-slide-2.jpg" alt="Distintivo e uniforme della Polizia" className="aspect-[4/3] w-full border border-line object-cover grayscale" />
          <div>
            <Eyebrow n="02">La Questura</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Una tradizione di servizio che continua ogni giorno
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-dim">
              La Questura Centrale è il cuore operativo della Polizia di Stato: qui si coordinano i reparti, si
              formano le nuove reclute e si costruisce il rapporto di fiducia con la comunità.
            </p>
            <Btn as={Link} href="/chi-siamo" variant="text" iconEnd="arrow_forward" className="mt-7">
              Scopri la nostra storia
            </Btn>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow n="03">Reparti Operativi</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Squadre specializzate per ogni esigenza del territorio
              </h2>
            </div>
            <Btn as={Link} href="/reparti" variant="outlined" iconEnd="arrow_forward">
              Vedi tutti i reparti
            </Btn>
          </div>
        </Container>
        <div className="mt-12 grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-4">
          {[
            ['01', 'Reparto Volanti', '/assets/hero-slide-1.jpg'],
            ['02', 'Squadra Investigativa', '/assets/hero-slide-2.jpg'],
            ['03', 'Nucleo Operativo Speciale', '/assets/hero-slide-1.jpg'],
            ['04', 'Polizia Stradale', '/assets/hero-slide-2.jpg'],
          ].map(([n, label, img]) => (
            <Link key={label} href="/reparti" className="group relative aspect-[3/4] overflow-hidden bg-bg">
              <img src={img} alt={label} className="h-full w-full object-cover opacity-50 grayscale transition-opacity group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
              <span className="absolute left-4 top-4 font-mono text-xs text-primary">{n}</span>
              <span className="absolute bottom-4 left-4 right-4 font-display text-sm font-semibold leading-snug">{label}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="04">Una carriera, otto gradi</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Dalla prima divisa alla guida della Questura
          </h2>
          <div className="mt-12 grid gap-px border-y border-line bg-line sm:grid-cols-3">
            {[
              ['school', 'Formazione', 'Accademia & Addestramento', "Ogni recluta segue un percorso strutturato, dalle basi teoriche all'affiancamento sul campo con agenti esperti."],
              ['military_tech', 'Carriera', 'Otto gradi, un solo obiettivo', 'Da Agente a Questore, la progressione di carriera riconosce impegno, esperienza e capacità di comando.'],
              ['handshake', 'Comunità', 'Vicini al cittadino', "L'Ufficio Relazioni Pubbliche garantisce un punto di contatto diretto per segnalazioni, denunce e richieste."],
            ].map(([, overline, title, text]) => (
              <div key={title} className="bg-bg p-8">
                <Eyebrow>{overline}</Eyebrow>
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{text}</p>
              </div>
            ))}
          </div>
          <Btn as={Link} href="/qualifiche" variant="text" iconEnd="arrow_forward" className="mt-8">
            Scopri tutti i gradi
          </Btn>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="05">Oltre il servizio</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Resta in contatto con la Questura
          </h2>
          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
            <Link href="/notizie" className="group block bg-bg">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="/assets/hero-slide-1.jpg" alt="Veduta della città al tramonto" className="h-full w-full object-cover opacity-60 grayscale transition-opacity group-hover:opacity-90" />
              </div>
              <div className="p-8">
                <Eyebrow>Sul territorio</Eyebrow>
                <h3 className="mt-3 font-display text-xl font-semibold">Le ultime notizie dalla Questura</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                  Comunicati ufficiali, operazioni concluse e aggiornamenti sulla vita dei reparti.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-primary">
                  Leggi le notizie →
                </span>
              </div>
            </Link>
            <Link href="/prenota" className="group block bg-bg">
              <div className="aspect-[16/9] overflow-hidden">
                <img src="/assets/hero-slide-2.jpg" alt="Ufficio della Questura" className="h-full w-full object-cover opacity-60 grayscale transition-opacity group-hover:opacity-90" />
              </div>
              <div className="p-8">
                <Eyebrow>Servizi al cittadino</Eyebrow>
                <h3 className="mt-3 font-display text-xl font-semibold">Prenota un appuntamento</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                  Appuntamento in Questura, URP o porto d&apos;armi: scegli il servizio che ti serve.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-primary">
                  Vai ai servizi →
                </span>
              </div>
            </Link>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container className="max-w-3xl">
          <blockquote className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
            &ldquo;Indossare questa divisa significa scegliere ogni giorno di mettersi al servizio di chi ci
            circonda.&rdquo;
          </blockquote>
          <cite className="mt-5 block font-mono text-xs uppercase tracking-[0.08em] text-ink-dim">
            — Commissario, Questura Centrale
          </cite>
        </Container>
      </Section>

      <section className="grain border-t border-line bg-surface-alt py-20">
        <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Concorso pubblico</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Entra a far parte del corpo
            </h2>
            <p className="mt-4 max-w-xl text-ink-dim">
              Le selezioni per diventare agente sono aperte tutto l&apos;anno. Supera il colloquio, completa la
              formazione in accademia e inizia il tuo percorso in uno dei nostri reparti.
            </p>
          </div>
          <Btn as={Link} href="/concorso" iconEnd="arrow_forward" lg>
            Invia candidatura
          </Btn>
        </Container>
      </section>
    </>
  );
}
