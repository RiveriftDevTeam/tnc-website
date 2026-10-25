'use client';
// The Home story stage (docs/plans/site-revamp.md § 5): a sticky 100svh frame on the deep petrol field with four layers,
// back to front — photos, the WebGL scene, scrims, the act copy. Scroll progress p (0..1) lives in a ref; each frame writes
// CSS properties and styles directly, never a React render per tick. Every act's words are server-rendered.
//   webgl    the scene (loaded on idle on capable devices), the act 1 still as first paint until it arrives
//   stills   no WebGL / low-end / slow frames: the act stills cross-fade on p instead of the scene
//   reduced  prefers-reduced-motion: no sticky stage, the acts stack as sections, each with its still
// ?stills=1 renders the scene alone for scripts/stills.mjs.
// `photos` are server-rendered <Photo> elements by slot, so the media manifest never ships in this client bundle.
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Cta from './Cta';
import Sticker from './Sticker';
import { Knot } from './Thread';
import useReducedMotion from '@/lib/useReducedMotion';
import { span } from '@/lib/motion';
import { fill } from '@/content/fill';
import { track, EVENTS } from '@/lib/analytics';

const StoryCanvas = dynamic(() => import('./StoryCanvas'), { ssr: false, loading: () => null });
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
// [in, out] by progress, and the photo each act stands on
const ACTS = [[0, 0.10], [0.10, 0.24], [0.24, 0.40], [0.40, 0.54], [0.54, 0.70], [0.70, 0.86], [0.86, 1]];
const ACT_PHOTO = ['story-hall', 'story-hall', 'story-touch', 'story-touch', null, 'story-circle', null];
const FADE = 0.025;

/** A pre-rendered frame of the scene for act n (scripts/stills.mjs): per language, theme and orientation. */
function Still({ n, lang, className = '', alt = '' }) {
  const src = (theme, shape = '') => `${BASE}/media/story/act-${n}-${lang}-${theme}${shape}.webp`;
  return (
    <picture className={className}>
      <source media="(prefers-color-scheme: dark) and (max-aspect-ratio: 1/1)" srcSet={src('dark', '-p')} />
      <source media="(max-aspect-ratio: 1/1)" srcSet={src('light', '-p')} />
      <source media="(prefers-color-scheme: dark)" srcSet={src('dark')} />
      <img src={src('light')} alt={alt} width={1600} height={1000} decoding="async" loading={n === 1 ? 'eager' : 'lazy'} className="h-full w-full object-cover" {...(alt === '' ? { 'aria-hidden': true } : {})} />
    </picture>
  );
}

function capable() {
  const c = navigator.connection;
  if ((c && c.saveData) || (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2) return false;
  try { const g = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (g.getContext('webgl2') || g.getContext('webgl'))); } catch { return false; }
}

