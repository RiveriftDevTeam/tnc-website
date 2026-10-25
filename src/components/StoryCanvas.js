'use client';
// The Home story scene (docs/plans/site-revamp.md § 5): clay people, the card and the coral thread over the photo layer,
// scrubbed by scroll progress (0..1, read from a ref each frame, never through React).
//   act 1  0.00–0.10  the card turns in the light, a soft ripple
//   act 2  0.10–0.24  the hall: clay people rise, the card goes to "you" (coral)
//   act 3  0.24–0.40  you and Omar drift together, pause a finger's width apart, touch; the thread draws between you
//   acts 4–7 hold the act 3 pose for now (C2 adds them)
// Vanilla three, transparent canvas, renders only while on screen. Colours come from the CSS tokens and follow the theme.
// A frame probe hands over to the stills (onDowngrade) when the device can't keep up. `capture` exposes
// window.__story.capture(p) for scripts/stills.mjs and never starts the loop.
import { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight, Color, SRGBColorSpace, Vector3 } from 'three';
import { makeCard } from './story/card';
import { makeBeads, HEAD_Y } from './story/beads';
import { makeThread } from './story/thread';
import { makeRipple } from './story/ripple';
import { span, easeOut, easeInOut } from '@/lib/motion';

const lerp = (a, b, t) => a + (b - a) * t;
const bump = (p, a, b) => { const x = span(p, a, b); return Math.sin(x * Math.PI); }; // 0 → 1 → 0 across [a, b]
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const readColors = () => ({
  field: css('--tnc-site-field'), ink: css('--tnc-site-field-ink'), thread: css('--tnc-site-thread'), sun: css('--tnc-site-sun'), faded: css('--tnc-site-faded'),
  clay: [1, 2, 3, 5, 6].map((i) => css(`--tnc-site-clay-${i}`)), you: css('--tnc-site-clay-4'), omar: css('--tnc-site-clay-2'),
});

