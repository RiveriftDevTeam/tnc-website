import { t } from '@/content';
import { LEGAL_URL, pathFor } from '@/content/site';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import Thread from '@/components/Thread';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';

const UAE = 6; // the "Your data stays in the UAE" promise sits beside its photo

export default function Trust({ lang }) {
  const d = t(lang); const tr = d.trust;
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16">
        <div className="wrap max-w-4xl">
          <h1 className="t-display">{tr.hero.h1}</h1>
          <p className="lead mt-6 max-w-prose">{tr.hero.sub}</p>
        </div>
      </section>

      <section className="section pt-14 lg:pt-20">
        <div className="wrap max-w-5xl">
          <ol className="relative">
            <Thread shape="vline" className="!absolute inset-y-6 start-[1.125rem] w-0.5" animate={false} />
            {tr.sections.map((s, i) => (
              <Reveal as="li" key={s.title} className="relative grid gap-x-8 gap-y-3 py-8 ps-14 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] md:py-10 lg:gap-x-14">
                <span className="num hand absolute start-0 top-8 grid h-9 w-9 place-items-center rounded-full bg-ground text-thread-text ring-2 ring-thread md:top-10" aria-hidden="true">{i + 1}</span>
                <h2 className="t-h2">{s.title}</h2>
                <div className={i === UAE ? 'grid gap-6 lg:grid-cols-2 lg:items-start' : ''}>
                  <p className="max-w-prose text-muted">{s.p}</p>
                  {i === UAE && <div className="photo-card aspect-[3/2]"><Photo slot="trust-uae" alt={s.photoAlt} sizes="(min-width:1024px) 30vw, 80vw" /></div>}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <div className="rounded-photo bg-field px-6 py-14 text-center text-field-ink sm:px-12 lg:py-20">
            <h2 className="t-h1">{tr.legal.h2}</h2>
            <p className="lead mx-auto mt-4 max-w-xl !text-field-ink/80">{tr.legal.p}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Cta href={pathFor('order', lang) + '#person'} placement="trust">{d.cta.talkToPerson}</Cta>
              <Cta href={`${LEGAL_URL}/${lang}`} variant="field" placement="trust">{tr.legal.link}</Cta>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={graph(ldWebPage('trust', lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'trust', name: d.nav.trust }], lang))} />
    </>
  );
}
