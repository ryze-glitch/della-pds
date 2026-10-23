'use client';

import { useEffect, useRef } from 'react';

// Sposta lentamente lo sfondo mentre si scorre (parallasse leggero).
export function Parallax({ children, speed = 0.25, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, 1400);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return (
    <div ref={ref} className={`absolute inset-x-0 -top-10 bottom-0 will-change-transform ${className}`}>
      {children}
    </div>
  );
}

// Luci della volante: bagliore blu/rosso alternato, molto discreto.
export function Siren() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="siren siren-blue" />
      <div className="siren siren-red" />
    </div>
  );
}
