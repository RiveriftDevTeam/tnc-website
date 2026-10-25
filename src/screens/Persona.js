import Link from 'next/link';
import { t } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import PersonaView from '@/components/PersonaView';
import Vignette from '@/components/Vignettes';
import Photo from '@/components/Photo';
import Sticker from '@/components/Sticker';
import Thread, { Knot } from '@/components/Thread';
import { Section } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';

const KIND = { organisers: 'organiser', exhibitors: 'exhibitor', sponsors: 'sponsor', companies: 'company', individuals: 'individual' };
const HERO_PHOTO = { organisers: ['door-organisers', 'aspect-[3/2]'], exhibitors: ['door-exhibitors', 'aspect-[4/5]'], sponsors: ['door-sponsors', 'aspect-[3/2]'], companies: ['door-companies', 'aspect-[3/2]'], individuals: ['door-individuals', 'aspect-[4/5]'] };
const SECOND_PHOTO = { organisers: ['how-organiser', 'aspect-[3/2]'], exhibitors: ['persona-exhibitor-2', 'aspect-[4/5]'], sponsors: ['persona-sponsor-2', 'aspect-[16/9]'], individuals: ['persona-individual-2', 'aspect-[4/5]'] };

/** The rows of the packages list, read from the one price list (plans.js). A null price is shown as "priced per order". */
function packageRows(persona, lang) {
  const nm = (o) => o[lang];
  if (persona === 'individuals') {
    return [
      ...PLANS.member.map((p) => ({ id: p.id, name: nm(p.name), line: nm(p.tagline), amount: p.prices.monthly, per: 'month', yearly: p.prices.yearly, featured: p.featured })),
      { id: PLANS.card.id, name: nm(PLANS.card.name), line: nm(PLANS.card.tagline), amount: PLANS.card.prices.once, per: 'once' },
    ];
  }
  const seat = (p) => ({ id: p.id, name: nm(p.name), unit: nm(p.unit), line: nm(p.what_you_get)[1], amount: p.prices.per_seat, featured: p.featured });
  if (persona === 'exhibitors') return PLANS.company.filter((p) => p.id.startsWith('seat')).map(seat);
  if (persona === 'companies') return PLANS.company.map((p) => (p.id.startsWith('seat') ? seat(p) : { id: p.id, name: nm(p.name), unit: nm(p.unit), line: nm(p.what_you_get)[0], amount: p.prices.per_term }));
  if (persona === 'organisers') return PLANS.organiser.map((p) => ({ id: p.id, name: nm(p.name), line: nm(p.line), amount: p.prices.per_event, featured: p.featured }));
  return PLANS.sponsor.map((p) => ({ id: p.id, name: nm(p.name), amount: null }));
}

function PriceCell({ row, lang, d, c, talk }) {
  const pr = d.pricing;
  if (row.amount === 0) return <span className="num text-2xl font-medium">{pr.free}</span>;
  if (row.amount == null) return <span><span className="hand block">{c.pricedPerOrder}</span><Link prefetch={false} href={talk} className="link mt-1 inline-block text-sm">{d.cta.talkToPerson}</Link></span>;
  return (
    <span>
      <span className="num text-2xl font-medium">{fmtAED(row.amount, lang)}</span>
      <span className="block text-sm text-subtle">{row.per === 'once' ? pr.once : pr.perMonth}</span>
      {row.yearly && <span className="num block text-sm text-subtle">{pr.yearlyNote.replace('{price}', fmtAED(row.yearly, lang))}</span>}
    </span>
  );
}

