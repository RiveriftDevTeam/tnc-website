import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import PersonaView from '@/components/PersonaView';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';

export default function Persona({ lang, persona }) {
  const d = t(lang); const p = d.personas[persona]; const c = d.personas.common;
  const primaryHref = persona === 'individuals' ? JOIN_URL : `${pathFor('order', lang)}?kind=${persona === 'organisers' ? 'organiser' : persona === 'exhibitors' ? 'exhibitor' : persona === 'sponsors' ? 'sponsor' : 'company'}`;
  const primaryLabel = persona === 'individuals' ? d.cta.startFree : d.cta.orderCompany;
  return (
    <>
      <PersonaView persona={persona} />
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl"><div className="eyebrow">{p.hero.eyebrow}</div><h1 className="t-display mt-4">{p.hero.h1}</h1><p className="lead mt-6">{p.hero.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Cta href={primaryHref} placement={`persona-${persona}`}>{primaryLabel}</Cta><Cta href={pathFor('pricing', lang)} variant="tonal" placement={`persona-${persona}`}>{c.seePricing}</Cta></div></div></section>

      <Section h2={c.outcomesH2}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">{p.outcomes.map((o, i) => <Reveal key={o.title} delay={i * 0.05}><Card className="h-full"><h3 className="text-xl font-medium">{o.title}</h3><p className="mt-2 text-muted">{o.p}</p></Card></Reveal>)}</div>
      </Section>

      <Section h2={p.journey.h2}>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">{p.journey.steps.map((s, i) => <Reveal key={s.title} delay={i * 0.05} as="li"><Card className="h-full"><div className="num text-sm text-subtle">{i + 1}</div><h3 className="mt-1 text-lg font-medium">{s.title}</h3><p className="mt-2 text-[.95rem] text-muted">{s.p}</p></Card></Reveal>)}</ol>
      </Section>

      <Section h2={p.packages.h2} lead={p.packages.p}>
        <div className="mt-8 flex flex-wrap gap-3"><Cta href={primaryHref} placement={`persona-${persona}-packages`}>{persona === 'individuals' ? d.cta.startFree : d.cta.askQuote}</Cta><Cta href={pathFor('pricing', lang)} variant="tonal" placement={`persona-${persona}-packages`}>{d.cta.seePricing}</Cta></div>
      </Section>

      <Section><Faq h2={c.faqH2} items={p.faq} /></Section>

      <section className="section pt-0"><div className="wrap"><Reveal><div className="glass glass-strong px-6 py-12 text-center sm:px-12"><h2 className="t-h1">{c.ctaH2}</h2><p className="lead mx-auto mt-3 max-w-xl">{c.ctaP}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Cta href={primaryHref} placement={`persona-${persona}-final`}>{primaryLabel}</Cta><Cta href={`${pathFor('order', lang)}#person`} variant="quiet" placement={`persona-${persona}-final`}>{d.cta.talkToPerson}</Cta></div></div></Reveal></div></section>
      <JsonLd data={graph(ldWebPage(persona, lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: persona, name: d.nav.personas[persona] }], lang))} />
    </>
  );
}
