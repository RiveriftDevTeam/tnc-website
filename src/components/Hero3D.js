'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CircleScene = dynamic(() => import('./CircleScene'), { ssr: false, loading: () => null });

/** The CSS-only picture paints first (no JS). The WebGL circle arrives after load, only if the device can afford it. */
export default function Hero3D({ label }) {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)'); const rm = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setDark(mq.matches || document.documentElement.dataset.theme === 'dark'); setReduced(rm.matches); };
    sync(); mq.addEventListener('change', sync); rm.addEventListener('change', sync);
    const saveData = navigator.connection && navigator.connection.saveData;
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory && navigator.deviceMemory < 2);
    let id;
    if (!saveData && !lowEnd && window.WebGLRenderingContext) {
      const go = () => setReady(true);
      id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 600);
    }
    return () => { mq.removeEventListener('change', sync); rm.removeEventListener('change', sync); if (id) ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id)); };
  }, []);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sheet md:aspect-[5/4] lg:aspect-square" role="img" aria-label={label}>
      {/* static first paint: the same composition in CSS */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,.55), rgba(11,95,107,.08) 60%, transparent 70%)' }} />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glass" />
        <span className="ring-tap left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" />
        {[[18, 30, 34, '#F0D9B5'], [74, 26, 28, '#9ED9CF'], [80, 66, 30, '#E8C9A0'], [24, 70, 26, '#BFE4DC'], [50, 86, 22, '#F3C9A8'], [8, 50, 20, '#D7EEF1'], [92, 48, 18, '#E9D6B4']].map(([x, y, s, c], i) => (
          <div key={i} className="absolute rounded-full shadow-1" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, background: `radial-gradient(circle at 35% 30%, #fff, ${c} 55%, rgba(0,0,0,.06))`, transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>
      {ready && <CircleScene dark={dark} reduced={reduced} />}
    </div>
  );
}
