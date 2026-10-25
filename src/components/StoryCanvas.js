'use client';
// The Home story scene (docs/plans/site-revamp.md § 5 + Amendment A1): clay people, the card, and the coral threads over the
// photo layer, scrubbed by scroll progress p (0..1, read from a ref each frame, never through React). Acts (ScrollStory ACTS):
//   1 0.00–0.08  the card turns in the light, a soft ripple
//   2 0.08–0.19  the hall: clay people rise, the card goes to "you" (coral)
//   3 0.19–0.31  you and Omar drift together, pause a finger's width apart, touch; the thread draws between you
//   (each act's scene settles by ~3/4 of its range so the words hold at full strength while the picture rests)
//   4 0.31–0.39  the hall greys and drifts away; only your thread keeps its colour
//   5 0.39–0.52  the hall comes back; every tap adds a thread, introductions link people to each other: a web
//   6 0.52–0.65  the web settles into four circles round you (team, friends, mentors, clients)
//   7 0.65–0.82  the assistant: a sun pulse runs to one person at a time and the thread glows (Omar, Sara, Yusuf, Omar→Huda)
//   8 0.82–1.00  the camera pulls back: your web is one of many across the hall, joined by shared people
// Vanilla three, transparent canvas, renders only while on screen; colours come from the CSS tokens and follow the theme.
// A frame probe hands over to the stills (onDowngrade). `capture` exposes window.__story.capture(p) for scripts/stills.mjs.
import { useEffect, useRef } from 'react';
import {
  Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight, Color, SRGBColorSpace, Vector3,
  CapsuleGeometry, MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, Object3D, DynamicDrawUsage, RingGeometry, Mesh,
} from 'three';
import { makeCard } from './story/card';
import { makeBeads, HEAD_Y } from './story/beads';
import { makeThread } from './story/thread';
import { makeRipple } from './story/ripple';
import { makeEdges, makePulses } from './story/graph';
import { span, easeOut, easeInOut } from '@/lib/motion';

const lerp = (a, b, t) => a + (b - a) * t;
const bump = (p, a, b) => Math.sin(span(p, a, b) * Math.PI); // 0 → 1 → 0 across [a, b]
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const readColors = () => ({
  field: css('--tnc-site-field'), ink: css('--tnc-site-field-ink'), thread: css('--tnc-site-thread'), sun: css('--tnc-site-sun'), faded: css('--tnc-site-faded'),
  clay: [1, 2, 3, 5, 6].map((i) => css(`--tnc-site-clay-${i}`)), you: css('--tnc-site-clay-4'), omar: css('--tnc-site-clay-2'),
  rings: [2, 3, 5, 1].map((i) => css(`--tnc-site-clay-${i}`)), // your team, friends, mentors, clients (ScrollStory CIRCLE_CLAY)
});

