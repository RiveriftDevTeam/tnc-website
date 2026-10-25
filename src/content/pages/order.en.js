// order page copy (English). Merged into the dictionary by src/content/index.js.
const page_order_en = {
  // ---------- Order ----------
  order: {
    title: 'Order TapNConnect for your company',
    description: 'Pick a package, tell us about your company, pay by card or bank transfer. Your plan is usually live within a working day; small card-paid orders in minutes.',
    hero: { h1: 'Order TapNConnect for your company.', sub: 'Pick a package, tell us about your company, pay. Your plan is usually live within a working day; small card-paid orders in minutes.' },
    agent: {
      name: 'Sales assistant', hint: 'Answers only from the price list. For anything else, a person.',
      q1: 'Who are you ordering for?', kinds: { exhibitor: 'An exhibitor', company: 'An everyday company', organiser: 'An organiser', sponsor: 'A sponsor', individual: 'Myself' },
      q2: 'Which event, if any?', noEvent: 'No event', eventPlaceholder: 'Type the event name',
      q3: 'How many people need seats?', q3sponsor: 'Which tier are you thinking of?', q3org: 'Roughly how many exhibitors?', q3ind: 'Which plan?',
      skip: 'Skip to the order form', typed: 'Or type anything about your order',
      answers: {
        exhibitor: 'For {n} people on the stand I’d suggest {n} Pro seats so each account gets a drafted follow-up and your CRM hand-over, plus stand cards for the counter. Basic seats fit colleagues who only capture. The seat price is confirmed by a person within a working day.',
        company: 'For {n} people without an event, the everyday company plan fits: seats and cards for the team and a shared monthly AI pool on a 12-month term. The price is confirmed by a person within a working day.',
        organiser: 'For about {n} exhibitors the Standard package fits: every exhibitor seated, the relationship report, sponsor reach, 1,000 AI credits a day per seat. Pilot is one hall; Portfolio compares editions. Organiser orders are always confirmed by a person.',
        sponsor: 'A {tier} tier decides placement, logo size and your share of banner views at the event, with two starter cards for 90 days after. The list price is confirmed by a person within a working day.',
        individual: 'Plus is AED 39 a month or AED 390 a year; Pro is AED 99 a month; the card is AED 149 with a year of Plus. You can also buy these inside the app.',
        unknown: 'I can’t promise that; a person can. Shall I pass this on?', passOn: 'Yes, pass it on', noThanks: 'No, continue',
      },
    },
    form: {
      h2: 'Your order', edit: 'Every field is editable.',
      kind: 'Ordering as', event: 'Event (optional)', seatsPro: 'Pro seats', seatsBasic: 'Basic seats', cards: 'Stand cards', package: 'Package', tier: 'Tier', plan: 'Plan',
      company: 'Company', legalName: 'Legal name as on the trade licence', licence: 'Trade licence number', emirate: 'Emirate', licenceFile: 'Licence document (PDF or photo)', website: 'Website',
      admin: 'The admin', name: 'Your name', email: 'Work e-mail', emailNote: 'Public mailboxes are refused: use your company e-mail. We send a code before payment.',
      policies: 'I accept the terms, the privacy notice and the data processing terms.', policiesLink: 'Read them',
      review: 'Review the order', back: 'Back', total: 'Total', totalNote: 'Computed from the price list. Items marked “per order” are confirmed by a person before you pay.',
      perOrder: 'per order',
      emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    },
    review: {
      h2: 'Check before you pay', payCard: 'Pay by card', payBank: 'Pay by bank transfer', sendEnquiry: 'Send the order for a quote',
      bankNote: 'Offered for orders of AED 20,000 and above, and for organisers and sponsors. Your order is reserved for 7 working days.',
      quoteNote: 'A person prices this order and writes to you within one working day. Nothing is charged now.',
    },
    done: {
      h2: 'Order received — {ref}', p: 'We are checking it now. You will hear from us by e-mail at {email} within one working day; card-paid orders are usually live within minutes.',
      bank: 'Bank details are in the e-mail. Reference {ref}. Your order is reserved for 7 working days.',
      next: 'Three things to do first once your plan is live: invite your team, make your cards, pick your events.',
      home: 'Back to the start',
    },
    person: { h2: 'Talk to a person', p: 'A custom deal, a multi-event contract, an invoice first, or a question the assistant can’t answer: write to us and a person replies within one working day.', write: 'Write to us', email: 'E-mail' },
    errors: { required: 'Needed', email: 'Use your company e-mail address', publicMailbox: 'Public mailboxes are refused: use your company e-mail', send: 'Couldn’t send the order. Write to {email} with your details and we take it from there.' },
  },
};
export default page_order_en;
