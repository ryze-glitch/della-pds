import { Btn, BackHome, Card, Container, Overline, Section } from '../../components/ui';

export const metadata = { title: 'Notizie — Polizia di Stato — Italian Paradise RP' };

export default function NotiziePage() {
  return (
    <>
      <section className="relative flex h-80 items-end overflow-hidden">
        <img src="/assets/hero-slide-2.jpg" alt="Questura Centrale di giorno" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <Container className="relative z-10 pb-10 text-white">
          <Overline>
            <span className="text-primary-soft">Comunicati &amp; Aggiornamenti</span>
          </Overline>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Le nostre notizie</h1>
        </Container>
      </section>

      <Section>
        <Container>
          <Overline>Dalla Questura</Overline>
          <p className="mt-3 max-w-2xl text-lg font-medium">
            Comunicati ufficiali, aggiornamenti sui reparti e storie dal campo: qui raccontiamo cosa succede ogni
            giorno all&apos;interno della Polizia di Stato di Italian Paradise RP.
          </p>

          <Card className="mt-8 grid overflow-hidden lg:grid-cols-2">
            <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="h-64 w-full object-cover lg:h-full" />
            <div className="p-6">
              <Overline>18 Agosto 2026</Overline>
              <h3 className="mt-2 font-display text-xl font-semibold">Al via il nuovo corso per le reclute</h3>
              <p className="mt-2 text-sm text-ink-dim">
                Ha preso il via questa settimana il nuovo ciclo di formazione in accademia: dodici nuove reclute
                inizieranno un percorso di otto settimane tra teoria, addestramento fisico e affiancamento sul campo
                prima dell&apos;assegnazione ai reparti.
              </p>
              <Btn variant="text" iconEnd="arrow_forward" className="mt-4 !px-0">
                Leggi tutto
              </Btn>
            </div>
          </Card>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <img src="/assets/hero-slide-2.jpg" alt="Intervento del Nucleo Operativo Speciale" className="h-44 w-full object-cover" />
              <div className="p-5">
                <Overline>12 Agosto 2026</Overline>
                <h3 className="mt-2 font-display text-lg font-semibold">Il Nucleo Operativo Speciale rafforza l&apos;organico</h3>
                <p className="mt-2 text-sm text-ink-dim">
                  A seguito degli ultimi interventi ad alto rischio, il Nucleo Operativo Speciale ha aperto una
                  selezione interna per rafforzare l&apos;organico.
                </p>
              </div>
            </Card>
            <Card>
              <img src="/assets/hero-slide-1.jpg" alt="Pattuglia della Polizia Stradale" className="h-44 w-full object-cover" />
              <div className="p-5">
                <Overline>5 Agosto 2026</Overline>
                <h3 className="mt-2 font-display text-lg font-semibold">Nuovi turni per la Polizia Stradale</h3>
                <p className="mt-2 text-sm text-ink-dim">
                  Da questo mese la Polizia Stradale adotta una nuova turnazione per garantire una copertura più
                  costante delle arterie principali della città.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <Overline>In Breve</Overline>
          <h2 className="mt-2 font-display text-3xl font-semibold">Altri aggiornamenti</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-5">
              <li className="flex gap-4">
                <img src="/assets/hero-slide-2.jpg" alt="Volante della Polizia" className="h-16 w-24 flex-none rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold">Nuove volanti in dotazione al Reparto</h3>
                  <p className="text-sm text-ink-dim">Consegnati questa settimana due nuovi veicoli per il pattugliamento del centro città.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <img src="/assets/hero-slide-1.jpg" alt="Ufficio Relazioni Pubbliche" className="h-16 w-24 flex-none rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold">URP: nuovi orari di sportello</h3>
                  <p className="text-sm text-ink-dim">L&apos;Ufficio Relazioni Pubbliche estende gli orari di apertura per le segnalazioni dei cittadini.</p>
                </div>
              </li>
            </ul>
            <Card className="bg-primary-soft p-6 text-on-primary-soft">
              <h3 className="font-display text-lg font-semibold">Resta aggiornato</h3>
              <p className="mt-2 text-sm text-on-primary-soft/90">
                Ricevi le ultime notizie e i comunicati della Questura direttamente sul canale Discord di IPRP.
              </p>
              <Btn href="#" iconEnd="arrow_forward" className="mt-5">
                Unisciti al Discord
              </Btn>
            </Card>
          </div>
        </Container>
      </Section>
      <BackHome />
    </>
  );
}
