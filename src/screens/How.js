import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import Sticker from '@/components/Sticker';
import Thread from '@/components/Thread';
import ScrollScenes from '@/components/ScrollScenes';
import { BeforeScene, MeetScene, AfterScene } from '@/components/scenes/HowScenes';
import CaptureTiles from '@/components/CaptureTiles';
import AutonomyToggle from '@/components/AutonomyToggle';
import { Section } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb, ldHowTo } from '@/lib/seo';

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
        <ScrollScenes
          className="mt-12 lg:mt-16"
          label={h.event.label}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          steps={h.event.phases.map((ph) => ({ key: ph.title, title: ph.title, strands: [{ who: ph.who, text: ph.p }, { who: ph.who2, text: ph.p2 }] }))}
          scenes={[
            <BeforeScene key="before" s={h.event.scenes.before} />,
            <MeetScene key="during" a={h.event.phases[1].who} b={h.event.phases[1].who2} met={h.event.scenes.during.met} />,
            <AfterScene key="after" s={h.event.scenes.after} />,
          ]}
        />
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
