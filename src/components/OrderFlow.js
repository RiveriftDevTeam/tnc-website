'use client';
// The Order page (ai-operations-agents § 9.1, REQ-002): a calm scripted conversation that only reads the price list,
// a pre-filled form the prospect can edit, a review, then card / bank transfer / a person. Totals come from code.
import { useEffect, useMemo, useState } from 'react';
import useReducedMotion from '@/lib/useReducedMotion';
import { Check, ArrowRight, Mail } from 'lucide-react';
import BrandMark from './BrandMark';
import Sticker from './Sticker';
import { Knot } from './Thread';
import { fill } from '@/content/fill';
import { PLANS, fmtAED } from '@/content/plans';
import { BACKEND_URL, LEGAL_URL, SALES_EMAIL } from '@/content/site';
import { emptyOrder, priceOrder, paymentOptions, validate, recommend, reference } from '@/lib/order';
import { track, EVENTS } from '@/lib/analytics';

const KINDS = ['exhibitor', 'company', 'organiser', 'sponsor', 'individual'];
const SALES_PATH = process.env.NEXT_PUBLIC_SALES_PATH || '/api/public/sales';
const ORDER_PATH = process.env.NEXT_PUBLIC_ORDER_PATH || '/api/public/order';
const UNKNOWN = /discount|%|off|integrat|invoice|delivery|refund|custom|contract|free trial|deal|خصم|تكامل|فاتورة|توصيل|عقد|تجربة/i;

function Field({ label, children, error, note }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>{children}{note && <span className="mt-1 block text-xs text-subtle">{note}</span>}{error && <span className="mt-1 block text-sm text-critical">{error}</span>}</label>;
}
const input = 'w-full rounded-control border border-line bg-ground px-3.5 py-2.5 text-[1rem] outline-none placeholder:text-subtle focus:border-thread focus-visible:ring-2 focus-visible:ring-thread/40';

