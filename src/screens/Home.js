import Link from 'next/link';
import { ArrowRight, Hand, Save, Brain, ListChecks, Trophy, Users, Lock, EyeOff, ShieldCheck, FileCheck } from 'lucide-react';
import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import Hero3D from '@/components/Hero3D';
import StoryBeats from '@/components/StoryBeats';
import TapCard3D from '@/components/TapCard3D';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldSoftwareApp, ldProductCard, ldHowTo } from '@/lib/seo';

const LOOP_ICONS = [Hand, Save, Brain, ListChecks, Trophy];
const TRUST_ICONS = [Users, Lock, EyeOff, ShieldCheck];

export default function Home({ lang }) {
  const d = t(lang); const h = d.home;
  const Arrow = () => <ArrowRight size={18} aria-hidden="true" className="rtl:rotate-180" />;
  return (
    <>
      {/* HERO */}
      <section className="section pt-10 lg:pt-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <div className="eyebrow">{h.hero.eyebrow}</div>
            <h1 className="t-display mt-4">{h.hero.h1}</h1>
            <p className="lead mt-6 max-w-xl">{h.hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta href={JOIN_URL} placement="hero">{h.hero.primary}</Cta>
              <Cta href={pathFor('order', lang)} variant="tonal" placement="hero">{h.hero.secondary}</Cta>
            </div>
            <p className="mt-4 text-sm text-subtle">{h.hero.note}</p>
          </div>
          <Hero3D label={h.hero.sceneLabel} />
        </div>
      </section>

      {/* PROBLEM */}
      <Section eyebrow={h.problem.eyebrow} h2={h.problem.h2} lead={h.problem.p}>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {h.problem.stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}><Card className="text-center"><div className="num text-5xl font-medium text-accent">{s.n}</div><div className="mt-2 text-muted">{s.l}</div></Card></Reveal>
          ))}
        </div>
      </Section>

      {/* STORY */}
      <Section id="story" eyebrow={h.story.eyebrow} h2={h.story.h2} lead={h.story.intro}>
        <div className="mt-10"><StoryBeats story={h.story} /></div>
      </Section>

      {/* LOOP */}
      <Section id="how" eyebrow={h.loop.eyebrow} h2={h.loop.h2}>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {h.loop.steps.map((s, i) => { const I = LOOP_ICONS[i]; return (
            <Reveal key={s.title} delay={i * 0.05} as="li"><Card className="h-full">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent"><I size={20} aria-hidden="true" /></span><span className="num text-sm text-subtle">{i + 1}</span></div>
              <h3 className="mt-4 text-xl font-medium">{s.title}</h3><p className="mt-2 text-[.95rem] text-muted">{s.p}</p>
            </Card></Reveal>
          ); })}
        </ol>
        <div className="mt-8"><Link href={pathFor('how', lang)} className="btn btn-quiet">{h.loop.link} <Arrow /></Link></div>
      </Section>

      {/* CARD */}
      <section className="section">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal><TapCard3D lang={lang} /></Reveal>
          <Reveal delay={0.08}>
            <div className="eyebrow">{h.card.eyebrow}</div>
            <h2 className="t-h1 mt-3">{h.card.h2}</h2>
            <p className="lead mt-4">{h.card.p}</p>
            <ul className="mt-6 space-y-2 text-muted">{h.card.bullets.map((b) => <li key={b} className="flex gap-3"><FileCheck size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{b}</li>)}</ul>
            <div className="mt-8"><Cta href={pathFor('pricing', lang) + '#card'} variant="tonal" placement="card">{h.card.cta}</Cta></div>
          </Reveal>
        </div>
      </section>

      {/* PERSONAS */}
      <Section id="who" eyebrow={h.personas.eyebrow} h2={h.personas.h2}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(h.personas.items).map(([k, p], i) => (
            <Reveal key={k} delay={i * 0.05}><Link prefetch={false} href={pathFor(k, lang)} className="glass block h-full p-6 transition hover:-translate-y-0.5 hover:shadow-glass"><h3 className="text-lg font-medium">{p.title}</h3><p className="mt-2 text-[.95rem] text-muted">{p.p}</p><span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">{d.cta.readMore} <Arrow /></span></Link></Reveal>
          ))}
        </div>
      </Section>

      {/* TRUST */}
      <Section id="trust" eyebrow={h.trust.eyebrow} h2={h.trust.h2}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {h.trust.items.map((s, i) => { const I = TRUST_ICONS[i]; return (
            <Reveal key={s.title} delay={i * 0.05}><Card className="flex h-full gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"><I size={20} aria-hidden="true" /></span><div><h3 className="text-lg font-medium">{s.title}</h3><p className="mt-1.5 text-[.95rem] text-muted">{s.p}</p></div></Card></Reveal>
          ); })}
        </div>
        <div className="mt-8"><Link href={pathFor('trust', lang)} className="btn btn-quiet">{h.trust.link} <Arrow /></Link></div>
      </Section>

      {/* PRICING TEASER */}
      <Section eyebrow={h.pricing.eyebrow} h2={h.pricing.h2} lead={h.pricing.p}>
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
      <section className="section">
        <div className="wrap"><Reveal><div className="glass glass-strong px-6 py-14 text-center sm:px-12">
          <h2 className="t-h1 mx-auto max-w-3xl">{h.final.h2}</h2><p className="lead mx-auto mt-4 max-w-xl">{h.final.p}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Cta href={JOIN_URL} placement="final">{d.cta.startFree}</Cta><Cta href={pathFor('order', lang)} variant="tonal" placement="final">{d.cta.orderCompany}</Cta></div>
        </div></Reveal></div>
      </section>

      <JsonLd data={graph(ldWebPage('home', lang), ldSoftwareApp(lang), ldProductCard(lang), ldHowTo(lang))} />
    </>
  );
}
