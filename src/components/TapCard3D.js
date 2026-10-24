'use client';
import { useRef } from 'react';
import useReducedMotion from '@/lib/useReducedMotion';
import { Check } from 'lucide-react';
import BrandMark from './BrandMark';

/** The tap card, tilting toward the pointer. CSS transforms only; static under reduced motion. */
export default function TapCard3D({ lang = 'en' }) {
  const ref = useRef(null); const reduce = useReducedMotion();
  const ar = lang === 'ar';
  const move = (e) => {
    if (reduce || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    ref.current.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 18}deg) translateZ(0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = 'rotateY(-12deg) rotateX(8deg)'; };
  return (
    <div className="scene-3d mx-auto w-full max-w-[380px]" onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className="card-3d relative aspect-[1.586] w-full rounded-[20px] p-5 text-splash-ink" style={{ transform: reduce ? 'none' : 'rotateY(-12deg) rotateX(8deg)', background: 'linear-gradient(135deg, #0E4650 0%, #0B1716 65%)', boxShadow: 'var(--tnc-shadow-float), inset 0 1px 0 rgba(255,255,255,.18)' }}>
        <div className="absolute inset-0 rounded-[20px]" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 45%)' }} aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-medium" aria-hidden="true">{ar ? 'ل' : 'LN'}</div>
            <span className="chip" style={{ background: 'rgba(255,255,255,.14)', color: '#EEF3F0' }}><Check size={14} aria-hidden="true" /> {ar ? 'لقاء شخصي' : 'Met in person'}</span>
          </div>
          <div>
            <div className="text-xl font-medium">{ar ? 'ليلى ناصر' : 'Layla Nasser'}</div>
            <div className="text-sm opacity-75">{ar ? 'مديرة الشراكات · شركة ميناء' : 'Head of Partnerships · Meena Co.'}</div>
          </div>
          <div className="flex items-center justify-between text-xs opacity-70"><span>{ar ? 'المس لتبادل البيانات' : 'Tap to exchange details'}</span><BrandMark size={18} /></div>
        </div>
        <span className="ring-tap end-6 top-6 h-10 w-10" style={{ borderColor: '#66D4E0' }} aria-hidden="true" />
      </div>
    </div>
  );
}
