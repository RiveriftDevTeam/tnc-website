// Small, honest pictures of the product for each buyer, drawn in HTML on the product's own tokens (sample figures).
import { Check, Mail, ArrowRight } from 'lucide-react';
import BrandMark from './BrandMark';

function Frame({ title, sub, children, dark }) {
  return (
    <div className={`glass glass-strong overflow-hidden p-0 ${dark ? 'text-splash-ink' : ''}`} style={dark ? { background: 'rgba(19,32,32,.85)', borderColor: 'rgba(238,243,240,.1)' } : undefined}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm"><span className="flex items-center gap-2 font-medium"><BrandMark size={16} /> {title}</span><span className="text-subtle">{sub}</span></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const Bar = ({ w, label, value }) => (
  <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm"><div><div className="mb-1 flex justify-between"><span className="text-muted">{label}</span><span className="num font-medium">{value}</span></div><div className="h-2 rounded-full bg-sunken"><div className="h-2 rounded-full bg-accent" style={{ width: `${w}%` }} /></div></div></div>
);

export function OrganiserVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <div className="grid grid-cols-3 gap-3 text-center">{v.stats.map((s) => <div key={s.l} className="rounded-card bg-sunken/70 p-3"><div className="num text-xl font-medium text-accent">{s.n}</div><div className="mt-0.5 text-xs text-subtle">{s.l}</div></div>)}</div>
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
      <div className="mt-3 flex items-center justify-between text-xs text-subtle"><span>{v.owner}</span><span className="flex items-center gap-1 text-accent">{v.crm} <ArrowRight size={12} className="rtl:rotate-180" aria-hidden="true" /></span></div>
    </Frame>
  );
}
export function SponsorVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <div className="grid grid-cols-2 gap-3">{v.stats.map((s) => <div key={s.l} className="rounded-card bg-sunken/70 p-3"><div className="num text-2xl font-medium">{s.n}</div><div className="text-xs text-subtle">{s.l}</div></div>)}</div>
      <div className="mt-4"><Bar w={v.bar.w} label={v.bar.label} value={v.bar.value} /></div>
      <p className="mt-3 text-xs text-subtle">{v.note}</p>
    </Frame>
  );
}
export function VisitorVignette({ v }) {
  return (
    <Frame title={v.title} sub={v.sub}>
      <ul className="space-y-2.5">{v.cards.map((c) => (
        <li key={c.line} className="rounded-card border border-line bg-surface/70 p-3 text-sm">
          <div className="flex items-start gap-2.5"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">{c.kind === 'mail' ? <Mail size={13} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}</span><div><div className="font-medium leading-snug">{c.line}</div><div className="text-xs text-subtle">{c.why}</div></div></div>
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