export default function OrderFlow({ lang, o, orderWord }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);          // 0 talk · 1 form · 2 review · 3 done
  const [turn, setTurn] = useState(0);          // conversation turn
  const [order, setOrder] = useState(emptyOrder('exhibitor'));
  const [extra, setExtra] = useState({ exhibitors: 50, tierName: '' });
  const [typed, setTyped] = useState('');
  const [unknown, setUnknown] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState('');
  const [done, setDone] = useState(null);
  const [reply, setReply] = useState(null);           // the backend Sales agent's answer, when the route is on
  const [session, setSession] = useState(null);
  const set = (k, v) => setOrder((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const kind = q.get('kind'); const patch = {};
    if (kind && KINDS.includes(kind)) patch.kind = kind;
    if (q.get('plan')) patch.plan = q.get('plan');
    if (q.get('pkg')) patch.pkg = q.get('pkg');
    if (q.get('tier')) patch.tier = q.get('tier');
    if (q.get('seat') === 'seat_basic') patch.seatsBasic = 1; if (q.get('seat') === 'seat_pro') patch.seatsPro = 1;
    if (Object.keys(patch).length) { setOrder((s) => ({ ...s, ...patch })); setTurn(kind ? (kind === 'individual' ? 2 : 1) : 0); }
    track(EVENTS.order_start, { kind: patch.kind || 'none' });
  }, []);

  const priced = useMemo(() => priceOrder(order, lang), [order, lang]);
  const pay = useMemo(() => paymentOptions(order, priced), [order, priced]);
  const tierName = PLANS.sponsor.find((x) => x.id === order.tier)?.name[lang] || '';
  const answer = reply ? reply.text : recommend({ ...order, exhibitors: extra.exhibitors, tierName }, o.agent.answers);
  const go = (s) => { setStep(s); track(EVENTS.order_step, { step: s }); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };

  const scripted = (text) => {
    const n = parseInt((text.match(/\d+/) || [])[0], 10);
    if (UNKNOWN.test(text)) { setUnknown(text); return; }
    if (n) { if (order.kind === 'organiser') setExtra((x) => ({ ...x, exhibitors: n })); else set('seatsPro', n); }
    setTurn(3);
  };
  const onTyped = async (e) => {
    e.preventDefault(); const text = typed.trim(); if (!text) return; setTyped('');
    // E47 O7: POST /api/public/sales { session_id?, turnstile_token, text | chip } -> { session_id, reply, chips[], prefill?, handoff? }.
    // 404 until SALES_AGENT_ENABLED=true on the backend; then the scripted line below answers instead.
    try {
      const r = await fetch(`${BACKEND_URL}${SALES_PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ session_id: session || undefined, turnstile_token: window.__tncTurnstile || '', text, lang }) });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      if (j.session_id) setSession(j.session_id);
      if (j.prefill && typeof j.prefill === 'object') setOrder((o) => ({ ...o, ...j.prefill }));
      setReply({ text: j.reply, chips: Array.isArray(j.chips) ? j.chips : [], handoff: j.handoff || null }); setTurn(3);
      return;
    } catch { /* route off or unreachable: the scripted assistant answers */ }
    scripted(text);
  };
  const submit = async (mode) => {
    const errs = validate(order); setErrors(errs); if (Object.keys(errs).length) { go(1); return; }
    setBusy(true); setSendError('');
    const payload = { lang, mode, order: { ...order, exhibitors: extra.exhibitors }, lines: priced.lines, total_aed: priced.total, utm: (() => { try { return JSON.parse(sessionStorage.getItem('tnc.site.utm') || '{}'); } catch { return {}; } })() };
    try {
      const r = await fetch(`${BACKEND_URL}${ORDER_PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      track(mode === 'enquiry' ? EVENTS.order_enquiry : EVENTS.order_submit, { kind: order.kind, pay: mode, total_aed: priced.total });
      if (j.checkout_url) { location.assign(j.checkout_url); return; }
      setDone({ ref: j.reference || reference(j.order_id || Date.now().toString(36)), mode }); go(3);
    } catch {
      setSendError(fill(o.errors.send, { email: SALES_EMAIL }));
    } finally { setBusy(false); }
  };
  const M = ({ children, k }) => <div key={k} className="arrive">{children}</div>;
  const Chips = ({ items, value, onPick }) => <div className="mt-3 flex flex-wrap gap-2">{items.map((it) => <button key={it.v} type="button" onClick={() => onPick(it.v)} aria-pressed={value === it.v} className={`btn btn-sm btn-tonal ${value === it.v ? 'ring-2 ring-thread' : ''}`}>{it.l}</button>)}</div>;

  const needCompany = order.kind !== 'individual';
  const err = (k) => (errors[k] ? o.errors[errors[k]] || o.errors.required : null);

  /* ---------- step 0: the conversation ---------- */
  const talk = (
    <div className="rounded-sheet bg-surface p-5 shadow-glass sm:p-7" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-subtle"><span className="flex items-center gap-2 font-medium text-muted"><BrandMark size={20} /> {o.agent.name}</span><span>{o.agent.hint}</span></div>
      <div>
        {turn === 0 && <M k="q1"><Sticker note={o.agent.q1} tilt={1} tape className="mt-6 max-w-[34ch]" /><Chips items={KINDS.map((k) => ({ v: k, l: o.agent.kinds[k] }))} value={order.kind} onPick={(v) => { set('kind', v); setTurn(v === 'individual' ? 2 : 1); }} /></M>}
        {turn === 1 && <M k="q2"><Sticker note={o.agent.q2} tilt={2} tape className="mt-6 max-w-[34ch]" /><div className="mt-3 flex flex-wrap gap-2"><input className={`${input} max-w-xs`} placeholder={o.agent.eventPlaceholder} value={order.event} onChange={(e) => set('event', e.target.value)} /><button type="button" className="btn btn-tonal btn-sm" onClick={() => setTurn(2)}>{order.event ? <><Check size={16} aria-hidden="true" /> {order.event}</> : o.agent.noEvent}</button></div></M>}
        {turn === 2 && <M k="q3">
          {order.kind === 'sponsor' ? <><Sticker note={o.agent.q3sponsor} tilt={3} tape className="mt-6 max-w-[34ch]" /><Chips items={PLANS.sponsor.map((x) => ({ v: x.id, l: x.name[lang] }))} value={order.tier} onPick={(v) => { set('tier', v); setTurn(3); }} /></>
          : order.kind === 'organiser' ? <><Sticker note={o.agent.q3org} tilt={3} tape className="mt-6 max-w-[34ch]" /><Chips items={[10, 50, 150, 400].map((n) => ({ v: n, l: String(n) }))} value={extra.exhibitors} onPick={(v) => { setExtra((x) => ({ ...x, exhibitors: v })); set('pkg', v <= 10 ? 'pilot' : v >= 400 ? 'portfolio' : 'standard'); setTurn(3); }} /></>
          : order.kind === 'individual' ? <><Sticker note={o.agent.q3ind} tilt={3} tape className="mt-6 max-w-[34ch]" /><Chips items={[...PLANS.member.filter((p) => p.prices.monthly > 0).map((p) => ({ v: p.id, l: p.name[lang] })), { v: 'card_plus', l: PLANS.card.name[lang] }]} value={order.plan} onPick={(v) => { set('plan', v); setTurn(3); }} /></>
          : <><Sticker note={o.agent.q3} tilt={3} tape className="mt-6 max-w-[34ch]" /><Chips items={[2, 4, 6, 12].map((n) => ({ v: n, l: String(n) }))} value={order.seatsPro} onPick={(v) => { set('seatsPro', v); if (order.kind === 'exhibitor') set('cards', 2); setTurn(3); }} /></>}
        </M>}
        {turn === 3 && <M k="a"><Sticker tilt={2} tape className="mt-6 max-w-[62ch]"><div className="flex gap-3"><BrandMark size={24} className="mt-1 shrink-0" /><p className="text-[1.05rem] leading-relaxed">{answer}</p></div></Sticker>
          {reply && reply.chips.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{reply.chips.map((c) => <button key={c} type="button" className="btn btn-tonal btn-sm" onClick={() => { setTyped(c); }}>{c}</button>)}</div>}
          {reply && reply.handoff && <p className="mt-4 text-sm text-subtle">{o.agent.answers.unknown.split('.')[0]}. {reply.handoff.enquiry_ref || ''}</p>}
          <div className="mt-6 flex flex-wrap gap-2"><button type="button" className="btn btn-primary" onClick={() => go(1)}>{o.form.review} <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" /></button><button type="button" className="btn btn-quiet" onClick={() => setTurn(0)}>{o.form.back}</button></div></M>}
      </div>
      {unknown && <div className="mt-6 rounded-sticker bg-sunken p-4"><p>{o.agent.answers.unknown}</p><div className="mt-3 flex gap-2"><button type="button" className="btn btn-tonal btn-sm" onClick={() => { setUnknown(null); setTurn(3); document.getElementById('person')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }}>{o.agent.answers.passOn}</button><button type="button" className="btn btn-quiet btn-sm" onClick={() => setUnknown(null)}>{o.agent.answers.noThanks}</button></div></div>}
      <form onSubmit={onTyped} className="mt-7 flex gap-2 border-t border-dashed border-line pt-5"><input className={input} placeholder={o.agent.typed} value={typed} onChange={(e) => setTyped(e.target.value)} aria-label={o.agent.typed} /><button type="submit" className="btn btn-tonal btn-sm">{orderWord}</button></form>
      <div className="mt-3 text-end"><button type="button" className="link text-sm" onClick={() => go(1)}>{o.agent.skip}</button></div>
    </div>
  );

  /* ---------- step 1: the form ---------- */
  const form = (
    <form className="rounded-sheet bg-surface p-5 shadow-glass sm:p-8" onSubmit={(e) => { e.preventDefault(); const errs = validate(order); setErrors(errs); if (!Object.keys(errs).length) go(2); }} noValidate>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4"><h2 className="t-h2">{o.form.h2}</h2><span className="hand text-muted">{o.form.edit}</span></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={o.form.kind}><select className={input} value={order.kind} onChange={(e) => set('kind', e.target.value)}>{KINDS.map((k) => <option key={k} value={k}>{o.agent.kinds[k]}</option>)}</select></Field>
        {order.kind !== 'individual' && order.kind !== 'company' && <Field label={o.form.event}><input className={input} value={order.event} onChange={(e) => set('event', e.target.value)} /></Field>}
        {(order.kind === 'exhibitor' || order.kind === 'company') && <>
          <Field label={o.form.seatsPro}><input className={`${input} num`} type="number" min="0" inputMode="numeric" value={order.seatsPro} onChange={(e) => set('seatsPro', e.target.value)} /></Field>
          <Field label={o.form.seatsBasic}><input className={`${input} num`} type="number" min="0" inputMode="numeric" value={order.seatsBasic} onChange={(e) => set('seatsBasic', e.target.value)} /></Field>
          <Field label={o.form.cards}><input className={`${input} num`} type="number" min="0" inputMode="numeric" value={order.cards} onChange={(e) => set('cards', e.target.value)} /></Field>
        </>}
        {order.kind === 'organiser' && <Field label={o.form.package}><select className={input} value={order.pkg} onChange={(e) => set('pkg', e.target.value)}>{PLANS.organiser.map((p) => <option key={p.id} value={p.id}>{p.name[lang]}</option>)}</select></Field>}
        {order.kind === 'sponsor' && <Field label={o.form.tier}><select className={input} value={order.tier} onChange={(e) => set('tier', e.target.value)}>{PLANS.sponsor.map((p) => <option key={p.id} value={p.id}>{p.name[lang]}</option>)}</select></Field>}
        {order.kind === 'individual' && <Field label={o.form.plan}><select className={input} value={order.plan} onChange={(e) => set('plan', e.target.value)}>{PLANS.member.filter((p) => p.prices.monthly > 0).map((p) => <option key={p.id} value={p.id}>{p.name[lang]}</option>)}<option value="card_plus">{PLANS.card.name[lang]}</option></select></Field>}
      </div>
      {needCompany && <><h3 className="t-h3 mt-10 border-t border-dashed border-line pt-6">{o.form.company}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={o.form.legalName} error={err('legalName')}><input className={input} value={order.legalName} onChange={(e) => set('legalName', e.target.value)} autoComplete="organization" /></Field>
          <Field label={o.form.licence} error={err('licence')}><input className={input} value={order.licence} onChange={(e) => set('licence', e.target.value)} /></Field>
          <Field label={o.form.emirate} error={err('emirate')}><select className={input} value={order.emirate} onChange={(e) => set('emirate', e.target.value)}><option value="">—</option>{o.form.emirates.map((em) => <option key={em} value={em}>{em}</option>)}</select></Field>
          <Field label={o.form.website}><input className={input} type="url" inputMode="url" value={order.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" /></Field>
          <Field label={o.form.licenceFile}><input className={`${input} file:me-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent`} type="file" accept="application/pdf,image/*" /></Field>
        </div></>}
      <h3 className="t-h3 mt-10 border-t border-dashed border-line pt-6">{o.form.admin}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label={o.form.name} error={err('name')}><input className={input} value={order.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></Field>
        <Field label={o.form.email} error={err('email')} note={needCompany ? o.form.emailNote : null}><input className={input} type="email" inputMode="email" value={order.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></Field>
      </div>
      <label className="mt-6 flex items-start gap-3 text-[.95rem]"><input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--tnc-site-thread-strong)]" checked={order.policies} onChange={(e) => set('policies', e.target.checked)} /><span>{o.form.policies} <a className="link" href={`${LEGAL_URL}/${lang}`} target="_blank" rel="noreferrer">{o.form.policiesLink}</a>{err('policies') && <span className="block text-sm text-critical">{err('policies')}</span>}</span></label>
      <Total priced={priced} lang={lang} o={o} />
      <div className="mt-6 flex flex-wrap gap-2"><button type="submit" className="btn btn-primary">{o.form.review}</button><button type="button" className="btn btn-quiet" onClick={() => go(0)}>{o.form.back}</button></div>
    </form>
  );

  /* ---------- step 2: review ---------- */
  const review = (
    <div className="rounded-sheet bg-surface p-5 shadow-glass sm:p-8">
      <h2 className="t-h2">{o.review.h2}</h2>
      <dl className="mt-5 grid gap-x-6 gap-y-2 text-[.95rem] sm:grid-cols-2">
        {[[o.form.kind, o.agent.kinds[order.kind]], order.event && [o.form.event, order.event], needCompany && [o.form.legalName, order.legalName], needCompany && [o.form.licence, `${order.licence} · ${order.emirate}`], [o.form.name, order.name], [o.form.email, order.email]].filter(Boolean).map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-dashed border-line py-2"><dt className="text-subtle">{k}</dt><dd className="text-end">{v}</dd></div>)}
      </dl>
      <Total priced={priced} lang={lang} o={o} />
      {sendError && <p className="mt-4 rounded-card bg-sunken p-3 text-sm text-critical">{sendError}</p>}
      <div className="mt-6 flex flex-wrap gap-2">
        {pay.includes('card') && <button type="button" disabled={busy} className="btn btn-primary" onClick={() => submit('card')}>{o.review.payCard}</button>}
        {pay.includes('bank') && <button type="button" disabled={busy} className="btn btn-tonal" onClick={() => submit('bank')}>{o.review.payBank}</button>}
        {pay.includes('enquiry') && <button type="button" disabled={busy} className="btn btn-primary" onClick={() => submit('enquiry')}>{o.review.sendEnquiry}</button>}
        <button type="button" className="btn btn-quiet" onClick={() => go(1)}>{o.form.back}</button>
      </div>
      <p className="mt-3 text-sm text-subtle">{pay.includes('enquiry') ? o.review.quoteNote : o.review.bankNote}</p>
    </div>
  );

  const finished = done && (
    <div className="sticker-tape relative rounded-sheet bg-surface p-6 text-center shadow-glass sm:p-10">
      <Knot size={40} className="mx-auto text-thread" />
      <h2 className="t-h2 mt-5">{fill(o.done.h2, { ref: done.ref })}</h2>
      <p className="mt-3 text-muted">{fill(o.done.p, { email: order.email })}</p>
      {done.mode === 'bank' && <p className="mt-2 text-muted">{fill(o.done.bank, { ref: done.ref })}</p>}
      <p className="mt-4 text-sm text-subtle">{o.done.next}</p>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <ol className="relative mb-8 grid grid-cols-3" aria-label="Steps">
          <span className="absolute inset-x-[16.667%] top-[9px] h-0.5 rounded bg-line" aria-hidden="true" />
          <span className="absolute start-[16.667%] top-[9px] h-0.5 rounded bg-thread transition-[width] duration-base ease-out" style={{ width: `${Math.min(step, 2) * 33.333}%` }} aria-hidden="true" />
          {[o.agent.name, o.form.h2, o.review.h2].map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className={`relative flex flex-col items-center gap-2 px-1 text-center text-xs sm:text-sm ${i === step ? 'font-medium text-ink' : 'text-subtle'}`}><Knot size={20} className={`transition-transform duration-quick ease-pop ${i <= step ? 'text-thread' : 'text-faded'} ${i === step ? 'scale-125' : ''}`} />{s}</li>)}
        </ol>
        {step === 0 && talk}{step === 1 && form}{step === 2 && review}{step === 3 && finished}
      </div>
      <Sticker as="aside" id="person" tilt={3} tape className="self-start scroll-mt-24 p-5 lg:sticky lg:top-24">
        <h2 className="t-h3 mt-1">{o.person.h2}</h2><p className="mt-2 text-[.95rem] text-muted">{o.person.p}</p>
        <a className="btn btn-tonal mt-4 w-full" href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent('TapNConnect — ' + (o.agent.kinds[order.kind] || ''))}`} onClick={() => track(EVENTS.cta_click, { label: 'talk_to_person', placement: 'order' })}><Mail size={18} aria-hidden="true" /> {o.person.write}</a>
        <div className="mt-2 text-center text-sm text-subtle">{SALES_EMAIL}</div>
      </Sticker>
    </div>
  );
}

function Total({ priced, lang, o }) {
  return (
    <div className="mt-8 rounded-card bg-sunken p-4 sm:p-5">
      <ul className="space-y-1.5 text-[.95rem]">{priced.lines.map((l) => <li key={l.id} className="flex justify-between gap-3"><span>{l.qty > 1 ? <span className="num">{l.qty} × </span> : null}{l.name}</span><span className="num text-muted">{l.unit == null ? o.form.perOrder : fmtAED(l.unit * l.qty, lang)}</span></li>)}</ul>
      <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 font-display text-lg font-semibold"><span>{o.form.total}</span><span className="num" data-testid="order-total">{priced.total ? fmtAED(priced.total, lang) : (priced.perOrder ? o.form.perOrder : fmtAED(0, lang))}</span></div>
      <p className="mt-2 text-xs text-subtle">{o.form.totalNote}</p>
    </div>
  );
}
