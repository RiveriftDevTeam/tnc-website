'use client';
// The landing story in one WebGL scene, scrubbed by scroll (progress 0..1 read from a ref, never through React):
//   act 1  the hall: hundreds of people, warm light, the event vibe
//   act 2  the touch: two points of light cross the hall, pause a finger's width apart, touch — one ring
//   act 3  the fade: the hall empties, names go grey, the person drifts away
//   act 4  the thread: TapNConnect lights the line back, and the people you met gather round you
//   act 5  the circle stays lit while the page goes on
// Vanilla three, no r3f. Renders only while on screen; one still frame under reduced motion.
import { useEffect, useRef } from 'react';
import {
  Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, Mesh, Group,
  HemisphereLight, PointLight, Color, RingGeometry, DoubleSide, SRGBColorSpace, Fog, BufferGeometry, Float32BufferAttribute,
  Points, Line, LineBasicMaterial, Vector3, AdditiveBlending, ShaderMaterial, PlaneGeometry,
} from 'three';

const POINT_VERT = `
  attribute vec3 color; attribute float size; varying vec3 vColor;
  void main() { vColor = color; vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = min(size * (300.0 / -mv.z), 22.0); gl_Position = projectionMatrix * mv; }`;
const POINT_FRAG = `
  uniform float uOpacity; uniform float uGrey; varying vec3 vColor;
  void main() { vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d) * uOpacity; vec3 col = mix(vColor, vec3(0.42, 0.47, 0.46), uGrey);
    gl_FragColor = vec4(col * (0.75 + 0.25 * (1.0 - d * 2.0)), a); }`;
const HALO_VERT = `
  uniform float uScale; varying vec2 vUv;
  void main() { vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0); mv.xy += position.xy * uScale; gl_Position = projectionMatrix * mv; }`;
const HALO_FRAG = `
  uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
  void main() { float d = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - d), 2.2) * uOpacity; gl_FragColor = vec4(uColor * a, a); }`;
function halo(hex, scale) {
  const m = new Mesh(new PlaneGeometry(1, 1), new ShaderMaterial({ vertexShader: HALO_VERT, fragmentShader: HALO_FRAG, uniforms: { uColor: { value: new Color(hex) }, uOpacity: { value: 0.5 }, uScale: { value: scale } }, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending }));
  m.renderOrder = 10; m.frustumCulled = false; return m;
}

const ACCENT = '#66D4E0', ACCENT_DEEP = '#0B5F6B', SAND = '#F0D9B5', WARM = '#F3C9A8', TEAL = '#9ED9CF', GREY = '#3E4B49';
const KEPT = [ // the people who stay: radius, turn, height, size, colour
  [3.0, 0.00, 0.1, 0.30, SAND], [3.6, 0.13, -0.2, 0.26, TEAL], [4.1, 0.26, 0.3, 0.24, WARM], [3.2, 0.39, -0.05, 0.28, '#BFE4DC'],
  [4.3, 0.51, 0.2, 0.22, SAND], [2.9, 0.62, -0.3, 0.27, '#D7EEF1'], [3.8, 0.74, 0.15, 0.25, '#E9D6B4'], [4.4, 0.86, -0.15, 0.21, TEAL],
  [3.4, 0.94, 0.25, 0.24, WARM], [4.8, 0.2, -0.35, 0.18, '#E2E8E4'], [5.0, 0.58, 0.4, 0.17, SAND],
];
const seeded = (n) => { let s = 1234 + n; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };            // smoothstep
const seg = (p, a, b) => ease((p - a) / (b - a));                                     // 0 before a, 1 after b
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (out, a, b, t) => out.set(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));

