// The three pictures of "At an event" (How it works): before, during, after. Server components; text comes in as props.
import { At, Pop, Scrub, Late, Note, Small, Pill, Bead, Strand, Dot, Phone, Bar, Tick, Who, Floor } from './parts';

/** A booth sign. */
export function Sign({ className = '' }) {
  return (
    <div className={`rounded-[1.2cqw] bg-sun p-[1.6cqw] ${className}`} aria-hidden="true">
      <div className="h-[1.3cqw] w-[62%] rounded-full bg-field/40" /><div className="mt-[1.1cqw] h-[1.3cqw] w-[38%] rounded-full bg-field/25" />
    </div>
  );
}
/** A counter. */
export const Counter = ({ className = '' }) => <div className={`h-[10cqw] rounded-t-[1.6cqw] border-[max(2px,.4cqw)] border-field-ink/30 bg-field-ink/[.12] ${className}`} aria-hidden="true" />;

/** Two beads meet at a stand: a tap, a ripple, a knot tied in the thread, and the note that keeps it. */
export function MeetScene({ a, b, met }) {
  return (
    <>
      <Floor y={84} />
      <At x={96} y={30} w={30}><Pop from="down" d={100}><Sign /></Pop></At>
      <At x={96} y={56} w={15}><Pop from="end" d={160}><Bead clay={3} /></Pop></At>
      <At x={96} y={73} w={36}><Pop from="end" d={60}><Counter /></Pop></At>
      <At x={77} y={66} w={5}>
        <span className="relative block aspect-square rounded-[.8cqw] bg-field-ink/30" aria-hidden="true">
          <span className="ring-tap block h-[16cqw] w-[16cqw] [left:50%] [top:50%] [translate:-50%_-50%] group-data-[on=0]/scene:hidden" />
        </span>
      </At>
      <At x={56} y={73} w={15}><Pop from="start" d={60}><Scrub from={-22}><Bead clay={2} /></Scrub></Pop></At>
      <Strand d="M58 63 C 64 41, 86 39, 92 49" late={0.45} />
      <At x={75} y={44}><Late at={0.7}><Dot size={4.2} /></Late></At>
      <At x={56} y={91}><Pop d={200}><Who>{a}</Who></Pop></At>
      <At x={96} y={91}><Pop d={260}><Who second>{b}</Who></Pop></At>
      <At x={38} y={14} w={52}><Pop from="down" pop d={380}><Note tilt={2} tape meta={met.meta} note={met.note} /></Pop></At>
    </>
  );
}

/** Before: the visitor's prep note beside a phone, the exhibitor's target accounts under it, a thread between the two. */
export function BeforeScene({ s }) {
  return (
    <>
      <Floor y={90} />
      <At x={30} y={55} w={30} className="aspect-[1/2.05]">
        <Pop from="up"><Phone className="aspect-[1/2.05]">
          <div className="flex items-center gap-[1.4cqw]"><span className="h-[2.6cqw] w-[2.6cqw] rounded-full bg-thread" /><Bar w="40%" /></div>
          <div className="mt-[3cqw] space-y-[2.4cqw]"><Bar /><Bar w="80%" /><div className="flex items-center gap-[1.6cqw] rounded-[1.4cqw] bg-sun/25 p-[1.6cqw]"><span className="h-[2.4cqw] w-[2.4cqw] rounded-full bg-sun" /><Bar w="70%" /></div><Bar w="90%" /><Bar w="55%" /></div>
        </Phone></Pop>
      </At>
      <At x={76} y={20} w={50}><Pop from="end" pop d={280}><Note tilt={2} tape meta={s.visitor.meta} note={s.visitor.note} /></Pop></At>
      <At x={84} y={68} w={50}>
        <Pop from="end" pop d={560}>
          <Note tilt={1} tape meta={s.exhibitor.meta} note={s.exhibitor.note}><Small>{s.exhibitor.line}</Small></Note>
        </Pop>
      </At>
      <Strand d="M45 50 C 56 46, 50 36, 56 29" w={0.5} />
      <Strand d="M82 29 C 94 38, 76 50, 84 59" late={0.3} />
      <At x={84.5} y={44}><Late at={0.7}><Dot /></Late></At>
    </>
  );
}

/** After: the assistant's notes arrive; the follow-up is drafted, the account page is filled, the hand-over is ready. */
export function AfterScene({ s }) {
  return (
    <>
      <Strand d="M40 31 C 40 42, 46 44, 58 46" w={0.5} />
      <Strand d="M84 57 C 88 66, 72 70, 61 74" w={0.5} late={0.3} />
      <At x={37} y={18} w={60}>
        <Pop from="down" pop d={80}>
          <Note tilt={1} tape meta={s.draft.meta} note={s.draft.note}>
            <div className="mt-[1.4cqw] flex gap-[1.4cqw]"><Pill>{s.draft.yes}</Pill><Pill quiet>{s.draft.no}</Pill></div>
          </Note>
        </Pop>
      </At>
      <At x={83} y={47} w={52}>
        <Pop from="end" pop d={420}>
          <Note tilt={2} meta={s.account.meta} note={s.account.note}><Small>{s.account.line}</Small></Note>
        </Pop>
      </At>
      <At x={36} y={78} w={50}>
        <Pop from="start" pop d={760}>
          <Note tilt={3} meta={s.reminder.meta} note={s.reminder.note} />
        </Pop>
      </At>
      <At x={92} y={86}><Pop from="up" pop d={1000}><span className="inline-flex items-center gap-[1.6cqw] whitespace-nowrap rounded-full bg-field-ink/[.12] py-[1.1cqw] pe-[2.6cqw] ps-[1.4cqw] text-[clamp(10px,2.4cqw,13.5px)] text-field-ink"><Tick size={4.2} />{s.crm}</span></Pop></At>
    </>
  );
}
