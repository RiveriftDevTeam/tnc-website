import { t } from '@/content';
import media from '@/content/media.json';
import JsonLd from '@/components/JsonLd';
import { graph, ldBreadcrumb } from '@/lib/seo';

/** Plain page: every photo on the site with its photographer, links and where it is used. Rendered from media.json. */
export default function Credits({ lang }) {
  const d = t(lang); const c = d.credits;
  const rows = Object.entries(media).filter(([, m]) => m.photographer);
  return (
    <>
      <section className="section pb-0 pt-10 lg:pt-16"><div className="wrap max-w-3xl">
        <h1 className="t-display">{c.h1}</h1>
        <p className="lead mt-6">{c.intro}</p>
        <p className="mt-3 text-sm text-subtle">{c.license}</p>
      </div></section>
      <section className="section pt-12 lg:pt-16"><div className="wrap max-w-3xl">
        <ul className="divide-y divide-line border-y border-line">
          {rows.map(([slot, m]) => (
            <li key={slot} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
              <div>
                <p className="t-h3">{c.by} {m.photographer}</p>
                <p className="mt-1 text-sm text-muted">{c.used}: {c.slots[slot] || slot}</p>
              </div>
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-[.95rem] sm:justify-end">
                <a className="link" href={m.profile} rel="noopener">{c.profile}</a>
                <a className="link" href={m.page} rel="noopener">{c.photo}</a>
              </p>
            </li>
          ))}
        </ul>
      </div></section>
      <JsonLd data={graph(ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'credits', name: d.footer.credits }], lang))} />
    </>
  );
}
