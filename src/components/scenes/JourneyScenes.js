// The pictures of the buyer journeys (ScrollScenes on the five buyer pages). Server components; every text comes in as a
// prop from the page copy. Drawn in the 120 x 100 box of parts.js. Sample figures are labelled by the caller.
import BrandMark from '../BrandMark';
import { At, Pop, Late, Note, Small, Pill, Bead, Strand, Dot, Tick, Who, Floor } from './parts';

/** The first step of every journey: what usually happens. Three notes that fade, and a thread that has snapped. */
export function FadeScene({ lines }) {
  const at = [[46, 20, -1.6], [70, 49, 1.2], [46, 78, -.8]];
  return (
    <>
      <Strand d="M9 8 C 15 22, 7 34, 13 44" className="text-field-ink/35" draw={false} w={0.5} />
      <Strand d="M15 56 C 9 68, 17 80, 11 92" className="text-field-ink/35" draw={false} w={0.5} />
      {lines.map((l, i) => (
        <At key={l} x={at[i][0]} y={at[i][1]} w={66}>
          <Pop from={i % 2 ? 'end' : 'start'} d={i * 160}>
            <p className="rounded-[1.6cqw] border border-dashed border-field-ink/40 px-[3cqw] py-[2.2cqw] text-[clamp(12px,3cqw,17px)] leading-snug text-field-ink" style={{ rotate: `${at[i][2]}deg`, opacity: `calc(1 - var(--sp, 0) * ${0.2 + i * 0.12})` }}>{l}</p>
          </Pop>
        </At>
      ))}
    </>
  );
}

const CROWD = [[20, 44, 12, 2], [46, 30, 13, 1], [76, 36, 12, 3], [102, 30, 11, 5], [32, 72, 13, 4], [62, 62, 12, 6], [90, 66, 13, 2]];
const LINKS = [[0, 1, 0], [1, 5, 0.15], [2, 5, 0.3], [2, 3, 0.45], [5, 6, 0.6], [4, 0, 0.75]];
const head = (b) => [b[0], b[1] - b[2] * 0.25];
/** A hall of beads, joined by thread as the scroll goes: people meeting people. chips (optional) name what each bead is doing. */
export function CrowdScene({ note, chips }) {
  return (
    <>
      <Floor y={90} />
      {LINKS.map(([a, b, late]) => {
        const [x1, y1] = head(CROWD[a]), [x2, y2] = head(CROWD[b]);
        return <Strand key={`${a}${b}`} d={`M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 14} ${x2} ${y2}`} late={late * 0.8} w={0.5} />;
      })}
      {CROWD.map(([x, y, w, c], i) => (
        <At key={i} x={x} y={y} w={w}><Pop from="up" d={i * 70}><Bead clay={c} /></Pop></At>
      ))}
      {chips && chips.map((c, i) => <At key={c} x={[22, 52, 84, 98][i]} y={[58, 46, 52, 44][i]}><Pop d={400 + i * 90}><Who second={i % 2 === 1}>{c}</Who></Pop></At>)}
      {note && <At x={60} y={89} w={70}><Pop from="up" pop d={500}><Note tilt={1} tape meta={note.meta} note={note.note} /></Pop></At>}
    </>
  );
}

/** A paper report: a few figures and bars that fill as you scroll. v is a product vignette's copy (sample figures). */
export function StatsScene({ v, sample, bars = 2, note }) {
  const stats = v.stats, bs = v.bars ? v.bars.slice(0, bars) : [v.bar];
  return (
    <>
      <At x={60} y={50} w={100}>
        <Pop from="up" pop>
          <div className="sticker !p-[3.2cqw]" data-tilt="1">
            <div className="flex items-baseline justify-between gap-[2cqw]"><p className="hand !text-[clamp(14px,3.8cqw,22px)]">{v.title}</p><span className="text-[clamp(10.5px,2.2cqw,12.5px)] text-subtle">{v.sub}</span></div>
            <div className="mt-[2.4cqw] grid gap-[2cqw]" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
              {stats.map((s) => (
                <div key={s.l} className="rounded-[1.6cqw] bg-sunken/80 p-[2cqw]"><div className="num font-display text-[clamp(18px,5.6cqw,34px)] font-semibold leading-none">{s.n}</div><div className="mt-[.8cqw] text-[clamp(10.5px,2.1cqw,12px)] leading-tight text-subtle">{s.l}</div></div>
              ))}
            </div>
            <div className="mt-[3cqw] space-y-[2.2cqw]">
              {bs.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between gap-[2cqw] text-[clamp(10.5px,2.3cqw,13px)]"><span className="text-muted">{b.label}</span><span className="num font-medium">{b.value}</span></div>
                  <div className="mt-[.9cqw] h-[1.4cqw] rounded-full bg-sunken"><div className="h-full origin-left rounded-full bg-thread rtl:origin-right" style={{ width: `${b.w}%`, transform: 'scaleX(clamp(0, var(--sp, 1) * 1.5 - .15, 1))' }} /></div>
                </div>
              ))}
            </div>
            {note && <p className="mt-[2.4cqw] text-[clamp(10.5px,2.2cqw,12.5px)] text-subtle">{note}</p>}
          </div>
        </Pop>
      </At>
      <At x={92} y={95}><Pop from="up" d={400}><span className="chip chip-sun !min-h-0 !px-[2cqw] !py-[.9cqw] !text-[clamp(10px,2.2cqw,12.5px)]">{sample}</span></Pop></At>
    </>
  );
}

