import { Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle } from 'lucide-react';
import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb, ldHowTo } from '@/lib/seo';

const CAP = [Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle];

export default function How({ lang }) {
  const d = t(lang); const h = d.how;
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl"><div className="eyebrow">{h.hero.eyebrow}</div><h1 className="t-display mt-4">{h.hero.h1}</h1><p className="lead mt-6">{h.hero.sub}</p></div></section>

      <Section h2={h.event.h2}>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {h.event.phases.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}><Card className="h-full">
              <div className="num text-sm text-subtle">{i + 1}</div><h3 className="mt-1 text-2xl font-medium">{p.title}</h3>
              <div className="mt-4 space-y-4"><div><div className="chip">{p.who}</div><p className="mt-2 text-[.95rem] text-muted">{p.p}</p></div><div><div className="chip">{p.who2}</div><p className="mt-2 text-[.95rem] text-muted">{p.p2}</p></div></div>
            </Card></Reveal>
          ))}
        </div>
        <Reveal className="mt-4"><Card><h3 className="text-xl font-medium">{h.event.organiser.title}</h3><p className="mt-2 text-muted">{h.event.organiser.p}</p></Card></Reveal>
      </Section>

      <Section h2={h.daily.h2}>
        <Reveal className="mt-10"><div className="glass divide-y divide-line">
          {h.daily.rows.map((r) => (
            <div key={r.when} className="grid gap-2 p-5 sm:grid-cols-[120px_1fr_2fr] sm:gap-6"><div className="text-sm font-medium text-accent">{r.when}</div><div className="font-medium">{r.you}</div><div className="text-muted">{r.it}</div></div>
          ))}
        </div></Reveal>
      </Section>

      <Section h2={h.capture.h2} lead={h.capture.p}>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {h.capture.items.map((it, i) => { const I = CAP[i]; return <Reveal key={it} delay={i * 0.04} as="li"><Card className="flex h-full flex-col items-center gap-3 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent"><I size={22} aria-hidden="true" /></span><span className="text-[.95rem] font-medium">{it}</span></Card></Reveal>; })}
        </ul>
      </Section>

      <Section h2={h.assistant.h2} lead={h.assistant.p}>
        <Reveal className="mt-8"><div className="glass inline-flex items-center gap-4 p-4"><span className="relative inline-flex h-7 w-12 items-center rounded-full bg-accent"><span className="absolute end-1 h-5 w-5 rounded-full bg-accent-ink" /></span><span>{h.assistant.consent}</span></div></Reveal>
        <div className="mt-10 flex flex-wrap gap-3"><Cta href={JOIN_URL} placement="how">{d.cta.startFree}</Cta><Cta href={pathFor('pricing', lang)} variant="tonal" placement="how">{d.cta.seePricing}</Cta></div>
      </Section>
      <JsonLd data={graph(ldWebPage('how', lang), ldHowTo(lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'how', name: d.nav.how }], lang))} />
    </>
  );
}
