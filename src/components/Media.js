'use client';
// Real photographs and one video loop of exhibitions, served from public/media (fetched once by scripts/media.mjs).
// Photo: responsive <picture> (960 / 1920), lazy, object-cover, with an optional scrim so words stay readable.
// HeroVideo: muted autoplay loop with a poster; the poster alone under reduced motion, save-data or when the
// file is not there yet. Both fall back to a quiet gradient when the media has not been fetched.
import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '@/lib/useReducedMotion';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const mediaUrl = (file) => `${BASE}/media/${file}`;

export function Photo({ item, alt, className = '', scrim = 'none', priority = false, position = '50% 50%' }) {
  const [ok, setOk] = useState(true);
  const scrims = {
    none: null,
    bottom: 'linear-gradient(180deg, rgba(11,23,22,0) 30%, rgba(11,23,22,.85) 100%)',
    start: 'linear-gradient(90deg, rgba(11,23,22,.9) 0%, rgba(11,23,22,.55) 45%, rgba(11,23,22,.15) 100%)',
    full: 'linear-gradient(180deg, rgba(11,23,22,.55), rgba(11,23,22,.7))',
  };
  return (
    <div className={`relative overflow-hidden bg-splash ${className}`}>
      {item && ok ? (
        <picture>
          <source media="(min-width: 768px)" srcSet={mediaUrl(`${item}-1920.jpg`)} />
          <img src={mediaUrl(`${item}-960.jpg`)} alt={alt || ''} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
        </picture>
      ) : (
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(900px 500px at 50% 80%, rgba(102,212,224,.18), transparent 70%), #0B1716' }} />
      )}
      {scrims[scrim] && <div className="absolute inset-0 rtl:-scale-x-100" aria-hidden="true" style={{ background: scrims[scrim] }} />}
    </div>
  );
}

export function HeroVideo({ item, poster, alt, className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData || !item) return;
    setPlay(true);
  }, [reduce, item]);
  useEffect(() => {
    const v = ref.current; if (!v || !play) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v); return () => io.disconnect();
  }, [play]);
  return (
    <div className={`relative overflow-hidden bg-splash ${className}`}>
      <Photo item={poster} alt={alt} priority className="absolute inset-0" />
      {play && !failed && (
        <video ref={ref} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline autoPlay preload="metadata" poster={poster ? mediaUrl(`${poster}-1920.jpg`) : undefined} onError={() => setFailed(true)} aria-hidden="true">
          <source src={mediaUrl(`${item}.mp4`)} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
