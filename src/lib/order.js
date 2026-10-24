// Pure order logic (no React): totals come from the price list, never from the assistant's words.
import { PLANS } from "../content/plans.js";

export const PUBLIC_MAILBOXES = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'mail.com', 'ymail.com', 'msn.com', 'zoho.com'];
export const BANK_TRANSFER_FROM_AED = 20000;

export function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim()); }
export function isPublicMailbox(email) {
  const domain = String(email || '').toLowerCase().split('@')[1] || '';
  return PUBLIC_MAILBOXES.includes(domain);
}
export function validEmail(email) {
  if (!isEmail(email)) return 'email';
  if (isPublicMailbox(email)) return 'publicMailbox';
  return null;
}

export function emptyOrder(kind = 'exhibitor') {
  return { kind, event: '', seatsPro: 0, seatsBasic: 0, cards: 0, pkg: 'standard', tier: 'tier_gold', plan: 'plus', legalName: '', licence: '', emirate: '', website: '', name: '', email: '', policies: false };
}

/** Lines + total. A line with price null is "per order" (a person confirms) and does not enter the total. */
export function priceOrder(o, lang = 'en') {
  const lines = []; let total = 0; let perOrder = false;
  const n = (v) => Math.max(0, parseInt(v || 0, 10) || 0);
  if (o.kind === 'individual') {
    const plan = PLANS.member.find((p) => p.id === o.plan);
    if (plan && plan.prices.monthly > 0) { lines.push({ id: plan.id, name: plan.name[lang], qty: 1, unit: plan.prices.monthly, period: 'monthly' }); total += plan.prices.monthly; }
    if (o.plan === 'card_plus') { lines.push({ id: 'card_plus', name: PLANS.card.name[lang], qty: 1, unit: PLANS.card.prices.once, period: 'once' }); total += PLANS.card.prices.once; }
  }
  if (o.kind === 'exhibitor' || o.kind === 'company') {
    const pro = PLANS.company.find((p) => p.id === 'seat_pro'); const basic = PLANS.company.find((p) => p.id === 'seat_basic');
    if (n(o.seatsPro)) { lines.push({ id: 'seat_pro', name: pro.name[lang], qty: n(o.seatsPro), unit: pro.prices.per_seat }); if (pro.prices.per_seat == null) perOrder = true; else total += pro.prices.per_seat * n(o.seatsPro); }
    if (n(o.seatsBasic)) { lines.push({ id: 'seat_basic', name: basic.name[lang], qty: n(o.seatsBasic), unit: basic.prices.per_seat }); if (basic.prices.per_seat == null) perOrder = true; else total += basic.prices.per_seat * n(o.seatsBasic); }
    if (n(o.cards)) { lines.push({ id: 'stand_cards', name: lang === 'ar' ? 'بطاقات المنصة' : 'Stand cards', qty: n(o.cards), unit: null }); perOrder = true; }
    if (o.kind === 'company') { const cp = PLANS.company.find((p) => p.id === 'company_plan'); lines.push({ id: cp.id, name: cp.name[lang], qty: 1, unit: cp.prices.per_term }); perOrder = true; }
  }
  if (o.kind === 'organiser') { const p = PLANS.organiser.find((x) => x.id === o.pkg) || PLANS.organiser[1]; lines.push({ id: p.id, name: p.name[lang], qty: 1, unit: p.prices.per_event }); perOrder = true; }
  if (o.kind === 'sponsor') { const p = PLANS.sponsor.find((x) => x.id === o.tier) || PLANS.sponsor[1]; lines.push({ id: p.id, name: p.name[lang], qty: 1, unit: null }); perOrder = true; }
  return { lines, total, perOrder };
}

/** Which payment doors the review step shows. Organisers, sponsors and per-order items go to a person. */
export function paymentOptions(o, priced) {
  if (priced.perOrder || o.kind === 'organiser' || o.kind === 'sponsor') return ['enquiry'];
  const opts = ['card'];
  if (priced.total >= BANK_TRANSFER_FROM_AED) opts.push('bank');
  return opts;
}

export function validate(o) {
  const errs = {};
  const needCompany = o.kind !== 'individual';
  if (needCompany) {
    if (!o.legalName.trim()) errs.legalName = 'required';
    if (!o.licence.trim()) errs.licence = 'required';
    if (!o.emirate) errs.emirate = 'required';
  }
  if (!o.name.trim()) errs.name = 'required';
  const e = validEmail(o.email); if (e) errs.email = needCompany ? e : (isEmail(o.email) ? null : 'email');
  if (errs.email === null) delete errs.email;
  if (!o.policies) errs.policies = 'required';
  return errs;
}

/** The sales assistant's answer, from the price list only. */
export function recommend(o, answers) {
  const n = Math.max(1, parseInt(o.seatsPro || 0, 10) + parseInt(o.seatsBasic || 0, 10) || 1);
  if (o.kind === 'exhibitor') return answers.exhibitor.replace(/\{n\}/g, n);
  if (o.kind === 'company') return answers.company.replace(/\{n\}/g, n);
  if (o.kind === 'organiser') return answers.organiser.replace(/\{n\}/g, o.exhibitors || 50);
  if (o.kind === 'sponsor') return answers.sponsor.replace(/\{tier\}/g, o.tierName || 'Gold');
  return answers.individual;
}

export function reference(id) { return `TNC-${String(id).toUpperCase()}`; }
