'use client';
// One tracking door for the whole site. Events go to window.dataLayer (Google Tag Manager, Consent Mode v2).
// Nothing loads and nothing is stored until the visitor says yes in the footer (UAE PDPL / E36 spirit: no banner storm,
// one quiet sentence). Before consent, events still reach dataLayer in memory so a later yes loses nothing.
export const CONSENT_KEY = 'tnc.site.analytics'; // 'granted' | 'denied'

export const EVENTS = {
  page_view: 'page_view',
  cta_click: 'cta_click',               // { label, to, placement }
  persona_view: 'persona_view',         // { persona }
  story_beat: 'story_beat',             // { beat }
  pricing_tab: 'pricing_tab',           // { tab }
  plan_select: 'plan_select',           // { plan_id }
  order_start: 'order_start',           // { kind }
  order_step: 'order_step',             // { step }
  order_submit: 'order_submit',         // { kind, pay, total_aed }
  order_enquiry: 'order_enquiry',       // { kind }
  lang_switch: 'lang_switch',           // { to }
  consent: 'analytics_consent',         // { state }
};

export function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
export function setConsent(state) {
  try { localStorage.setItem(CONSENT_KEY, state); } catch { /* private window */ }
  push({ event: EVENTS.consent, state });
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: state === 'granted' ? 'granted' : 'denied' });
  }
  if (state === 'granted') loadGtm();
}
export function push(obj) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ts: Date.now(), ...obj });
}
export function track(event, props = {}) {
  push({ event, ...props, path: typeof location !== 'undefined' ? location.pathname : undefined });
}
export function utm() {
  if (typeof location === 'undefined') return {};
  const q = new URLSearchParams(location.search); const out = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) if (q.get(k)) out[k] = q.get(k);
  return out;
}
let gtmLoaded = false;
export function loadGtm() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id || gtmLoaded || typeof document === 'undefined') return;
  gtmLoaded = true;
  push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script'); s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
/** Consent Mode v2 defaults (denied) — set before any tag loads. Run once at boot. */
export function boot() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  const u = utm(); if (Object.keys(u).length) { push({ event: 'utm', ...u }); try { sessionStorage.setItem('tnc.site.utm', JSON.stringify(u)); } catch {} }
  if (getConsent() === 'granted') { window.gtag('consent', 'update', { analytics_storage: 'granted' }); loadGtm(); }
}
