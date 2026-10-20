import Link from 'next/link';
import { Btn, Container, CtaBand, Label, PageHero, SectionTitle } from '../../components/ui';

export const metadata = { title: 'Notizie — Polizia di Stato — Italian Paradise RP' };

const NEWS = [
  ['12 Agosto 2026', "Il Nucleo Operativo Speciale rafforza l'organico", "A seguito degli ultimi interventi ad alto rischio, il Nucleo Operativo Speciale ha aperto una selezione interna per rafforzare l'organico. I candidati dovranno superare una prova fisica e un colloquio tattico con i responsabili di reparto.", '/assets/hero-slide-2.jpg', '80% 50%'],
  ['5 Agosto 2026', 'Nuovi turni per la Polizia Stradale', 'Da questo mese la Polizia Stradale adotta una nuova turnazione per garantire una copertura più costante delle arterie principali della città, in particolare nelle ore serali dei fine settimana.', '/assets/hero-slide-1.jpg', '10% 60%'],
];

export default function NotiziePage() {
  return (
    <>
      <PageHero
        label="Comunicati & aggiornamenti"
        title="Le nostre notizie."
        text="Comunicati ufficiali, aggiornamenti sui reparti e storie dal campo: qui raccontiamo cosa succede ogni giorno nella Polizia di Stato di Italian Paradise RP."
        img="/assets/hero-slide-2.jpg"
        pos="center 40%"
      />

      <section className="py-16 md:py-28">
        <Container>
          <SectionTitle n="01" label="In evidenza" />
          <article className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <img src="/assets/hero-slide-1.jpg" alt="Nuove reclute in formazione in accademia" className="h-72 w-full border-2 border-ink object-cover md:h-full md:min-h-[26rem]" />
            <div className="flex flex-col justify-center">
              <Label>18 Agosto 2026</Label>
              <h2 className="display mt-5 text-[clamp(2.6rem,6vw,6rem)]">Al via il nuovo corso per le reclute.</h2>
              <p className="mt-6 text-lg leading-relaxed text-mute">
                Ha preso il via questa settimana il nuovo ciclo di formazione in accademia: dodici nuove reclute
                inizieranno un percorso di otto settimane tra teoria, addestramento fisico e affiancamento sul campo
                prima dell&apos;assegnazione ai reparti.
              </p>
              <div className="mt-8">
                <Btn as="button" type="button" variant="outline" icon="arrow-right">
                  Leggi tutto
                </Btn>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <section className="pb-16 md:pb-28">
        <Container>
          <SectionTitle n="02" label="Archivio" />
          <ul className="mt-10 border-t-2 border-ink">
            {NEWS.map(([date, title, text, img, pos]) => (
              <li key={title} className="grid gap-6 border-b-2 border-ink py-10 md:grid-cols-12 md:items-center">
                <Label className="md:col-span-2">{date}</Label>
                <h3 className="display text-4xl md:col-span-5 md:text-5xl">{title}</h3>
                <p className="text-lg text-mute md:col-span-3">{text}</p>
                <img src={img} alt="" className="hidden h-28 w-full object-cover md:col-span-2 md:block" style={{ objectPosition: pos }} />
              </li>
            ))}
            {[
              ['Nuove volanti in dotazione al Reparto', 'Consegnati questa settimana due nuovi veicoli per il pattugliamento del centro città.'],
              ['URP: nuovi orari di sportello', "L'Ufficio Relazioni Pubbliche estende gli orari di apertura per le segnalazioni dei cittadini."],
            ].map(([title, text]) => (
              <li key={title} className="grid gap-3 border-b-2 border-ink py-7 md:grid-cols-12 md:items-baseline">
                <Label className="md:col-span-2">In breve</Label>
                <h3 className="text-2xl font-extrabold md:col-span-5">{title}</h3>
                <p className="text-mute md:col-span-5">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        label="Resta aggiornato"
        title="Entra su Discord."
        text="Ricevi le ultime notizie e i comunicati della Questura direttamente sul canale Discord di IPRP."
        action={
          <Btn href="#" variant="paper" size="lg" icon="arrow-up-right">
            Unisciti al Discord
          </Btn>
        }
      />
    </>
  );
}
