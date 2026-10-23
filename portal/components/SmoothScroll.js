'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

let instance = null;

// Scroll morbido su tutto il sito (rotella e tastiera; il touch resta nativo).
export function SmoothScroll() {
  const pathname = usePathname();
  const bar = useRef(null);

  useEffect(() => {
    // Scorrimento a durata fissa con decelerazione marcata: si sente "planare".
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      anchors: true,
    });
    instance = lenis;
    lenis.on('scroll', ({ progress }) => {
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress || 0))})`;
    });
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // A ogni cambio pagina si riparte dall'alto (salvo ancore #...).
  useEffect(() => {
    if (!window.location.hash && instance) instance.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="h-full origin-left bg-primary" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
