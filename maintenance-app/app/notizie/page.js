import { BackHome, Container, Eyebrow, Rule, Section } from '../../components/ui';

export const metadata = { title: 'Notizie — Polizia di Stato — Italian Paradise RP' };

export default function NotiziePage() {
  return (
    <>
      <section className="grain relative flex h-96 items-end overflow-hidden border-b border-line">
        <img src="/assets/hero-slide-2.jpg" alt="Questura Centrale di giorno" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
        <Container className="relative z-10 pb-14">
          <Eyebrow>Comunicati &amp; Aggiornamenti</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Le nostre notizie</h1>
        </Container>
      </section>

      <Section>
        <Container>
          <Eyebrow n="01">Dalla Questura</Eyebrow>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-dim">
            Comunicati ufficiali, aggiornamenti sui reparti e storie dal campo: qui raccontiamo cosa succede ogni
            giorno all&apos;interno della Polizia di Stato di Italian Paradise RP.
          </p>

          <div className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden bg-bg lg:aspect-auto">
              <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="h-full w-full object-cover opacity-60 grayscale" />
            </div>
            <div className="bg-bg p-8">
              <Eyebrow>18 Agosto 2026</Eyebrow>
              <h3 className="mt-3 font-display text-2xl font-semibold">Al via il nuovo corso per le reclute</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                Ha preso il via questa settimana il nuovo ciclo di formazione in accademia: dodici nuove reclute
                inizieranno un percorso di otto settimane tra teoria, addestramento fisico e affiancamento sul campo
                prima dell&apos;assegnazione ai reparti.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-primary">Leggi tutto →</span>
            </div>
          </div>

          <div className="mt-px grid gap-px border-x border-b border-line bg-line sm:grid-cols-2">
            <div className="bg-bg p-8">
              <Eyebrow>12 Agosto 2026</Eyebrow>
              <h3 className="mt-3 font-display text-lg font-semibold">Il Nucleo Operativo Speciale rafforza l&apos;organico</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                A seguito degli ultimi interventi ad alto rischio, il Nucleo Operativo Speciale ha aperto una
                selezione interna per rafforzare l&apos;organico.
              </p>
            </div>
            <div className="bg-bg p-8">
              <Eyebrow>5 Agosto 2026</Eyebrow>
              <h3 className="mt-3 font-display text-lg font-semibold">Nuovi turni per la Polizia Stradale</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                Da questo mese la Polizia Stradale adotta una nuova turnazione per garantire una copertura più
                costante delle arterie principali della città.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Rule />

      <Section>
        <Container>
          <Eyebrow n="02">In Breve</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold">Altri aggiornamenti</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <ul className="divide-y divide-line border-y border-line">
              <li className="flex gap-5 py-5">
                <img src="/assets/hero-slide-2.jpg" alt="Volante della Polizia" className="h-16 w-24 flex-none object-cover opacity-70 grayscale" />
                <div>
                  <h3 className="font-semibold">Nuove volanti in dotazione al Reparto</h3>
                  <p className="mt-1 text-sm text-ink-dim">Consegnati questa settimana due nuovi veicoli per il pattugliamento del centro città.</p>
                </div>
              </li>
              <li className="flex gap-5 py-5">
                <img src="/assets/hero-slide-1.jpg" alt="Ufficio Relazioni Pubbliche" className="h-16 w-24 flex-none object-cover opacity-70 grayscale" />
                <div>
                  <h3 className="font-semibold">URP: nuovi orari di sportello</h3>
                  <p className="mt-1 text-sm text-ink-dim">L&apos;Ufficio Relazioni Pubbliche estende gli orari di apertura per le segnalazioni dei cittadini.</p>
                </div>
              </li>
            </ul>
            <div className="border border-line p-7">
              <h3 className="font-display text-lg font-semibold">Resta aggiornato</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                Ricevi le ultime notizie e i comunicati della Questura direttamente sul canale Discord di IPRP.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-primary">Unisciti al Discord →</span>
            </div>
          </div>
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
