import { Btn, Cell, Cells, CtaBox, Inner, Mono, PageHero, Section, SectionHead } from '../../components/ui';

export const metadata = { title: 'Notizie — Polizia di Stato — Italian Paradise RP' };

const NEWS = [
  ['12 Agosto 2026', "Il Nucleo Operativo Speciale rafforza l'organico", "A seguito degli ultimi interventi ad alto rischio, il Nucleo Operativo Speciale ha aperto una selezione interna per rafforzare l'organico. I candidati dovranno superare una prova fisica e un colloquio tattico.", '/assets/hero-slide-2.jpg', '80% 50%'],
  ['5 Agosto 2026', 'Nuovi turni per la Polizia Stradale', 'Da questo mese la Polizia Stradale adotta una nuova turnazione per garantire una copertura più costante delle arterie principali della città, in particolare nelle ore serali dei fine settimana.', '/assets/hero-slide-1.jpg', '10% 60%'],
];

export default function NotiziePage() {
  return (
    <>
      <PageHero
        badge="Comunicati & aggiornamenti"
        title="Le nostre notizie."
        text="Comunicati ufficiali, aggiornamenti sui reparti e storie dal campo: cosa succede ogni giorno nella Polizia di Stato di Italian Paradise RP."
      />

      <Section>
        <div className="grid md:grid-cols-2">
          <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="h-72 w-full object-cover md:h-full md:min-h-[24rem]" />
          <div className="flex flex-col justify-center border-t border-line p-6 md:border-l md:border-t-0 md:p-12">
            <Mono>18 Agosto 2026 · In evidenza</Mono>
            <h2 className="h-section mt-4 text-3xl md:text-4xl">Al via il nuovo corso per le reclute.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Ha preso il via questa settimana il nuovo ciclo di formazione in accademia: dodici nuove reclute
              inizieranno un percorso di otto settimane tra teoria, addestramento fisico e affiancamento sul campo
              prima dell&apos;assegnazione ai reparti.
            </p>
            <div className="mt-7">
              <Btn as="button" type="button" variant="secondary" icon="arrow-right">
                Leggi tutto
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Cells cols="md:grid-cols-2">
          {NEWS.map(([date, title, text, img, pos]) => (
            <Cell key={title}>
              <img src={img} alt="" className="aspect-[16/8] w-full object-cover" style={{ objectPosition: pos }} />
              <div className="p-6 md:p-8">
                <Mono>{date}</Mono>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </div>
            </Cell>
          ))}
        </Cells>
      </Section>

      <Section>
        <Inner>
          <SectionHead badge="In breve" title="Altri aggiornamenti." />
          <ul className="mt-10 border-t border-line">
            {[
              ['Nuove volanti in dotazione al Reparto', 'Consegnati questa settimana due nuovi veicoli per il pattugliamento del centro città.'],
              ['URP: nuovi orari di sportello', "L'Ufficio Relazioni Pubbliche estende gli orari di apertura per le segnalazioni dei cittadini."],
            ].map(([title, text]) => (
              <li key={title} className="grid gap-1 border-b border-line py-5 md:grid-cols-[1fr_1.4fr] md:gap-8">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Inner>
      </Section>

      <CtaBox
        title="Resta aggiornato su Discord."
        text="Ricevi le ultime notizie e i comunicati della Questura direttamente sul canale Discord di IPRP."
        action={
          <Btn href="#" size="lg" icon="arrow-up-right">
            Unisciti al Discord
          </Btn>
        }
      />
    </>
  );
}
