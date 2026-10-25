import Link from 'next/link';
import { Check } from 'lucide-react';
import { t, fill } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import PricingTabs from '@/components/PricingTabs';
import Thread from '@/components/Thread';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldSoftwareApp, ldProductCard, ldBreadcrumb } from '@/lib/seo';

function Lines({ items }) { return <ul className="mt-5 space-y-2 text-[.95rem] text-muted">{items.map((l) => <li key={l} className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-thread-text" aria-hidden="true" />{l}</li>)}</ul>; }

/** The sun "most popular" tape: a strip of tape across the card's top edge, label in the hand face. */
function Tape({ children }) {
  return <span className="absolute -top-3.5 start-6 z-10 -rotate-2 rounded-[3px] bg-sun px-3.5 py-1 font-hand text-[1.15rem] leading-tight text-sun-ink shadow-sticker rtl:rotate-2">{children}</span>;
}

/** "Priced per order": the hand face says it, a link takes you to a person. Never a number we do not hold. */
function Price({ amount, period, lang, d, order }) {
  if (amount === 0) return <div className="num mt-3 font-display text-3xl font-semibold">{d.pricing.free}</div>;
  if (amount == null) return (
    <div className="mt-3">
      <div className="hand text-[1.6rem]">{d.pricing.quote}</div>
      <div className="mt-1 text-sm text-subtle">{d.pricing.quoteNote}</div>
      <Link href={`${order}#person`} className="link mt-2 inline-block text-sm font-medium">{d.cta.talkToPerson}</Link>
    </div>
  );
  return <div className="num mt-3 font-display text-3xl font-semibold">{fmtAED(amount, lang)}{period && <span className="font-sans text-base font-normal text-subtle"> / {period}</span>}</div>;
}

/** The card in CSS 3D, a thumbnail: tilted on the paper, it squares up when you hover. Decorative; the text beside it says it all. */
function CardThumb({ name }) {
  return (
    <div className="scene-3d group mx-auto w-full max-w-[260px]" aria-hidden="true">
      <div className="card-3d relative aspect-[1.586] w-full rounded-[16px] bg-field p-4 text-field-ink shadow-float [transform:rotateY(-16deg)_rotateX(10deg)_rotateZ(-4deg)] group-hover:[transform:rotateY(-4deg)_rotateX(2deg)_rotateZ(-1deg)]">
        <span className="absolute end-4 top-4 h-9 w-9 rounded-full border-2 border-thread" />
        <span className="absolute end-[26px] top-[26px] h-3 w-3 rounded-full bg-thread" />
        <div className="absolute inset-x-4 bottom-4">
          <Thread shape="h" animate={false} className="h-3 w-24" knots={[100]} />
          <div className="mt-2 font-display text-lg font-semibold">{name}</div>
        </div>
      </div>
    </div>
  );
}

const featuredRing = (f) => (f ? 'ring-2 ring-thread' : '');

export default function Pricing({ lang }) {
  const d = t(lang); const p = d.pricing; const order = pathFor('order', lang);
  const people = (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.member.map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${featuredRing(pl.featured)}`}>
            {pl.featured && <Tape>{p.mostPopular}</Tape>}
            <h3 className="t-h3">{pl.name[lang]}</h3>
            <Price amount={pl.prices.monthly} period={p.perMonth} lang={lang} d={d} order={order} />
            {pl.prices.yearly && <div className="num mt-1 text-sm text-subtle">{fill(p.yearlyNote, { price: fmtAED(pl.prices.yearly, lang) })}</div>}
            <p className="mt-3 text-muted">{pl.tagline[lang]}</p>
            <Lines items={pl.what_you_get[lang]} />
            <div className="mt-auto pt-8"><Cta href={JOIN_URL} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.startFree}</Cta></div>
          </Card>
        ))}
      </div>
      <h2 id="card" className="t-h2 mt-16 scroll-mt-24">{p.cardH2}</h2>
      <Card className="mt-5 grid gap-8 md:grid-cols-[240px_1fr_auto] md:items-center">
        <CardThumb name={PLANS.card.name[lang]} />
        <div><h3 className="t-h3">{PLANS.card.name[lang]}</h3><p className="mt-1 text-muted">{PLANS.card.tagline[lang]}</p><Lines items={PLANS.card.what_you_get[lang]} /></div>
        <div className="text-start md:text-end"><div className="num font-display text-3xl font-semibold">{fmtAED(PLANS.card.prices.once, lang)}</div><div className="text-sm text-subtle">{p.once}</div><div className="mt-4"><Cta href={`${order}?kind=individual&plan=card_plus`} variant="tonal" placement="pricing-card">{d.cta.getCard}</Cta></div></div>
      </Card>
      <h2 id="packs" className="t-h2 mt-16 scroll-mt-24">{p.packsH2}</h2><p className="mt-2 text-muted">{p.packsP}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{PLANS.packs.map((pk) => <Card key={pk.id} className="flex items-center justify-between"><span className="font-medium">{pk.name[lang]}</span><span className="num font-display text-lg font-semibold">{fmtAED(pk.prices.once, lang)}</span></Card>)}</div>
    </>
  );
  const companies = (
    <>
      <h2 className="t-h2">{p.seatsH2}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {PLANS.company.filter((x) => x.id.startsWith('seat')).map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${featuredRing(pl.featured)}`}>
            {pl.featured && <Tape>{p.mostPopular}</Tape>}
            <div className="flex items-center justify-between gap-3"><h3 className="t-h3">{pl.name[lang]}</h3><span className="chip chip-quiet">{pl.unit[lang]}</span></div>
            <Price amount={pl.prices.per_seat} lang={lang} d={d} order={order} />
            <Lines items={pl.what_you_get[lang]} />
            <div className="mt-auto pt-8"><Cta href={`${order}?kind=exhibitor&seat=${pl.id}`} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.order}</Cta></div>
          </Card>
        ))}
      </div>
      <h2 className="t-h2 mt-16">{p.companyPlanH2}</h2>
      {PLANS.company.filter((x) => x.id === 'company_plan').map((pl) => (
        <Card key={pl.id} className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div><div className="flex flex-wrap items-center gap-3"><h3 className="t-h3">{pl.name[lang]}</h3><span className="chip chip-quiet">{pl.unit[lang]}</span></div><Lines items={pl.what_you_get[lang]} /></div>
          <div className="md:text-end"><Price amount={pl.prices.per_term} lang={lang} d={d} order={order} /><div className="mt-4"><Cta href={`${order}?kind=company`} variant="tonal" placement="pricing-company">{d.cta.askQuote}</Cta></div></div>
        </Card>
      ))}
    </>
  );
  const events = (
    <>
      <h2 className="t-h2">{p.organiserH2}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {PLANS.organiser.map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${featuredRing(pl.featured)}`}>
            {pl.featured && <Tape>{p.mostPopular}</Tape>}
            <h3 className="t-h3">{pl.name[lang]}</h3><p className="mt-2 text-muted">{pl.line[lang]}</p>
            <div className="mt-auto pt-4"><Price amount={pl.prices.per_event} lang={lang} d={d} order={order} /><div className="mt-5"><Cta href={`${order}?kind=organiser&pkg=${pl.id}`} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.askQuote}</Cta></div></div>
          </Card>
        ))}
      </div>
      <h2 className="t-h2 mt-16">{p.sponsorH2}</h2><p className="mt-2 max-w-2xl text-muted">{p.sponsorP}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PLANS.sponsor.map((pl) => <Card key={pl.id} className="flex items-center justify-between gap-3"><span className="t-h3">{pl.name[lang]}</span><Cta href={`${order}?kind=sponsor&tier=${pl.id}`} variant="quiet" size="sm" placement={`pricing-${pl.id}`}>{d.cta.order}</Cta></Card>)}</div>
    </>
  );
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16">
        <div className="wrap max-w-3xl">
          <h1 className="t-h1">{p.hero.h1}</h1>
          <p className="lead mt-6">{p.hero.sub}</p>
          <Thread shape="h" animate={false} className="mt-8 h-6 w-full max-w-xs" knots={[100]} />
        </div>
      </section>
      <Section><PricingTabs tabs={p.tabs} panels={{ people, companies, events }} /><p className="mt-12 max-w-3xl text-sm text-subtle">{p.footnote}</p></Section>
      <section className="section pt-0" aria-labelledby="talk-h2">
        <div className="wrap">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <div className="photo-card aspect-[3/2]"><Photo slot="pricing-hands" alt={p.talk.alt} sizes="(min-width: 768px) 560px, 100vw" /></div>
            <div>
              <h2 id="talk-h2" className="t-h1">{p.talk.h2}</h2>
              <p className="lead mt-4 max-w-prose">{p.talk.p}</p>
              <div className="mt-7"><Cta href={`${order}#person`} variant="tonal" placement="pricing-talk">{d.cta.talkToPerson}</Cta></div>
            </div>
          </div>
        </div>
      </section>
      <Section className="pt-0"><Faq h2={p.faqH2} items={p.faq} /></Section>
      <JsonLd data={graph(ldWebPage('pricing', lang), ldSoftwareApp(lang), ldProductCard(lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'pricing', name: d.nav.pricing }], lang))} />
    </>
  );
}
