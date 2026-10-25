// The welcome story (one person, one year) strung on the coral thread: five dated moments, each a paper note.
// Desktop: a row with the thread through the knots. Phone: a column with the thread down the start side.
import { Check } from './icons';
import BrandMark from './BrandMark';
import Thread, { Knot } from './Thread';

// the people, in the clay colours of the story scene
const FACE = { layla: 4, omar: 2, hana: 1, noor: 5, yusuf: 3 };
const Face = ({ id, name, ring }) => (
  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-semibold text-ink ${ring ? 'ring-2 ring-thread ring-offset-2 ring-offset-sticker' : 'ring-2 ring-sticker'}`} style={{ background: `var(--tnc-site-clay-${FACE[id]})` }} title={name} aria-hidden="true">{name.slice(0, 1)}</span>
);

export default function YearTimeline({ story }) {
  const c = story.cast;
  const faces = [[['layla', c.layla, true], ['omar', c.omar]], [['layla', c.layla, true], ['omar', c.omar]], [['noor', c.noor], ['hana', c.hana], ['layla', c.layla, true], ['omar', c.omar], ['yusuf', c.yusuf]], [['layla', c.layla, true], ['omar', c.omar]], [['noor', c.noor], ['hana', c.hana], ['layla', c.layla, true], ['omar', c.omar], ['yusuf', c.yusuf]]];
  return (
    <div className="relative">
      <Thread shape="vline" className="absolute bottom-6 start-[3px] top-6 w-2 lg:hidden" />
      <Thread shape="h" className="absolute inset-x-0 top-[2px] hidden h-6 lg:block" />
      <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-5">
        {story.beats.map((b, i) => (
          <li key={b.k} className="relative ps-9 lg:ps-0 lg:pt-12">
            <span className="absolute start-0 top-1 text-thread lg:start-1/2 lg:top-[7px] lg:-translate-x-1/2 rtl:lg:translate-x-1/2" aria-hidden="true"><Knot size={16} /></span>
            <div className="hand mb-2 text-thread-text lg:text-center">{b.chip}</div>
            <div className="sticker h-full !p-4" data-tilt={[1, 2, 0, 3, 1][i]}>
              <div className="mb-3 flex -space-x-1.5 rtl:space-x-reverse">{faces[i].map(([id, name, ring]) => <Face key={id} id={id} name={name} ring={ring} />)}</div>
              <h3 className="t-h3 text-[1.05rem]">{b.title}</h3>
              <p className="mt-2 text-sm text-muted">{b.line}</p>
              {b.preview && <p className="mt-1.5 text-xs italic text-subtle">{b.preview}</p>}
              {b.assistant && <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><BrandMark size={14} /> {b.assistant}</p>}
              {b.action && <div className="mt-3 flex gap-1.5" aria-hidden="true"><span className={`btn btn-sm !min-h-8 !px-3 !text-xs ${b.k === 'draft' ? 'btn-primary' : 'btn-tonal'}`}>{b.action}</span><span className="btn btn-quiet btn-sm !min-h-8 !px-3 !text-xs">{b.quiet}</span></div>}
              {b.reply && <p className="hand mt-3 rounded-[10px] bg-sun/25 px-2.5 py-1.5 !text-base"><span className="font-semibold">{c.omar}:</span> {b.reply}</p>}
              {b.outcome && <p className="mt-2 flex items-center gap-1.5 text-xs text-good"><Check size={13} aria-hidden="true" /> {b.outcome}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
