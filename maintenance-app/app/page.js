import Link from 'next/link';
import { Btn, Container, CtaBand, DeptRows, Label, Marquee, SectionTitle } from '../components/ui';
import { DEPTS, GRADI, STATS } from '../lib/data';

export default function HomePage() {
  return (
    <>
      <section className="border-b-2 border-ink">
        <Container className="pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="flex items-center justify-between">
            <Label>Polizia di Stato — Italian Paradise RP</Label>
            <Label className="hidden sm:inline-flex">Questura Centrale</Label>
          </div>
          <h1 className="display mt-8 text-[clamp(3.2rem,12vw,12.5rem)]">
            Al servizio della città,
            <br />
            <span className="text-accent">senza sosta.</span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="text-xl font-medium leading-snug md:col-span-6 md:text-2xl">
              Reparti specializzati, una carriera in otto gradi e una comunità che ogni giorno lavora per la
              sicurezza di tutti.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
              <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
                Invia candidatura
              </Btn>
              <Btn as={Link} href="/reparti" size="lg" variant="outline">
                Scopri i reparti
              </Btn>
            </div>
          </div>
        </Container>
        <div className="border-t-2 border-ink">
          <img
            src="/assets/hero-slide-1.jpg"
            alt="Questura Centrale di notte, volanti in sosta"
            className="h-[48vh] w-full object-cover object-[50%_62%] md:h-[68vh]"
          />
        </div>
      </section>

      <Marquee
        className="bg-accent text-white"
        items={['Polizia di Stato', 'Italian Paradise RP', 'Selezioni sempre aperte', 'Sicurezza 24/7', 'Sub Lege Libertas']}
      />

      <section className="border-b-2 border-ink">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map(([v, l], i) => (
              <div key={l} className={`py-10 md:py-14 ${i > 0 ? 'md:border-l-2 md:border-ink md:pl-8' : ''} ${i % 2 === 1 ? 'border-l-2 border-ink pl-5 md:pl-8' : ''} ${i > 1 ? 'border-t-2 border-ink md:border-t-0' : ''}`}>
                <div className="display text-[clamp(3.4rem,8vw,8rem)]">{v}</div>
                <div className="mono mt-4 text-xs text-mute">{l}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="Missione" />
          <div className="mt-10 grid gap-12 md:grid-cols-12">
            <h2 className="display text-[clamp(2.6rem,6.5vw,6.5rem)] md:col-span-8">
              Ordine, tutela e vicinanza al cittadino.
            </h2>
            <p className="text-lg leading-relaxed text-mute md:col-span-4 md:text-xl">
              La Questura Centrale coordina reparti specializzati che operano ogni giorno sul territorio: dal
              pattugliamento urbano alle indagini più complesse, ogni agente porta avanti lo stesso impegno verso la
              sicurezza pubblica.
            </p>
          </div>
          <ul className="mt-16 border-t-2 border-ink">
            {[
              ['Formazione', "Accademia & addestramento: dalle basi teoriche all'affiancamento sul campo con agenti esperti."],
              ['Carriera', 'Otto gradi, da Agente a Questore. Impegno, esperienza e capacità di comando vengono riconosciuti.'],
              ['Comunità', "L'Ufficio Relazioni Pubbliche è il punto di contatto diretto per segnalazioni, denunce e richieste."],
            ].map(([t, d], i) => (
              <li key={t} className="grid gap-3 border-b-2 border-ink py-7 md:grid-cols-12 md:items-baseline">
                <span className="mono text-sm font-bold text-accent md:col-span-1">0{i + 1}</span>
                <span className="display text-4xl md:col-span-5 md:text-6xl">{t}</span>
                <span className="text-lg text-mute md:col-span-6">{d}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16 md:pb-28">
        <Container>
          <SectionTitle n="02" label="Reparti operativi" title="Una squadra per ogni esigenza." />
          <div className="mt-12">
            <DeptRows
              depts={DEPTS}
              cta={
                <li className="py-8">
                  <Btn as={Link} href="/reparti" variant="outline" icon="arrow-right">
                    Tutti i reparti
                  </Btn>
                </li>
              }
            />
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-ink py-16 text-paper md:py-28">
        <Container>
          <Label n="03" className="text-paper/70">
            Una carriera, otto gradi
          </Label>
          <p className="display mt-10 text-[clamp(2.4rem,6vw,6rem)]">
            {GRADI.map(([name], i) => (
              <span key={name} className="mr-5 inline-block">
                {name}
                <sup className="mono ml-1 align-super text-[0.28em] font-bold text-accent">{String(i + 1).padStart(2, '0')}</sup>
                {i < GRADI.length - 1 ? <span className="text-paper/30"> /</span> : <span className="text-accent">.</span>}
              </span>
            ))}
          </p>
          <div className="mt-12">
            <Btn as={Link} href="/qualifiche" variant="outline-paper" icon="arrow-right">
              Tutti i gradi
            </Btn>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="04" label="Oltre il servizio" title="Resta in contatto." />
          <div className="mt-12 grid gap-px border-2 border-ink bg-ink md:grid-cols-2">
            {[
              ['/notizie', '/assets/hero-slide-2.jpg', '30% 40%', 'Sul territorio', 'Le ultime notizie dalla Questura', 'Comunicati ufficiali, operazioni concluse e aggiornamenti sulla vita dei reparti.'],
              ['/prenota', '/assets/hero-slide-1.jpg', '80% 50%', 'Servizi al cittadino', 'Prenota un appuntamento', "Appuntamento in Questura, URP o porto d'armi: scegli il servizio che ti serve."],
            ].map(([href, img, pos, tag, title, text]) => (
              <Link key={title} href={href} className="group bg-paper transition-colors hover:bg-accent hover:text-white">
                <img src={img} alt="" className="h-64 w-full object-cover md:h-80" style={{ objectPosition: pos }} />
                <div className="p-6 md:p-8">
                  <Label className="group-hover:text-white/80">{tag}</Label>
                  <h3 className="display mt-4 text-4xl md:text-5xl">{title}</h3>
                  <p className="mt-4 max-w-md text-lg text-mute group-hover:text-white/85">{text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink">
        <Container className="py-16 md:py-28">
          <blockquote className="display text-[clamp(2.2rem,5.5vw,5.5rem)]">
            &ldquo;Indossare questa divisa significa scegliere ogni giorno di mettersi al servizio di chi ci
            circonda.&rdquo;
          </blockquote>
          <cite className="mono mt-8 block text-xs not-italic text-mute">— Commissario, Questura Centrale</cite>
        </Container>
      </section>

      <CtaBand
        label="Concorso pubblico"
        title="Candidati."
        text="Le selezioni sono aperte tutto l'anno. Supera il colloquio, completa l'accademia e inizia il tuo percorso in uno dei nostri reparti."
        action={
          <Btn as={Link} href="/concorso" variant="paper" size="lg" icon="arrow-right">
            Invia candidatura
          </Btn>
        }
      />
    </>
  );
}
