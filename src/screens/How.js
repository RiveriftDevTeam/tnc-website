import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import Sticker from '@/components/Sticker';
import Thread, { Knot } from '@/components/Thread';
import CaptureTiles from '@/components/CaptureTiles';
import AutonomyToggle from '@/components/AutonomyToggle';
import { Section } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb, ldHowTo } from '@/lib/seo';

// the second strand crosses the first at every chapter: that is where a visitor and an exhibitor meet
const CROSS_H = 'M0 50 C 18 70, 32 30, 50 50 S 82 70, 100 50';
const CROSS_V = 'M50 0 C 70 18, 30 32, 50 50 S 70 82, 50 100';
const TILTS = [1, 2, 0, 3, 1];

export default function How({ lang }) {
  const d = t(lang); const h = d.how;
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <div>
            <h1 className="t-display">{h.hero.h1}</h1>
            <p className="lead mt-6 max-w-prose">{h.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={JOIN_URL} placement="how-hero">{d.cta.startFree}</Cta>
              <Cta href={pathFor('pricing', lang)} variant="tonal" placement="how-hero">{d.cta.seePricing}</Cta>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="photo-card aspect-[4/5]"><Photo slot="how-hero" alt={h.hero.photoAlt} priority sizes="(min-width:1024px) 40vw, 90vw" imgClassName="object-[45%_30%]" /></div>
            <Sticker tilt={3} tape meta={h.hero.sticker.meta} note={h.hero.sticker.note} className="absolute -bottom-6 end-2 w-56 sm:-end-4" />
          </div>
        </div>
      </section>

      <Section h2={h.event.h2}>
        <div className="relative mt-10 lg:mt-12">
          {/* wide screens: two strands run left to right and cross at each chapter */}
          <div className="absolute inset-x-0 top-0 hidden h-12 lg:block" aria-hidden="true">
            <Thread shape="h" knots={[16.67, 50, 83.33]} className="!absolute inset-0" />
            <Thread shape="h" d={CROSS_H} className="!absolute inset-0 !text-accent" width={2} />
          </div>
          {/* phone: the same two strands run down the start edge */}
          <div className="absolute inset-y-0 start-0 w-8 lg:hidden" aria-hidden="true">
            <Thread shape="v" animate={false} className="!absolute inset-0" />
            <Thread shape="v" animate={false} d={CROSS_V} className="!absolute inset-0 !text-accent" />
          </div>
          <ol className="grid gap-12 ps-12 lg:grid-cols-3 lg:gap-10 lg:ps-0 lg:pt-16">
            {h.event.phases.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="relative">
                <span className="absolute -start-12 top-2 grid h-8 w-8 place-items-center text-thread lg:hidden" aria-hidden="true"><Knot size={18} /></span>
                <h3 className="t-h2">{p.title}</h3>
                {i === 1 && <div className="photo-card mt-5 aspect-[3/2]"><Photo slot="how-event" alt={h.event.photoAlt} sizes="(min-width:1024px) 30vw, 85vw" /></div>}
                <div className="mt-6 space-y-6">
                  <div><span className="chip"><span className="h-2 w-2 rounded-full bg-thread" aria-hidden="true" />{p.who}</span><p className="mt-2 max-w-prose text-muted">{p.p}</p></div>
                  <div><span className="chip chip-quiet"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />{p.who2}</span><p className="mt-2 max-w-prose text-muted">{p.p2}</p></div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <section className="section pt-0">
        <div className="wrap">
          <Reveal className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="relative pb-10 lg:pb-0">
              <div className="photo-card aspect-[3/2]"><Photo slot="how-organiser" alt={h.event.organiser.photoAlt} sizes="(min-width:1024px) 55vw, 90vw" /></div>
            </div>
            <Sticker as="div" tilt={1} tape className="max-w-lg !p-6">
              <h2 className="hand !text-[1.6rem]">{h.event.organiser.title}</h2>
              <p className="mt-3 text-muted">{h.event.organiser.p}</p>
            </Sticker>
          </Reveal>
        </div>
      </section>

      <Section h2={h.daily.h2}>
        <div className="relative mt-12 lg:mt-16">
          <div className="absolute inset-x-0 top-5 hidden h-8 lg:block" aria-hidden="true"><Thread shape="h" knots={[10, 30, 50, 70, 90]} className="!absolute inset-0" /></div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5 lg:pt-16">
            {h.daily.rows.map((r, i) => (
              <Reveal as="li" key={r.when} delay={i * 0.05}>
                <Sticker tilt={TILTS[i % TILTS.length]} meta={r.when} note={r.you} className="h-full">
                  <p className="mt-2 text-[.9375rem] text-muted">{r.it}</p>
                </Sticker>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section h2={h.capture.h2} className="pt-0"><CaptureTiles c={h.capture} /></Section>

      <Section h2={h.assistant.h2} lead={h.assistant.p} className="pt-0">
        <div className="mt-12"><AutonomyToggle c={h.assistant} /></div>
      </Section>

      <section className="section pt-0">
        <div className="wrap">
          <div className="rounded-photo bg-field px-6 py-16 text-center text-field-ink sm:px-12 lg:py-24">
            <h2 className="t-h1 mx-auto max-w-2xl">{h.cta.h2}</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Cta href={JOIN_URL} placement="how">{d.cta.startFree}</Cta>
              <Cta href={pathFor('pricing', lang)} variant="field" placement="how">{d.cta.seePricing}</Cta>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={graph(ldWebPage('how', lang), ldHowTo(lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'how', name: d.nav.how }], lang))} />
    </>
  );
}
