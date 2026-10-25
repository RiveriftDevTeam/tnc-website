'use client';
import { useEffect, useRef } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** A muted, looping, self-hosted clip (public/media/video/<name>.{webm,mp4} + <name>.jpg poster; plan Amendment A2.2).
 *  Server-rendered as the poster alone (no sources, nothing downloads). On wide screens without reduced motion or data
 *  saver the sources are attached and it plays only while on screen. Decorative: the words around it carry the meaning. */
export default function Video({ name, className = '', mediaClassName = 'h-full w-full object-cover' }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current, c = navigator.connection;
    if (!v || (c && c.saveData) || matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;
    for (const ext of ['webm', 'mp4']) { const s = document.createElement('source'); s.src = `${BASE}/media/video/${name}.${ext}`; s.type = `video/${ext}`; v.append(s); }
    v.load();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, [name]);
  return (
    <div className={className} aria-hidden="true">
      <video ref={ref} className={mediaClassName} poster={`${BASE}/media/video/${name}.jpg`} muted loop playsInline preload="none" disablePictureInPicture />
    </div>
  );
}