export default function StoryCanvas({ progressRef, dir = 'ltr', cardName = 'Layla Nasser', onReady, onDowngrade, capture = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const phone = Math.min(window.innerWidth, window.innerHeight) < 600 || window.innerWidth < 768;
    let raf = 0, running = !document.hidden, visible = true, disposed = false;
    const w = () => el.clientWidth || 1, h = () => el.clientHeight || 1;
    const renderer = new WebGLRenderer({ antialias: !phone, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: capture });
    renderer.setPixelRatio(capture ? 1 : Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5));
    renderer.setSize(w(), h()); renderer.outputColorSpace = SRGBColorSpace; renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    let colors = readColors();
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, w() / h(), 0.1, 60);
    const hemi = new HemisphereLight(new Color('#FFF4E6'), new Color(colors.field), 1.6); scene.add(hemi);
    const key = new DirectionalLight(new Color('#FFE2C4'), 2.4); key.position.set(3, 6, 5); scene.add(key);
    const fill = new DirectionalLight(new Color(colors.thread), 0.5); fill.position.set(-4, 2, -3); scene.add(fill);

    const fonts = { display: css(dir === 'rtl' ? '--font-display-ar' : '--font-display') || 'system-ui', body: css(dir === 'rtl' ? '--font-arabic' : '--font-geist-sans') || 'system-ui' };
    const cardColors = () => ({ paper: '#F6F1EA', ink: '#14201F', thread: colors.thread });
    const card = makeCard({ colors: cardColors(), name: cardName, dir, fonts });
    scene.add(card.mesh);
    if (document.fonts) document.fonts.load(`700 64px ${fonts.display}`).then(() => { if (!disposed) { card.repaint(); if (capture) frame(0, lastP); } }).catch(() => {});

    const COUNT = phone ? 24 : 60;
    const beads = makeBeads({ count: COUNT, palette: colors.clay, you: colors.you, omar: colors.omar, rimLight: !phone });
    beads.meshes.forEach((m) => scene.add(m));
    const thread = makeThread({ color: colors.thread }); scene.add(thread.mesh);
    const ambient = makeRipple({ color: colors.thread, radius: phone ? 1.05 : 1.5 }); scene.add(ambient.mesh);
    const touchRing = makeRipple({ color: colors.thread, radius: 0.9 }); scene.add(touchRing.mesh);

    // the pair: where they meet, and where they stand once the thread holds
    const MEET_Z = 1.0, GAP = 0.32, TOUCH = 0.215, APART = 0.62;
    let threadBuilt = false;
    const buildThread = () => { thread.span(new Vector3(-APART, HEAD_Y + 0.05, MEET_Z), new Vector3(APART, HEAD_Y + 0.05, MEET_Z), 0.5); threadBuilt = true; };

    // frame the people beside the words: to the end side on wide screens, above them on phones
    const frameView = () => {
      const W = w(), H = h(), portrait = W / H < 1;
      camera.aspect = W / H; camera.fov = portrait ? 46 : 34;
      if (portrait) camera.setViewOffset(W, H, 0, H * 0.17, W, H);
      else camera.setViewOffset(W, H, (dir === 'rtl' ? 1 : -1) * W * 0.2, 0, W, H);
      camera.updateProjectionMatrix();
    };
    frameView();

    const camPos = new Vector3(), camAt = new Vector3();
    const t0 = performance.now();
    let lastP = 0;
    function frame(now, forcedP) {
      const t = capture ? 0 : (now - t0) / 1000;
      const p = forcedP ?? Math.min(1, Math.max(0, progressRef.current || 0)); lastP = p;
      const portrait = camera.aspect < 1;
      const s2 = span(p, 0.10, 0.24), s3 = span(p, 0.24, 0.40);
      // camera: steady over the hall, then a slow dolly in to the pair
      const dolly = easeInOut(s3);
      camPos.set(0, lerp(2.3, 1.75, dolly), lerp(portrait ? 11.5 : 9, portrait ? 8.6 : 6.6, dolly));
      camAt.set(0, lerp(0.9, 0.8, dolly), lerp(0, 0.8, dolly));
      camera.position.copy(camPos); camera.lookAt(camAt);

      // ---- the hall: people rise out of the photo in staggered bands
      const breathe = (i) => 1 + Math.sin(t * 1.6 + beads.phase[i]) * 0.015;
      for (let i = 2; i < COUNT; i++) {
        const [x, z] = beads.home[i];
        const band = (i / COUNT) * 0.55;
        const rise = easeOut(span(s2, band, band + 0.45));
        beads.place(i, x, z, { rise, scale: breathe(i) });
      }
      // ---- you and Omar
      const approach = easeInOut(span(p, 0.26, 0.33)), touch = easeOut(span(p, 0.355, 0.37)), apart = easeInOut(span(p, 0.375, 0.39));
      const squash = 1 - bump(p, 0.355, 0.385) * 0.1;
      const riseYou = easeOut(span(s2, 0, 0.4)), riseOmar = easeOut(span(s2, 0.2, 0.6));
      const youX = lerp(lerp(lerp(beads.home[0][0], -GAP, approach), -TOUCH, touch), -APART, apart);
      const omX = lerp(lerp(lerp(beads.home[1][0], GAP, approach), TOUCH, touch), APART, apart);
      const youZ = lerp(beads.home[0][1], MEET_Z, approach), omZ = lerp(beads.home[1][1], MEET_Z, approach);
      const lean = bump(p, 0.33, 0.37) * 0.08;
      beads.place(0, youX, youZ, { rise: riseYou, scale: breathe(0) * 1.06, squash, lean: -lean });
      beads.place(1, omX, omZ, { rise: riseOmar, scale: breathe(1) * 1.06, squash, lean });
      beads.commit();

      // ---- the card: center stage in act 1, then into your hand, and it stays with you
      const turn = span(p, 0, 0.10), toHand = easeInOut(s2);
      const hand = [youX + 0.3, 0.55, youZ + 0.18];
      card.mesh.position.set(lerp(0, hand[0], toHand), lerp((portrait ? 2.35 : 1.3) + Math.sin(t * 0.9) * 0.04, hand[1], toHand), lerp(1.4, hand[2], toHand));
      card.mesh.rotation.set(lerp(-0.08, -0.25, toHand), lerp(-0.31, 0.17, turn) * (dir === 'rtl' ? -1 : 1) + lerp(0, 0.5, toHand), lerp(0.02, 0.15, toHand));
      card.mesh.scale.setScalar(lerp(portrait ? 0.95 : 1.45, 0.22, toHand));
      // ripples: a soft beat around the card in act 1, one ring at the touch
      ambient.mesh.position.copy(card.mesh.position);
      ambient.set(capture ? 0.55 : (t % 2.4) / 1.6, camera, 1 - span(s2, 0, 0.3));
      touchRing.mesh.position.set(0, HEAD_Y * 0.6, MEET_Z);
      touchRing.set(span(p, 0.36, 0.43), camera);

      // ---- the thread draws between you as you step apart, then pulses softly
      if (!threadBuilt) buildThread();
      thread.set(easeOut(span(p, 0.38, 0.40)), p > 0.40 ? 0.15 + Math.sin(t * 2.2) * 0.15 : 0);

      renderer.render(scene, camera);
    }

    // frame probe: if the first 45 visible frames average more than 28 ms, hand over to the stills
    const probe = { n: 0, sum: 0, last: 0, done: capture || !onDowngrade };
    function loop() {
      cancelAnimationFrame(raf);
      const step = (now) => {
        if (disposed || !running || !visible) { probe.last = 0; return; }
        frame(now);
        if (!probe.done) {
          if (probe.last) { probe.sum += now - probe.last; probe.n++; }
          probe.last = now;
          if (probe.n >= 45) { probe.done = true; if (probe.sum / probe.n > 28) { onDowngrade(); return; } }
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    const onResize = () => { renderer.setSize(w(), h()); frameView(); frame(performance.now(), capture ? lastP : undefined); };
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !capture) loop(); }, { threshold: 0.01 });
    io.observe(el);
    const onVis = () => { running = !document.hidden; if (running && visible && !capture) loop(); };
    document.addEventListener('visibilitychange', onVis);
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onTheme = () => {
      colors = readColors();
      card.recolor(cardColors());
      beads.recolor({ palette: colors.clay, you: colors.you, omar: colors.omar });
      thread.recolor(colors.thread); ambient.recolor(colors.thread); touchRing.recolor(colors.thread);
      hemi.groundColor.set(colors.field); fill.color.set(colors.thread);
    };
    mq.addEventListener('change', onTheme);

    frame(performance.now(), capture ? 0 : undefined);
    if (capture) window.__story = { capture(p) { frame(0, p); return renderer.domElement.toDataURL('image/png'); } };
    else loop();
    if (onReady) onReady();
    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); mq.removeEventListener('change', onTheme);
      if (capture) delete window.__story;
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        for (const m of [].concat(o.material || [])) { if (m.map) m.map.dispose(); m.dispose(); }
      });
      renderer.dispose(); if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [progressRef, dir, cardName, onReady, onDowngrade, capture]);
  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
