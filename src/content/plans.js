// The published price list — the ONE source every price on this site reads (REQ-002 § 2; E17 § 1.3a).
// Shape mirrors GET /api/public/plans (`what_you_get` lines per plan). When the website is connected,
// src/lib/plans.js swaps this file for the live read; nothing else changes. Prices are starting values set by the
// founder (2026-10-14, D1/D2/D3); the Owner changes them on the admin Plans page, never here.
// A price of null means "priced per order by a person" — the site never invents a number (sales-agent rule).

export const CURRENCY = 'AED';

export const PLANS = {
  member: [
    {
      id: 'free', tier_rank: 0,
      name: { en: 'Free', ar: 'مجاني' },
      tagline: { en: 'Your card and the people you meet.', ar: 'بطاقتك ومن تقابلهم.' },
      prices: { monthly: 0 },
      what_you_get: {
        en: ['Your digital card and public page', 'Everyone you meet, saved with where and when', '30 voice notes a month', 'Next steps for 20 relationships', '30 AI credits a day to ask about your people', 'Reminders when a word would count'],
        ar: ['بطاقتك الرقمية وصفحتك العامة', 'كل من تقابله، محفوظ مع المكان والوقت', '30 ملاحظة صوتية في الشهر', 'الخطوات التالية لعشرين علاقة', '30 رصيدًا يوميًا لتسأل عن أشخاصك', 'تذكير حين تكون للكلمة قيمة'],
      },
      cta: 'join',
    },
    {
      id: 'plus', tier_rank: 1, featured: true,
      name: { en: 'Plus', ar: 'Plus' },
      tagline: { en: 'Your assistant, unlimited voice notes and reminders for every relationship.', ar: 'مساعدك، وملاحظات صوتية غير محدودة، وتذكيرات لكل علاقة.' },
      prices: { monthly: 39, yearly: 390 },
      what_you_get: {
        en: ['Everything in Free', 'Your assistant: it remembers, reminds and writes the first draft', 'Unlimited voice notes', 'Next steps for every relationship', '300 AI credits a day', '200 minutes of voice conversation a month', 'Two specialists to ask', 'Connect your own assistant (ChatGPT, Claude, Siri)'],
        ar: ['كل ما في المجاني', 'مساعدك: يتذكر ويذكّرك ويكتب المسودة الأولى', 'ملاحظات صوتية غير محدودة', 'الخطوات التالية لكل علاقة', '300 رصيد يوميًا', '200 دقيقة محادثة صوتية في الشهر', 'مختصّان تسألهما', 'اربط مساعدك الخاص (ChatGPT وClaude وSiri)'],
      },
      cta: 'join',
    },
    {
      id: 'pro', tier_rank: 2,
      name: { en: 'Pro', ar: 'Pro' },
      tagline: { en: 'Every specialist and unlimited questions about your network.', ar: 'كل المختصين وأسئلة غير محدودة عن شبكتك.' },
      prices: { monthly: 99 },
      what_you_get: {
        en: ['Everything in Plus', 'Every specialist: advisor, sales, outreach, writer, research, concierge', '1,500 AI credits a day, deeper answers', '600 minutes of voice conversation a month', 'Unlimited questions about your network', 'Two answers at once'],
        ar: ['كل ما في Plus', 'كل المختصين: المستشار والمبيعات والتواصل والكاتب والبحث والمساعد الشخصي', '1,500 رصيد يوميًا وإجابات أعمق', '600 دقيقة محادثة صوتية في الشهر', 'أسئلة غير محدودة عن شبكتك', 'إجابتان في الوقت نفسه'],
      },
      cta: 'join',
    },
  ],
  card: {
    id: 'card_plus',
    name: { en: 'The card', ar: 'البطاقة' },
    tagline: { en: 'A tap card with a year of Plus included.', ar: 'بطاقة لمس مع سنة من Plus.' },
    prices: { once: 149 },
    what_you_get: {
      en: ['One NFC card in our design, your photo, logo and words', 'A year of Plus', 'Your palette, light or dark', 'Delivered in the UAE'],
      ar: ['بطاقة NFC واحدة بتصميمنا، بصورتك وشعارك وكلماتك', 'سنة من Plus', 'لوحة ألوانك، فاتحة أو داكنة', 'التوصيل داخل الإمارات'],
    },
  },
  packs: [
    { id: 'credit_pack_s', name: { en: '1,000 AI credits', ar: '1,000 رصيد' }, prices: { once: 19 } },
    { id: 'credit_pack_l', name: { en: '5,000 AI credits', ar: '5,000 رصيد' }, prices: { once: 79 } },
    { id: 'voice_topup', name: { en: '100 voice minutes', ar: '100 دقيقة صوتية' }, prices: { once: 9 } },
  ],
  // Companies, organisers and sponsors: what each package holds is published; the price is confirmed per order
  // by a person within a working day (invoiced by TapNConnect, card or bank transfer).
  company: [
    {
      id: 'seat_basic',
      name: { en: 'Basic seat', ar: 'مقعد أساسي' },
      unit: { en: 'per person', ar: 'لكل شخص' },
      prices: { per_seat: null },
      what_you_get: {
        en: ['A work account for one person on your team', 'Every visitor they meet, saved to your company', 'Accounts, not scan lists: one page per company you met', 'The recap after the event', '200 AI credits a day'],
        ar: ['حساب عمل لشخص واحد في فريقك', 'كل زائر يقابله، محفوظ لشركتك', 'حسابات لا قوائم مسح: صفحة لكل شركة قابلتها', 'الملخص بعد الفعالية', '200 رصيد يوميًا'],
      },
    },
    {
      id: 'seat_pro', featured: true,
      name: { en: 'Pro seat', ar: 'مقعد Pro' },
      unit: { en: 'per person', ar: 'لكل شخص' },
      prices: { per_seat: null },
      what_you_get: {
        en: ['Everything in Basic', 'The sales specialist: drafts the follow-up for each account', 'Who on your team knows this company best', 'One click to your CRM', 'Your company documents in the answers', 'Results by salesperson and across events', '1,000 AI credits a day'],
        ar: ['كل ما في الأساسي', 'مختص المبيعات: يكتب المتابعة لكل حساب', 'من في فريقك يعرف هذه الشركة أكثر', 'نقرة واحدة إلى نظام CRM', 'مستندات شركتك ضمن الإجابات', 'النتائج لكل بائع وعبر الفعاليات', '1,000 رصيد يوميًا'],
      },
    },
    {
      id: 'company_plan',
      name: { en: 'Everyday company plan', ar: 'خطة الشركة اليومية' },
      unit: { en: '12-month term', ar: 'مدة 12 شهرًا' },
      prices: { per_term: null },
      what_you_get: {
        en: ['Seats and cards for your team, with or without an event', 'A shared pool of AI credits every month', 'Every relationship stays with the company when a person leaves', 'Results, CRM hand-over and documents', 'Priced by seats and cards'],
        ar: ['مقاعد وبطاقات لفريقك، مع فعالية أو من دونها', 'رصيد مشترك كل شهر', 'كل علاقة تبقى مع الشركة حين يغادر شخص', 'النتائج وتسليم CRM والمستندات', 'التسعير حسب المقاعد والبطاقات'],
      },
    },
  ],
  organiser: [
    { id: 'pilot', name: { en: 'Pilot', ar: 'تجريبي' }, line: { en: 'One hall, one edition: the relationship report and 300 AI credits a day per seat.', ar: 'قاعة واحدة ونسخة واحدة: تقرير العلاقات و300 رصيد يوميًا لكل مقعد.' }, prices: { per_event: null } },
    { id: 'standard', name: { en: 'Standard', ar: 'قياسي' }, line: { en: 'The whole show: every exhibitor seated, the report, sponsor reach, 1,000 credits a day per seat.', ar: 'المعرض كله: كل عارض بمقعد، والتقرير، ووصول الرعاة، و1,000 رصيد يوميًا لكل مقعد.' }, prices: { per_event: null }, featured: true },
    { id: 'portfolio', name: { en: 'Portfolio', ar: 'محفظة' }, line: { en: 'Several editions and shows, compared, 3,000 credits a day per seat.', ar: 'عدة نسخ ومعارض، مقارنة، و3,000 رصيد يوميًا لكل مقعد.' }, prices: { per_event: null } },
  ],
  sponsor: [
    { id: 'tier_platinum', name: { en: 'Platinum', ar: 'بلاتيني' } },
    { id: 'tier_gold', name: { en: 'Gold', ar: 'ذهبي' } },
    { id: 'tier_silver', name: { en: 'Silver', ar: 'فضي' } },
    { id: 'tier_bronze', name: { en: 'Bronze', ar: 'برونزي' } },
  ],
};

export function fmtAED(n, lang = 'en') {
  if (n === null || n === undefined) return null;
  const s = new Intl.NumberFormat('en-US').format(n); // Latin digits in both languages (plain-words rule)
  return lang === 'ar' ? `${s} درهم` : `AED ${s}`;
}

/** Everything a customer can put in an order, with the price the site may quote. */
export function orderable(lang = 'en') {
  const t = (o) => (typeof o === 'object' && o !== null && 'en' in o ? o[lang] : o);
  return {
    individual: [
      ...PLANS.member.filter((p) => p.prices.monthly > 0).map((p) => ({ id: p.id, name: t(p.name), price: p.prices.monthly, period: 'monthly' })),
      { id: PLANS.card.id, name: t(PLANS.card.name), price: PLANS.card.prices.once, period: 'once' },
    ],
    company: PLANS.company.map((p) => ({ id: p.id, name: t(p.name), price: null })),
    organiser: PLANS.organiser.map((p) => ({ id: p.id, name: t(p.name), price: null })),
    sponsor: PLANS.sponsor.map((p) => ({ id: p.id, name: t(p.name), price: null })),
  };
}
