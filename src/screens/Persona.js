import { BarChart3, Users, Eye, Compass } from 'lucide-react';
import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import PersonaView from '@/components/PersonaView';
import Vignette from '@/components/Vignettes';
import { Section } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';

const ICONS = [BarChart3, Users, Eye, Compass];
const KIND = { organisers: 'organiser', exhibitors: 'exhibitor', sponsors: 'sponsor', companies: 'company', individuals: 'individual' };

export default function Persona({ lang, persona }) {
  const d = t(lang); const p = d.personas[persona]; const c = d.personas.common;
  const vKind = persona === 'companies' ? 'exhibitors' : persona;
  const primaryHref = persona === 'individuals' ? JOIN_URL : `${pathFor('order', lang)}?kind=${KIND[persona]}`;
  const primaryLabel = persona === 'individuals' ? d.cta.startFree : d.cta.orderCompany;
  return (
    <>
      <PersonaView persona={persona} />
      {/* HERO on the dark splash: the ask on one side, the product on the other */}
      <section className="bg-splash text-splash-ink">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <div className="eyebrow">{p.hero.eyebrow}</div>
            <h1 className="t-display mt-4">{p.hero.h1}</h1>
            <p className="lead mt-5 max-w-xl text-splash-ink/80">{p.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Cta href={primaryHref} placement={`persona-${persona}`}>{primaryLabel}</Cta><Cta href={pathFor('pricing', lang)} variant="tonal" placement={`persona-${persona}`} className="!bg-white/10 !text-splash-ink hover:!bg-white/20">{c.seePricing}</Cta></div>
          </div>
          <Reveal delay={0.1}><div className="text-ink"><div className="mb-2 text-xs text-splash-ink/60">{d.personas.hero.seeInside} · {d.home.who.sample}</div><Vignette kind={vKind} v={d.home.vignettes[vKind]} /></div></Reveal>
        </div>
      </section>

      {/* WHAT YOU GET — four tiles with an icon, one line each */}
      <Section h2={c.outcomesH2}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.outcomes.map((o, i) => { const I = ICONS[i]; return (
            <Reveal key={o.title} delay={i * 0.05}><div className="glass h-full p-5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-ink"><I size={22} aria-hidden="true" /></span><h3 className="mt-4 text-lg font-medium leading-snug">{o.title}</h3><p className="mt-2 text-[.95rem] text-muted">{o.p}</p></div></Reveal>
          ); })}
        </div>
      </Section>

      {/* THE JOURNEY — four steps on one line */}
      <Section h2={p.journey.h2} className="pt-0">
        <ol className="relative mt-10 grid gap-6 md:grid-cols-4 md:gap-4">
          <span className="absolute start-5 top-6 bottom-6 w-px bg-line md:start-[12%] md:end-[12%] md:top-5 md:bottom-auto md:h-px md:w-auto" aria-hidden="true" />
          {p.journey.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05} as="li" className="relative ps-14 md:ps-0 md:text-center">
              <span className="num absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium text-accent md:relative md:mx-auto">{i + 1}</span>
              <h3 className="text-lg font-medium md:mt-4">{s.title}</h3><p className="mt-1.5 text-[.95rem] text-muted">{s.p}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* PACKAGES */}
      <section className="section pt-0"><div className="wrap"><Reveal><div className="glass glass-strong grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div><h2 className="t-h2">{p.packages.h2}</h2><p className="mt-2 text-muted">{p.packages.p}</p></div>
        <div className="flex flex-wrap gap-3"><Cta href={primaryHref} placement={`persona-${persona}-packages`}>{persona === 'individuals' ? d.cta.startFree : d.cta.askQuote}</Cta><Cta href={pathFor('pricing', lang)} variant="tonal" placement={`persona-${persona}-packages`}>{d.cta.seePricing}</Cta></div>
      </div></Reveal></div></section>

      <Section className="pt-0"><Faq h2={c.faqH2} items={p.faq} /></Section>

      <section className="section pt-0"><div className="wrap"><Reveal><div className="rounded-sheet bg-splash px-6 py-12 text-center text-splash-ink sm:px-12"><h2 className="t-h1">{c.ctaH2}</h2><p className="lead mx-auto mt-3 max-w-xl text-splash-ink/80">{c.ctaP}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Cta href={primaryHref} placement={`persona-${persona}-final`}>{primaryLabel}</Cta><Cta href={`${pathFor('order', lang)}#person`} variant="quiet" placement={`persona-${persona}-final`} className="!text-splash-ink/80 hover:!bg-white/10">{d.cta.talkToPerson}</Cta></div></div></Reveal></div></section>
      <JsonLd data={graph(ldWebPage(persona, lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: persona, name: d.nav.personas[persona] }], lang))} />
    </>
  );
}
