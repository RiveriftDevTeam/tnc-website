// Small, honest pictures of the product for each buyer, drawn in HTML on the product's own tokens (sample figures).
// Kept Thread: each is a paper note from the product, the figures in the display face, progress on the coral thread.
import { Check, Mail, ArrowRight } from './icons';
import BrandMark from './BrandMark';

function Frame({ title, sub, children, dark }) {
  return (
    <div className={`overflow-hidden rounded-[18px] bg-sticker text-ink shadow-sticker ${dark ? 'ring-1 ring-field-ink/10' : ''}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-sm"><span className="flex items-center gap-2 font-medium"><BrandMark size={16} /> {title}</span><span className="text-subtle">{sub}</span></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const Bar = ({ w, label, value }) => (
  <div className="text-sm">
    <div className="mb-1.5 flex justify-between gap-3"><span className="text-muted">{label}</span><span className="num font-medium">{value}</span></div>
    <div className="h-1.5 rounded-full bg-sunken"><div className="h-1.5 rounded-full bg-thread" style={{ width: `${w}%` }} /></div>
  </div>
);
const Stat = ({ n, l, big }) => <div className="rounded-[12px] bg-sunken/80 p-3"><div className={`num font-display font-semibold ${big ? 'text-2xl' : 'text-xl'}`}>{n}</div><div className="mt-0.5 text-xs leading-snug text-subtle">{l}</div></div>;

export function OrganiserVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <div className="grid grid-cols-3 gap-2.5 text-center">{v.stats.map((s) => <Stat key={s.l} {...s} />)}</div>
      <div className="mt-4 space-y-3">{v.bars.map((b) => <Bar key={b.label} {...b} />)}</div>
    </Frame>
  );
}
export function ExhibitorVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <ul className="divide-y divide-line">{v.rows.map((r) => (
        <li key={r.company} className="flex items-center justify-between gap-3 py-2.5 text-sm"><div><div className="font-medium">{r.company}</div><div className="text-xs text-subtle">{r.line}</div></div><span className="chip whitespace-nowrap">{r.next}</span></li>
      ))}</ul>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-subtle"><span>{v.owner}</span><span className="flex items-center gap-1 text-thread-text">{v.crm} <ArrowRight size={12} className="rtl:rotate-180" aria-hidden="true" /></span></div>
    </Frame>
  );
}
export function SponsorVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <div className="grid grid-cols-2 gap-2.5">{v.stats.map((s) => <Stat key={s.l} {...s} big />)}</div>
      <div className="mt-4"><Bar w={v.bar.w} label={v.bar.label} value={v.bar.value} /></div>
      <p className="mt-3 text-xs text-subtle">{v.note}</p>
    </Frame>
  );
}
export function VisitorVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <ul className="space-y-2.5">{v.cards.map((c) => (
        <li key={c.line} className="rounded-[12px] bg-sunken/70 p-3 text-sm">
          <div className="flex items-start gap-2.5"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun text-sun-ink">{c.kind === 'mail' ? <Mail size={13} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}</span><div><div className="font-medium leading-snug">{c.line}</div><div className="text-xs text-subtle">{c.why}</div></div></div>
          <div className="mt-2.5 flex gap-2"><span className="btn btn-tonal btn-sm !min-h-8 !px-3 !text-xs">{c.yes}</span><span className="btn btn-quiet btn-sm !min-h-8 !px-3 !text-xs">{c.no}</span></div>
        </li>
      ))}</ul>
    </Frame>
  );
}
export default function Vignette({ kind, v }) {
  if (kind === 'organisers') return <OrganiserVignette v={v} />;
  if (kind === 'exhibitors') return <ExhibitorVignette v={v} />;
  if (kind === 'sponsors') return <SponsorVignette v={v} />;
  return <VisitorVignette v={v} />;
}
