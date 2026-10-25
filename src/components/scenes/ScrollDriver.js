'use client';
// The scroll driver of ScrollScenes (docs/plans/site-revamp.md Amendment A2.3): the only script. It reads where each step is and
// writes data-on / data-a / data-r and the --sp variable straight onto the elements (one rAF-coalesced scroll handler, no React
// render per tick). The markup and every class live in ScrollScenes.js (server), so this stays tiny.
import { useEffect, useRef } from 'react';

const clamp = (x) => Math.min(1, Math.max(0, x));

export default function ScrollDriver() {
  const me = useRef(null);
  useEffect(() => {
    const el = me.current && me.current.parentElement; if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)'), wide = matchMedia('(min-width: 768px)');
    if (reduce.matches) return;
    const all = (s) => [...el.querySelectorAll(s)];
    const lis = all('[data-step]'), knots = all('[data-knot]'), stage = all('[data-stage]'), pics = all('[data-pic]');
    const track = el.querySelector('[data-track]'), fill = el.querySelector('[data-fill]');
    let raf = 0;
    if (!wide.matches) pics.forEach((p) => { p.dataset.on = '0'; });
    const update = () => {
      raf = 0;
      const vh = innerHeight, line = vh * 0.52, rects = lis.map((l) => l.getBoundingClientRect());
      const sp = rects.map((r) => clamp((line - r.top) / r.height));
      let on = sp.findIndex((v) => v < 1); if (on < 0) on = lis.length - 1;
      const stageOn = wide.matches;
      lis.forEach((l, i) => { l.dataset.a = !stageOn || i === on ? '1' : '0'; l.dataset.r = i <= on ? '1' : '0'; });
      stage.forEach((s, i) => { s.dataset.on = i === on ? '1' : '0'; s.style.setProperty('--sp', String(i < on ? 1 : i > on ? 0 : sp[i])); });
      if (!stageOn) pics.forEach((p) => { const r = p.getBoundingClientRect(); if (r.top < vh * 0.88) p.dataset.on = '1'; p.style.setProperty('--sp', String(clamp((vh * 0.92 - r.top) / (vh * 0.5)))); });
      // the thread: runs from the first knot to the last, filled up to where the reader is
      const o = el.querySelector('ol').getBoundingClientRect().top, ky = knots.map((k) => k.getBoundingClientRect().top + 8 - o);
      const from = ky[0], len = Math.max(1, ky[ky.length - 1] - from);
      track.style.top = fill.style.top = `${from}px`; track.style.height = fill.style.height = `${len}px`; track.style.bottom = fill.style.bottom = 'auto';
      const y = on < ky.length - 1 ? ky[on] + sp[on] * (ky[on + 1] - ky[on]) : ky[on];
      fill.style.transform = `scaleY(${clamp((y - from) / len)})`;
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); wide.addEventListener('change', tick);
    return () => { removeEventListener('scroll', tick); removeEventListener('resize', tick); wide.removeEventListener('change', tick); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <span ref={me} hidden />;
}
