// The welcome story (one person, one year) as a connected timeline: five moment cards on one dated line.
// Desktop: a row with the line running through the dates. Phone: a column with the line down the start side.
import { Check } from 'lucide-react';
import BrandMark from './BrandMark';
import Reveal from './Reveal';

const FACE = { layla: ['#0B5F6B', '#66D4E0'], omar: ['#C8791A', '#F3C9A8'], hana: ['#D1487A', '#F7D2B5'], noor: ['#6E56CF', '#C4CDF2'], yusuf: ['#0A9083', '#9ED9CF'] };
const Face = ({ id, name, ring }) => { const [a, b] = FACE[id]; return <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${ring ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}`} style={{ background: `radial-gradient(circle at 35% 30%, ${b}, ${a} 70%)` }} title={name} aria-hidden="true">{name.slice(0, 1)}</span>; };

export default function YearTimeline({ story }) {
  const c = story.cast;
  const faces = [[['layla', c.layla, true], ['omar', c.omar]], [['layla', c.layla, true], ['omar', c.omar]], [['noor', c.noor], ['hana', c.hana], ['layla', c.layla, true], ['omar', c.omar], ['yusuf', c.yusuf]], [['layla', c.layla, true], ['omar', c.omar]], [['noor', c.noor], ['hana', c.hana], ['layla', c.layla, true], ['omar', c.omar], ['yusuf', c.yusuf]]];
  return (
    <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
      <span className="absolute start-[19px] top-6 bottom-6 w-px bg-line lg:start-0 lg:end-0 lg:top-[22px] lg:bottom-auto lg:h-px lg:w-auto" aria-hidden="true" />
      {story.beats.map((b, i) => (
        <Reveal key={b.k} delay={i * 0.06} as="li" className="relative ps-12 lg:ps-0">
          <div className="absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium text-accent lg:relative lg:mb-4 lg:mx-auto" aria-hidden="true">{i + 1}</div>
          <div className="num mb-2 text-xs font-medium uppercase tracking-wide text-subtle lg:text-center">{b.chip}</div>
          <div className="glass h-full p-4">
            <div className="mb-3 flex -space-x-1.5 rtl:space-x-reverse">{faces[i].map(([id, name, ring]) => <Face key={id} id={id} name={name} ring={ring} />)}</div>
            <h3 className="text-[1.05rem] font-medium leading-snug">{b.title}</h3>
            <p className="mt-2 text-sm text-muted">{b.line}</p>
            {b.preview && <p className="mt-1.5 text-xs italic text-subtle">{b.preview}</p>}
            {b.assistant && <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><BrandMark size={14} /> {b.assistant}</p>}
            {b.action && <div className="mt-3 flex gap-1.5"><span className={`btn btn-sm !min-h-8 !px-3 !text-xs ${b.k === 'draft' ? 'btn-primary' : 'btn-tonal'}`}>{b.action}</span><span className="btn btn-quiet btn-sm !min-h-8 !px-3 !text-xs">{b.quiet}</span></div>}
            {b.reply && <p className="mt-2 rounded-card bg-accent-soft/60 p-2 text-xs"><span className="font-medium">{c.omar}:</span> {b.reply}</p>}
            {b.outcome && <p className="mt-2 flex items-center gap-1.5 text-xs text-good"><Check size={13} aria-hidden="true" /> {b.outcome}</p>}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
