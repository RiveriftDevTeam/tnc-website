import { t } from '@/content';
import OrderFlow from '@/components/OrderFlow';
import JsonLd from '@/components/JsonLd';
import { graph, ldWebPage, ldBreadcrumb } from '@/lib/seo';
export default function Order({ lang }) {
  const d = t(lang); const o = d.order;
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl"><h1 className="t-h1">{o.hero.h1}</h1><p className="lead mt-5">{o.hero.sub}</p></div></section>
      <section className="section pt-10 lg:pt-12"><div className="wrap"><OrderFlow lang={lang} o={o} orderWord={d.cta.order} /></div></section>
      <JsonLd data={graph(ldWebPage('order', lang), ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'order', name: d.nav.order }], lang))} />
    </>
  );
}
