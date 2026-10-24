'use client';
// The hero: you in the centre, the people you meet around you, a tap ring now and then. Vanilla three (no r3f).
// Loaded after first paint by Hero3D; renders only while on screen and the tab is visible; one frame under reduced motion.
import { useEffect, useRef } from 'react';
import {
  Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, Mesh, Group,
  HemisphereLight, DirectionalLight, Color, RingGeometry, DoubleSide, SRGBColorSpace, Fog, CircleGeometry,
} from 'three';

const PEOPLE = [
  // radius, angle (turns), height, size, hue (warm or cool)
  [2.3, 0.00, 0.10, 0.34, '#F0D9B5'], [2.9, 0.14, -0.25, 0.30, '#9ED9CF'], [3.4, 0.27, 0.35, 0.26, '#E8C9A0'],
  [2.6, 0.40, -0.05, 0.32, '#BFE4DC'], [3.6, 0.52, 0.22, 0.24, '#F3C9A8'], [2.2, 0.63, -0.30, 0.30, '#D7EEF1'],
  [3.1, 0.75, 0.15, 0.28, '#E9D6B4'], [3.8, 0.86, -0.18, 0.22, '#A9D9CE'], [2.75, 0.95, 0.30, 0.27, '#F6E3B4'],
  [4.2, 0.20, -0.40, 0.18, '#E2E8E4'], [4.4, 0.58, 0.42, 0.17, '#F0D9B5'], [4.1, 0.80, 0.05, 0.19, '#C9E6E0'],
];

export default function CircleScene({ dark = false, reduced = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0, running = true, visible = true, disposed = false;
    const w = () => el.clientWidth, h = () => el.clientHeight;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w(), h());
    renderer.outputColorSpace = SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const scene = new Scene();
    scene.fog = new Fog(new Color(dark ? '#0B1514' : '#F2EDE3'), 8.5, 13.5);
    const camera = new PerspectiveCamera(32, w() / h(), 0.1, 50);
    camera.position.set(0, 2.6, 8.6); camera.lookAt(0, -0.1, 0);

    const hemi = new HemisphereLight(new Color(dark ? '#66D4E0' : '#FFFFFF'), new Color(dark ? '#3E3222' : '#C9A36A'), dark ? 0.9 : 1.15);
    scene.add(hemi);
    const key = new DirectionalLight(new Color('#FFFFFF'), dark ? 0.9 : 1.3); key.position.set(3, 5, 4); scene.add(key);
    const rim = new DirectionalLight(new Color(dark ? '#66D4E0' : '#0B5F6B'), dark ? 0.7 : 0.35); rim.position.set(-4, 2, -3); scene.add(rim);

    const group = new Group(); group.scale.setScalar(0.66); scene.add(group);
    const sphereGeo = new SphereGeometry(1, 48, 32);
    // you: petrol, slightly larger
    const you = new Mesh(sphereGeo, new MeshStandardMaterial({ color: new Color(dark ? '#66D4E0' : '#0B5F6B'), roughness: 0.35, metalness: 0.05 }));
    you.scale.setScalar(0.5); group.add(you);
    // ring under you (the tap) — expands and fades
    const ringMat = new MeshBasicMaterial({ color: new Color(dark ? '#66D4E0' : '#0B5F6B'), transparent: true, opacity: 0.0, side: DoubleSide });
    const ring = new Mesh(new RingGeometry(0.96, 1.0, 96), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = -0.48; group.add(ring);
    // a soft contact shadow under you, nothing more (the backdrop is the ground)
    const disc = new Mesh(new CircleGeometry(1.1, 48), new MeshBasicMaterial({ color: new Color(dark ? '#000000' : '#0B5F6B'), transparent: true, opacity: dark ? 0.25 : 0.10 }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = -0.62; group.add(disc);

    const people = PEOPLE.map(([r, turn, y, s, hex], i) => {
      const m = new Mesh(sphereGeo, new MeshStandardMaterial({ color: new Color(hex), roughness: 0.55, metalness: 0.0 }));
      m.userData = { r, a: turn * Math.PI * 2, y, s, phase: i * 0.7 };
      m.scale.setScalar(s); group.add(m); return m;
    });

    const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const onMove = (e) => { const b = el.getBoundingClientRect(); target.x = ((e.clientX - b.left) / b.width - 0.5) * 2; target.y = ((e.clientY - b.top) / b.height - 0.5) * 2; };
    window.addEventListener('pointermove', onMove, { passive: true });
    const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix(); if (reduced) frame(0); };
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduced) loop(); }, { threshold: 0.05 });
    io.observe(el);
    const onVis = () => { running = !document.hidden; if (running && visible && !reduced) loop(); };
    document.addEventListener('visibilitychange', onVis);

    const t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      pointer.x += (target.x - pointer.x) * 0.04; pointer.y += (target.y - pointer.y) * 0.04;
      group.rotation.y = t * 0.06 + pointer.x * 0.25;
      group.rotation.x = pointer.y * 0.08;
      for (const m of people) {
        const { r, a, y, phase } = m.userData;
        m.position.set(Math.cos(a) * r, y + Math.sin(t * 0.6 + phase) * 0.08, Math.sin(a) * r);
      }
      you.position.y = Math.sin(t * 0.8) * 0.04;
      const k = (t % 3.2) / 3.2; // the tap ring every 3.2 s
      ring.scale.setScalar(0.6 + k * 3.2); ringMat.opacity = k < 0.05 ? k * 12 : Math.max(0, 0.6 * (1 - k));
      renderer.render(scene, camera);
    }
    function loop() {
      cancelAnimationFrame(raf);
      const step = (now) => { if (disposed || !running || !visible) return; frame(now); raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    if (reduced) frame(1200); else loop();

    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
      sphereGeo.dispose(); ring.geometry.dispose(); disc.geometry.dispose();
      scene.traverse((o) => { if (o.material) o.material.dispose(); });
      renderer.dispose(); if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [dark, reduced]);
  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
