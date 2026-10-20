import Link from 'next/link';
import { Badge, Btn, Cell, Cells, CtaBox, DeptCards, Inner, Mono, Section, SectionHead } from '../components/ui';
import { Icon } from '../components/icons';
import { DEPTS, GRADI, STATS } from '../lib/data';

export default function HomePage() {
  return (
    <>
      <Section first>
        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
          />
          <div className="relative px-5 pb-14 pt-16 text-center md:px-12 md:pb-20 md:pt-28">
            <Link href="/concorso">
              <Badge className="hover:border-fg hover:text-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Selezioni aperte tutto l&apos;anno
                <Icon name="arrow-right" size={12} />
              </Badge>
            </Link>
            <h1 className="h-display mx-auto mt-7 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
              Al servizio della città, senza sosta.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Reparti specializzati, una carriera in otto gradi e una comunità che ogni giorno lavora per la
              sicurezza di tutti. Entra nella Questura Centrale.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Btn as={Link} href="/concorso" size="lg" icon="arrow-right">
                Invia candidatura
              </Btn>
              <Btn as={Link} href="/reparti" size="lg" variant="secondary">
                Scopri i reparti
              </Btn>
            </div>
          </div>
        </div>
        <div className="border-t border-line p-3 md:p-6">
          <img
            src="/assets/hero-slide-1.jpg"
            alt="Questura Centrale di notte, volanti in sosta"
            className="h-[300px] w-full rounded-lg border border-line object-cover object-[50%_62%] md:h-[520px]"
          />
        </div>
      </Section>

      <Section>
        <Cells cols="grid-cols-2 md:grid-cols-4">
          {STATS.map(([v, l]) => (
            <Cell key={l} className="px-6 py-8 md:px-8 md:py-10">
              <div className="text-4xl font-semibold tracking-tighter md:text-5xl">{v}</div>
              <div className="mt-2 text-sm text-muted">{l}</div>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner>
          <SectionHead
            badge="Missione"
            title="Ordine, tutela e vicinanza al cittadino."
            text="Dal pattugliamento urbano alle indagini più complesse, ogni agente porta avanti lo stesso impegno verso la sicurezza pubblica."
          />
        </Inner>
        <Cells cols="md:grid-cols-3" className="border-t border-line">
          {[
            ['graduation', 'Formazione', 'Accademia & addestramento', "Un percorso strutturato dalle basi teoriche all'affiancamento sul campo con agenti esperti."],
            ['medal', 'Carriera', 'Otto gradi, un solo obiettivo', 'Da Agente a Questore: impegno, esperienza e capacità di comando vengono riconosciuti.'],
            ['handshake', 'Comunità', 'Vicini al cittadino', "L'Ufficio Relazioni Pubbliche è il punto di contatto diretto per segnalazioni, denunce e richieste."],
          ].map(([icon, tag, title, text]) => (
            <Cell key={title} className="p-6 md:p-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line2">
                <Icon name={icon} size={18} />
              </span>
              <Mono className="mt-6 block">{tag}</Mono>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner className="!pb-12 md:!pb-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead badge="Reparti operativi" title="Una squadra per ogni esigenza." />
            <Btn as={Link} href="/reparti" variant="secondary" icon="arrow-right">
              Tutti i reparti
            </Btn>
          </div>
        </Inner>
        <div className="border-t border-line">
          <DeptCards depts={DEPTS} />
        </div>
      </Section>

      <Section>
        <Inner className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div>
            <SectionHead badge="Carriera" title="Otto gradi, dalla prima divisa alla guida della Questura." />
            <Btn as={Link} href="/qualifiche" variant="secondary" icon="arrow-right" className="mt-8">
              Tutti i gradi
            </Btn>
          </div>
          <ol className="border-t border-line">
            {GRADI.map(([name, text], i) => (
              <li key={name} className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-line py-4">
                <Mono className="pt-1">{String(i + 1).padStart(2, '0')}</Mono>
                <div>
                  <span className="font-semibold">{name}</span>
                  <p className="mt-0.5 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Inner>
      </Section>

      <Section>
        <Cells cols="md:grid-cols-2">
          {[
            ['/notizie', '/assets/hero-slide-2.jpg', '30% 40%', 'Sul territorio', 'Le ultime notizie dalla Questura', 'Comunicati ufficiali, operazioni concluse e aggiornamenti sulla vita dei reparti.'],
            ['/prenota', '/assets/hero-slide-1.jpg', '80% 50%', 'Servizi al cittadino', 'Prenota un appuntamento', "Appuntamento in Questura, URP o porto d'armi: scegli il servizio che ti serve."],
          ].map(([href, img, pos, tag, title, text]) => (
            <Cell key={title}>
              <Link href={href} className="group block h-full hover:bg-bg2">
                <div className="overflow-hidden">
                  <img src={img} alt="" className="aspect-[16/8] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" style={{ objectPosition: pos }} />
                </div>
                <div className="p-6 md:p-8">
                  <Mono>{tag}</Mono>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-muted">{text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Continua <Icon name="arrow-right" size={14} />
                  </span>
                </div>
              </Link>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner className="mx-auto max-w-3xl text-center">
          <blockquote className="h-section text-2xl md:text-4xl">
            &ldquo;Indossare questa divisa significa scegliere ogni giorno di mettersi al servizio di chi ci
            circonda.&rdquo;
          </blockquote>
          <cite className="mt-6 block text-sm not-italic text-muted">— Commissario, Questura Centrale</cite>
        </Inner>
      </Section>

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