export default function StoryCanvas({ progressRef, reduced = false, onReady, dir = 'ltr' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0, running = true, visible = true, disposed = false;
    const w = () => el.clientWidth, h = () => el.clientHeight;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w(), h()); renderer.outputColorSpace = SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const scene = new Scene(); scene.fog = new Fog(new Color('#0B1716'), 14, 34);
    const camera = new PerspectiveCamera(36, w() / h(), 0.1, 80);
    scene.add(new HemisphereLight(new Color('#CFE9E4'), new Color('#3E3222'), 0.55));
    const key = new PointLight(new Color('#FFE7C2'), 60, 40, 2); key.position.set(4, 7, 6); scene.add(key);
    const rim = new PointLight(new Color(ACCENT), 30, 30, 2); rim.position.set(-6, 3, -4); scene.add(rim);

    // the crowd
    const N = 1100, rnd = seeded(7), pos = new Float32Array(N * 3), base = new Float32Array(N * 3), col = new Float32Array(N * 3), phase = new Float32Array(N), size = new Float32Array(N);
    const palette = [SAND, WARM, TEAL, '#FFFFFF', '#E9D6B4', '#CFE9E4'].map((c) => new Color(c));
    for (let i = 0; i < N; i++) {
      const x = (rnd() - 0.5) * 34, z = (rnd() - 0.5) * 22, y = 0.1 + rnd() * 0.5;
      base.set([x, y, z], i * 3); pos.set([x, y, z], i * 3); phase[i] = rnd() * Math.PI * 2;
      const c = palette[Math.floor(rnd() * palette.length)]; col.set([c.r, c.g, c.b], i * 3); size[i] = 0.5 + rnd() * 0.9;
    }
    const crowdGeo = new BufferGeometry(); crowdGeo.setAttribute('position', new Float32BufferAttribute(pos, 3)); crowdGeo.setAttribute('color', new Float32BufferAttribute(col, 3)); crowdGeo.setAttribute('size', new Float32BufferAttribute(size, 1));
    const crowdMat = new ShaderMaterial({ vertexShader: POINT_VERT, fragmentShader: POINT_FRAG, uniforms: { uOpacity: { value: 0.95 }, uGrey: { value: 0 } }, transparent: true, depthWrite: false, blending: AdditiveBlending });
    const crowd = new Points(crowdGeo, crowdMat); scene.add(crowd);
    // the floor glow
    const floor = new Mesh(new RingGeometry(0.01, 18, 64), new MeshBasicMaterial({ color: new Color('#143A40'), transparent: true, opacity: 0.35, side: DoubleSide }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.05; scene.add(floor);

    // you and the person you meet
    const sphere = new SphereGeometry(1, 40, 28);
    const youMat = new MeshStandardMaterial({ color: new Color(ACCENT_DEEP), emissive: new Color(ACCENT), emissiveIntensity: 0.9, roughness: 0.35 });
    const you = new Mesh(sphere, youMat); you.scale.setScalar(0.34); scene.add(you);
    const youLight = new PointLight(new Color(ACCENT), 8, 8, 2); you.add(youLight);
    const youHalo = halo(ACCENT, 2.8); scene.add(youHalo);
    const themHalo = halo(WARM, 2.3); scene.add(themHalo);
    const themMat = new MeshStandardMaterial({ color: new Color('#C8791A'), emissive: new Color(WARM), emissiveIntensity: 0.7, roughness: 0.5 });
    const them = new Mesh(sphere, themMat); them.scale.setScalar(0.3); scene.add(them);
    // the ring of the touch
    const ringMat = new MeshBasicMaterial({ color: new Color(ACCENT), transparent: true, opacity: 0, side: DoubleSide, blending: AdditiveBlending, depthWrite: false });
    const ring = new Mesh(new RingGeometry(0.94, 1, 96), ringMat); ring.rotation.x = -Math.PI / 2; scene.add(ring);
    const ring2 = new Mesh(new RingGeometry(0.97, 1, 96), ringMat.clone()); ring2.rotation.x = -Math.PI / 2; scene.add(ring2);
    // the thread you <-> them, and the threads to the kept people
    const mkLine = () => { const g = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]); const m = new LineBasicMaterial({ color: new Color(ACCENT), transparent: true, opacity: 0, blending: AdditiveBlending }); const l = new Line(g, m); scene.add(l); return l; };
    const thread = mkLine();
    const kept = KEPT.map(([r, turn, y, s, hex], i) => {
      const m = new Mesh(sphere, new MeshStandardMaterial({ color: new Color(hex), emissive: new Color(hex), emissiveIntensity: 0.25, roughness: 0.55, transparent: true, opacity: 0 }));
      m.scale.setScalar(0.001); scene.add(m);
      const a = turn * Math.PI * 2;
      return { m, line: mkLine(), home: new Vector3(Math.cos(a) * r, 0.4 + y, Math.sin(a) * r), from: new Vector3(Math.cos(a) * r * 2.6, 0.2, Math.sin(a) * r * 2.6), s, phase: i * 0.9 };
    });

    const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const onMove = (e) => { target.x = (e.clientX / window.innerWidth - 0.5) * 2; target.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', onMove, { passive: true });
    const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix(); if (reduced) frame(performance.now()); };
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduced) loop(); }, { threshold: 0.01 });
    io.observe(el);
    const onVis = () => { running = !document.hidden; if (running && visible && !reduced) loop(); };
    document.addEventListener('visibilitychange', onVis);

    const camPos = new Vector3(), camAt = new Vector3(), themPos = new Vector3(), tmp = new Vector3();
    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      const p = reduced ? 0.74 : clamp01(progressRef.current || 0);
      pointer.x += (target.x - pointer.x) * 0.05; pointer.y += (target.y - pointer.y) * 0.05;

      // ---- camera path
      const s1 = seg(p, 0.02, 0.26), s2 = seg(p, 0.40, 0.56), s3 = seg(p, 0.58, 0.78), s4 = seg(p, 0.80, 1);
      if (p < 0.40) { mix(camPos, [0, 5.5, 19], [0.4, 1.3, 7.4], s1); mix(camAt, [0, 0.6, 0], [0.4, 0.4, 0], s1); }
      else if (p < 0.58) { mix(camPos, [0.4, 1.3, 7.4], [0, 6, 16], s2); mix(camAt, [0.4, 0.4, 0], [0, 0.4, 0], s2); }
      else if (p < 0.80) { mix(camPos, [0, 6, 16], [0, 7.5, 12.5], s3); mix(camAt, [0, 0.4, 0], [0, 0.3, 0], s3); }
      else { const a = s4 * 0.9 + t * 0.03; camPos.set(Math.sin(a) * 12.5, 7.5 + s4 * 1.5, Math.cos(a) * 12.5); camAt.set(0, 0.3, 0); }
      // keep the people beside the words: to the end side on wide screens, above them on phones
      const portrait = camera.aspect < 1; const side = dir === 'rtl' ? 1 : -1;
      const offAmt = p < 0.02 ? 0 : 1;
      if (portrait) camAt.y -= 2.2 * offAmt * (p < 0.4 ? 0.38 : 0.9); else camAt.x += side * (p < 0.4 ? 1.9 : 3.2) * offAmt;
      camPos.x += pointer.x * 0.5; camPos.y += -pointer.y * 0.3;
      camera.position.copy(camPos); camera.lookAt(camAt);

      // ---- the crowd: alive in the hall, thinning and greying as the hall empties
      const alive = 1 - seg(p, 0.42, 0.60) * 0.86;
      const arr = crowdGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const j = i * 3, drift = seg(p, 0.42, 0.62);
        arr[j] = base[j] + Math.sin(t * 0.5 + phase[i]) * 0.12 + Math.sign(base[j]) * drift * 6;
        arr[j + 1] = base[j + 1] + Math.sin(t * 0.9 + phase[i]) * 0.05;
        arr[j + 2] = base[j + 2] + Math.cos(t * 0.4 + phase[i]) * 0.12 + Math.sign(base[j + 2]) * drift * 4;
      }
      crowdGeo.attributes.position.needsUpdate = true;
      crowdMat.uniforms.uOpacity.value = 0.95 * alive; crowdMat.uniforms.uGrey.value = seg(p, 0.44, 0.62) * 0.85;
      floor.material.opacity = 0.35 * alive;
      key.intensity = 60 * (0.35 + 0.65 * alive);

      // ---- the beats of the touch, used by everything below
      const approach = seg(p, 0.06, 0.30), pause = seg(p, 0.30, 0.345), touch = seg(p, 0.345, 0.375);
      const drift = seg(p, 0.44, 0.60), back = seg(p, 0.62, 0.76);
      // ---- you
      you.position.set(0, 0.42 + Math.sin(t * 0.8) * 0.03, 0); youHalo.position.copy(you.position);
      youHalo.material.uniforms.uOpacity.value = 0.45 + touch * 0.35 + seg(p, 0.6, 0.72) * 0.25;
      youMat.emissiveIntensity = 0.9 + Math.sin(t * 2) * 0.1 + seg(p, 0.6, 0.72) * 0.5;

      // ---- them: across the hall, the pause a finger's width away, the touch, the drift, the return to the circle
      if (p < 0.44) { const x = lerp(lerp(9, 1.15, approach), 0.68, touch); themPos.set(x, 0.42 + (1 - approach) * 0.3 + pause * 0, 0.1); }
      else if (p < 0.62) { mix(themPos, [0.86, 0.42, 0.1], [7, 0.3, -5], drift); }
      else { mix(themPos, [7, 0.3, -5], [2.6, 0.5, 1.2], back); }
      them.position.copy(themPos); themHalo.position.copy(themPos);
      const grey = seg(p, 0.46, 0.6) * (1 - back);
      themMat.color.set('#C8791A').lerp(new Color(GREY), grey); themMat.emissive.set(WARM).lerp(new Color('#1A2423'), grey);
      themMat.emissiveIntensity = 0.55 + touch * 0.5 - grey * 0.45 + back * 0.1; themHalo.material.uniforms.uOpacity.value = (0.4 + touch * 0.4) * (1 - grey * 0.9);
      // the ring, once, at the touch
      const burst = seg(p, 0.36, 0.44);
      ring.position.set(0.34, 0.08, 0.05); ring.scale.setScalar(0.4 + burst * 5.5); ringMat.opacity = burst > 0 ? 0.9 * (1 - burst) : 0;
      ring2.position.copy(ring.position); ring2.scale.setScalar(0.3 + seg(p, 0.38, 0.47) * 8); ring2.material.opacity = 0.45 * (1 - seg(p, 0.38, 0.47)) * (p > 0.38 ? 1 : 0);
      // the thread: lit by TapNConnect, pulses while the circle is up
      const lit = seg(p, 0.60, 0.70);
      thread.geometry.setFromPoints([you.position, them.position]);
      thread.material.opacity = lit * (0.55 + Math.sin(t * 3) * 0.2) * (1 - grey);

      // ---- the people you met gather round
      const gather = seg(p, 0.64, 0.84);
      for (const k of kept) {
        const g = ease(clamp01(gather * 1.3 - k.phase * 0.05));
        tmp.copy(k.from).lerp(k.home, g); tmp.y += Math.sin(t * 0.7 + k.phase) * 0.06;
        k.m.position.copy(tmp); k.m.scale.setScalar(Math.max(0.001, k.s * g)); k.m.material.opacity = g;
        k.line.geometry.setFromPoints([you.position, tmp]); k.line.material.opacity = g * (0.3 + Math.sin(t * 2 + k.phase) * 0.12);
      }
      renderer.render(scene, camera);
    }
    function loop() {
      cancelAnimationFrame(raf);
      const step = (now) => { if (disposed || !running || !visible) return; frame(now); raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    frame(performance.now()); if (!reduced) loop();
    if (onReady) onReady();
    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose(); if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [progressRef, reduced, onReady, dir]);
  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
