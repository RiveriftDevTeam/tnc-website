import { t } from '@/content';
import media from '@/content/media.json';
import JsonLd from '@/components/JsonLd';
import { graph, ldBreadcrumb } from '@/lib/seo';

/** Plain page: every photo and video clip on the site with its maker, links and where it is used. Rendered from media.json. */
export default function Credits({ lang }) {
  const d = t(lang); const c = d.credits;
  const rows = Object.entries(media).filter(([, m]) => m.photographer);
  const videos = Object.entries(media.video || {});
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
                <a className="link" href={m.page} rel="noopener">{m.source === 'pexels' ? c.photoPexels : c.photo}</a>
              </p>
            </li>
          ))}
        </ul>
        {videos.length > 0 && (
          <>
            <h2 className="t-h2 mt-14">{c.videosH}</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {videos.map(([name, v]) => (
                <li key={name} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <p className="t-h3">{c.videoBy} {v.creator}</p>
                    <p className="mt-1 text-sm text-muted">{c.used}: {c.videoSlots[name] || name}</p>
                  </div>
                  <p className="flex flex-wrap gap-x-5 gap-y-1 text-[.95rem] sm:justify-end">
                    {v.creatorUrl && <a className="link" href={v.creatorUrl} rel="noopener">{c.profile}</a>}
                    <a className="link" href={v.page} rel="noopener">{c.videoLink}</a>
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div></section>
      <JsonLd data={graph(ldBreadcrumb([{ key: 'home', name: d.brand }, { key: 'credits', name: d.footer.credits }], lang))} />
    </>
  );
}
