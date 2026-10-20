import Link from 'next/link';
import { Badge, Btn, Cell, Cells, CtaBox, DeptCards, Marquee, Mono, SectionHead } from '../components/ui';
import { Icon } from '../components/icons';
import { Counter, LiveClock, Parallax, RankTimeline, Reveal, ScrubText, SpotCard, SplitText, Spotlight } from '../components/motion';
import { DEPTS, GRADI } from '../lib/data';

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
        />
        <Spotlight />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-[34rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
        />

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-32 text-center md:px-12">
          <Reveal afterIntro variant="blur">
            <Link href="/concorso">
              <Badge className="hover:border-fg hover:text-fg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-ok" />
                </span>
                Centrale operativa · Roma <LiveClock className="text-fg" />
                <Icon name="arrow-right" size={12} />
              </Badge>
            </Link>
          </Reveal>

          <h1 className="h-display mx-auto mt-8 max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem]">
            <SplitText text="Al servizio della città, senza sosta." afterIntro baseDelay={150} accentFrom={4} />
          </h1>

          <Reveal afterIntro variant="blur" delay={600}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Reparti specializzati, una carriera in otto gradi e una comunità che ogni giorno lavora per la
              sicurezza di tutti. Entra nella Questura Centrale.
            </p>
          </Reveal>

          <Reveal afterIntro variant="up" delay={800}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
                Invia candidatura
              </Btn>
              <Btn as={Link} href="/reparti" size="lg" variant="secondary">
                Scopri i reparti
              </Btn>
            </div>
          </Reveal>
        </div>

        <Marquee
          className="relative border-y border-line bg-bg/60 py-4 backdrop-blur"
          itemClass="font-mono text-xs uppercase tracking-[0.2em] text-muted"
          speed={50}
          items={['Polizia di Stato', 'Italian Paradise RP', 'Selezioni sempre aperte', 'Sicurezza 24/7', 'Sub Lege Libertas', 'Sei reparti operativi', 'Otto gradi di carriera']}
        />
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-12 md:py-16">
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-xl border border-line">
              <Parallax src="/assets/hero-slide-1.jpg" alt="Questura Centrale di notte, volanti in sosta" pos="50% 62%" className="h-[340px] md:h-[620px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 md:inset-x-8 md:bottom-8">
                <div className="float-y rounded-lg border border-line2 bg-bg/70 px-4 py-3 backdrop-blur-md">
                  <Mono>Questura Centrale</Mono>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-ok" /> Operativa 24/7
                  </div>
                </div>
                <Mono className="text-fg/80">Italian Paradise RP — 2026</Mono>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden">
            <div className="stagger -mb-px -mr-px grid grid-cols-2 md:grid-cols-4">
              {[
                [6, '', 'Reparti operativi'],
                [8, '', 'Gradi di carriera'],
                [24, '/7', 'Presenza sul territorio'],
                [365, '', 'Giorni di selezioni aperte'],
              ].map(([v, suf, l]) => (
                <Cell key={l} className="px-6 py-10 md:px-10 md:py-14">
                  <div className="text-5xl font-semibold tracking-tighter md:text-7xl">
                    <Counter to={v} suffix={suf} />
                  </div>
                  <div className="mt-3 text-sm text-muted">{l}</div>
                </Cell>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-12 md:py-40">
          <Badge>Missione</Badge>
          <ScrubText
            className="h-section mt-8 max-w-4xl text-3xl md:text-6xl"
            text="Ordine, tutela e vicinanza al cittadino. Dal pattugliamento urbano alle indagini più complesse, ogni agente porta avanti lo stesso impegno verso la sicurezza pubblica."
          />
        </div>
        <div className="mx-auto max-w-[1200px] border-t border-line">
          <Cells cols="md:grid-cols-3">
            {[
              ['graduation', 'Formazione', 'Accademia & addestramento', "Un percorso strutturato dalle basi teoriche all'affiancamento sul campo con agenti esperti."],
              ['medal', 'Carriera', 'Otto gradi, un solo obiettivo', 'Da Agente a Questore: impegno, esperienza e capacità di comando vengono riconosciuti.'],
              ['handshake', 'Comunità', 'Vicini al cittadino', "L'Ufficio Relazioni Pubbliche è il punto di contatto diretto per segnalazioni, denunce e richieste."],
            ].map(([icon, tag, title, text]) => (
              <Cell key={title}>
                <SpotCard className="h-full p-6 md:p-10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line2">
                    <Icon name={icon} size={19} />
                  </span>
                  <Mono className="mt-8 block">{tag}</Mono>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
                </SpotCard>
              </Cell>
            ))}
          </Cells>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-20 md:px-12 md:pb-14 md:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead badge="Reparti operativi" title="Una squadra per ogni esigenza." />
            <Reveal variant="left">
              <Btn as={Link} href="/reparti" variant="secondary" icon="arrow-right">
                Tutti i reparti
              </Btn>
            </Reveal>
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] border-t border-line">
          <DeptCards depts={DEPTS} />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-20 md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-12 md:py-32">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHead badge="Carriera" title="Otto gradi, dalla prima divisa alla guida della Questura." />
            <Reveal delay={200}>
              <Btn as={Link} href="/qualifiche" variant="secondary" icon="arrow-right" className="mt-8">
                Tutti i gradi
              </Btn>
            </Reveal>
          </div>
          <RankTimeline items={GRADI} />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px]">
          <Cells cols="md:grid-cols-2">
            {[
              ['/notizie', '/assets/hero-slide-2.jpg', '30% 40%', 'Sul territorio', 'Le ultime notizie dalla Questura', 'Comunicati ufficiali, operazioni concluse e aggiornamenti sulla vita dei reparti.'],
              ['/prenota', '/assets/hero-slide-1.jpg', '80% 50%', 'Servizi al cittadino', 'Prenota un appuntamento', "Appuntamento in Questura, URP o porto d'armi: scegli il servizio che ti serve."],
            ].map(([href, img, pos, tag, title, text]) => (
              <Cell key={title}>
                <SpotCard className="h-full">
                  <Link href={href} className="group block h-full">
                    <Parallax src={img} pos={pos} amount={6} className="aspect-[16/9]" />
                    <div className="p-6 md:p-10">
                      <Mono>{tag}</Mono>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h3>
                      <p className="mt-2 text-muted">{text}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        Continua <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </Link>
                </SpotCard>
              </Cell>
            ))}
          </Cells>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-12 md:py-40">
          <Icon name="sparkles" size={26} className="mx-auto text-accent" />
          <ScrubText
            className="h-section mt-8 text-2xl md:text-5xl"
            text="“Indossare questa divisa significa scegliere ogni giorno di mettersi al servizio di chi ci circonda.”"
          />
          <Reveal delay={150}>
            <cite className="mt-8 block text-sm not-italic text-muted">— Commissario, Questura Centrale</cite>
          </Reveal>
        </div>
      </section>

      <CtaBox
        title="Entra a far parte del corpo."
        text="Le selezioni sono aperte tutto l'anno. Supera il colloquio, completa l'accademia e inizia il tuo percorso."
        action={
          <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
            Invia candidatura
          </Btn>
        }
      />
    </>
  );
}
