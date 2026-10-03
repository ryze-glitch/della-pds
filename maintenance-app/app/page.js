import Link from 'next/link';
import { Btn, Card, Container, Overline, Section } from '../components/ui';

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[80vh] items-end overflow-hidden">
        <img
          src="/assets/hero-slide-1.jpg"
          alt="Questura Centrale di notte, volanti in sosta"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <Container className="relative z-10 pb-16 pt-32 text-white">
          <Overline>
            <span className="text-primary-soft">Polizia di Stato — Italian Paradise RP</span>
          </Overline>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
            Al servizio della città, senza sosta
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn as={Link} href="/concorso" lg iconEnd="arrow_forward">
              Invia candidatura
            </Btn>
            <Btn as={Link} href="/reparti" variant="tonal" lg>
              Scopri i reparti
            </Btn>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl">
          <Overline>Missione</Overline>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Ordine, tutela e vicinanza al cittadino
          </h2>
          <p className="mt-4 text-lg text-ink-dim">
            La Questura Centrale coordina reparti specializzati che operano ogni giorno sul territorio: dal
            pattugliamento urbano alle indagini più complesse, ogni agente porta avanti lo stesso impegno verso la
            sicurezza pubblica.
          </p>
        </Container>
      </Section>

      <Section tight>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <img src="/assets/hero-slide-2.jpg" alt="Distintivo e uniforme della Polizia" className="rounded-3xl object-cover" />
          <div>
            <Overline>La Questura</Overline>
            <h2 className="mt-3 font-display text-3xl font-semibold">Una tradizione di servizio che continua ogni giorno</h2>
            <p className="mt-4 text-lg text-ink-dim">
              La Questura Centrale è il cuore operativo della Polizia di Stato: qui si coordinano i reparti, si
              formano le nuove reclute e si costruisce il rapporto di fiducia con la comunità.
            </p>
            <Btn as={Link} href="/chi-siamo" variant="tonal" iconEnd="arrow_forward" className="mt-6">
              Scopri la nostra storia
            </Btn>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>Reparti Operativi</Overline>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold">
            Squadre specializzate per ogni esigenza del territorio
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-dim">
            Dal Reparto Volanti al Nucleo Operativo Speciale, ogni divisione risponde a una parte specifica della
            sicurezza cittadina, con procedure e catena di comando dedicate.
          </p>
        </Container>
        <div className="mt-8 flex gap-4 overflow-x-auto px-6 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          {[
            ['Reparto Volanti', '/assets/hero-slide-1.jpg'],
            ['Squadra Investigativa', '/assets/hero-slide-2.jpg'],
            ['Nucleo Operativo Speciale', '/assets/hero-slide-1.jpg'],
            ['Polizia Stradale', '/assets/hero-slide-2.jpg'],
          ].map(([label, img]) => (
            <Link
              key={label}
              href="/reparti"
              className="relative h-64 w-48 flex-none overflow-hidden rounded-2xl"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img src={img} alt={label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-medium text-white">{label}</span>
            </Link>
          ))}
        </div>
        <Container className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold">I nostri reparti</h3>
            <p className="text-ink-dim">Ogni divisione ha una missione precisa e un ruolo definito nella catena operativa.</p>
          </div>
          <Btn as={Link} href="/reparti" variant="tonal" iconEnd="arrow_forward">
            Vedi tutti i reparti
          </Btn>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>Una carriera, otto gradi</Overline>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold">
            Dalla prima divisa alla guida della Questura
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-dim">
            Ogni grado riconosce esperienza, impegno e capacità di comando.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              ['school', 'Formazione', "Accademia & Addestramento", "Ogni recluta segue un percorso strutturato, dalle basi teoriche all'affiancamento sul campo con agenti esperti."],
              ['military_tech', 'Carriera', 'Otto gradi, un solo obiettivo', 'Da Agente a Questore, la progressione di carriera riconosce impegno, esperienza e capacità di comando.'],
              ['handshake', 'Comunità', 'Vicini al cittadino', "L'Ufficio Relazioni Pubbliche garantisce un punto di contatto diretto per segnalazioni, denunce e richieste."],
            ].map(([icon, overline, title, text]) => (
              <Card key={title} className="p-6">
                <Overline>{overline}</Overline>
                <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{text}</p>
              </Card>
            ))}
          </div>
          <Btn as={Link} href="/qualifiche" variant="text" iconEnd="arrow_forward" className="mt-6 !px-0">
            Scopri tutti i gradi
          </Btn>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>Oltre il servizio</Overline>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold">Resta in contatto con la Questura</h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-dim">
            Dalle ultime notizie ai servizi per il cittadino, tutto quello che ti serve è a un clic di distanza.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card>
              <img src="/assets/hero-slide-1.jpg" alt="Veduta della città al tramonto" className="h-56 w-full object-cover" />
              <div className="p-6">
                <Overline>Sul territorio</Overline>
                <h3 className="mt-2 font-display text-xl font-semibold">Le ultime notizie dalla Questura</h3>
                <p className="mt-2 text-sm text-ink-dim">
                  Comunicati ufficiali, operazioni concluse e aggiornamenti sulla vita dei reparti.
                </p>
                <Btn as={Link} href="/notizie" variant="tonal" iconEnd="arrow_forward" className="mt-5">
                  Leggi le notizie
                </Btn>
              </div>
            </Card>
            <Card>
              <img src="/assets/hero-slide-2.jpg" alt="Ufficio della Questura" className="h-56 w-full object-cover" />
              <div className="p-6">
                <Overline>Servizi al cittadino</Overline>
                <h3 className="mt-2 font-display text-xl font-semibold">Prenota un appuntamento</h3>
                <p className="mt-2 text-sm text-ink-dim">
                  Appuntamento in Questura, URP o porto d&apos;armi: scegli il servizio che ti serve.
                </p>
                <Btn as={Link} href="/prenota" variant="tonal" iconEnd="arrow_forward" className="mt-5">
                  Vai ai servizi
                </Btn>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container className="max-w-3xl text-center">
          <blockquote className="font-display text-2xl font-semibold sm:text-3xl">
            &ldquo;Indossare questa divisa significa scegliere ogni giorno di mettersi al servizio di chi ci
            circonda.&rdquo;
          </blockquote>
          <cite className="mt-4 block text-ink-dim">— Commissario, Questura Centrale</cite>
        </Container>
      </Section>

      <Section className="pb-24 pt-0">
        <Container>
          <div className="grid items-center gap-8 rounded-3xl bg-primary-soft p-8 text-on-primary-soft sm:grid-cols-2 sm:p-12">
            <div>
              <Overline>
                <span className="text-on-primary-soft/80">Concorso pubblico</span>
              </Overline>
              <h2 className="mt-3 font-display text-3xl font-semibold">Entra a far parte del corpo</h2>
              <p className="mt-3 text-on-primary-soft/90">
                Le selezioni per diventare agente sono aperte tutto l&apos;anno. Supera il colloquio, completa la
                formazione in accademia e inizia il tuo percorso in uno dei nostri reparti.
              </p>
              <Btn as={Link} href="/concorso" iconEnd="arrow_forward" className="mt-6">
                Invia candidatura
              </Btn>
            </div>
            <img src="/assets/hero-slide-2.jpg" alt="Nuove reclute in formazione" className="hidden rounded-2xl object-cover sm:block" />
          </div>
        </Container>
      </Section>
    </>
  );
}
