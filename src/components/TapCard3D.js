import BrandMark from './BrandMark';

/** The tap card: the same paper face, coral thread and tap mark as the card in the story scene. It rests tilted and
 *  straightens toward you on hover (CSS only, no script; static under reduced motion via globals.css). */
export default function TapCard3D({ lang = 'en' }) {
  const ar = lang === 'ar';
  return (
    <div className="scene-3d group mx-auto w-full max-w-[400px]">
      <div className="card-3d relative aspect-[1.586] w-full overflow-hidden rounded-[20px] p-5 text-[#14201F] [transform:rotateY(-12deg)_rotateX(8deg)] group-hover:[transform:rotateY(4deg)_rotateX(-3deg)_scale(1.02)] rtl:[transform:rotateY(12deg)_rotateX(8deg)] rtl:group-hover:[transform:rotateY(-4deg)_rotateX(-3deg)_scale(1.02)] motion-reduce:![transform:none]" style={{ background: '#F6F1EA', boxShadow: '0 0 0 2px var(--tnc-site-thread), var(--tnc-shadow-float)' }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 63" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-2 39 C 30 26, 55 52, 102 35" fill="none" stroke="var(--tnc-site-thread)" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
        </svg>
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-display text-lg font-bold tracking-tight">TapNConnect</span>
            <span className="chip !bg-[#14201F]/5 !text-[#14201F]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
              {ar ? 'لقاء شخصي' : 'Met in person'}
            </span>
          </div>
          <div>
            <div className="font-display text-xl font-semibold">{ar ? 'ليلى ناصر' : 'Layla Nasser'}</div>
            <div className="text-sm opacity-70">{ar ? 'مديرة الشراكات · شركة ميناء' : 'Head of Partnerships · Meena Co.'}</div>
          </div>
          <div className="flex items-center justify-between text-xs opacity-70"><span>{ar ? 'المس لتبادل البيانات' : 'Tap to exchange details'}</span><BrandMark size={18} /></div>
        </div>
        <span className="ring-tap end-6 top-12 h-10 w-10" aria-hidden="true" />
      </div>
    </div>
  );
}
