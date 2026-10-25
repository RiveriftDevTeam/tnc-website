import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { t } from '@/content';
import { fill } from '@/content/fill';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import ScrollStory from '@/components/ScrollStory';
import Photo from '@/components/Photo';
import Sticker from '@/components/Sticker';
import Thread, { Knot } from '@/components/Thread';
import Vignette from '@/components/Vignettes';
import YearTimeline from '@/components/YearTimeline';
import TapCard3D from '@/components/TapCard3D';
import JsonLd from '@/components/JsonLd';
import { graph, ldWebPage, ldSoftwareApp, ldProductCard, ldHowTo } from '@/lib/seo';

// "What everyone gains" (docs/plans/site-revamp.md Amendment A1.2): the order buyers are told in, their page, order kind and photo
const GAINS = [
  { k: 'individuals', kind: null, photo: 'door-individuals' },
  { k: 'exhibitors', kind: 'exhibitor', photo: 'door-exhibitors' },
  { k: 'sponsors', kind: 'sponsor', photo: 'door-sponsors' },
  { k: 'organisers', kind: 'organiser', photo: 'door-organisers' },
  { k: 'companies', kind: 'company', photo: 'door-companies' },
];

export default function Home({ lang }) {
  const d = t(lang); const h = d.home;
  const Arrow = () => <ArrowRight size={16} aria-hidden="true" className="rtl:rotate-180" />;
  const orderHref = (kind) => `${pathFor('order', lang)}?kind=${kind}`;
  return (
    <>
      {/* THE STORY: eight acts, from one tap to everyone's web */}
      <ScrollStory
        lang={lang} acts={h.acts} label={h.hero.sceneLabel} dir={d.dir}
        chips={Object.entries(h.chips).map(([k, label]) => ({ href: pathFor(k, lang), label }))}
        primary={h.hero.primary} primaryHref={JOIN_URL} secondary={h.hero.secondary} secondaryHref={pathFor('order', lang)}
        photos={Object.fromEntries(['story-hall', 'story-touch'].map((slot, k) => [slot, <Photo key={slot} slot={slot} alt="" sizes="100vw" priority={k === 0} className="absolute inset-0" imgClassName="h-full w-full object-cover" />]))}
        skip={h.skip} storyNav={h.storyNav} chapter={h.chapter} sample={h.sample} cardName={h.cardName}
      />

      {/* WHAT EVERYONE GAINS: one block per buyer, the rail keeps them in view on wide screens */}
      <section id="who" className="section scroll-mt-16" aria-labelledby="gains-h">
        <div className="wrap">
          <div className="max-w-3xl">
            <h2 id="gains-h" className="t-h1">{h.gains.h2}</h2>
            <p className="lead mt-5">{h.gains.lead}</p>
          </div>
          {/* the loop on one line, strung on the thread */}
          <div className="relative mt-12">
            <Thread shape="line" className="absolute inset-x-[10%] top-[7px] hidden h-0.5 md:block" />
            <ol className="relative grid gap-5 md:grid-cols-5">
              {h.loop.steps.map((s) => (
                <li key={s.title} className="flex gap-3 md:block md:text-center">
                  <span className="mt-0.5 shrink-0 text-thread md:mx-auto md:block md:w-fit" aria-hidden="true"><Knot size={16} /></span>
                  <div><h3 className="t-h3 md:mt-3">{s.title}</h3><p className="mt-1 text-[.95rem] text-muted md:text-sm">{s.p}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-6 md:text-center"><Link prefetch={false} href={pathFor('how', lang)} className="link text-[.95rem]">{h.loop.link}</Link></div>
          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <nav aria-label={h.gains.h2} className="hidden lg:block">
              <ol className="sticky top-24 space-y-1 border-s-2 border-line">
                {GAINS.map(({ k }) => <li key={k}><a href={`#gain-${k}`} className="-ms-0.5 block border-s-2 border-transparent px-4 py-2 font-display text-[1.05rem] font-semibold text-muted transition-colors duration-quick hover:border-thread hover:text-ink">{h.gains.items[k].title}</a></li>)}
              </ol>
            </nav>
            <div className="space-y-24 lg:space-y-32">
              {GAINS.map(({ k, kind, photo }, i) => {
                const g = h.gains.items[k];
                const href = kind ? orderHref(kind) : JOIN_URL;
                return (
                  <article key={k} id={`gain-${k}`} className="grid scroll-mt-24 items-center gap-10 md:grid-cols-2 md:gap-12">
                    <div className={`relative ${i % 2 ? 'md:order-2' : ''}`}>
                      <div className="photo-card aspect-[4/5] w-[86%] md:w-[88%]"><Photo slot={photo} alt={g.alt} sizes="(min-width: 1024px) 34vw, (min-width: 768px) 44vw, 86vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" /></div>
                      <div className="relative -mt-28 ms-auto w-[78%] max-w-[360px] sm:-mt-36">
                        {h.vignettes[k] ? <Vignette kind={k} v={h.vignettes[k]} /> : <Sticker tilt={2} tape meta={g.title} note={g.points[0]} />}
                        {h.vignettes[k] && <div className="mt-2 text-end text-xs text-subtle">{h.who.sample}</div>}
                      </div>
                    </div>
                    <div>
                      <div className="hand text-thread-text">{g.title}</div>
                      <h3 className="t-h2 mt-2">{g.gain}</h3>
                      <ul className="relative mt-7 space-y-4">
                        <Thread shape="vline" className="absolute bottom-3 start-[3px] top-3 w-2" />
                        {g.points.map((pt) => <li key={pt} className="relative flex gap-4"><span className="mt-1 shrink-0 text-thread" aria-hidden="true"><Knot size={12} /></span><span className="text-[1.02rem] text-muted">{pt}</span></li>)}
                      </ul>
                      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Cta href={href} variant={i === 0 ? 'primary' : 'tonal'} placement={`gain-${k}`}>{g.cta}</Cta>
                        <Link prefetch={false} href={pathFor(k, lang)} className="link inline-flex items-center gap-1 text-[.95rem]">{fill(h.gains.more, { who: g.title })} <Arrow /></Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ONE PERSON, ONE YEAR */}
      <section id="story" className="section bg-sunken/60" aria-labelledby="year-h">
        <div className="wrap">
          <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div className="max-w-2xl"><h2 id="year-h" className="t-h1">{h.story.h2}</h2><p className="lead mt-5">{h.story.intro}</p></div>
            <div className="photo-card hidden aspect-[4/3] rotate-[1.4deg] md:block"><Photo slot="year-coffee" alt={h.story.alt} sizes="22rem" className="absolute inset-0" imgClassName="h-full w-full object-cover" /></div>
          </div>
          <div className="mt-14"><YearTimeline story={h.story} /></div>
        </div>
      </section>

      {/* THE CARD */}
      <section className="section" aria-labelledby="card-h">
        <div className="wrap grid items-center gap-12 overflow-hidden rounded-sheet bg-field px-6 py-14 text-field-ink lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-20">
          <TapCard3D lang={lang} />
          <div>
            <h2 id="card-h" className="t-h1">{h.card.h2}</h2>
            <p className="lead mt-5 text-field-ink/80">{h.card.p}</p>
            <ul className="mt-6 space-y-2.5">{h.card.bullets.map((b) => <li key={b} className="flex gap-3 text-field-ink/85"><span className="mt-1 shrink-0 text-thread" aria-hidden="true"><Knot size={12} /></span>{b}</li>)}</ul>
            <div className="mt-9"><Cta href={pathFor('pricing', lang) + '#card'} placement="card">{fill(h.card.cta, { price: fmtAED(PLANS.card.prices.once, lang) })}</Cta></div>
          </div>
        </div>
      </section>

      {/* PRIVACY: four promises on the thread */}
      <section id="trust" className="section pt-0" aria-labelledby="trust-h">
        <div className="wrap">
          <h2 id="trust-h" className="t-h1 max-w-3xl">{h.trust.h2}</h2>
          <ol className="relative mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {h.trust.items.map((s) => (
              <li key={s.title} className="relative flex gap-4">
                <span className="mt-1.5 shrink-0 text-thread" aria-hidden="true"><Knot size={16} /></span>
                <div><h3 className="t-h3">{s.title}</h3><p className="mt-2 text-muted">{s.p}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-10"><Link prefetch={false} href={pathFor('trust', lang)} className="link inline-flex items-center gap-1">{h.trust.link} <Arrow /></Link></div>
        </div>
      </section>

      {/* PRICING: the member plans, straight from the one price list */}
      <section className="section pt-0" aria-labelledby="price-h">
        <div className="wrap">
          <div className="max-w-3xl"><h2 id="price-h" className="t-h1">{h.pricing.h2}</h2><p className="lead mt-5">{h.pricing.p}</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.member.map((p) => (
              <div key={p.id} className={`relative rounded-card bg-surface p-6 shadow-2 ${p.featured ? 'sticker-tape ring-2 ring-sun' : ''}`}>
                <div className="font-display text-lg font-semibold">{p.name[lang]}</div>
                <div className="num mt-3 font-display text-3xl font-bold">{p.prices.monthly ? fmtAED(p.prices.monthly, lang) : d.pricing.free}{p.prices.monthly ? <span className="font-sans text-base font-normal text-subtle"> / {d.pricing.perMonth}</span> : null}</div>
                <p className="mt-3 text-[.95rem] text-muted">{p.tagline[lang]}</p>
              </div>
            ))}
          </div>
          <div className="mt-10"><Cta href={pathFor('pricing', lang)} variant="tonal" placement="pricing-teaser">{h.pricing.cta}</Cta></div>
        </div>
      </section>

      {/* FINAL ASK */}
      <section className="pb-10" aria-labelledby="final-h">
        <div className="wrap">
          <div className="relative isolate overflow-hidden rounded-sheet bg-field text-field-ink">
            <Photo slot="final" alt="" sizes="(min-width: 1180px) 1140px, 100vw" className="absolute inset-0 -z-10" imgClassName="h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-field via-field/70 to-field/20" aria-hidden="true" />
            <div className="px-6 pb-14 pt-40 text-center sm:px-12 md:pt-56">
              <h2 id="final-h" className="t-h1 mx-auto max-w-3xl">{h.final.h2}</h2>
              <p className="lead mx-auto mt-5 max-w-xl text-field-ink/85">{h.final.p}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3"><Cta href={JOIN_URL} placement="final">{d.cta.startFree}</Cta><Cta href={pathFor('order', lang)} variant="field" placement="final">{d.cta.orderCompany}</Cta></div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(ldWebPage('home', lang), ldSoftwareApp(lang), ldProductCard(lang), ldHowTo(lang))} />
    </>
  );
}
