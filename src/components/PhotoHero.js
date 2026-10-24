// The landing hero: a real exhibition hall (video loop with a photo poster), the promise, who it is for, two asks.
import Link from 'next/link';
import Cta from './Cta';
import { HeroVideo } from './Media';

export default function PhotoHero({ act, chips, primary, primaryHref, secondary, secondaryHref, video, poster, alt }) {
  return (
    <section className="on-dark relative min-h-[88svh] bg-splash text-splash-ink">
      <HeroVideo item={video} poster={poster} alt={alt} className="absolute inset-0" />
      <div className="absolute inset-0 rtl:-scale-x-100" aria-hidden="true" style={{ background: 'linear-gradient(90deg, rgba(11,23,22,.92) 0%, rgba(11,23,22,.7) 40%, rgba(11,23,22,.25) 75%, rgba(11,23,22,.35) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-40" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(11,23,22,0), rgba(11,23,22,.9))' }} />
      <div className="wrap relative flex min-h-[88svh] flex-col justify-end pb-16 pt-24 sm:justify-center sm:py-24">
        <div className="max-w-2xl">
          <div className="eyebrow">{act.eyebrow}</div>
          <h1 className="t-display mt-3">{act.h}</h1>
          <p className="lead mt-5 max-w-xl !text-splash-ink/85">{act.p}</p>
          <div className="mt-6 flex flex-wrap gap-2">{chips.map((c) => <Link prefetch={false} key={c.href} href={c.href} className="chip border border-white/15 bg-white/10 !text-splash-ink hover:bg-white/20" style={{ minHeight: 34, fontSize: '.9rem' }}>{c.label}</Link>)}</div>
          <div className="mt-7 flex flex-wrap gap-3"><Cta href={primaryHref} placement="hero">{primary}</Cta><Cta href={secondaryHref} variant="tonal" placement="hero" className="!bg-white/10 !text-splash-ink hover:!bg-white/20">{secondary}</Cta></div>
        </div>
      </div>
    </section>
  );
}