export default function Persona({ lang, persona }) {
  const d = t(lang); const p = d.personas[persona]; const c = d.personas.common;
  const vKind = persona === 'companies' ? null : persona;
  const order = pathFor('order', lang);
  const talk = `${order}#person`;
  const primaryHref = persona === 'individuals' ? JOIN_URL : `${order}?kind=${KIND[persona]}`;
  const primaryLabel = persona === 'individuals' ? d.cta.startFree : d.cta.orderCompany;
  const [heroSlot, heroAspect] = HERO_PHOTO[persona];
  const second = SECOND_PHOTO[persona];
  const rows = packageRows(persona, lang);
  const ph = `persona-${persona}`;

  return (
    <>
      <PersonaView persona={persona} />

      {/* HERO: the buyer's photo, their product as a paper sticker on its corner, the gain line, the ask */}
      <section>
        <div className="wrap grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <h1 className="t-display !text-[clamp(2.1rem,4.4vw,3.7rem)] text-balance">{p.hero.h1}</h1>
            <p className="lead mt-6 max-w-xl">{p.hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta href={primaryHref} placement={ph}>{primaryLabel}</Cta>
              <Cta href={pathFor('pricing', lang)} variant="quiet" placement={ph}>{c.seePricing}</Cta>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none lg:pb-12">
            <div className={`photo-card ${heroAspect} ${heroAspect === 'aspect-[4/5]' ? 'mx-auto max-w-[26rem] lg:max-w-[28rem]' : ''}`}>
              <Photo slot={heroSlot} alt={p.hero.photoAlt} priority sizes="(min-width:1024px) 520px, 90vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </div>
            <Sticker tilt={1} tape className="relative z-10 mx-3 -mt-10 overflow-hidden !p-0 sm:mx-6 lg:absolute lg:-bottom-2 lg:-start-10 lg:mx-0 lg:mt-0 lg:w-[min(24rem,78%)]">
              {vKind ? (
                <>
                  <Vignette kind={vKind} v={d.home.vignettes[vKind]} />
                  <p className="px-4 pb-2.5 pt-1 text-xs text-subtle">{c.sample}</p>
                </>
              ) : (
                <div className="p-4">
                  <div className="text-[.8125rem] text-subtle">{p.hero.sticker.meta}</div>
                  <p className="hand mt-1">{p.hero.sticker.note}</p>
                  <ul className="mt-3 space-y-2 text-[.95rem]">
                    {p.hero.sticker.lines.map((l) => <li key={l} className="flex items-center gap-2.5"><Knot size={12} className="shrink-0 text-thread-text" />{l}</li>)}
                  </ul>
                </div>
              )}
            </Sticker>
          </div>
        </div>
      </section>

      {/* BEFORE / WITH: each faded line paired with the thread that replaces it */}
      <Section h2={c.compareH2} className="!pt-0">
        <div className="mt-12 md:mt-14">
          <div className="hidden grid-cols-[1fr_3rem_1fr] gap-x-4 pb-4 text-sm text-subtle md:grid"><span>{c.compareBefore}</span><span /><span className="text-ink">{c.compareWith}</span></div>
          <ol>
            {p.compare.rows.map((r, i) => (
              <Reveal key={r.with} as="li" delay={i * 0.06} className="grid gap-x-4 md:grid-cols-[1fr_3rem_1fr]">
                <p className="border-t border-dashed border-faded pb-2 pt-5 text-muted md:py-7 md:border-t-0">
                  <span className="mb-1 block text-xs text-subtle md:hidden">{c.compareBefore}</span>{r.before}
                </p>
                <div className="relative hidden md:block"><Thread shape="vline" knots={[50]} animate={false} className="h-full w-full" /></div>
                <p className="t-h3 !font-medium pb-6 pt-2 md:py-7">
                  <span className="mb-1 block font-sans text-xs font-normal text-thread-text md:hidden">{c.compareWith}</span>{r.with}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* THE JOURNEY: four steps strung on the thread (across on desktop, down on a phone) */}
      <Section h2={p.journey.h2} className="!pt-0">
        <div className="relative mt-12 md:mt-16">
          <div className="absolute inset-x-0 top-[6px] hidden h-[2px] rounded-full bg-thread md:block" aria-hidden="true" />
          <ol className="grid gap-9 md:grid-cols-4 md:gap-8">
            {p.journey.steps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 0.06} className="relative ps-10 md:ps-0 md:pt-10">
                <Knot size={14} className="absolute start-0 top-1.5 text-thread-text md:top-0" />
                {i < p.journey.steps.length - 1 && <div className="absolute start-[6px] top-6 -bottom-9 w-[2px] rounded-full bg-thread md:hidden" aria-hidden="true" />}
                <h3 className="t-h3">{s.title}</h3>
                <p className="mt-2 text-muted">{s.p}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* WHAT YOU GET: editorial rows, with a second photo where one fits */}
      <Section h2={c.outcomesH2} className="!pt-0">
        <div className={`mt-12 gap-12 ${second ? 'grid lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16' : ''}`}>
          {second && (
            <Reveal className={`${second[1] === 'aspect-[4/5]' ? 'mx-auto max-w-sm lg:max-w-none' : ''} lg:sticky lg:top-24`}>
              <div className={`photo-card ${second[1]}`}>
                <Photo slot={second[0]} alt={p.outcomesPhotoAlt} sizes="(min-width:1024px) 480px, 90vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}
          <ul className={second ? '' : 'max-w-4xl'}>
            {p.outcomes.map((o, i) => (
              <Reveal key={o.title} as="li" delay={i * 0.05} className={`border-t border-line py-6 ${second ? '' : 'md:grid md:grid-cols-[1fr_1.4fr] md:gap-10'}`}>
                <h3 className="t-h3">{o.title}</h3>
                <p className="mt-2 text-muted md:mt-0">{o.p}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* PACKAGES: read live from the price list; no price is written in this file */}
      <Section h2={p.packages.h2} lead={p.packages.p} className="!pt-0">
        <ul className="mt-10 max-w-4xl">
          {rows.map((r) => (
            <li key={r.id} className="grid items-start gap-x-8 gap-y-3 border-t border-line py-6 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="t-h3">{r.name}</h3>
                  {r.featured && <span className="chip chip-sun">{d.pricing.mostPopular}</span>}
                  {r.unit && <span className="chip chip-quiet">{r.unit}</span>}
                </div>
                {r.line && <p className="mt-2 max-w-prose text-muted">{r.line}</p>}
              </div>
              <div className="sm:text-end"><PriceCell row={r} lang={lang} d={d} c={c} talk={talk} /></div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <Cta href={primaryHref} variant="tonal" placement={`${ph}-packages`}>{persona === 'individuals' ? d.cta.startFree : d.cta.askQuote}</Cta>
          <Cta href={pathFor('pricing', lang)} variant="quiet" placement={`${ph}-packages`}>{d.cta.seePricing}</Cta>
        </div>
      </Section>

      <Section className="!pt-0"><Faq h2={c.faqH2} items={p.faq} /></Section>

      {/* THE FINAL ASK, on the field colour */}
      <section className="bg-field text-field-ink">
        <div className="wrap py-20 lg:py-28">
          <div className="mb-10 h-[2px] w-full max-w-md rounded-full bg-thread" aria-hidden="true" />
          <h2 className="t-h1 max-w-3xl text-balance">{c.ctaH2}</h2>
          <p className="lead mt-4 max-w-xl !text-field-ink/80">{c.ctaP}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={primaryHref} placement={`${ph}-final`}>{primaryLabel}</Cta>
            <Cta href={talk} variant="field" placement={`${ph}-final`}>{d.cta.talkToPerson}</Cta>
          </div>
        </div>
      </section>
      <JsonLd data={graph(ldWebPage(persona, lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: persona, name: d.nav.personas[persona] }], lang))} />
    </>
  );
}