/** Several people meet one company; one page, one owner. Beads on the start side feed a card. */
export function AccountScene({ title, lines, foot, chip }) {
  const beads = [[12, 24, 2], [12, 42, 1], [12, 60, 3], [12, 78, 5]];
  return (
    <>
      {beads.map(([x, y, c], i) => <Strand key={y} d={`M${x + 5} ${y - 4} C 30 ${y - 4}, 36 50, 49 50`} late={i * 0.12} w={0.5} />)}
      {beads.map(([x, y, c], i) => <At key={`b${y}`} x={x} y={y} w={10}><Pop from="start" d={i * 80}><Bead clay={c} /></Pop></At>)}
      <At x={80} y={50} w={62}>
        <Pop from="end" pop d={300}>
          <Note tilt={2} tape note={title}>
            <ul className="mt-[1.6cqw] space-y-[1.4cqw]">{lines.map((l, i) => <li key={l} className="flex items-start gap-[1.4cqw] text-[clamp(11px,2.4cqw,13.5px)] leading-snug text-muted"><span className="mt-[.7cqw] h-[1.8cqw] w-[1.8cqw] shrink-0 rounded-full bg-thread" />{l}</li>)}</ul>
            {chip && <div className="mt-[2cqw]"><Pill>{chip}</Pill></div>}
            {foot && <Small className="!text-subtle">{foot}</Small>}
          </Note>
        </Pop>
      </At>
      <At x={49} y={50}><Late at={0.6}><Dot /></Late></At>
    </>
  );
}

/** A photo with the note that goes with it. */
export function PhotoScene({ photo, meta, note, line }) {
  return (
    <>
      <At x={50} y={50} w={92}>
        <Pop from="up">
          <div className="aspect-[4/3] overflow-hidden rounded-[2.6cqw] bg-field-ink/10 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_picture]:block [&_picture]:h-full" style={{ boxShadow: '0 1.6cqw 5cqw -2cqw rgb(0 0 0 / .5)' }}>
            <div className="h-full w-full" style={{ transform: 'scale(calc(1.14 - var(--sp, 1) * .14))' }}>{photo}</div>
          </div>
        </Pop>
      </At>
      <At x={84} y={78} w={52}><Pop from="end" pop d={360}><Note tilt={2} tape meta={meta} note={note}>{line && <Small>{line}</Small>}</Note></Pop></At>
    </>
  );
}

/** Drafts waiting for a yes: each item is { note, why, yes, no }. */
export function DraftsScene({ items }) {
  const at = items.length > 2 ? [[36, 19], [80, 49], [38, 79]] : [[40, 30], [78, 66]];
  return (
    <>
      <Strand d={items.length > 2 ? 'M40 31 C 42 40, 56 40, 66 44' : 'M46 42 C 50 52, 68 50, 76 56'} w={0.5} />
      {items.length > 2 && <Strand d="M72 58 C 72 68, 60 68, 52 72" w={0.5} late={0.4} />}
      {items.map((it, i) => (
        <At key={it.note} x={at[i][0]} y={at[i][1]} w={items.length > 2 ? 56 : 64}>
          <Pop from={i % 2 ? 'end' : 'start'} pop d={i * 300}>
            <Note tilt={[1, 2, 3][i]} tape={i === 0} note={it.note}>
              {it.why && <Small>{it.why}</Small>}
              <div className="mt-[1.4cqw] flex gap-[1.4cqw]"><Pill>{it.yes}</Pill><Pill quiet>{it.no}</Pill></div>
            </Note>
          </Pop>
        </At>
      ))}
    </>
  );
}