export default function ScrollStory({ lang = 'en', acts, chips, primary, secondary, primaryHref, secondaryHref, label, dir = 'ltr', skip, storyNav, chapter, sample, cardName, photos = {} }) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState('webgl'); // webgl | stills
  const [ready, setReady] = useState(false);  // the scene has drawn its first frame
  const [load, setLoad] = useState(false);    // time to fetch the scene
  const [captureMode, setCapture] = useState(false);
  const progress = useRef(0);
  const wrap = useRef(null);
  const actRefs = useRef([]);
  const photoRefs = useRef({});
  const stillRefs = useRef([]);
  const fillRef = useRef(null);
  const knotRefs = useRef([]);
  const lastAct = useRef(-1);

  useEffect(() => {
    if (new URLSearchParams(location.search).has('stills')) { setCapture(true); setLoad(true); return; }
    if (!capable()) { setMode('stills'); return; }
    const go = () => setLoad(true);
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 400);
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onDowngrade = useCallback(() => { setMode('stills'); track(EVENTS.story_beat, { beat: 'downgrade' }); }, []);

  useEffect(() => {
    if (reduced || captureMode) return;
    const el = wrap.current; if (!el) return;
    let raf = 0;
    const set = (n, o, y = 0) => { if (!n) return; n.style.opacity = String(o); if (y !== null) n.style.transform = y ? `translateY(${y}px)` : ''; };
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      progress.current = p;
      // the act copy: fade in over FADE at the start of its range, out at its end (act 1 starts shown, act 7 stays)
      ACTS.forEach(([a, b], i) => {
        const n = actRefs.current[i]; if (!n) return;
        const fin = i === 0 ? 1 : span(p, a, a + FADE), fout = i === ACTS.length - 1 ? 1 : 1 - span(p, b - FADE, b);
        const o = Math.min(fin, fout);
        set(n, o, (1 - o) * (p < a + FADE ? 18 : -18));
        const on = o > 0.5;
        n.style.pointerEvents = on ? 'auto' : 'none'; n.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        n.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on && lastAct.current !== i) { lastAct.current = i; track(EVENTS.story_beat, { beat: `act-${i + 1}` }); }
      });
      // the photos: the hall pushes in and blurs, the hands cross-fade in, then dim; the circle warms act 6
      const hall = photoRefs.current['story-hall'], touch = photoRefs.current['story-touch'], circle = photoRefs.current['story-circle'];
      if (hall) {
        const push = span(p, 0, 0.10) * 0.08 + span(p, 0.10, 0.24) * 0.17;
        hall.style.opacity = String(1 - span(p, 0.24, 0.29));
        hall.style.transform = `scale(${1 + push})`;
        hall.style.filter = `blur(${2.5 + span(p, 0.10, 0.24) * 5}px)`;
      }
      if (touch) touch.style.opacity = String(span(p, 0.24, 0.29) * (0.42 - span(p, 0.40, 0.50) * 0.24) * (1 - span(p, 0.54, 0.58)));
      if (circle) circle.style.opacity = String(span(p, 0.70, 0.75) * 0.5 * (1 - span(p, 0.86, 0.92)));
      // stills mode: cross-fade the act frames
      stillRefs.current.forEach((s, i) => { if (s) { const [a, b] = ACTS[i]; s.style.opacity = String(i === 0 ? 1 - span(p, b - FADE, b) : Math.min(span(p, a - FADE, a + FADE), i === ACTS.length - 1 ? 1 : 1 - span(p, b - FADE, b + FADE))); } });
      // the progress thread
      if (fillRef.current) fillRef.current.style.setProperty('--p', String(p));
      knotRefs.current.forEach((k, i) => { if (k) k.dataset.on = p >= ACTS[i][0] - 0.001 ? '1' : '0'; });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [reduced, captureMode, mode]);

  const goTo = (i) => {
    const el = wrap.current; if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY, travel = el.offsetHeight - innerHeight;
    scrollTo({ top: top + travel * (ACTS[i][0] + (i ? FADE * 1.6 : 0)), behavior: 'smooth' });
  };

  // ?stills: the scene alone, transparent, for the stills script
  if (captureMode) {
    return (
      <section className="fixed inset-0 z-[100]" style={{ background: 'transparent' }} aria-hidden="true">
        <style>{'html,body{background:transparent!important}header,footer{display:none!important}'}</style>
        {load && <StoryCanvas progressRef={progress} dir={dir} cardName={cardName} capture />}
      </section>
    );
  }

  const copy = (a, i) => (
    <>
      {i === 0 ? <h1 className="t-display text-field-ink">{a.h}</h1> : <h2 className="t-h1 text-field-ink">{a.h}</h2>}
      {a.p && <p className={`lead mt-5 max-w-xl text-field-ink/80 ${i === 0 ? 'text-[clamp(1.06rem,1.3vw,1.2rem)]' : ''}`}>{a.p}</p>}
      {a.sticker && <Sticker tilt={2} tape meta={a.sticker.meta} note={a.sticker.note} className="mt-6 inline-block max-w-xs !pe-6" />}
      {a.notes && (
        <div className="mt-6 flex max-w-md flex-col gap-4">
          {a.notes.map((n, k) => (
            <Sticker key={n.note} tilt={k ? 3 : 1} meta={n.meta ? `${n.meta} · ${sample}` : sample} note={n.note} className={k ? 'ms-10 max-w-[18rem]' : 'max-w-sm'}>
              {n.yes && <div className="mt-3 flex gap-2" aria-hidden="true"><span className="btn btn-primary btn-sm !min-h-[34px] !px-3 !text-sm">{n.yes}</span><span className="btn btn-quiet btn-sm !min-h-[34px] !px-3 !text-sm">{n.no}</span></div>}
            </Sticker>
          ))}
        </div>
      )}
      {i === 0 && (
        <>
          <div className="mt-7 flex flex-wrap gap-3">
            <Cta href={primaryHref} placement="story-act-1">{primary}</Cta>
            <Cta href={secondaryHref} variant="field" placement="story-act-1">{secondary}</Cta>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => <li key={c.href}><Link prefetch={false} href={c.href} className="chip !min-h-[34px] bg-field-ink/10 !px-3.5 text-[.9rem] text-field-ink ring-1 ring-field-ink/20 transition-colors duration-quick hover:bg-field-ink/20">{c.label}</Link></li>)}
          </ul>
          <a href="#who" className="mt-6 inline-block text-sm text-field-ink/70 underline decoration-thread decoration-2 underline-offset-4 hover:text-field-ink">{skip}</a>
        </>
      )}
      <p className="sr-only" id={`act-${i + 1}-desc`}>{a.desc}</p>
    </>
  );

  // reduced motion: the acts stack as plain sections on the field, each with its picture
  if (reduced) {
    return (
      <section className="bg-field text-field-ink" aria-label={label}>
        {acts.map((a, i) => (
          <div key={i} id={`act-${i + 1}`} className={`wrap grid items-center gap-8 py-14 md:grid-cols-2 ${i === 0 ? 'pt-28' : ''}`}>
            <div>{copy(a, i)}</div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-photo bg-field-ink/5">
              {ACT_PHOTO[i] && <div className={`absolute inset-0 opacity-50 ${ACT_PHOTO[i] === 'story-hall' ? 'blur-[2.5px]' : ''}`}>{photos[ACT_PHOTO[i]]}</div>}
              <Still n={i + 1} lang={lang} className="absolute inset-0" alt={a.desc} />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={wrap} className="relative h-[480vh] bg-field text-field-ink md:h-[640vh]" aria-label={label}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* 1 · photos */}
        <div className="absolute inset-0" aria-hidden="true">
          {['story-hall', 'story-touch', 'story-circle'].map((slot, k) => (
            <div key={slot} ref={(n) => (photoRefs.current[slot] = n)} className="absolute inset-0 will-change-[opacity,transform]" style={{ opacity: k ? 0 : 1, filter: k ? undefined : 'blur(2.5px)' }}>
              {photos[slot]}
            </div>
          ))}
          <div className="absolute inset-0 bg-field/55" />
        </div>
        {/* 2 · the scene, or its stills */}
        {mode === 'webgl' && (
          <>
            <div className={`absolute inset-0 transition-opacity duration-slow ease-out ${ready ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true"><Still n={1} lang={lang} className="absolute inset-0" /></div>
            {load && <StoryCanvas progressRef={progress} dir={dir} cardName={cardName} onReady={onReady} onDowngrade={onDowngrade} />}
          </>
        )}
        {mode === 'stills' && (
          <div className="absolute inset-0" aria-hidden="true">
            {acts.map((a, i) => <div key={i} ref={(n) => (stillRefs.current[i] = n)} className="absolute inset-0" style={{ opacity: i ? 0 : 1 }}><Still n={i + 1} lang={lang} className="absolute inset-0" /></div>)}
          </div>
        )}
        {/* 3 · scrims: the start side on wide screens, the bottom on phones */}
        <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-[62%] bg-gradient-to-r from-field from-40% via-field/85 to-transparent rtl:bg-gradient-to-l md:block" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-field via-field/90 to-transparent md:hidden" aria-hidden="true" />
        {/* 4 · the acts */}
        <div className="absolute inset-0">
          {acts.map((a, i) => (
            <div key={i} id={`act-${i + 1}`} ref={(n) => (actRefs.current[i] = n)} aria-describedby={`act-${i + 1}-desc`}
              className="absolute inset-x-0 bottom-[max(4.5rem,8vh)] md:bottom-auto md:top-1/2 md:-translate-y-1/2"
              style={{ opacity: i ? 0 : 1, visibility: i ? 'hidden' : 'visible' }}>
              <div className="wrap"><div className={`max-w-[34rem] md:ps-14 ${i === 0 ? 'md:max-w-[40rem]' : ''}`}>{copy(a, i)}</div></div>
            </div>
          ))}
        </div>
        {/* the progress thread: start edge on wide screens, bottom on phones; its knots jump to each chapter */}
        <nav ref={fillRef} aria-label={storyNav} className="story-progress" style={{ '--p': 0 }}>
          <span className="story-progress-line" aria-hidden="true" />
          <ol className="story-progress-knots">
            {acts.map((a, i) => (
              <li key={i}><button type="button" ref={(n) => (knotRefs.current[i] = n)} data-on={i ? '0' : '1'} onClick={() => goTo(i)} aria-label={`${fill(chapter, { n: i + 1 })}: ${a.h}`} className="story-knot"><Knot size={14} /></button></li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
