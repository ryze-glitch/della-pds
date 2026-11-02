import Link from 'next/link';
import { Icon } from '../../components/icons';
import { MiePratiche } from '../../components/MiePratiche';
import { Widget } from '../../components/Widget';
import { HeroTrack } from '../../components/forms/HeroTrack';
import { Bacheca } from '../../components/Bacheca';
import { Crest3D } from '../../components/Crest3D';
import { DEPTS } from '../../lib/data';

const SERVIZI = [
  { icon: 'file-text', titolo: 'Denuncia online', testo: 'Furto, rapina, aggressione, truffa', href: '/sportello/denuncia' },
  { icon: 'shield-check', titolo: "Porto d'armi (PDA)", testo: 'Nuovo, rinnovo e uso sportivo', href: '/sportello/porto-darmi' },
  { icon: 'calendar-check', titolo: 'Colloquio con i dirigenti', testo: 'Prenota un appuntamento', href: '/sportello/colloquio' },
  { icon: 'search', titolo: 'Stato della pratica', testo: 'Controlla con il codice', href: '/sportello/pratica' },
  { icon: 'briefcase', titolo: 'Bandi e reclutamento', testo: 'Selezioni sempre aperte', href: '/reclutamento' },
];

const PASSI = ['Compila', 'Invia', 'Codice', 'Esito'];

export default function HomePage() {
  return (
    <>
      <section className="px-5 pb-4" aria-labelledby="titolo-home">
        <ol className="mb-5 flex gap-1.5" aria-label="Come funziona: compila, invia, ricevi il codice, segui l'esito">
          {PASSI.map((p, i) => (
            <li key={p} className="flex-1">
              <div className={`h-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
              <span className="sr-only">{`Passo ${i + 1}: ${p}`}</span>
            </li>
          ))}
        </ol>
        <p className="hero-in text-[16px] text-white/80">Benvenuto allo sportello</p>
        <h1 id="titolo-home" className="h1 hero-in mt-3 font-bold uppercase" style={{ '--d': '80ms' }}>Pronto a presentare la tua pratica online?</h1>
        <div className="hero-in relative mx-auto my-6 flex h-[300px] w-full items-center justify-center" style={{ '--d': '160ms' }}>
          <Crest3D className="relative h-[290px] w-[230px]" fallbackClass="h-[260px] w-auto" glow={false} />
        </div>
        <div className="hero-in space-y-3" style={{ '--d': '240ms' }}>
          <Link href="/sportello/denuncia" className="btn">Presenta una denuncia</Link>
          <Link href="/sportello/pratica" className="btn-dark">Segui una pratica</Link>
        </div>
      </section>

      <div className="space-y-4 px-5 pt-8">
        <section className="card p-2" aria-label="Servizi">
          <ul>
            {SERVIZI.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex min-h-[72px] items-center gap-4 rounded-[18px] px-3 py-3 transition-colors hover:bg-white/5">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface2">
                    <Icon name={s.icon} size={22} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[18px] font-semibold leading-tight tracking-[-0.01em]">{s.titolo}</span>
                    <span className="block text-[15px] text-muted">{s.testo}</span>
                  </span>
                  <Icon name="chevron" size={20} className="flex-none text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Widget icon="file-text" title="Le tue pratiche" href="/sportello/pratica">
          <MiePratiche compact />
          <div className="mt-3 border-t border-line pt-4">
            <div className="mb-3 text-[15px] text-muted">Hai un codice? Inseriscilo qui.</div>
            <HeroTrack />
          </div>
        </Widget>

        <Bacheca />

        <Widget icon="users" title="Reparti" href="/organigramma">
          <ul className="flex flex-wrap gap-2 pt-1">
            {DEPTS.map((d) => (
              <li key={d.name} className="chip">{d.name}</li>
            ))}
          </ul>
        </Widget>

        <Link href="/reclutamento" className="card block p-6 transition-colors hover:bg-surface2">
          <span className="label">Reclutamento</span>
          <span className="h2 mt-3 block">Entra nella Polizia di Stato</span>
          <span className="mt-2 block text-[16px] text-muted">Selezioni sempre aperte, formazione in Accademia e affiancamento sul campo.</span>
          <span className="btn mt-5">Scopri i bandi</span>
        </Link>
      </div>
    </>
  );
}
