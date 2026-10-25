// Pieces for the ScrollScenes pictures (server components, no script). Every scene is drawn in a 120 x 100 box that fills
// the stage; positions are in those units and use logical insets, so Arabic mirrors by itself. Sizes inside a scene use
// cqw (the stage is a size container) so a picture reads the same on a phone and on a wide stage.
// A scene wrapper (ScrollScenes) carries data-on and --sp; `Pop` settles in when it turns on, `Scrub` follows --sp.
import { Check } from 'lucide-react';

const FILL = { 0: 'fill-thread', 1: 'fill-clay-1', 2: 'fill-clay-2', 3: 'fill-clay-3', 4: 'fill-clay-4', 5: 'fill-clay-5', 6: 'fill-clay-6' };
const FROM = {
  up: 'group-data-[on=0]/scene:translate-y-[5cqw]',
  down: 'group-data-[on=0]/scene:-translate-y-[5cqw]',
  start: 'group-data-[on=0]/scene:-translate-x-[6cqw] rtl:group-data-[on=0]/scene:translate-x-[6cqw]',
  end: 'group-data-[on=0]/scene:translate-x-[6cqw] rtl:group-data-[on=0]/scene:-translate-x-[6cqw]',
  grow: 'group-data-[on=0]/scene:scale-50',
};

/** The picture's backdrop: a soft floor so things stand on something. */
export function Floor({ y = 80 }) {
  return <div className="absolute inset-x-0 bottom-0 bg-field-ink/[.07]" style={{ top: `${y}%` }} aria-hidden="true" />;
}

/** Place something in the 120 x 100 box: x, y the centre (or the start/top corner when c is false), w the width. */
export function At({ x, y, w, c = true, className = '', children }) {
  const s = { insetInlineStart: `${(x / 1.2).toFixed(2)}%`, top: `${y}%` };
  if (w) s.width = `${(w / 1.2).toFixed(2)}%`;
  return <div className={`absolute ${c ? '[translate:-50%_-50%] rtl:[translate:50%_-50%]' : ''} ${className}`} style={s}>{children}</div>;
}

/** Settles in when its scene turns on (and goes back out when it turns off). d is the delay in ms. */
export function Pop({ d = 0, from = 'up', pop = false, className = '', children }) {
  return (
    <div className={`transition-[opacity,transform] ${pop ? 'duration-base ease-pop' : 'duration-slow ease-out'} group-data-[on=0]/scene:opacity-0 ${FROM[from]} group-data-[on=1]/scene:[transition-delay:var(--d)] ${className}`} style={{ '--d': `${d}ms` }}>{children}</div>
  );
}

/** Moves with the scroll through the step: from `from` (at --sp 0) to its place (at --sp 1), in cqw. */
export function Scrub({ from = -16, className = '', children }) {
  return <div className={`[--dir:1] rtl:[--dir:-1] ${className}`} style={{ transform: `translateX(calc((1 - var(--sp, 1)) * ${from}cqw * var(--dir)))` }}>{children}</div>;
}

/** Appears once the scroll through the step passes `at` (a knot that waits for its thread). */
export function Late({ at = 0.7, children }) {
  return <div style={{ opacity: `clamp(0, (var(--sp, 1) - ${at}) * 5, 1)` }}>{children}</div>;
}

/** A paper sticker sized to the stage. */
export function Note({ meta, note, tilt = 1, tape = false, className = '', children }) {
  return (
    <div className={`sticker ${tape ? 'sticker-tape' : ''} !p-[clamp(7px,2.2cqw,13px)] ${className}`} data-tilt={tilt}>
      {meta && <div className="text-[clamp(10.5px,2.2cqw,12.5px)] leading-tight text-subtle">{meta}</div>}
      {note && <p className={`hand !text-[clamp(14px,3.4cqw,21px)] rtl:!text-[clamp(16px,3.8cqw,23px)] !leading-[1.18] ${meta ? 'mt-0.5' : ''}`}>{note}</p>}
      {children}
    </div>
  );
}
export const Small = ({ children, className = '' }) => <p className={`mt-[.6cqw] text-[clamp(11px,2.3cqw,13.5px)] leading-snug text-muted ${className}`}>{children}</p>;
/** A tiny pill that looks like a button (decoration: the scene is aria-hidden). */
export const Pill = ({ children, quiet = false }) => <span className={`inline-block rounded-full px-[1.8cqw] py-[.6cqw] text-[clamp(10.5px,2.2cqw,12.5px)] font-medium leading-tight ${quiet ? 'bg-sunken text-muted' : 'bg-accent-soft text-accent'}`}>{children}</span>;
/** A person as a clay bead: a head and shoulders, no face. */
export function Bead({ clay = 2, className = '' }) {
  return (
    <svg viewBox="0 0 40 48" className={`block w-full ${className}`} aria-hidden="true">
      <path d="M3 48c0-14 7.5-21 17-21s17 7 17 21z" className={FILL[clay]} />
      <circle cx="20" cy="14" r="11" className={FILL[clay]} />
      <ellipse cx="16" cy="10" rx="4" ry="2.6" className="fill-field-ink/30" transform="rotate(-25 16 10)" />
    </svg>
  );
}
/** A strand of the thread. d is a path in the box; it draws itself as --sp goes from `late` to 1 (0 = from the start). */
export function Strand({ d, className = 'text-thread', w = 0.6, draw = true, late = 0 }) {
  return (
    <svg viewBox="0 0 120 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible rtl:-scale-x-100" aria-hidden="true">
      <path d={d} pathLength="1" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeDasharray="1" className={className} style={{ strokeDashoffset: draw ? `calc(1 - max(0, (var(--sp, 1) - ${late}) / ${1 - late}))` : 0 }} />
    </svg>
  );
}
/** A knot on the thread: where two people connect (a ring with a centre, as on the page's thread). */
export function Dot({ size = 3.6 }) {
  return <span className="grid place-items-center rounded-full border-[max(2px,.5cqw)] border-thread bg-field" style={{ width: `${size}cqw`, height: `${size}cqw` }} aria-hidden="true"><span className="h-[28%] w-[28%] rounded-full bg-thread" /></span>;
}
/** A phone: its screen holds whatever is passed. */
export function Phone({ children, className = '' }) {
  return <div className={`h-full w-full rounded-[3.6cqw] border-[max(2px,.5cqw)] border-field-ink/45 bg-field p-[2cqw] ${className}`}>{children}</div>;
}
export const Bar = ({ w = '100%', className = '' }) => <div className={`h-[1.5cqw] rounded-full bg-field-ink/20 ${className}`} style={{ width: w }} />;
/** A small tick in a sun disc: "done". */
export const Tick = ({ size = 4.4 }) => <span className="grid place-items-center rounded-full bg-sun text-sun-ink" style={{ width: `${size}cqw`, height: `${size}cqw` }} aria-hidden="true"><Check className="h-[62%] w-[62%]" strokeWidth={3} /></span>;
/** A label chip: who a bead is. The colour follows the strand (thread for the first, accent for the second). */
export const Who = ({ children, second = false }) => <span className="chip !min-h-0 whitespace-nowrap !px-[1.8cqw] !py-[.7cqw] !text-[clamp(10.5px,2.3cqw,13px)]"><span className={`h-[1.6cqw] w-[1.6cqw] rounded-full ${second ? 'bg-accent' : 'bg-thread'}`} aria-hidden="true" />{children}</span>;
