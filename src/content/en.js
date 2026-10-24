// English copy. Voice: a colleague talking (docs/knowledge/plain-words.md); short, evidence first, one ask.
const en = {
  lang: 'en', dir: 'ltr',
  brand: 'TapNConnect',
  meta: {
    siteName: 'TapNConnect',
    tagline: 'Stay close to the people you meet.',
    description: 'TapNConnect is your AI assistant for the people in your life, at work and at home. Tap a card, keep what matters, get a draft when a word would count. Built in the UAE for events, exhibitors, companies and the people who meet them.',
  },
  nav: {
    how: 'How it works', who: 'Who it is for', pricing: 'Pricing', trust: 'Privacy', order: 'Order',
    signIn: 'Sign in', startFree: 'Start free', menu: 'Menu', close: 'Close', language: 'العربية', langLabel: 'Switch to Arabic',
    personas: { organisers: 'Event organisers', exhibitors: 'Exhibitors', sponsors: 'Sponsors', companies: 'Companies', individuals: 'Individuals' },
    skip: 'Skip to content',
  },
  footer: {
    line: 'The human layer of the agent internet. Made in Dubai.',
    product: 'Product', buyers: 'Who it is for', company: 'Company',
    legal: 'Privacy, terms and cookies', signIn: 'Member sign in', portal: 'Company portal', contact: 'Write to us',
    analytics: 'Help us improve the site with anonymous usage figures?', allow: 'Allow', notNow: 'Not now', thanks: 'Thank you. You can change this in the footer any time.', off: 'Usage figures are off.',
    copyright: '© {year} TapNConnect. Riverift FZ-LLC, Dubai, UAE.',
  },
  cta: {
    startFree: 'Start free', orderCompany: 'Order for your company', seePricing: 'See pricing', talkToPerson: 'Talk to a person',
    howItWorks: 'See how it works', getCard: 'Get the card', order: 'Order', askQuote: 'Ask for a quote', readMore: 'Read more',
  },

  // ---------- Home ----------
  home: {
    title: 'TapNConnect — Stay close to the people you meet',
    description: 'Your AI assistant for the people in your life, at work and at home. It keeps what matters to each of them, tells you when a word would count, and writes the first draft. Nothing is sent without your yes.',
    hero: {
      eyebrow: 'Your relationship assistant',
      h1: 'Stay close to the people you meet.',
      sub: 'Your AI assistant for the people in your life, at work and at home. It keeps what matters to each of them, tells you when a word would count, and writes the first draft. Nothing is sent without your yes.',
      primary: 'Start free', secondary: 'Order for your company',
      note: 'Free for the people you meet. Plans in AED for companies and events.',
      sceneLabel: 'A circle of people around you, growing over a year.',
    },
    problem: {
      eyebrow: 'Why',
      h2: 'You meet hundreds of people a year. Your phone keeps a number.',
      p: 'The conversation, the promise, the thing they care about: lost between a lanyard, a WhatsApp thread and a business card in a drawer. Nobody writes it down, because until now writing it down cost more than it was worth.',
      stats: [
        { n: '20+', l: 'contacts after one event day' },
        { n: '47', l: 'days before a warm lead goes quiet' },
        { n: '0', l: 'notes about what you actually discussed' },
      ],
    },
    story: {
      eyebrow: 'One person, one year',
      h2: 'Trust first. Business follows.',
      intro: 'Follow Layla through a year with the people she meets. The assistant saves, reminds, suggests and drafts. Every yes is hers.',
      beats: [
        { k: 'meet', title: 'Two people meet.', chip: 'Met in person · Gulf Tech Expo · 14 Oct', line: 'Omar runs the Dubai Marathon in January.', assistant: 'Saved. I’ll remind you before the race.', action: null },
        { k: 'word', title: 'It knows when a word matters.', chip: '9 Jan', line: 'Omar’s marathon is on Sunday. Wish him luck?', assistant: null, action: 'Send a note', quiet: 'Not now', reply: 'Thank you, Layla! 3:58 — coffee next week?', replyBy: 'Omar · the same day' },
        { k: 'circle', title: 'One person, many relationships.', chip: '2 Jun', line: 'Omar can introduce you to Yusuf at Al Noor. Ask him?', assistant: null, action: 'Ask Omar', quiet: 'Not now', outcome: 'Omar introduced you · 2 Jun' },
        { k: 'draft', title: 'It drafts. You say yes.', chip: '22 Sep', line: 'Omar asked for a proposal.', preview: 'Omar, thank you for Tuesday’s call. Here is the proposal…', action: 'Approve', quiet: 'Not this one', outcome: 'Sent · 11 months after you met' },
        { k: 'close', title: 'Trust first. Business follows.', chip: 'Sent · 11 months after you met', line: 'A friend, a mentor, a client and the man he introduced. One circle, one year.', action: null },
      ],
      cast: { layla: 'Layla', omar: 'Omar', hana: 'Hana', noor: 'Noor', yusuf: 'Yusuf', friend: 'friend', mentor: 'mentor', client: 'client', via: 'via Omar', company: 'Al Noor', you: 'you' },
      assistantName: 'Your assistant',
    },
    loop: {
      eyebrow: 'How it works',
      h2: 'Capture is one gesture. The rest is the assistant’s job.',
      steps: [
        { title: 'Tap', p: 'Tap a card, scan a badge or a QR, or hold to record a 20-second voice note. No form, no typing during the conversation.' },
        { title: 'Keep', p: '“Save this memory?” is already filled: who, where, when, what they care about, what you promised. Edit is optional.' },
        { title: 'Remember', p: 'Ask in plain words: “Who did I meet at GITEX in cybersecurity that I haven’t spoken to in 90 days?” Every answer cites its evidence.' },
        { title: 'Next step', p: 'One morning brief with the three things that need you today, and the first draft of each message.' },
        { title: 'Outcome', p: 'A meeting, an introduction, a deal, a friend kept. The assistant asks “anything come of it?” and remembers the answer.' },
      ],
      link: 'See the full journey',
    },
    card: {
      eyebrow: 'The card',
      h2: 'One tap. The card is the door, not the product.',
      p: 'A tap card in our design, with your photo, logo and words. Tap it on any phone: your page opens, your details are exchanged with one yes, and both of you leave with the moment saved. Never required: a QR, a badge or a photo of a paper card does the same.',
      bullets: ['Works on iPhone and Android without an app', 'Your palette, light or dark; Arabic and English', 'Met in person: the only proof is two phones, one moment, two yeses'],
      cta: 'Get the card — AED 149 with a year of Plus',
    },
    personas: {
      eyebrow: 'Who it is for',
      h2: 'Built for the whole hall, and for the day after.',
      items: {
        organisers: { title: 'Event organisers', p: 'Prove what relationships your event created. Sell what nobody else can: the day after.' },
        exhibitors: { title: 'Exhibitors', p: 'Accounts, not scan lists. The Monday-morning hand-over, done by Friday evening.' },
        sponsors: { title: 'Sponsors', p: 'See what your banner delivered, honestly, and keep the people who tapped.' },
        companies: { title: 'Companies', p: 'Every relationship stays with the company when a salesperson leaves.' },
        individuals: { title: 'Individuals', p: 'Founders, consultants, brokers: never lose a person again.' },
      },
    },
    trust: {
      eyebrow: 'Privacy you can see',
      h2: 'The AI doesn’t need to know who you are to understand your relationships.',
      items: [
        { title: 'Humans only', p: 'Every person in your circle is someone you met, claimed or imported yourself. No bots, no bought lists, no scraping.' },
        { title: 'Your graph is yours', p: 'One isolated memory per member. An organiser sees counts, never names. An employer sees what you captured for them, nothing else.' },
        { title: 'Names stay in a vault', p: 'The model reasons over pseudonyms. A name is put back only on a purpose check, and every time it is, it is logged.' },
        { title: 'Nothing goes out without a yes', p: 'Every message, introduction and CRM push is shown first. You approve, edit or dismiss. Delete means delete, everywhere it was copied.' },
      ],
      link: 'How we handle your data',
    },
    pricing: {
      eyebrow: 'Pricing',
      h2: 'Free for the people you meet. Plans for the ones who sell.',
      p: 'Prices in AED, published once, the same list our sales assistant quotes.',
      cta: 'See every plan',
    },
    final: {
      h2: 'Meet people. Stay close. The rest follows.',
      p: 'Start free today, or order for your company and be live within a working day.',
    },
  },

  // ---------- How it works ----------
  how: {
    title: 'How TapNConnect works — before, during and after an event, and every day',
    description: 'Tap, keep, remember, next step, outcome. How TapNConnect captures a relationship where it happens and keeps it alive, at an event and every day after.',
    hero: { eyebrow: 'How it works', h1: 'A relationship, from the handshake to the outcome.', sub: 'One loop, five verbs. Here is what happens at an event and on an ordinary Tuesday.' },
    event: {
      h2: 'At an event',
      phases: [
        { title: 'Before', who: 'Visitor', p: 'Your profile and what you are looking for are known. The assistant tells you who is worth meeting and why.', who2: 'Exhibitor', p2: 'Target accounts and booth goals set. Warm paths to them surfaced from your team’s own relationships.' },
        { title: 'During', who: 'Visitor', p: 'Tap or scan. Details are exchanged with one yes. A 20-second voice note becomes a memory with the promise in it.', who2: 'Exhibitor', p2: 'A visitor becomes an account with an owner, an intent and a suggested follow-up, before the hall closes.' },
        { title: 'After', who: 'Visitor', p: 'You leave with a circle that persists, reminders set, and the follow-ups drafted for your yes.', who2: 'Exhibitor', p2: 'Prioritised accounts, who on the team knows each company, CRM-ready. The Monday hand-over done.' },
      ],
      organiser: { title: 'And for the organiser', p: 'A report that answers “what did those tap moments create?”: new and repeat relationships, cross-industry clusters, which exhibitors became hubs, what to target for the next edition. Counts and aggregates, never a visitor’s name.' },
    },
    daily: {
      h2: 'Every day after',
      rows: [
        { when: 'Morning', you: 'Open Today', it: 'Three cards: a relationship that needs attention, a promise due, a chance to connect. “Draft the three” is one tap.' },
        { when: 'Meeting', you: 'Hold to record', it: 'The memory is already filled; nothing else appears.' },
        { when: 'Between things', you: 'Reply to one WhatsApp question', it: '“How was the meeting with Sarah? Anything to remember?” One reply, done.' },
        { when: 'Weekly', you: 'Decide on five', it: 'Keep, let go, or ask about five relationships, one swipe each.' },
        { when: 'Anytime', you: 'Ask', it: 'In the app, in WhatsApp, or in your own assistant (ChatGPT, Claude, Siri). Every answer with its evidence.' },
      ],
    },
    capture: {
      h2: 'Six ways to capture, one result',
      items: ['Tap a card', 'Scan a badge', 'Scan a QR', 'Photo of a paper card', 'Voice note', 'Forward a WhatsApp message'],
      p: 'Every one creates the same memory: who, where, when, what you discussed, what each of you promised. High-confidence captures save silently, with undo. A question is asked only when the answer changes what happens next.',
    },
    assistant: {
      h2: 'What the assistant may do on its own',
      p: 'Save, remind, suggest and draft. It never sends, writes to your CRM or shares a name without your yes. After three identical yeses it offers, once, to make that one thing automatic. You can turn it back off in one sentence.',
      consent: 'Your assistant may send email after you approve.',
    },
  },

  // ---------- Persona pages ----------
  personas: {
    organisers: {
      title: 'TapNConnect for event organisers — prove the relationships your event created',
      description: 'Sell the day after. A relationship report for every edition, exhibitor value you can show at renewal, sponsor reach with honest numbers, and a next-event engine. Counts and aggregates, never visitor data.',
      hero: { eyebrow: 'For event organisers', h1: 'Prove what your event created. Then sell the day after.', sub: 'Registrations, footfall and scans say who came. TapNConnect says what happened between them, and what to do for the next edition.' },
      outcomes: [
        { title: 'The relationship report', p: 'Reach → Relationships → Quality → Progress → Structure → Exhibitors → Next edition. Print-ready, sponsor-brandable, one story.' },
        { title: 'Exhibitor renewal proof', p: 'Which exhibitors became hubs, how many accounts progressed in the 30 days after. Shown at renewal, not argued.' },
        { title: 'Sponsor reach, honestly', p: 'Banner views counted only when the banner was on screen; clicks through a short redirect. No cookies, no identities.' },
        { title: 'The next-event engine', p: '“We want 20 % more CIOs.” See who they engaged with, which sessions and channels worked, and target the campaign.' },
      ],
      journey: {
        h2: 'Your edition with TapNConnect',
        steps: [
          { title: 'Set up', p: 'One event, your exhibitor list, your package. We seat every exhibitor; attendee cards are issued for the show.' },
          { title: 'Show days', p: 'Live: which companies and industries are interacting, which stands are busy. Aggregates only.' },
          { title: 'The report', p: 'The relationship report lands after the last day, with the next-edition targets.' },
          { title: 'The 365 days', p: 'Your community keeps its circle; your sponsors keep their reach; you keep the proof for the next sale.' },
        ],
      },
      packages: { h2: 'Packages', p: 'Pilot, Standard and Portfolio. Each is priced per event by a person, usually within a working day.' },
      faq: [
        { q: 'Do organisers receive visitor data?', a: 'No. You see counts and aggregates with a privacy floor on every attendee-attribute cell. A visitor’s circle belongs to the visitor.' },
        { q: 'Do my exhibitors need an app?', a: 'No. Booth staff work from a phone browser; visitors tap or scan without installing anything.' },
        { q: 'Does it replace Cvent or Swapcard?', a: 'No. They run the event; we run what happens between people and after. Write-back to Cvent and Swapcard is on the roadmap.' },
        { q: 'How is it priced?', a: 'Per event, by package. Tell us the show and the number of exhibitors on the Order page and a person confirms within a working day.' },
      ],
    },
    exhibitors: {
      title: 'TapNConnect for exhibitors — accounts, not scan lists',
      description: 'Every visitor your booth meets becomes an account with an owner, an intent and a drafted follow-up. Who on your team knows the company best, one click to your CRM. Priced per seat.',
      hero: { eyebrow: 'For exhibitors', h1: 'Accounts, not scan lists.', sub: 'ABC Technologies: five conversations, three decision-makers, two existing relationships, one owner, one next step. Not “Lead 1 to 5”.' },
      outcomes: [
        { title: 'Capture in seconds, one hand', p: 'Tap, badge, QR or a paper card. Two-tap notes for a loud hall: “send pricing”, “book a demo”, “decision maker”. Voice when it is quieter.' },
        { title: 'Lead → Account → Intent → Owner → Next action → CRM', p: 'Five staff meet one company; you see one page. The strongest internal relationship owns it.' },
        { title: 'The Monday hand-over, by Friday', p: 'Follow-ups drafted for each account, in your voice, with the promise in them. One yes per message.' },
        { title: 'Results you can show the board', p: 'Customers, meetings held, deals opened, repeat business. By salesperson, across events. Real meetings, not scans.' },
      ],
      journey: {
        h2: 'Your show with TapNConnect',
        steps: [
          { title: 'Seats', p: 'A Basic or Pro seat per person on the stand. Stand cards for the counter, where taps go to the company.' },
          { title: 'The stand', p: 'Today at the booth: who is here, who is worth a second conversation, what was promised.' },
          { title: 'The evening', p: 'The recap: accounts, owners, drafts waiting for a yes.' },
          { title: 'The quarter', p: 'Results: what came of it, and the people worth keeping warm until the next show.' },
        ],
      },
      packages: { h2: 'Seats', p: 'Basic and Pro seats, with or without an event, plus stand cards. Priced per seat by a person within a working day.' },
      faq: [
        { q: 'Do visitors need the app?', a: 'No. They tap or scan and give one yes on their phone. They can claim their circle later, free.' },
        { q: 'Does it work offline in a hall with weak signal?', a: 'Captures are saved on the phone and sent when the signal returns.' },
        { q: 'Which CRMs?', a: 'Salesforce, HubSpot and Dynamics hand-over, with Marketo on the roadmap. The account page is CRM-ready even without an integration.' },
        { q: 'Who owns the data?', a: 'The company owns what its seats captured for it. A staff member’s personal circle is separate and stays theirs.' },
      ],
    },
    sponsors: {
      title: 'TapNConnect for sponsors — what your sponsorship delivered',
      description: 'Your banner on the event’s attendee cards and event page, rotated by tier. Views counted only on screen, no cookies, no identities. Keep the people who tapped with starter cards.',
      hero: { eyebrow: 'For sponsors', h1: 'What your sponsorship delivered. Honestly.', sub: 'Your banner where people actually look: on the attendee cards they tap and the event page they open. Counted when it was on screen, never guessed.' },
      outcomes: [
        { title: 'Placement by tier', p: 'Platinum, Gold, Silver, Bronze decide where the logo shows, how large, and your share of banner views.' },
        { title: 'Figures you can trust', p: 'A view counts only when the banner was on screen. A click goes through a short redirect. No cookie, no stored address.' },
        { title: 'Starter cards', p: 'Two tap cards for your team for 90 days after the show: Ask, reminders, the advisor and follow-up, so the people who tapped stay in your circle.' },
        { title: 'Your own page', p: 'Reach, the tier’s promise against what was delivered, and your relationships, in the same portal as the exhibitors.' },
      ],
      journey: {
        h2: 'Your sponsorship with TapNConnect',
        steps: [
          { title: 'Tier', p: 'Chosen with the organiser, or ordered here.' },
          { title: 'Banner', p: 'Your artwork, the dates, the event. Live on the attendee cards and the event page.' },
          { title: 'Reach', p: 'Views and clicks as they happen, with the tier’s promise beside them.' },
          { title: 'After', p: 'Your starter cards keep working for 90 days. Upgrade to seats when you want more.' },
        ],
      },
      packages: { h2: 'Tiers', p: 'Platinum, Gold, Silver and Bronze, with a published list price each. A person confirms within a working day.' },
      faq: [
        { q: 'Is my banner on every member’s card?', a: 'No. Only on attendee cards issued for the event you sponsor and on that event’s page in the app. A member’s own professional card is never ad space.' },
        { q: 'Can I see who viewed it?', a: 'No, and neither can we. We count views, not people.' },
        { q: 'Is it ROI?', a: 'We call it “what your sponsorship delivered” and compare it with the tier’s promise. Return needs the price you paid, which the organiser holds.' },
      ],
    },
    companies: {
      title: 'TapNConnect for companies — relationship memory that survives staff churn',
      description: 'Who in our company knows this person, and how well? Seats and cards for your team with or without events, a shared pool of AI credits, and every relationship kept by the company.',
      hero: { eyebrow: 'For companies', h1: 'Who in our company knows this person? And how well?', sub: 'Every relationship your team captures stays with the company when the salesperson leaves. Work accounts, separate from personal ones, by design.' },
      outcomes: [
        { title: 'Relationship memory', p: 'One page per company you deal with: who met whom, what was discussed, what was promised, who owns it.' },
        { title: 'Work and personal, apart', p: 'A seat is a work account with the work e-mail. A person’s own circle is theirs; what they capture for you is yours.' },
        { title: 'Your documents in the answers', p: 'Price lists, case studies, playbooks: the sales specialist drafts with them, with the source on every line.' },
        { title: 'CRM hygiene without the nagging', p: 'The hand-over to Salesforce, HubSpot or Dynamics is one click, with the context the CRM never had.' },
      ],
      journey: {
        h2: 'Your year with TapNConnect',
        steps: [
          { title: 'Seats and cards', p: 'Pick seats and cards for the team. Invite them by work e-mail.' },
          { title: 'Capture everywhere', p: 'Meetings, calls, trade shows, the Deira shop counter. Tap, voice, WhatsApp.' },
          { title: 'Monday', p: 'Each seat’s brief; each account’s owner; the drafts waiting for a yes.' },
          { title: 'Results', p: 'Customers, repeat business, introductions. By person, by quarter.' },
        ],
      },
      packages: { h2: 'The everyday plan', p: 'Seats, cards and a monthly AI pool on a 12-month term. Priced by seats and cards by a person within a working day.' },
      faq: [
        { q: 'Does it read our inboxes?', a: 'No. We never mine mail. Relationships enter through what your team captures, imports from their own contacts, or hands over.' },
        { q: 'Can we start without an event?', a: 'Yes. The everyday plan has no event in it; add events when you exhibit.' },
        { q: 'Where is the data kept?', a: 'In the UAE (Azure UAE North). Names are kept in a vault and the AI works on pseudonyms.' },
      ],
    },
    individuals: {
      title: 'TapNConnect for individuals — never lose a person again',
      description: 'Founders, consultants, investors, recruiters, brokers. Free to start: your card, everyone you meet, 30 voice notes a month. Plus adds your assistant for AED 39 a month.',
      hero: { eyebrow: 'For individuals', h1: 'Never lose a person again.', sub: 'For the people whose work is relationships: founders, consultants, investors, recruiters, brokers. The one right person instead of a broadcast.' },
      outcomes: [
        { title: 'Remember', p: 'Where did I meet Sarah, what did we discuss, what did I promise? Answered, with the evidence.' },
        { title: 'Prepare', p: 'A brief before tomorrow’s meeting: last time, open promises, what changed at their company.' },
        { title: 'Act', p: 'Three messages drafted every morning for the relationships that need a word today. You say yes.' },
        { title: 'Strengthen', p: 'Quiet relationships surfaced before they go cold. Who can introduce you, from your own circle.' },
      ],
      journey: {
        h2: 'Your first week',
        steps: [
          { title: 'Day 1', p: 'Create your card in two minutes. Import your contacts if you like; they stay yours.' },
          { title: 'Day 2', p: 'Meet someone. Tap, or hold to record. “Save this memory?” Yes.' },
          { title: 'Day 3', p: 'Today shows its first card. You send the first note.' },
          { title: 'Week 2', p: 'You ask the assistant something you had forgotten. It knew.' },
        ],
      },
      packages: { h2: 'Plans', p: 'Free keeps your card and your people. Plus is AED 39 a month, or AED 390 a year. The card is AED 149 with a year of Plus.' },
      faq: [
        { q: 'Is Free really free?', a: 'Yes. Your card, everyone you meet, 30 voice notes a month and 30 AI credits a day, with no card required.' },
        { q: 'Can I use my own AI assistant?', a: 'Yes, on Plus and above. Your circle answers inside ChatGPT, Claude or Siri through a connection you approve and can revoke.' },
        { q: 'What happens to my data if I leave?', a: 'Delete means delete: your circle, your memories and every copy derived from them, within the legal retention periods we publish.' },
      ],
    },
    common: {
      outcomesH2: 'What you get', faqH2: 'Questions people ask', ctaH2: 'Ready when you are.', ctaP: 'Order on this page, or talk to a person first.',
      seePricing: 'See the price list',
    },
  },

  // ---------- Pricing ----------
  pricing: {
    title: 'TapNConnect pricing — plans in AED for people, companies, exhibitors, organisers and sponsors',
    description: 'Free, Plus (AED 39 a month) and Pro (AED 99 a month) for people. The card for AED 149 with a year of Plus. Seats, company plans, event packages and sponsor tiers priced per order within a working day.',
    hero: { eyebrow: 'Pricing', h1: 'One price list. The same one our sales assistant quotes.', sub: 'Prices in AED, VAT shown at checkout. Starting values; the founder publishes every change here first.' },
    tabs: { people: 'For people', companies: 'For companies and exhibitors', events: 'For organisers and sponsors' },
    perMonth: 'a month', perYear: 'a year', once: 'one time', free: 'Free', mostPopular: 'Most chosen', yearlyNote: 'or {price} a year',
    quote: 'Priced per order', quoteNote: 'A person confirms the price within a working day. Card or bank transfer.',
    cardH2: 'The card', packsH2: 'When you need more', packsP: 'AI credits and voice minutes, one-time, no subscription.',
    seatsH2: 'Seats for your team', companyPlanH2: 'The everyday company plan',
    organiserH2: 'Event packages', sponsorH2: 'Sponsor tiers', sponsorP: 'Platinum, Gold, Silver and Bronze decide placement, logo size and the share of banner views. List prices are confirmed on order.',
    faqH2: 'Questions about paying',
    faq: [
      { q: 'Which currency and taxes?', a: 'AED. VAT is added at checkout for UAE customers. Stripe issues the receipt.' },
      { q: 'Card or bank transfer?', a: 'Card for individuals and small company orders. Bank transfer for orders of AED 20,000 and above, and for organisers and sponsors.' },
      { q: 'When is my plan live?', a: 'Card-paid orders are usually live within minutes after a person checks them; every other order within a working day.' },
      { q: 'Can prices change?', a: 'Yes, and when they do, existing subscribers keep their price until they are moved, with notice.' },
    ],
    footnote: 'Prices and what each plan includes are read from the published price list. If a number here and a number in the app ever differ, the app is right and we fix this page.',
  },

  // ---------- Order ----------
  order: {
    title: 'Order TapNConnect for your company',
    description: 'Pick a package, tell us about your company, pay by card or bank transfer. Your plan is usually live within a working day; small card-paid orders in minutes.',
    hero: { eyebrow: 'Order', h1: 'Order TapNConnect for your company.', sub: 'Pick a package, tell us about your company, pay. Your plan is usually live within a working day; small card-paid orders in minutes.' },
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

  // ---------- Trust ----------
  trust: {
    title: 'Privacy and trust at TapNConnect — how we handle your data',
    description: 'Humans only, one isolated graph per member, names in a vault with the AI on pseudonyms, no scraping, consent on every message, delete means delete. Data in the UAE.',
    hero: { eyebrow: 'Privacy and trust', h1: 'Privacy is a feature you can see, not a page you can find.', sub: 'What we built so that the AI does not need to know who you are to understand your relationships.' },
    sections: [
      { title: 'Humans only', p: 'Every node in your circle is a human you met, claimed or imported from your own contacts. No agent, bot or synthetic contact is ever added, whatever assistant asks. Proof of meeting is two phones, one moment, two yeses, shown as “met in person”. Never a selfie gate or a biometric check.' },
      { title: 'The tenant is a person', p: 'One isolated memory per member. A company sees what its seats captured for it. An organiser sees counts and aggregates with a privacy floor. Nothing crosses between members except an introduction both sides said yes to.' },
      { title: 'Pseudonymise, don’t anonymise', p: 'Names and contact details live in an identity vault. The AI reasons over identifiers like PERSON-8472. A controlled resolver puts the name back only on a permission and purpose check, and every resolution is logged. Personal data is found by a named-entity model, never a name list.' },
      { title: 'Lineage on every fact', p: 'Every memory carries its source: who captured it, where, when, how. A deletion request becomes a traversal and a cascade, including to CRM rows derived from it. Delete means delete.' },
      { title: 'No scraping, no mining', p: 'We never scrape LinkedIn or Instagram and never read your inbox. Enrichment comes from company websites, official APIs, your own exports and what a person hands you.' },
      { title: 'Nothing goes out without a yes', p: 'Every message, introduction, calendar invite and CRM push is shown first. You approve, edit or dismiss. After three identical yeses the assistant offers, once, to make that one thing automatic; you can turn it off in a sentence.' },
      { title: 'Where your data lives', p: 'Azure UAE North for the system of record and the vault. Audio of a voice note is deleted after it is transcribed. Public cards hold no phone or e-mail in their page source when the popup is on.' },
      { title: 'What this is not', p: 'An honest limit: this is engineering, not a certificate. We publish the legal documents, the sub-processors and the pentest findings as they are closed. Ask us for the trust pack.' },
    ],
    legal: { h2: 'The documents', p: 'Privacy notice, terms, cookies and the data processing terms, in English and Arabic.', link: 'Read the legal pages' },
  },

  notFound: { title: 'Page not found', p: 'That page isn’t here. The start is one tap away.', home: 'Go to the start' },
};
export default en;
