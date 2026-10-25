// home page copy (English). Merged into the dictionary by src/content/index.js.
const page_home_en = {
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
};

// The home story copy. Merged over the block above.
export const story = {
  home: {
    acts: [
      { h: 'Stay close to the people you meet.', p: 'Tap a card at the stand. TapNConnect keeps who they are and what you promised, and tells you when to say hello again. For visitors, exhibitors, sponsors and the organisers who bring them together.', desc: 'A busy exhibition hall. A TapNConnect card turns slowly in the light.' },
      { h: 'A three-day show. A hundred hellos.', p: 'Every conversation feels like it matters while you are in it.', desc: 'The hall blurs and small clay figures rise out of it: the crowd, and you in coral.' },
      { h: 'One tap. The moment is kept.', p: 'Who, where, when, and what you promised each other. No form, no app for the visitor.', sticker: { meta: 'Met in person', note: 'Gulf Tech Expo · 14 Oct · Hall 4' }, desc: 'Two figures drift together, pause a finger’s width apart, then touch. A coral thread draws between them.' },
      { h: 'Usually, this is where it ends.', p: 'The hall empties. The cards go in a drawer. By next week the names have faded.', desc: 'The crowd turns grey and drifts away. Only the coral thread keeps its colour.' },
      { h: 'This time, the thread holds.', p: 'Your assistant remembers each person, tells you when a word would count, and writes the first draft. Nothing goes out without your yes.', notes: [{ note: 'Omar’s marathon is Sunday. Wish him luck?', yes: 'Send a note', no: 'Not now' }, { note: '3:58! Coffee next week?', meta: 'Omar replied' }], desc: 'A warm glow travels along the thread while the assistant’s notes pin to it.' },
      { h: 'A year later, they’re still around you.', p: 'A friend, a mentor, a client, and the person they introduced.', desc: 'The thread branches to new people, and a circle gathers round you in full colour.' },
      { h: 'Everyone in the hall leaves with more than a badge scan.', p: 'The visitor keeps a circle. The exhibitor gets accounts. The sponsor sees what it delivered. The organiser can prove it.', desc: 'The view pulls back: your circle is one of many lit circles across the hall.' },
    ],
    cardName: 'Layla Nasser',
    sample: 'Sample',
    skip: 'Skip the story',
    storyNav: 'Story chapters',
    chapter: 'Chapter {n}',
    chips: { organisers: 'For organisers', exhibitors: 'For exhibitors', sponsors: 'For sponsors', individuals: 'For visitors' },
    who: {
      eyebrow: 'Who it is for', h2: 'Built for the whole hall.', sample: 'Sample figures',
      pitch: {
        organisers: { title: 'Event organisers', line: 'Prove the relationships your event created, and sell the day after.' },
        exhibitors: { title: 'Exhibitors', line: 'Accounts with an owner and a drafted follow-up, not scan lists.' },
        sponsors: { title: 'Sponsors', line: 'Banner reach counted honestly, and the people who tapped kept.' },
        individuals: { title: 'Visitors and professionals', line: 'A circle that lasts, with an assistant that remembers for you.' },
        companies: { title: 'Companies', line: 'Relationship memory that stays when a salesperson leaves.' },
      },
    },
    vignettes: {
      organisers: { title: 'Relationship report', sub: 'Gulf Tech Expo 2026', stats: [{ n: '4,812', l: 'relationships created' }, { n: '71%', l: 'met in person' }, { n: '1,206', l: 'accounts progressed in 30 days' }], bars: [{ w: 82, label: 'Exhibitors who became hubs', value: '82 of 100' }, { w: 64, label: 'Cross-industry clusters', value: '9' }, { w: 48, label: 'Next edition: CIOs engaged', value: '48%' }] },
      exhibitors: { title: 'Accounts', sub: 'Stand B-14 · day 2', rows: [{ company: 'Al Noor Trading', line: '5 conversations · 3 decision-makers · owner Mohammed', next: 'Send proposal' }, { company: 'Qamar Bank', line: '2 conversations · CIO met in person', next: 'Book a demo' }, { company: 'Oasis Energy', line: '1 conversation · pricing promised', next: 'Send pricing' }], owner: 'Strongest relationship owns each account', crm: 'One click to CRM' },
      sponsors: { title: 'What your sponsorship delivered', sub: 'Gold · Gulf Tech Expo', stats: [{ n: '38,420', l: 'banner views on screen' }, { n: '1,912', l: 'clicks' }], bar: { w: 27, label: 'Share of views · promised 25%', value: 'delivered 27%' }, note: 'Counted only when the banner was on screen. No cookie, no identity.' },
      individuals: { title: 'Today', sub: 'Thursday', cards: [{ kind: 'mail', line: 'Omar’s marathon is on Sunday. Wish him luck?', why: 'Met at Gulf Tech Expo · he mentioned the race', yes: 'Send a note', no: 'Not now' }, { kind: 'check', line: 'You promised Sara the pilot scope by Thursday.', why: 'Said in your voice note · 14 Oct', yes: 'Draft it', no: 'Later' }, { kind: 'mail', line: 'Yusuf changed company. Congratulate him?', why: 'Introduced by Omar · now at Al Noor', yes: 'Send a note', no: 'Not now' }] },
    },
    how: { eyebrow: 'How it works', h2: 'Five verbs, one loop.' },
    year: { eyebrow: 'One person, one year', h2: 'Trust first. Business follows.', p: 'Layla meets Omar in October. Eleven months later he asks her for a proposal. Everything in between is the assistant doing its job, and Layla saying yes.' },
    outcomes: {
      eyebrow: 'Why it matters', h2: 'The numbers behind the hall.',
      items: [{ n: '100+', l: 'people a visitor meets at a three-day show' }, { n: '47', l: 'days before a warm lead goes quiet' }, { n: '0', l: 'notes anyone keeps about what was said' }, { n: '1', l: 'tap to keep all of it' }],
    },
  },
};
export default page_home_en;
