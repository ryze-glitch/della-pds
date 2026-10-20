'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Lenis from 'lenis';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// ---------------------------------------------------------------------------
// Coordinamento con la schermata d'ingresso: gli elementi "afterIntro"
// aspettano che la tendina si alzi prima di animarsi.
// ---------------------------------------------------------------------------
function onIntroDone(cb) {
  if (typeof window === 'undefined') return () => {};
  if (window.__introDone) {
    cb();
    return () => {};
  }
  window.addEventListener('intro-done', cb, { once: true });
  return () => window.removeEventListener('intro-done', cb);
}

function useInView(ref, { threshold = 0.12, rootMargin = '0px 0px -8% 0px', afterIntro = false } = {}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io;
    const start = () => {
      if (typeof IntersectionObserver === 'undefined') {
        setOn(true);
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        },
        { threshold, rootMargin }
      );
      io.observe(el);
    };
    const off = afterIntro ? onIntroDone(start) : (start(), () => {});
    return () => {
      if (io) io.disconnect();
      off();
    };
  }, []);
  return on;
}

// ---------------------------------------------------------------------------
// Rivelazione allo scroll (varianti: up, left, right, scale, blur)
// ---------------------------------------------------------------------------
export function Reveal({ children, className = '', delay = 0, variant = 'up', afterIntro = false }) {
  const ref = useRef(null);
  const on = useInView(ref, { afterIntro });
  return (
    <div ref={ref} className={`rv rv-${variant} ${on ? 'is-in' : ''} ${className}`} style={delay ? { '--rd': `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Titolo che entra parola per parola, con maschera
// ---------------------------------------------------------------------------
export function SplitText({ text, as: Tag = 'span', className = '', afterIntro = false, baseDelay = 0, step = 60, accentFrom = -1 }) {
  const ref = useRef(null);
  const on = useInView(ref, { afterIntro, threshold: 0.2 });
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`split ${on ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span aria-hidden="true" className="w">
            <span
              className={`wi ${accentFrom >= 0 && i >= accentFrom ? 'text-grad' : ''}`}
              style={{ '--i': i, '--base': `${baseDelay}ms`, '--step': `${step}ms` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Contatore animato
// ---------------------------------------------------------------------------
export function Counter({ to, suffix = '', duration = 1800, className = '' }) {
  const ref = useRef(null);
  const on = useInView(ref, { threshold: 0.4 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = clamp((now - start) / duration);
      setV(Math.round(easeOutExpo(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  return (
    <span ref={ref} className={className}>
      {v}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card con riflettore che segue il mouse
// ---------------------------------------------------------------------------
export function SpotCard({ children, className = '' }) {
  const ref = useRef(null);
  function move(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
  return (
    <div ref={ref} onMouseMove={move} className={`spot ${className}`}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sfondo con griglia che si illumina sotto il cursore
// ---------------------------------------------------------------------------
export function Spotlight({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const r0 = parent.getBoundingClientRect();
    tx = cx = r0.width / 2;
    ty = cy = r0.height / 3;
    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty('--mx', `${cx}px`);
      el.style.setProperty('--my', `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className={`spotlight pointer-events-none absolute inset-0 ${className}`} />;
}

// ---------------------------------------------------------------------------
// Immagine con parallasse
// ---------------------------------------------------------------------------
export function Parallax({ src, alt = '', className = '', pos = 'center', amount = 9 }) {
  const wrap = useRef(null);
  const img = useRef(null);
  useEffect(() => {
    const tick = () => {
      if (!wrap.current || !img.current) return;
      const r = wrap.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh - r.top) / (vh + r.height));
      img.current.style.transform = `translate3d(0, ${(0.5 - p) * amount * 2}%, 0) scale(1.2)`;
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);
  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      <img ref={img} src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover will-change-transform" style={{ objectPosition: pos }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Testo che si accende parola per parola mentre scorri
// ---------------------------------------------------------------------------
export function ScrubText({ text, className = '' }) {
  const ref = useRef(null);
  const words = text.split(' ');
  useEffect(() => {
    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.55));
      const spans = el.querySelectorAll('[data-w]');
      const n = spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = String(0.16 + 0.84 * clamp((p * (n + 3) - i) / 3));
      });
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w style={{ opacity: 0.16 }}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Orologio in tempo reale (ora di Roma)
// ---------------------------------------------------------------------------
export function LiveClock({ className = '' }) {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className={`tabular-nums ${className}`}>{t || '--:--:--'}</span>;
}

// ---------------------------------------------------------------------------
// Linea di carriera che si riempie mentre scorri
// ---------------------------------------------------------------------------
export function RankTimeline({ items }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.62;
      setP(clamp((mid - r.top) / r.height));
      let a = -1;
      el.querySelectorAll('[data-row]').forEach((row, i) => {
        if (row.getBoundingClientRect().top <= mid) a = i;
      });
      setActive(a);
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);
  return (
    <ol ref={ref} className="relative" aria-label="Gradi in ordine di carriera">
      <span aria-hidden="true" className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-line2" />
      <span aria-hidden="true" className="absolute left-[1.15rem] top-3 w-px bg-accent" style={{ height: `calc((100% - 1.5rem) * ${p})` }} />
      {items.map(([name, text], i) => {
        const on = i <= active;
        const last = i === items.length - 1;
        return (
          <li
            key={name}
            data-row
            className={`relative flex gap-6 py-6 pl-12 transition-all duration-700 md:py-8 ${on ? 'opacity-100' : 'opacity-30'}`}
            style={{ transform: on ? 'none' : 'translateX(14px)' }}
          >
            <span
              className={`absolute left-0 top-6 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full border font-mono text-xs transition-all duration-700 md:top-8 ${
                on ? (last ? 'border-accent bg-accent text-white' : 'border-fg bg-fg text-bg') : 'border-line2 bg-bg text-muted'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{name}</h3>
              <p className="mt-1.5 max-w-xl text-muted">{text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Barra di avanzamento dello scroll
// ---------------------------------------------------------------------------
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? clamp(window.scrollY / h) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />;
}

// ---------------------------------------------------------------------------
// Scroll morbido (inerzia)
// ---------------------------------------------------------------------------
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}

// ---------------------------------------------------------------------------
// Schermata d'ingresso: logo, contatore, tendina che si alza
// ---------------------------------------------------------------------------
export function Intro() {
  const [phase, setPhase] = useState('in');
  const [n, setN] = useState(0);
  useEffect(() => {
    const D = 1900;
    const start = performance.now();
    let raf;
    let t1;
    const finish = () => {
      window.__introDone = true;
      document.documentElement.classList.add('intro-done');
      window.dispatchEvent(new Event('intro-done'));
    };
    const tick = (now) => {
      const p = clamp((now - start) / D);
      setN(Math.round(easeOutExpo(p) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('out');
        finish();
        t1 = setTimeout(() => setPhase('gone'), 1000);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
    };
  }, []);
  if (phase === 'gone') return null;
  const word = 'POLIZIA DI STATO'.split('');
  return (
    <div
      className="intro fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      style={{
        transform: phase === 'out' ? 'translateY(-100%)' : 'none',
        transition: 'transform 0.95s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <img src="/assets/crest-md.png" alt="" className="intro-crest h-24 w-auto" />
      <div className="mt-8 flex overflow-hidden font-mono text-xs tracking-[0.35em] text-muted" aria-hidden="true">
        {word.map((c, i) => (
          <span key={i} className="intro-letter inline-block whitespace-pre" style={{ animationDelay: `${300 + i * 45}ms` }}>
            {c}
          </span>
        ))}
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between md:inset-x-12 md:bottom-10">
        <span className="font-mono text-xs text-muted">Italian Paradise RP</span>
        <span className="font-semibold tabular-nums leading-none tracking-tighter text-fg" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}>
          {String(n).padStart(3, '0')}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
        <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${n / 100})` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tendina tra le pagine: copre, naviga, scopre
// ---------------------------------------------------------------------------
const LABELS = {
  '/': 'Home',
  '/notizie': 'Notizie',
  '/chi-siamo': 'Chi Siamo',
  '/qualifiche': 'Qualifiche',
  '/prenota': 'Prenota',
  '/concorso': 'Concorso',
  '/reparti': 'Reparti',
  '/login': 'Area Personale',
  '/dashboard': 'Dashboard',
  '/candidature': 'Candidature',
};

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState('idle'); // idle | cover | reveal
  const [label, setLabel] = useState('');
  const target = useRef(null);
  const phaseRef = useRef('idle');
  const timers = useRef([]);

  const set = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (phaseRef.current !== 'idle') {
        e.preventDefault();
        return;
      }
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      target.current = url.pathname + url.search + url.hash;
      setLabel(LABELS[url.pathname] || '');
      set('cover');
      later(() => router.push(target.current), 620);
      later(() => {
        if (phaseRef.current === 'cover') window.location.href = target.current;
      }, 3500);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      timers.current.forEach(clearTimeout);
    };
  }, [router]);

  useEffect(() => {
    if (phaseRef.current !== 'cover') return;
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    later(() => set('reveal'), 80);
    later(() => set('idle'), 900);
  }, [pathname]);

  const y = phase === 'cover' ? '0%' : phase === 'reveal' ? '-100%' : '100%';
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] flex items-end bg-fg"
      style={{
        transform: `translateY(${y})`,
        transition: phase === 'idle' ? 'none' : 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: phase === 'idle' ? 'none' : 'auto',
        visibility: phase === 'idle' ? 'hidden' : 'visible',
      }}
    >
      <span className="px-6 pb-8 font-semibold leading-none tracking-tighter text-bg md:px-12 md:pb-12" style={{ fontSize: 'clamp(3rem, 13vw, 11rem)' }}>
        {label}
      </span>
    </div>
  );
}
