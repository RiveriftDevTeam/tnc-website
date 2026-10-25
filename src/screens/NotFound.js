import { dict } from '@/content';
import { pathFor } from '@/content/site';
import Cta from '@/components/Cta';
import Photo from '@/components/Photo';

/** A thread with a loose end: the two halves drift apart and re-tie, with a knot, when you hover or focus the page.
 *  CSS only (Tailwind group-hover / group-focus-within); with reduced motion the global rule makes it instant. */
function LooseThread() {
  const piece = 'absolute top-1/2 h-12 -translate-y-1/2 transition-transform duration-story ease-pop';
  return (
    <div aria-hidden="true" className="relative mx-auto h-14 w-full max-w-md text-thread">
      <svg className={`${piece} start-0 w-[46%] -translate-x-0 group-hover:translate-x-[8%] group-focus-within:translate-x-[8%] rtl:-scale-x-100 rtl:group-hover:-translate-x-[8%] rtl:group-focus-within:-translate-x-[8%]`} viewBox="0 0 100 48" fill="none" preserveAspectRatio="none">
        <path d="M0 24 C 20 6, 40 42, 62 24 S 88 10, 96 30 C 99 40, 90 46, 86 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className={`${piece} end-0 w-[46%] group-hover:-translate-x-[8%] group-focus-within:-translate-x-[8%] rtl:-scale-x-100 rtl:group-hover:translate-x-[8%] rtl:group-focus-within:translate-x-[8%]`} viewBox="0 0 100 48" fill="none" preserveAspectRatio="none">
        <path d="M100 24 C 82 40, 62 8, 40 24 S 14 38, 8 20 C 5 10, 14 4, 18 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute start-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full border-2 border-current bg-ground opacity-0 transition-all duration-base delay-200 ease-pop group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100" />
    </div>
  );
}

/** One 404 for the whole static site, so it speaks both languages (one h1 per language block; scripts/check.mjs expects two). */
export default function NotFound() {
  const en = dict.en;
  return (
    <section className="section">
      <div className="group wrap max-w-4xl">
        <div className="photo-card mx-auto aspect-[3/2] max-w-xl"><Photo slot="notfound" alt={en.notFound.photoAlt} priority sizes="(min-width:768px) 36rem, 90vw" /></div>
        <div className="mt-8"><LooseThread /></div>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          {['en', 'ar'].map((lang) => { const d = dict[lang]; const H = 'h1'; return (
            <div key={lang} lang={lang} dir={d.dir} className="text-center">
              <H className="t-h1">{d.notFound.title}</H>
              <p className="lead mt-4">{d.notFound.p}</p>
              <div className="mt-8"><Cta href={pathFor('home', lang)} variant={lang === 'en' ? 'primary' : 'tonal'} placement="404">{d.notFound.home}</Cta></div>
            </div>
          ); })}
        </div>
      </div>
    </section>
  );
}