// the pair (act 3) and the web (acts 5–8)
const MEET_Z = 1.0, GAP = 0.32, TOUCH = 0.215, APART = 0.62, LIFT_STATIC = 0.45;
const YOU = [-APART, MEET_Z];
const RADII = [1.25, 1.95, 2.65, 3.35];
// circle slots: 'o' is Omar, numbers index the twelve people you meet in act 5 (0 Sara, 1 Yusuf, 5 Huda)
const RINGS = [[4, 7, 11], ['o', 1, 6], [2, 5, 8], [0, 3, 9, 10]];
const INTROS = [['o', 1], ['o', 5], [2, 6], [8, 9], [3, 10]];
const NOTE_EDGES = [['you', 'o'], ['you', 0], ['you', 1], ['o', 5]]; // act 7, in order (copy: Omar, Sara, Yusuf, Omar→Huda)
const CLUSTERS = 8, PER = 5;
const LONG = [['you', 0], ['o', 2], [3, 5], [9, 6]]; // shared people: your web joins others' (to cluster index)
// camera keyframes after act 3: [p, position, target]
const KEYS = [
  [0.31, [0, 1.75, 6.6], [0, 0.8, 0.8]],
  [0.39, [-0.4, 3.0, 9.0], [-0.4, 0.6, 0.6]],
  [0.52, [-0.62, 5.2, 9.4], [-0.62, 0.3, 0.6]],
  [0.65, [-0.62, 8.4, 7.6], [-0.62, 0, 1.0]],
  [0.82, [-0.62, 7.4, 7.2], [-0.62, 0.2, 1.0]],
  [0.97, [-0.62, 19, 17], [-0.62, 0, -1.5]],
];

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
    const camera = new PerspectiveCamera(34, w() / h(), 0.1, 90);
    const hemi = new HemisphereLight(new Color('#FFF4E6'), new Color(colors.field), 1.6); scene.add(hemi);
    const key = new DirectionalLight(new Color('#FFE2C4'), 2.4); key.position.set(3, 6, 5); scene.add(key);
    const fill = new DirectionalLight(new Color(colors.thread), 0.5); fill.position.set(-4, 2, -3); scene.add(fill);

    const fonts = { display: css(dir === 'rtl' ? '--font-display-ar' : '--font-display') || 'system-ui', body: css(dir === 'rtl' ? '--font-arabic' : '--font-geist-sans') || 'system-ui' };
    const cardColors = () => ({ paper: '#FFFDF8', ink: '#14201F', thread: colors.thread });
    const card = makeCard({ colors: cardColors(), name: cardName, dir, fonts });
    scene.add(card.mesh);
    if (document.fonts) document.fonts.load(`700 64px ${fonts.display}`).then(() => { if (!disposed) { card.repaint(); if (capture) frame(0, lastP); } }).catch(() => {});

    const COUNT = phone ? 24 : 60;
    const beads = makeBeads({ count: COUNT, palette: colors.clay, you: colors.you, omar: colors.omar, rimLight: !phone });
    beads.meshes.forEach((m) => scene.add(m));
    const thread = makeThread({ color: colors.thread }); scene.add(thread.mesh);
    thread.span(new Vector3(-APART, HEAD_Y + 0.05, MEET_Z), new Vector3(APART, HEAD_Y + 0.05, MEET_Z), LIFT_STATIC);
    const ambient = makeRipple({ color: colors.thread, radius: phone ? 1.05 : 1.5 }); scene.add(ambient.mesh);
    const touchRing = makeRipple({ color: colors.thread, radius: 0.9 }); scene.add(touchRing.mesh);

    // the twelve people you meet next: the crowd members nearest to you
    const met = beads.home.map(([x, z], i) => ({ i, d: (x - YOU[0]) ** 2 + (z - YOU[1]) ** 2 })).filter((o) => o.i > 1).sort((a, b) => a.d - b.d).slice(0, 12).map((o) => o.i);
    const metIndex = new Map(met.map((bi, j) => [bi, j]));
    const ringOf = new Map(); // bead index → [ring, x, z]
    RINGS.forEach((members, r) => members.forEach((m, j) => {
      const a = r * 0.7 + 0.3 + (j * Math.PI * 2) / members.length, R = RADII[r];
      ringOf.set(m === 'o' ? 1 : met[m], [r, YOU[0] + Math.cos(a) * R, YOU[1] + Math.sin(a) * R * 0.85]);
    }));
    const bead = (k) => (k === 'you' ? 0 : k === 'o' ? 1 : met[k]);
    // the circles drawn on the floor (act 6 on), one colour each, so the four groups read at a glance
    const groundRings = RADII.map((R, r) => {
      const m = new Mesh(new RingGeometry(R - 0.025, R + 0.025, 128), new MeshBasicMaterial({ color: new Color(colors.rings[r]), transparent: true, opacity: 0, depthWrite: false }));
      m.rotation.x = -Math.PI / 2; m.scale.y = 0.85; m.position.set(YOU[0], 0.012, YOU[1]); scene.add(m); return m;
    });

    // the web: you → Omar, you → each person met, introductions, and the long threads to other webs in act 8
    const E_MET = 1, E_INTRO = E_MET + 12, E_LONG = E_INTRO + INTROS.length, E_TOTAL = E_LONG + LONG.length;
    const edges = makeEdges({ capacity: E_TOTAL, color: colors.thread, sun: colors.sun }); scene.add(edges.mesh);
    const pulses = makePulses({ capacity: 1, sun: colors.sun }); scene.add(pulses.mesh);
    // other people's webs (act 8): small clay people and their threads
    const ghosts = new InstancedMesh(new CapsuleGeometry(0.17, 0.22, 3, 10), new MeshStandardMaterial({ roughness: 0.85 }), CLUSTERS * (PER + 1));
    ghosts.instanceMatrix.setUsage(DynamicDrawUsage); ghosts.frustumCulled = false; scene.add(ghosts);
    const ghostEdges = makeEdges({ capacity: CLUSTERS * PER, color: colors.thread, sun: colors.sun, radius: 0.016, emissive: 0.3 }); scene.add(ghostEdges.mesh);
    const ghostHome = [];
    for (let c = 0; c < CLUSTERS; c++) {
      const a = (c / CLUSTERS) * Math.PI * 2 + 0.4, R = 7.2 + (c % 3) * 1.6;
      const cx = YOU[0] + Math.cos(a) * R, cz = YOU[1] + Math.sin(a) * R * 0.8 - 1.5;
      ghostHome.push([cx, cz]);
      for (let k = 0; k < PER; k++) { const b = (k / PER) * Math.PI * 2 + c; ghostHome.push([cx + Math.cos(b) * 0.8, cz + Math.sin(b) * 0.7]); }
    }
    const paintGhosts = () => { const c = new Color(), f = new Color(colors.faded); for (let i = 0; i < ghosts.count; i++) { c.set(colors.clay[i % colors.clay.length]).lerp(f, 0.25); ghosts.setColorAt(i, c); } ghosts.instanceColor.needsUpdate = true; };
    paintGhosts();

    // frame the people beside the words: to the end side on wide screens, above them on phones
    const frameView = () => {
      const W = w(), H = h(), portrait = W / H < 1;
      camera.aspect = W / H; camera.fov = portrait ? 46 : 34;
      if (portrait) camera.setViewOffset(W, H, 0, H * 0.17, W, H);
      else camera.setViewOffset(W, H, (dir === 'rtl' ? 1 : -1) * W * 0.2, 0, W, H);
      camera.updateProjectionMatrix();
    };
    frameView();

    const camPos = new Vector3(), camAt = new Vector3(), A = new Vector3(), B = new Vector3();
    const heads = new Map(); // bead index → head position this frame
    const headOf = (i) => heads.get(i) || heads.set(i, new Vector3()).get(i);
    const o3 = new Object3D(), faded = new Color(), fieldC = new Color(), ringC = colors.rings.map((x) => new Color(x));
    const t0 = performance.now();
    let lastP = 0;
    function frame(now, forcedP) {
      const t = capture ? 0 : (now - t0) / 1000;
      const p = forcedP ?? Math.min(1, Math.max(0, progressRef.current || 0)); lastP = p;
      const portrait = camera.aspect < 1;
      const q = Math.min(p, 0.28) * (0.40 / 0.28); // acts 1–3 run on their original timeline (0..0.40), settled by 0.28
      const s2 = span(q, 0.10, 0.24), s3 = span(q, 0.24, 0.40);
      const a4 = easeInOut(span(p, 0.31, 0.37)), back = easeInOut(span(p, 0.39, 0.45));
      const tapIn = span(p, 0.40, 0.47), intro = span(p, 0.44, 0.49), ring = easeInOut(span(p, 0.52, 0.60)), a8 = easeInOut(span(p, 0.82, 0.97));
      const gone = a4 * (1 - back); // act 4: the hall greys and drifts away, then comes back

      // ---- camera: the act 1–3 path, then keyframes
      if (p <= 0.31) {
        const dolly = easeInOut(s3);
        camPos.set(0, lerp(2.3, 1.75, dolly), lerp(portrait ? 11.5 : 9, portrait ? 8.6 : 6.6, dolly));
        camAt.set(0, lerp(0.9, 0.8, dolly), lerp(0, 0.8, dolly));
      } else {
        let k = 0; while (k < KEYS.length - 2 && p > KEYS[k + 1][0]) k++;
        const [pa, posA, atA] = KEYS[k], [pb, posB, atB] = KEYS[k + 1], e = easeInOut(span(p, pa, pb));
        camAt.set(lerp(atA[0], atB[0], e), lerp(atA[1], atB[1], e), lerp(atA[2], atB[2], e));
        camPos.set(lerp(posA[0], posB[0], e), lerp(posA[1], posB[1], e), lerp(posA[2], posB[2], e));
        if (portrait) camPos.sub(camAt).multiplyScalar(1.35).add(camAt);
      }
      camera.position.copy(camPos); camera.lookAt(camAt);

      // ---- act 7: which note is up, and where its pulse is
      const u = span(p, 0.65, 0.82) * 4, nk = Math.min(3, Math.floor(u)), f = u - nk, inNotes = p > 0.65 && p < 0.82;
      const [nFrom, nTo] = NOTE_EDGES[nk];
      const popAt = inNotes ? bead(nTo) : -1, pop = inNotes ? bump(f, 0.5, 0.9) * 0.18 : 0;

      // ---- the people
      const breathe = (i) => 1 + Math.sin(t * 1.6 + beads.phase[i]) * 0.015;
      for (let i = 2; i < COUNT; i++) {
        let [x, z] = beads.home[i];
        const dx = x - YOU[0], dz = z - YOU[1], d = Math.hypot(dx, dz) || 1;
        x += (dx / d) * 2.4 * gone; z += (dz / d) * 2.4 * gone; // act 4: drift away from you
        const slot = ringOf.get(i);
        if (slot) { x = lerp(x, slot[1], ring); z = lerp(z, slot[2], ring); }
        else if (d < 4.3) { const push = (4.3 - d) * ring; x += (dx / d) * push; z += (dz / d) * push; }
        const band = (i / COUNT) * 0.55;
        const rise = easeOut(span(s2, band, band + 0.45));
        const j = metIndex.get(i);
        const tapped = j === undefined ? 0 : easeOut(span(tapIn, (j / 12) * 0.6, (j / 12) * 0.6 + 0.4));
        const scale = breathe(i) * (1 + tapped * 0.06) * (slot ? 1 : 1 - a8) * (i === popAt ? 1 + pop : 1);
        beads.place(i, x, z, { rise, scale });
        headOf(i).set(x, HEAD_Y * (1 + tapped * 0.06) + 0.04, z);
      }
      // you and Omar: the act 3 approach, the touch, then Omar takes his place in your circles
      const approach = easeInOut(span(q, 0.26, 0.33)), touch = easeOut(span(q, 0.355, 0.37)), apart = easeInOut(span(q, 0.375, 0.39));
      const squash = 1 - bump(q, 0.355, 0.385) * 0.1;
      const riseYou = easeOut(span(s2, 0, 0.4)), riseOmar = easeOut(span(s2, 0.2, 0.6));
      const youX = lerp(lerp(lerp(beads.home[0][0], -GAP, approach), -TOUCH, touch), -APART, apart);
      const youZ = lerp(beads.home[0][1], MEET_Z, approach);
      const oSlot = ringOf.get(1);
      const omX = lerp(lerp(lerp(lerp(beads.home[1][0], GAP, approach), TOUCH, touch), APART, apart), oSlot[1], ring);
      const omZ = lerp(lerp(beads.home[1][1], MEET_Z, approach), oSlot[2], ring);
      const lean = bump(q, 0.33, 0.37) * 0.08;
      beads.place(0, youX, youZ, { rise: riseYou, scale: breathe(0) * 1.06, squash, lean: -lean });
      beads.place(1, omX, omZ, { rise: riseOmar, scale: breathe(1) * 1.06 * (popAt === 1 ? 1 + pop : 1), squash, lean });
      headOf(0).set(youX, HEAD_Y * 1.06 + 0.04, youZ); headOf(1).set(omX, HEAD_Y * 1.06 + 0.04, omZ);
      beads.commit();
      // colours: the hall greys in act 4; the people you met take their circle's colour in act 6
      faded.set(colors.faded).lerp(fieldC.set(colors.field), 0.3);
      beads.paintWith((i, base, out) => {
        if (i === 0) return;
        const slot = ringOf.get(i);
        if (i > 1 || gone) out.lerp(faded, Math.min(1, gone * 0.95 + (i > 1 && !slot ? ring * 0.5 : 0))); // act 4 greys Omar too: only the thread keeps colour
        if (slot) out.lerp(ringC[slot[0]], ring * 0.85);
      });

      // ---- the card: center stage in act 1, then into your hand, and it stays with you
      const turn = span(q, 0, 0.10), toHand = easeInOut(s2);
      const hand = [youX + 0.3, 0.55, youZ + 0.18];
      card.mesh.position.set(lerp(0, hand[0], toHand), lerp((portrait ? 2.35 : 1.3) + Math.sin(t * 0.9) * 0.04, hand[1], toHand), lerp(1.4, hand[2], toHand));
      card.mesh.rotation.set(lerp(-0.08, -0.25, toHand), lerp(-0.31, 0.17, turn) * (dir === 'rtl' ? -1 : 1) + lerp(0, 0.5, toHand), lerp(0.02, 0.15, toHand));
      card.mesh.scale.setScalar(lerp(portrait ? 0.95 : 1.45, 0.22, toHand));
      ambient.mesh.position.copy(card.mesh.position);
      ambient.set(capture ? 0.55 : (t % 2.4) / 1.6, camera, 1 - span(s2, 0, 0.3));
      touchRing.mesh.position.set(0, HEAD_Y * 0.6, MEET_Z);
      touchRing.set(p < 0.31 ? span(q, 0.36, 0.40) : 1, camera);
      groundRings.forEach((m, r) => { m.material.opacity = easeOut(span(ring, r * 0.12, r * 0.12 + 0.5)) * 0.6 * (1 - a8 * 0.5); m.visible = m.material.opacity > 0.001; });

      // ---- the first thread (acts 3–4), then the web takes over
      thread.set(p < 0.39 ? easeOut(span(q, 0.38, 0.40)) : 0, p > 0.31 && p < 0.39 ? 0.25 : 0);
      const glowFor = (from, to) => (inNotes && from === nFrom && to === nTo ? bump(f, 0.3, 1) : 0);
      edges.set(0, headOf(0), headOf(1), p >= 0.39 ? 1 : 0, glowFor('you', 'o'));
      met.forEach((bi, j) => edges.set(E_MET + j, headOf(0), headOf(bi), easeOut(span(tapIn, (j / 12) * 0.6, (j / 12) * 0.6 + 0.4)), glowFor('you', j)));
      INTROS.forEach(([a, b], k) => edges.set(E_INTRO + k, headOf(bead(a)), headOf(bead(b)), easeOut(span(intro, k * 0.12, k * 0.12 + 0.5)), glowFor(a, b)));

      // ---- other people's webs, and the shared people that join them to yours
      const gHead = (n, out) => out.set(ghostHome[n][0], HEAD_Y * 0.8, ghostHome[n][1]);
      for (let c = 0; c < CLUSTERS; c++) {
        const grow = easeOut(span(a8, c * 0.06, c * 0.06 + 0.4));
        gHead(c * (PER + 1), A);
        for (let k = 0; k <= PER; k++) {
          const n = c * (PER + 1) + k, [x, z] = ghostHome[n], s = Math.max(0.0001, grow * (k ? 0.85 : 1.05));
          o3.position.set(x, 0.32 * s, z); o3.scale.setScalar(s); o3.updateMatrix(); ghosts.setMatrixAt(n, o3.matrix);
          if (k) ghostEdges.set(c * PER + k - 1, A, gHead(n, B), easeOut(span(grow, 0.4, 1)));
        }
      }
      ghosts.instanceMatrix.needsUpdate = true; ghostEdges.commit();
      LONG.forEach(([from, c], k) => edges.set(E_LONG + k, headOf(bead(from)), gHead(c * (PER + 1), A), easeOut(span(p, 0.88, 0.98))));
      edges.commit();

      // ---- the assistant's pulse (act 7)
      if (inNotes) pulses.set(0, headOf(bead(nFrom)), headOf(bead(nTo)), easeInOut(span(f, 0, 0.55)), f < 0.55 ? 1 : 1 - span(f, 0.55, 0.75));
      else pulses.set(0, headOf(0), headOf(0), 0, 0.0001);
      pulses.commit();

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
      ringC.forEach((c, i) => c.set(colors.rings[i])); groundRings.forEach((m, i) => m.material.color.set(colors.rings[i]));
      thread.recolor(colors.thread); ambient.recolor(colors.thread); touchRing.recolor(colors.thread);
      edges.recolor(colors.thread, colors.sun); ghostEdges.recolor(colors.thread, colors.sun); pulses.recolor(colors.sun); paintGhosts();
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
