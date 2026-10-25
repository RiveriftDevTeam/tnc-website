'use client';
import { useEffect, useRef } from 'react';

// Where the sand meets the sea (plan Amendment A2.1): the fixed backdrop (tokens.css --tnc-backdrop) and a light 2D canvas of
// sand grains drifting low across the page and sea foam bobbing where the water is (top end). 30 fps, paused when the tab
// is hidden; one still frame under reduced motion, data saver or on low-end devices. Decorative only.
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export default function Shore() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    const c = navigator.connection;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches || (c && c.saveData) || (navigator.hardwareConcurrency || 8) <= 2;
    const rtl = document.documentElement.dir === 'rtl';
    let W = 0, H = 0, raf = 0, last = 0, sand = '', foam = '';
    const rnd = (a, b) => a + Math.random() * (b - a);
    const colours = () => { sand = css('--tnc-site-sand-rgb'); foam = css('--tnc-site-foam-rgb'); };
    const grain = (fresh) => ({ x: fresh ? rnd(-0.05, 0) : rnd(0, 1), y: rnd(0.45, 1), r: rnd(0.5, 1.5), a: rnd(0.25, 0.6), v: rnd(0.00008, 0.00025), w: rnd(0, 6.28) });
    const bubble = () => ({ x: rnd(0.55, 1.02), y: rnd(-0.02, 0.32), r: rnd(0.8, 2.4), a: rnd(0.35, 0.8), w: rnd(0, 6.28), s: rnd(0.4, 1) });
    const grains = Array.from({ length: 80 }, () => grain(false));
    const bubbles = Array.from({ length: 46 }, bubble);
    const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    function draw(t) {
      g.clearRect(0, 0, W, H);
      for (const p of grains) {
        if (!still) { p.x += p.v * 16; p.y += Math.sin(t / 1400 + p.w) * 0.00004; if (p.x > 1.05) Object.assign(p, grain(true)); }
        g.fillStyle = `rgb(${sand} / ${p.a})`; g.beginPath(); g.arc((rtl ? 1 - p.x : p.x) * W, p.y * H, p.r, 0, 6.283); g.fill();
      }
      for (const b of bubbles) {
        const bob = still ? 0 : Math.sin(t / 900 * b.s + b.w);
        const x = (b.x + bob * 0.004) * W, y = (b.y + bob * 0.006) * H;
        g.fillStyle = `rgb(${foam} / ${b.a * (0.75 + 0.25 * bob)})`; g.beginPath(); g.arc(rtl ? W - x : x, y, b.r, 0, 6.283); g.fill();
      }
    }
    const loop = (t) => { raf = requestAnimationFrame(loop); if (t - last < 33) return; last = t; draw(t); };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden && !still) raf = requestAnimationFrame(loop); };
    const onResize = () => { size(); if (still) draw(0); };
    const mq = matchMedia('(prefers-color-scheme: dark)'); const onTheme = () => { colours(); if (still) draw(0); };
    colours(); size();
    if (still) draw(0); else raf = requestAnimationFrame(loop);
    addEventListener('resize', onResize); document.addEventListener('visibilitychange', onVis); mq.addEventListener('change', onTheme);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); mq.removeEventListener('change', onTheme); };
  }, []);
  return (
    <>
      <div className="shore" aria-hidden="true" />
      <canvas ref={ref} className="shore-particles" aria-hidden="true" />
    </>
  );
}
