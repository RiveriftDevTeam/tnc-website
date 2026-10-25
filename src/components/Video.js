'use client';
import { useEffect, useRef, useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** A muted, looping, self-hosted clip (public/media/video/<name>.{webm,mp4} + <name>.jpg poster; plan Amendment A2.2).
 *  The poster is the server-rendered first paint. The clip loads only on wide screens, without reduced motion or data
 *  saver, and plays only while on screen. Decorative: the words around it carry the meaning. */
export default function Video({ name, className = '', mediaClassName = 'h-full w-full object-cover', priority = false }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const c = navigator.connection;
    if ((c && c.saveData) || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 767px)').matches) return;
    setPlay(true);
  }, []);
  useEffect(() => {
    const v = ref.current; if (!play || !v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, [play]);
  const poster = `${BASE}/media/video/${name}.jpg`;
  return (
    <div className={className} aria-hidden="true">
      {play ? (
        <video ref={ref} className={mediaClassName} poster={poster} muted loop playsInline preload="metadata" disablePictureInPicture>
          <source src={`${BASE}/media/video/${name}.webm`} type="video/webm" />
          <source src={`${BASE}/media/video/${name}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className={mediaClassName} decoding="async" loading={priority ? 'eager' : 'lazy'} {...(priority ? { fetchpriority: 'high' } : {})} />
      )}
    </div>
  );
}
