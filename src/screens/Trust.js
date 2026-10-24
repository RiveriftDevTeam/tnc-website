import { Users, Fingerprint, KeyRound, GitBranch, Ban, CheckCircle2, MapPin, Scale } from 'lucide-react';
import { t } from '@/content';
import { LEGAL_URL, pathFor } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';
const ICONS = [Users, Fingerprint, KeyRound, GitBranch, Ban, CheckCircle2, MapPin, Scale];
export default function Trust({ lang }) {
  const d = t(lang); const tr = d.trust;
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl"><div className="eyebrow">{tr.hero.eyebrow}</div><h1 className="t-display mt-4">{tr.hero.h1}</h1><p className="lead mt-6">{tr.hero.sub}</p></div></section>
      <Section>
        <div className="grid gap-4 md:grid-cols-2">{tr.sections.map((s, i) => { const I = ICONS[i]; return <Reveal key={s.title} delay={i * 0.04}><Card className="flex h-full gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"><I size={20} aria-hidden="true" /></span><div><h2 className="text-xl font-medium">{s.title}</h2><p className="mt-2 text-muted">{s.p}</p></div></Card></Reveal>; })}</div>
      </Section>
      <Section className="pt-0"><Reveal><div className="glass glass-strong px-6 py-12 text-center sm:px-12"><h2 className="t-h1">{tr.legal.h2}</h2><p className="lead mx-auto mt-3 max-w-xl">{tr.legal.p}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Cta href={`${LEGAL_URL}/${lang}`} variant="tonal" placement="trust">{tr.legal.link}</Cta><Cta href={pathFor('order', lang) + '#person'} variant="quiet" placement="trust">{d.cta.talkToPerson}</Cta></div></div></Reveal></Section>
      <JsonLd data={graph(ldWebPage('trust', lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'trust', name: d.nav.trust }], lang))} />
    </>
  );
}
