'use client';
import { useEffect, useRef } from 'react';

/** Enter-on-view with CSS only (globals.css [data-reveal]). The server HTML is visible; the `js` class on <html>
 *  (set by Shell) hides it for the 160 ms arrival; without JS nothing is ever hidden. Reduced motion = static. */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>{children}</Tag>;
}
