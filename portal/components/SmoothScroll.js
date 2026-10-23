'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

let instance = null;

// Scroll morbido su tutto il sito (rotella e tastiera; il touch resta nativo).
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: true });
    instance = lenis;
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

  return null;
}
