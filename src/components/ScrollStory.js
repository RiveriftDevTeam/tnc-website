'use client';
// The landing story: a sticky viewport with the 3D scene behind five acts of text, scrubbed by scroll.
// The scene reads progress from a ref each frame; the act text is faded by direct style writes, never a React render per
// scroll tick. Every act's words are in the HTML for readers and crawlers. Reduced motion: the acts stack as normal
// sections over one still frame.
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Cta from './Cta';
import useReducedMotion from '@/lib/useReducedMotion';
import { track, EVENTS } from '@/lib/analytics';

const StoryCanvas = dynamic(() => import('./StoryCanvas'), { ssr: false, loading: () => null });
const ALL_ACTS = [[0, 0.17], [0.2, 0.42], [0.46, 0.6], [0.63, 0.8], [0.84, 1]]; // [in, out] by the scene's progress

export default function ScrollStory({ acts, chips, primary, secondary, primaryHref, secondaryHref, label, dir = 'ltr', from = 0 }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const progress = useRef(0);
  const wrap = useRef(null);
  const actRefs = useRef([]);
  const lastAct = useRef(-1);

  useEffect(() => {
    const saveData = navigator.connection && navigator.connection.saveData;
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 2;
    if (saveData || lowEnd || !window.WebGLRenderingContext) return;
    const go = () => setReady(true);
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 400);
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const first = acts.length === 5 ? 0 : 5 - acts.length; // which scene act the first text block belongs to
  const ACTS = ALL_ACTS.slice(first);
  useEffect(() => {
    if (reduced) return;
    const el = wrap.current; if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const p = from + (1 - from) * Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      progress.current = p;
      ACTS.forEach(([a, b], i) => {
        const n = actRefs.current[i]; if (!n) return;
        const fade = 0.04;
        const o = i === 0 ? (p < b ? 1 : Math.max(0, 1 - (p - b) / fade)) : Math.min(1, Math.max(0, (p - a) / fade), Math.max(0, (b - p) / fade), 1);
        const vis = i === ACTS.length - 1 && p >= a ? 1 : Math.min(1, o);
        n.style.opacity = String(vis);
        n.style.transform = `translateY(${(1 - vis) * 14}px)`;
        n.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
        n.setAttribute('aria-hidden', vis > 0.5 ? 'false' : 'true');
        if (vis > 0.5 && lastAct.current !== i) { lastAct.current = i; track(EVENTS.story_beat, { beat: `act-${i + 1}` }); }
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [reduced, from, ACTS]);

  const Act = ({ a, i, children }) => (
    <div ref={(n) => (actRefs.current[i] = n)} className={reduced ? 'py-10' : 'absolute inset-x-0 bottom-[12vh] top-auto transition-none sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2'} style={reduced ? undefined : { opacity: i === 0 ? 1 : 0 }}>
      <div className="wrap">
        <div className={`max-w-2xl ${i === 0 ? '' : 'ms-0'}`}>
          {a.eyebrow && <div className="eyebrow text-accent">{a.eyebrow}</div>}
          {i === 0 && first === 0 ? <h1 className="t-display mt-3 text-splash-ink">{a.h}</h1> : <h2 className={`${i === 0 ? 't-display' : 't-h1'} mt-3 text-splash-ink`}>{a.h}</h2>}
          {a.p && <p className="lead mt-4 max-w-xl !text-splash-ink/85">{a.p}</p>}
          {a.chip && <div className="chip mt-4 num" style={{ background: 'rgba(102,212,224,.16)', color: '#9AE6EE' }}>{a.chip}</div>}
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={wrap} className={`on-dark relative bg-splash text-splash-ink ${reduced ? '' : (first === 0 ? 'h-[520vh] sm:h-[560vh]' : 'h-[380vh] sm:h-[420vh]')}`} aria-label={label}>
      <div className={reduced ? 'relative' : 'sticky top-0 h-[100svh] overflow-hidden'}>
        {/* first paint: a dark hall in CSS, before WebGL arrives */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true" style={{ background: 'radial-gradient(900px 500px at 50% 80%, rgba(102,212,224,.18), transparent 70%), radial-gradient(700px 400px at 20% 30%, rgba(240,217,181,.12), transparent 60%), #0B1716' }}>
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle, rgba(240,217,181,.9) 0 1px, transparent 1.5px), radial-gradient(circle, rgba(158,217,207,.8) 0 1px, transparent 1.5px)', backgroundSize: '58px 44px, 71px 53px', backgroundPosition: '0 0, 29px 22px', maskImage: 'linear-gradient(180deg, transparent, #000 40%, #000 80%, transparent)' }} />
        </div>
        {ready && <StoryCanvas progressRef={progress} reduced={reduced} dir={dir} />}
        <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-[62%] bg-gradient-to-r from-splash/95 via-splash/55 to-transparent rtl:bg-gradient-to-l sm:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-splash/90 to-transparent sm:hidden" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-splash to-transparent" aria-hidden="true" />
        {/* the acts */}
        <div className={reduced ? 'relative' : 'absolute inset-0'}>
          {acts.map((a, i) => (
            <Act key={a.h} a={a} i={i}>
              {i === 0 && first === 0 && chips && <div className="mt-6 flex flex-wrap gap-2">{chips.map((c) => <Link key={c.href} href={c.href} className="chip border border-white/15 bg-white/10 text-splash-ink hover:bg-white/20" style={{ minHeight: 34, fontSize: '.9rem' }}>{c.label}</Link>)}</div>}
              {i === 0 && first === 0 && primary && <div className="mt-7 flex flex-wrap gap-3"><Cta href={primaryHref} placement="hero">{primary}</Cta><Cta href={secondaryHref} variant="tonal" placement="hero" className="!bg-white/10 !text-splash-ink hover:!bg-white/20">{secondary}</Cta></div>}
              {i === acts.length - 1 && primary && first > 0 && <div className="mt-7 flex flex-wrap gap-3"><Cta href={primaryHref} placement="story">{primary}</Cta><Cta href={secondaryHref} variant="tonal" placement="story" className="!bg-white/10 !text-splash-ink hover:!bg-white/20">{secondary}</Cta></div>}
            </Act>
          ))}
        </div>
        {!reduced && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-splash-ink/50" aria-hidden="true">↓</div>}
      </div>
    </section>
  );
}