/** An account moves to the CRM in one click: a small pile of accounts, a thread, the CRM. */
export function RouteScene({ meta, note, line, to, click }) {
  return (
    <>
      <At x={36} y={50} w={56}><div className="aspect-[2.2/1] -rotate-3 rounded-[1.6cqw] bg-sticker opacity-30" /></At>
      <At x={36} y={50} w={56}><div className="aspect-[2.2/1] rotate-2 rounded-[1.6cqw] bg-sticker opacity-50" /></At>
      <At x={36} y={50} w={56}><Pop from="start" pop><Note tilt={1} tape meta={meta} note={note}>{line && <Small>{line}</Small>}</Note></Pop></At>
      <Strand d="M67 50 L 87 50" w={0.8} late={0.2} />
      <At x={70} y={40}><Pop from="down" pop d={500}><Pill>{click}</Pill></Pop></At>
      <At x={77} y={50}><Late at={0.5}><Dot size={4} /></Late></At>
      <At x={102} y={50} w={26}>
        <Pop from="end" d={200}>
          <div className="relative grid aspect-square place-items-center rounded-[3cqw] border-[max(2px,.4cqw)] border-field-ink/40 bg-field-ink/[.1] p-[1cqw] text-center text-[clamp(11px,2.8cqw,15px)] font-medium leading-tight text-field-ink">
            {to}
            <span className="absolute -end-[2cqw] -top-[2cqw]"><Late at={0.6}><Tick size={6} /></Late></span>
          </div>
        </Pop>
      </At>
    </>
  );
}

/** One person at the centre, the people around them joined by thread. labels name the people (or the cards). */
export function CircleScene({ centre, labels }) {
  const ring = [[26, 30, 2], [94, 28, 3], [22, 70, 5], [98, 72, 1]];
  return (
    <>
      <Floor y={92} />
      {ring.slice(0, labels.length).map(([x, y], i) => <Strand key={i} d={`M60 55 Q ${(60 + x) / 2} ${(55 + y) / 2 + (i % 2 ? 8 : -8)} ${x} ${y - 3}`} late={i * 0.18} w={0.55} />)}
      {ring.slice(0, labels.length).map(([x, y, c], i) => (
        <At key={i} x={x} y={y} w={13}><Pop from="grow" d={i * 120}><Bead clay={c} /></Pop></At>
      ))}
      {ring.slice(0, labels.length).map(([x, y], i) => <At key={labels[i]} x={x} y={y + 13}><Pop d={300 + i * 120}><Who second={i % 2 === 1}>{labels[i]}</Who></Pop></At>)}
      <At x={60} y={55} w={17}><Pop from="grow" pop><Bead clay={0} /></Pop></At>
      <At x={60} y={80}><Pop d={200}><Who>{centre}</Who></Pop></At>
    </>
  );
}

/** A tap card: the member's card, tilted, with the note that says how long it took. */
export function CardScene({ name, line, note, meta }) {
  return (
    <>
      <At x={56} y={48} w={74}>
        <Pop from="up" pop>
          <div className="aspect-[1.6/1] -rotate-3 rounded-[3cqw] bg-sticker p-[4cqw] text-ink shadow-sticker">
            <div className="flex items-center justify-between"><BrandMark size={32} className="h-[7cqw] w-[7cqw]" /><span className="h-[4cqw] w-[4cqw] rounded-full border-[max(2px,.5cqw)] border-thread" /></div>
            <p className="hand mt-[4cqw] !text-[clamp(18px,5.6cqw,32px)] !leading-none">{name}</p>
            <p className="mt-[1.4cqw] text-[clamp(10px,2.5cqw,14px)] text-subtle">{line}</p>
            <div className="mt-[3cqw] space-y-[1.4cqw]"><div className="h-[1.3cqw] w-[70%] rounded-full bg-sunken" /><div className="h-[1.3cqw] w-[44%] rounded-full bg-sunken" /></div>
          </div>
        </Pop>
      </At>
      <At x={92} y={84} w={44}><Pop from="end" pop d={400}><Note tilt={3} tape meta={meta} note={note} /></Pop></At>
    </>
  );
}

/** Ask the assistant: a question, and an answer with its evidence. */
export function AskScene({ q, name, where, promised, sample }) {
  return (
    <>
      <At x={74} y={22} w={56}>
        <Pop from="end" d={60}><p className="rounded-[3cqw] rounded-ee-[.8cqw] bg-field-ink/[.14] px-[3cqw] py-[2.4cqw] text-[clamp(12px,3.1cqw,17px)] leading-snug text-field-ink rtl:rounded-ee-[3cqw] rtl:rounded-es-[.8cqw]">{q}</p></Pop>
      </At>
      <At x={46} y={62} w={70}>
        <Pop from="start" pop d={500}>
          <Note tilt={1} tape meta={sample} note={name}>
            <Small>{where}</Small>
            <Small className="!font-medium !text-thread-text">{promised}</Small>
          </Note>
        </Pop>
      </At>
      <Strand d="M70 32 C 72 44, 60 44, 58 52" w={0.5} late={0.3} />
    </>
  );
}
