'use client';
import { useEffect, useRef } from 'react';

// Paths live in a 0..100 box and stretch to the element (non-scaling stroke), so one shape fits any width.
const PATHS = {
  h: 'M0 50 C 18 30, 32 70, 50 50 S 82 30, 100 50',
  v: 'M50 0 C 30 18, 70 32, 50 50 S 30 82, 50 100',
  line: 'M0 50 L 100 50',
  vline: 'M50 0 L 50 100',
};

/** A small loop tied in the thread: where two people connect. */
export function Knot({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className={`knot ${className}`}>
      <circle cx="7" cy="7" r="5" fill="var(--tnc-ground)" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="7" r="1.8" fill="currentColor" />
    </svg>
  );
}

/** The coral thread (docs/plans/site-revamp.md § 3.4). Draws itself on scroll: native scroll timeline where supported,
 *  IntersectionObserver otherwise (globals.css .thread). Fully drawn without JS and under reduced motion.
 *  knots: positions along the run in % (0..100), rendered as HTML so they stay round on any aspect ratio. */
export default function Thread({ shape = 'h', d, knots = [], animate = true, width = 2, className = '', style }) {
  const ref = useRef(null);
  const vertical = shape === 'v' || shape === 'vline';
  useEffect(() => {
    const el = ref.current; if (!el || !animate) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);
  return (
    <div ref={ref} className={`thread pointer-events-none relative rtl:-scale-x-100 ${className}`} data-animate={animate ? '' : undefined} style={style} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={d || PATHS[shape]} pathLength="1" data-draw="" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {knots.map((k) => (
        <span key={k} className="absolute -translate-x-1/2 -translate-y-1/2" style={vertical ? { top: `${k}%`, left: '50%' } : { left: `${k}%`, top: '50%' }}><Knot /></span>
      ))}
    </div>
  );
}
