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
import { Knot } from '@/components/Thread';
import ScrollScenes from '@/components/ScrollScenes';
import { FadeScene, CrowdScene, StatsScene, AccountScene, PhotoScene, DraftsScene, RouteScene, CircleScene, CardScene, AskScene } from '@/components/scenes/JourneyScenes';
import { MeetScene } from '@/components/scenes/HowScenes';
import { Section } from '@/components/Section';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';

const KIND = { organisers: 'organiser', exhibitors: 'exhibitor', sponsors: 'sponsor', companies: 'company', individuals: 'individual' };
const HERO_PHOTO = { organisers: ['door-organisers', 'aspect-[3/2]'], exhibitors: ['door-exhibitors', 'aspect-[4/5]'], sponsors: ['door-sponsors', 'aspect-[3/2]'], companies: ['door-companies', 'aspect-[3/2]'], individuals: ['door-individuals', 'aspect-[4/5]'] };
// the second photo sits beside "What you get" unless the journey already uses it
const SECOND_PHOTO = { exhibitors: ['persona-exhibitor-2', 'aspect-[4/5]'], individuals: ['persona-individual-2', 'aspect-[4/5]'] };

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

/** The pictures of a buyer's journey, one per step: how it usually ends first, then what happens (copy: personas.<buyer>.journey). */
function journeyScenes(persona, d, p) {
  const j = p.journey, sc = j.scene, c = d.personas.common, cs = c.scene, v = d.home.vignettes, sample = c.sample;
  const fade = <FadeScene key="fade" lines={j.fade} />;
  const send = v.individuals.cards[0];
  const drafts = (items) => <DraftsScene key="drafts" items={items.map((it) => ({ ...it, yes: send.yes, no: send.no }))} />;
  if (persona === 'organisers') {
    return [fade, <CrowdScene key="crowd" note={sc.crowd} />, <StatsScene key="stats" v={v.organisers} sample={sample} />,
      <PhotoScene key="next" photo={<Photo slot="how-organiser" alt="" sizes="(min-width:1024px) 40vw, 90vw" />} meta={sc.next.meta} note={sc.next.note} />];
  }
  if (persona === 'exhibitors') {
    const row = v.exhibitors.rows[0];
    return [fade, <MeetScene key="meet" a={cs.visitor} b={cs.stand} met={cs.met} />,
      <AccountScene key="account" title={row.company} lines={row.line.split(' · ')} chip={row.next} foot={v.exhibitors.owner} />,
      drafts(sc.drafts),
      <RouteScene key="route" meta={row.company} note={sc.route.note} to={cs.crm} click={v.exhibitors.crm} />];
  }
  if (persona === 'sponsors') {
    const cast = d.home.story.cast;
    return [fade, <PhotoScene key="banner" photo={<Photo slot="persona-sponsor-2" alt="" sizes="(min-width:1024px) 40vw, 90vw" />} meta={v.sponsors.sub} note={sc.banner.note} />,
      <StatsScene key="stats" v={v.sponsors} sample={sample} bars={1} note={v.sponsors.note} />,
      <CircleScene key="circle" centre={cs.team} labels={[cast.omar, cast.hana, cast.noor, cast.yusuf]} />];
  }
  if (persona === 'companies') {
    const s = p.hero.sticker;
    return [fade, <CrowdScene key="crowd" chips={sc.channels} />,
      <AccountScene key="account" title={s.note} lines={s.lines} foot={s.meta} />,
      drafts(sc.drafts),
      <CircleScene key="circle" centre={cs.company} labels={sc.results} />];
  }
  const m = d.how.capture.memory;
  return [fade, <CardScene key="card" name={sc.card.name} line={sc.card.line} note={sc.card.note} />,
    <MeetScene key="meet" a={cs.you} b={cs.someone} met={cs.met} />,
    drafts(v.individuals.cards.slice(0, 2).map((k) => ({ note: k.line, why: k.why }))),
    <AskScene key="ask" q={sc.ask.q} sample={m.meta} name={m.name} where={m.where} promised={m.promised} />];
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

      {/* THE JOURNEY: one scroll story. The first scene is how it usually ends; each step is a picture and one line */}
      <Section h2={p.journey.h2} className="!pt-0">
        <ScrollScenes
          className="mt-12 lg:mt-16"
          label={p.journey.h2}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          steps={p.journey.steps.map((st, i) => ({ key: `${persona}-${i}`, title: st.title, line: st.line }))}
          scenes={journeyScenes(persona, d, p)}
        />
      </Section>

      {/* WHAT YOU GET: editorial rows, with a second photo where one fits */}
      <Section h2={c.outcomesH2} className="!pt-0">
        <div className={`mt-12 gap-12 ${second ? 'grid lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16' : ''}`}>
          {second && (
            <Reveal className={`${second[1] === 'aspect-[4/5]' ? 'mx-auto w-full max-w-sm lg:max-w-none' : ''} lg:sticky lg:top-24`}>
              <div className={`photo-card ${second[1]}`}>
                <Photo slot={second[0]} alt={p.outcomesPhotoAlt} sizes="(min-width:1024px) 480px, 90vw" className="block h-full w-full" imgClassName={`${second[1]} h-full w-full object-cover`} />
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
