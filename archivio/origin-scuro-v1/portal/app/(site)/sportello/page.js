import Link from 'next/link';
import { IconTile, Notice, PageHeader, Container } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { Reveal } from '../../../components/Reveal';
import { SERVIZI } from '../../../lib/data';

export const metadata = { title: 'Sportello Cittadino — Questura IPRP' };

const SERVE = {
  '/sportello/denuncia': 'Dati del personaggio, luogo e data dei fatti, dinamica. Facoltativi: testimoni e link alle prove.',
  '/sportello/porto-darmi': 'Dati anagrafici (maggiore età IC), motivazione, dichiarazione di assenza di precedenti e visita medica.',
  '/sportello/colloquio': 'Dati del personaggio, con chi vuoi parlare, data e fascia oraria preferite, motivo.',
  '/sportello/pratica': 'Il codice pratica ricevuto all’invio, ad esempio POL-2026-K7M2QX.',
};

export default function SportelloPage() {
  return (
    <>
      <PageHeader
        title="Sportello Telematico"
        text="Denunce, porto d’armi e colloqui con la dirigenza, senza code. Ogni richiesta riceve un codice univoco per il tracciamento."
        crumbs={[{ label: 'Sportello Cittadino' }]}
      />
      <Container className="py-10 md:py-14">
        <div className="divide-y divide-line border-y border-line">
          {SERVIZI.map((s, i) => (
            <Reveal key={s.href} delay={i * 60}>
              <Link href={s.href} className="group grid items-center gap-x-8 gap-y-3 py-7 transition hover:bg-white/[0.02] md:grid-cols-[56px_1fr_1.1fr_32px]">
                <IconTile name={s.icon} className="!h-12 !w-12" />
                <div>
                  <h2 className="text-xl font-semibold">{s.title}</h2>
                  <p className="mt-1 text-[13.5px] text-muted">{s.text}</p>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Cosa serve</div>
                  <p className="mt-1 text-[13.1px] leading-relaxed text-fg/85">{SERVE[s.href]}</p>
                </div>
                <Icon name="arrow-right" size={20} className="hidden text-muted transition-transform group-hover:translate-x-1 md:block" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Notice tone="gold" title="Servizio in-character" className="mt-8">
          Lo Sportello fa parte del gioco di ruolo del server Italian Paradise XI. Non usarlo per segnalazioni reali: in
          caso di emergenza reale chiama il <strong className="text-fg">112</strong>.
        </Notice>
      </Container>
    </>
  );
}
