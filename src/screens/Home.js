import Link from 'next/link';
import { ArrowRight, Hand, Save, Brain, ListChecks, Trophy, Users, Lock, EyeOff, ShieldCheck, FileCheck } from 'lucide-react';
import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import ScrollStory from '@/components/ScrollStory';
import PhotoHero from '@/components/PhotoHero';
import TakeItHome from '@/components/TakeItHome';
import { MEDIA } from '@/content/media';
import Vignette from '@/components/Vignettes';
import YearTimeline from '@/components/YearTimeline';
import TapCard3D from '@/components/TapCard3D';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldSoftwareApp, ldProductCard, ldHowTo } from '@/lib/seo';

const LOOP_ICONS = [Hand, Save, Brain, ListChecks, Trophy];
const TRUST_ICONS = [Users, Lock, EyeOff, ShieldCheck];
const WHO = ['organisers', 'exhibitors', 'sponsors', 'individuals'];

export default function Home({ lang }) {
  const d = t(lang); const h = d.home;
  const Arrow = () => <ArrowRight size={16} aria-hidden="true" className="rtl:rotate-180" />;
  return (
    <>
      {/* THE HALL: a real exhibition, the promise, who it is for */}
      <PhotoHero act={h.acts[0]} chips={Object.entries(h.chips).map(([k, label]) => ({ href: pathFor(k, lang), label }))}
        primary={h.hero.primary} primaryHref={JOIN_URL} secondary={h.hero.secondary} secondaryHref={pathFor('order', lang)}
        video={MEDIA.heroVideo.pexels ? 'heroVideo' : null} poster={MEDIA.hall.unsplash ? 'hall' : null} alt={h.alts.hero} />

      {/* DON'T LEAVE IT AT THE EVENT: three photographs */}
      <TakeItHome take={h.take} alts={h.alts} />

      {/* THE THREAD: the touch, the fade, the thread, the circle — one scene scrubbed by scroll */}
      <ScrollStory acts={h.acts.slice(1)} from={0.2} label={h.hero.sceneLabel} dir={d.dir}
        primary={h.hero.primary} primaryHref={JOIN_URL} secondary={h.hero.secondary} secondaryHref={pathFor('order', lang)} />

      {/* WHO IT IS FOR — the product itself, one picture per buyer */}
      <Section id="who" eyebrow={h.who.eyebrow} h2={h.who.h2}>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {WHO.map((k, i) => (
            <Reveal key={k} delay={i * 0.05}>
              <Link prefetch={false} href={pathFor(k, lang)} className="group block h-full rounded-sheet border border-line bg-surface/40 p-4 transition hover:-translate-y-0.5 hover:border-accent/40 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div><h3 className="text-xl font-medium">{h.who.pitch[k].title}</h3><p className="mt-1 text-[.95rem] text-muted">{h.who.pitch[k].line}</p></div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm text-accent">{d.cta.readMore} <Arrow /></span>
                </div>
                <Vignette kind={k} v={h.vignettes[k]} />
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-subtle">
          <span>{h.who.sample}</span>
          <Link prefetch={false} href={pathFor('companies', lang)} className="inline-flex items-center gap-1 text-accent">{h.who.pitch.companies.title}: {h.who.pitch.companies.line} <Arrow /></Link>
        </div>
      </Section>

      {/* HOW IT WORKS — five verbs on one line */}
      <Section id="how" eyebrow={h.how.eyebrow} h2={h.how.h2} className="pt-0">
        <ol className="relative mt-10 grid gap-5 md:grid-cols-5 md:gap-4">
          <span className="absolute start-5 top-6 bottom-6 w-px bg-line md:start-[10%] md:end-[10%] md:top-6 md:bottom-auto md:h-px md:w-auto" aria-hidden="true" />
          {h.loop.steps.map((s, i) => { const I = LOOP_ICONS[i]; return (
            <Reveal key={s.title} delay={i * 0.05} as="li" className="relative ps-14 md:ps-0 md:text-center">
              <span className="absolute start-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-glass md:relative md:mx-auto"><I size={22} aria-hidden="true" /></span>
              <h3 className="mt-0 text-lg font-medium md:mt-4">{s.title}</h3><p className="mt-1.5 text-[.95rem] text-muted">{s.p}</p>
            </Reveal>
          ); })}
        </ol>
        <div className="mt-8 md:text-center"><Link prefetch={false} href={pathFor('how', lang)} className="btn btn-quiet">{h.loop.link} <Arrow /></Link></div>
      </Section>

      {/* ONE PERSON, ONE YEAR */}
      <Section id="story" eyebrow={h.year.eyebrow} h2={h.year.h2} lead={h.year.p}>
        <div className="mt-10"><YearTimeline story={h.story} /></div>
      </Section>

      {/* THE CARD */}
      <section className="section pt-0">
        <div className="on-dark wrap grid items-center gap-10 overflow-hidden rounded-sheet bg-splash px-6 py-12 text-splash-ink lg:grid-cols-2 lg:gap-16 lg:px-14">
          <Reveal><TapCard3D lang={lang} /></Reveal>
          <Reveal delay={0.08}>
            <div className="eyebrow">{h.card.eyebrow}</div>
            <h2 className="t-h1 mt-3">{h.card.h2}</h2>
            <p className="lead mt-4">{h.card.p}</p>
            <ul className="mt-6 space-y-2">{h.card.bullets.map((b) => <li key={b} className="flex gap-3"><FileCheck size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{b}</li>)}</ul>
            <div className="mt-8"><Cta href={pathFor('pricing', lang) + '#card'} placement="card">{h.card.cta}</Cta></div>
          </Reveal>
        </div>
      </section>

      {/* THE NUMBERS */}
      <Section eyebrow={h.outcomes.eyebrow} h2={h.outcomes.h2} className="pt-0">
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.outcomes.items.map((s, i) => <Reveal key={s.l} delay={i * 0.05}><Card className="h-full"><div className="num text-5xl font-medium text-accent">{s.n}</div><div className="mt-2 text-muted">{s.l}</div></Card></Reveal>)}
        </div>
      </Section>

      {/* TRUST */}
      <Section id="trust" eyebrow={h.trust.eyebrow} h2={h.trust.h2} className="pt-0">
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.trust.items.map((s, i) => { const I = TRUST_ICONS[i]; return (
            <Reveal key={s.title} delay={i * 0.05}><Card className="h-full"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent"><I size={20} aria-hidden="true" /></span><h3 className="mt-4 text-lg font-medium">{s.title}</h3><p className="mt-1.5 text-[.95rem] text-muted">{s.p}</p></Card></Reveal>
          ); })}
        </div>
        <div className="mt-8"><Link prefetch={false} href={pathFor('trust', lang)} className="btn btn-quiet">{h.trust.link} <Arrow /></Link></div>
      </Section>

      {/* PRICING */}
      <Section eyebrow={h.pricing.eyebrow} h2={h.pricing.h2} lead={h.pricing.p} className="pt-0">
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.member.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}><Card className={`h-full ${p.featured ? 'ring-1 ring-accent' : ''}`}>
              <div className="text-lg font-medium">{p.name[lang]}</div>
              <div className="num mt-2 text-3xl font-medium">{p.prices.monthly ? fmtAED(p.prices.monthly, lang) : d.pricing.free}{p.prices.monthly ? <span className="text-base font-normal text-subtle"> / {d.pricing.perMonth}</span> : null}</div>
              <p className="mt-3 text-[.95rem] text-muted">{p.tagline[lang]}</p>
            </Card></Reveal>
          ))}
        </div>
        <div className="mt-8"><Cta href={pathFor('pricing', lang)} variant="tonal" placement="pricing-teaser">{h.pricing.cta}</Cta></div>
      </Section>

      {/* FINAL */}
      <section className="section pt-0">
        <div className="wrap"><Reveal><div className="glass glass-strong px-6 py-14 text-center sm:px-12">
          <h2 className="t-h1 mx-auto max-w-3xl">{h.final.h2}</h2><p className="lead mx-auto mt-4 max-w-xl">{h.final.p}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Cta href={JOIN_URL} placement="final">{d.cta.startFree}</Cta><Cta href={pathFor('order', lang)} variant="tonal" placement="final">{d.cta.orderCompany}</Cta></div>
        </div></Reveal></div>
      </section>

      <JsonLd data={graph(ldWebPage('home', lang), ldSoftwareApp(lang), ldProductCard(lang), ldHowTo(lang))} />
    </>
  );
}
