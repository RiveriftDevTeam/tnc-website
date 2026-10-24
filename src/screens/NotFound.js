import { dict } from '@/content';
import { pathFor } from '@/content/site';
import Cta from '@/components/Cta';
/** One 404 for the whole static site, so it speaks both languages. */
export default function NotFound() {
  return (
    <section className="section"><div className="wrap grid max-w-4xl gap-10 md:grid-cols-2">
      {['en', 'ar'].map((lang) => { const d = dict[lang]; return (
        <div key={lang} lang={lang} dir={d.dir} className="text-center"><h1 className="t-h1">{d.notFound.title}</h1><p className="lead mt-4">{d.notFound.p}</p><div className="mt-8"><Cta href={pathFor('home', lang)} placement="404">{d.notFound.home}</Cta></div></div>
      ); })}
    </div></section>
  );
}
