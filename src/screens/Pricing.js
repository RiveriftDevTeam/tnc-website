import { Check } from 'lucide-react';
import { t, fill } from '@/content';
import { pathFor, JOIN_URL } from '@/content/site';
import { PLANS, fmtAED } from '@/content/plans';
import Cta from '@/components/Cta';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import PricingTabs from '@/components/PricingTabs';
import { Section, Card } from '@/components/Section';
import { graph, ldWebPage, ldSoftwareApp, ldProductCard, ldBreadcrumb } from '@/lib/seo';

function Lines({ items }) { return <ul className="mt-5 space-y-2 text-[.95rem] text-muted">{items.map((l) => <li key={l} className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{l}</li>)}</ul>; }

function Price({ amount, period, lang, d }) {
  if (amount === 0) return <div className="num mt-3 text-3xl font-medium">{d.pricing.free}</div>;
  if (amount == null) return <div className="mt-3"><div className="text-2xl font-medium">{d.pricing.quote}</div><div className="mt-1 text-sm text-subtle">{d.pricing.quoteNote}</div></div>;
  return <div className="num mt-3 text-3xl font-medium">{fmtAED(amount, lang)}{period && <span className="text-base font-normal text-subtle"> / {period}</span>}</div>;
}

export default function Pricing({ lang }) {
  const d = t(lang); const p = d.pricing; const order = pathFor('order', lang);
  const people = (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.member.map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${pl.featured ? 'ring-1 ring-accent' : ''}`}>
            <div className="flex items-center justify-between"><h3 className="text-xl font-medium">{pl.name[lang]}</h3>{pl.featured && <span className="chip">{p.mostPopular}</span>}</div>
            <Price amount={pl.prices.monthly} period={p.perMonth} lang={lang} d={d} />
            {pl.prices.yearly && <div className="num mt-1 text-sm text-subtle">{fill(p.yearlyNote, { price: fmtAED(pl.prices.yearly, lang) })}</div>}
            <p className="mt-3 text-muted">{pl.tagline[lang]}</p>
            <Lines items={pl.what_you_get[lang]} />
            <div className="mt-6 pt-2"><Cta href={JOIN_URL} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.startFree}</Cta></div>
          </Card>
        ))}
      </div>
      <h2 id="card" className="t-h2 mt-14">{p.cardH2}</h2>
      <Card className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div><h3 className="text-xl font-medium">{PLANS.card.name[lang]}</h3><p className="mt-1 text-muted">{PLANS.card.tagline[lang]}</p><Lines items={PLANS.card.what_you_get[lang]} /></div>
        <div className="text-start md:text-end"><div className="num text-3xl font-medium">{fmtAED(PLANS.card.prices.once, lang)}</div><div className="text-sm text-subtle">{p.once}</div><div className="mt-4"><Cta href={`${order}?kind=individual&plan=card_plus`} placement="pricing-card">{d.cta.getCard}</Cta></div></div>
      </Card>
      <h2 id="packs" className="t-h2 mt-14">{p.packsH2}</h2><p className="mt-2 text-muted">{p.packsP}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{PLANS.packs.map((pk) => <Card key={pk.id} className="flex items-center justify-between"><span className="font-medium">{pk.name[lang]}</span><span className="num text-lg">{fmtAED(pk.prices.once, lang)}</span></Card>)}</div>
    </>
  );
  const companies = (
    <>
      <h2 className="t-h2">{p.seatsH2}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {PLANS.company.filter((x) => x.id.startsWith('seat')).map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${pl.featured ? 'ring-1 ring-accent' : ''}`}>
            <div className="flex items-center justify-between"><h3 className="text-xl font-medium">{pl.name[lang]}</h3><span className="chip chip-quiet">{pl.unit[lang]}</span></div>
            <Price amount={pl.prices.per_seat} lang={lang} d={d} />
            <Lines items={pl.what_you_get[lang]} />
            <div className="mt-6 pt-2"><Cta href={`${order}?kind=exhibitor&seat=${pl.id}`} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.order}</Cta></div>
          </Card>
        ))}
      </div>
      <h2 className="t-h2 mt-14">{p.companyPlanH2}</h2>
      {PLANS.company.filter((x) => x.id === 'company_plan').map((pl) => (
        <Card key={pl.id} className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div><div className="flex items-center gap-3"><h3 className="text-xl font-medium">{pl.name[lang]}</h3><span className="chip chip-quiet">{pl.unit[lang]}</span></div><Lines items={pl.what_you_get[lang]} /></div>
          <div className="md:text-end"><Price amount={pl.prices.per_term} lang={lang} d={d} /><div className="mt-4"><Cta href={`${order}?kind=company`} placement="pricing-company">{d.cta.askQuote}</Cta></div></div>
        </Card>
      ))}
    </>
  );
  const events = (
    <>
      <h2 className="t-h2">{p.organiserH2}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {PLANS.organiser.map((pl) => (
          <Card key={pl.id} className={`flex h-full flex-col ${pl.featured ? 'ring-1 ring-accent' : ''}`}><h3 className="text-xl font-medium">{pl.name[lang]}</h3><p className="mt-2 text-muted">{pl.line[lang]}</p><div className="mt-auto pt-4"><Price amount={pl.prices.per_event} lang={lang} d={d} /><div className="mt-5"><Cta href={`${order}?kind=organiser&pkg=${pl.id}`} variant={pl.featured ? 'primary' : 'tonal'} placement={`pricing-${pl.id}`} className="w-full">{d.cta.askQuote}</Cta></div></div></Card>
        ))}
      </div>
      <h2 className="t-h2 mt-14">{p.sponsorH2}</h2><p className="mt-2 max-w-2xl text-muted">{p.sponsorP}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PLANS.sponsor.map((pl) => <Card key={pl.id} className="flex items-center justify-between"><span className="text-lg font-medium">{pl.name[lang]}</span><Cta href={`${order}?kind=sponsor&tier=${pl.id}`} variant="quiet" size="sm" placement={`pricing-${pl.id}`}>{d.cta.order}</Cta></Card>)}</div>
    </>
  );
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl"><div className="eyebrow">{p.hero.eyebrow}</div><h1 className="t-display mt-4">{p.hero.h1}</h1><p className="lead mt-6">{p.hero.sub}</p></div></section>
      <Section><PricingTabs tabs={p.tabs} panels={{ people, companies, events }} /><p className="mt-10 max-w-3xl text-sm text-subtle">{p.footnote}</p></Section>
      <Section className="pt-0"><Faq h2={p.faqH2} items={p.faq} /></Section>
      <JsonLd data={graph(ldWebPage('pricing', lang), ldSoftwareApp(lang), ldProductCard(lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'pricing', name: d.nav.pricing }], lang))} />
    </>
  );
}
