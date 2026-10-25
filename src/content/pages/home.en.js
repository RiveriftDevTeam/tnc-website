// home page copy (English). Merged into the dictionary by src/content/index.js.
// The story (acts) follows docs/plans/site-revamp.md § 5 and Amendment A1; prices never appear here (src/content/plans.js).
const page_home_en = {
  home: {
    title: 'TapNConnect — the relationship OS for events and the people in them',
    description: 'TapNConnect is the relationship OS for events and the people in them: every tap becomes a thread, and an assistant keeps each one alive. It remembers who people are and what you promised, tells you when a word would count, and writes the first draft. Nothing goes out without your yes.',
    hero: {
      h1: 'Stay close to the people you meet.',
      primary: 'Start free', secondary: 'Order for your company',
      note: 'Free for the people you meet. Plans in AED for companies and events.',
      sceneLabel: 'The story of one tap: the hall, the touch, the thread, your circles, and the assistant keeping them alive.',
    },
    acts: [
      { h: 'Stay close to the people you meet.', p: 'TapNConnect is the relationship OS for events and the people in them: every tap becomes a thread, and an assistant keeps each one alive. For visitors, exhibitors, sponsors and the organisers who bring them together.', desc: 'A busy exhibition hall. A TapNConnect card turns slowly in the light.' },
      { h: 'A three-day show. A hundred hellos.', p: 'Every conversation feels like it matters while you are in it.', desc: 'The hall blurs and small clay figures rise out of it: the crowd, and you in coral.' },
      { h: 'One tap. The moment is kept.', p: 'Who, where, when, and what you promised each other. No form, no app for the visitor.', sticker: { meta: 'Met in person', note: 'Gulf Tech Expo · 14 Oct · Hall 4' }, desc: 'Two figures drift together, pause a finger’s width apart, then touch. A coral thread draws between them.' },
      { h: 'Usually, this is where it ends.', p: 'The hall empties. The cards go in a drawer. By next week the names have faded.', desc: 'The crowd turns grey and drifts away. Only the coral thread keeps its colour.' },
      { h: 'Every tap adds a thread. Soon it’s a web.', p: 'Sara at the coffee stand, Yusuf after the panel, a mentor from the last show. TapNConnect keeps each one, and sees who already knows whom.', desc: 'The hall comes back in colour. Threads draw from you to each person you met, and between people who know each other: a web forms.' },
      { h: 'From where you stand, it’s your circles.', p: 'The people you meet settle into the circles you actually have, and each circle gets the attention it needs.', circles: ['Your team', 'Friends', 'Mentors', 'Clients'], desc: 'The web settles into four rings around you, one colour for each circle.' },
      { h: 'The right word, at the right time.', p: 'Your assistant knows who needs a word today and why, and writes the first draft. Nothing goes out without your yes.', notes: [
        { when: 'Sunday', note: 'Omar’s marathon is today. Wish him luck?', why: 'He mentioned the race when you met at Gulf Tech Expo.', yes: 'Send a note', no: 'Not now' },
        { when: 'Thursday', note: 'You promised Sara the pilot scope by today.', why: 'You said it in your voice note after her stand.', yes: 'Draft it', no: 'Later' },
        { when: 'Next week', note: 'Yusuf started at Al Noor. Congratulate him?', why: 'Omar introduced you; his work changed.', yes: 'Send a note', no: 'Not now' },
        { when: 'When it helps', note: 'Omar can introduce you to Huda at Qamar Bank.', why: 'You asked about their pilot; Omar has worked with her.', yes: 'Ask Omar', no: 'Not now' },
      ], desc: 'Warm pulses travel along the threads to one person at a time, and a note from the assistant pins to each.' },
      { h: 'One hall. Every thread kept.', p: 'Everyone leaves with more than a badge scan. The visitor keeps a circle. The exhibitor gets accounts. The sponsor sees what it delivered. The organiser can prove it.', desc: 'The view pulls back: your web is one of many across the hall, joined by the people you share.' },
    ],
    cardName: 'Layla Nasser',
    sample: 'Sample',
    skip: 'Skip the story',
    storyNav: 'Story chapters',
    chapter: 'Chapter {n}',
    chips: { organisers: 'For organisers', exhibitors: 'For exhibitors', sponsors: 'For sponsors', individuals: 'For visitors' },
    who: { sample: 'Sample figures' },
    gains: {
      h2: 'What everyone gains.',
      lead: 'One tap at an event becomes a relationship that lasts. Here is what that is worth to each person in the hall.',
      more: 'More for {who}',
      items: {
        individuals: { title: 'Visitors and professionals', gain: 'A circle that lasts, and an assistant that remembers for you.', points: ['Remember where you met, what was said and what you promised.', 'A short brief before your next meeting, with the promises still open.', 'The few messages that matter today, drafted. You say yes.'], cta: 'Start free', alt: 'A smiling woman chatting at an event with friends beside her.' },
        exhibitors: { title: 'Exhibitors', gain: 'Accounts, not scan lists. The Monday hand-over, done by Friday.', points: ['Capture in seconds with one hand: a tap, a badge, a QR or a paper card.', 'Five people from your team meet one company; you see one account with one owner.', 'A follow-up drafted for each account, in your voice, with the promise in it.'], cta: 'Order for your stand', alt: 'A smiling stallholder standing at her art booth.' },
        sponsors: { title: 'Sponsors', gain: 'What your sponsorship delivered, counted honestly, and the people who tapped kept close.', points: ['A view counts only when your banner was on screen.', 'Your tier’s promise, side by side with what was delivered.', 'Starter cards keep the people who tapped in your team’s circle after the show.'], cta: 'Ask about sponsorship', alt: 'Two people smile as they shake hands outside a brick building.' },
        organisers: { title: 'Organisers', gain: 'Prove the relationships your event created, and sell the next edition with it.', points: ['A relationship report after the last day: one story, ready to print.', 'Which exhibitors became hubs, shown at renewal time.', 'Who your audience engaged with, to aim the next edition.'], cta: 'Ask about your event', alt: 'Two colleagues with blank badges chat and smile over coffee.' },
        companies: { title: 'Companies', gain: 'Relationship memory that stays when people move on.', points: ['One page for each company you deal with: who met whom, and what was promised.', 'Work and personal kept apart; what is captured for you stays yours.', 'One click to your CRM, with the context it never had.'], cta: 'Order for your company', alt: 'Three smiling delegates with name badges at an event.' },
      },
    },
        vignettes: {
      organisers: { title: 'Relationship report', sub: 'Gulf Tech Expo 2026', stats: [{ n: '4,812', l: 'relationships created' }, { n: '71%', l: 'met in person' }, { n: '1,206', l: 'accounts progressed in 30 days' }], bars: [{ w: 82, label: 'Exhibitors who became hubs', value: '82 of 100' }, { w: 64, label: 'Cross-industry clusters', value: '9' }, { w: 48, label: 'Next edition: CIOs engaged', value: '48%' }] },
      exhibitors: { title: 'Accounts', sub: 'Stand B-14 · day 2', rows: [{ company: 'Al Noor Trading', line: '5 conversations · 3 decision-makers · owner Mohammed', next: 'Send proposal' }, { company: 'Qamar Bank', line: '2 conversations · CIO met in person', next: 'Book a demo' }, { company: 'Oasis Energy', line: '1 conversation · pricing promised', next: 'Send pricing' }], owner: 'Strongest relationship owns each account', crm: 'One click to CRM' },
      sponsors: { title: 'What your sponsorship delivered', sub: 'Gold · Gulf Tech Expo', stats: [{ n: '38,420', l: 'banner views on screen' }, { n: '1,912', l: 'clicks' }], bar: { w: 27, label: 'Share of views · promised 25%', value: 'delivered 27%' }, note: 'Counted only when the banner was on screen. No cookie, no identity.' },
      individuals: { title: 'Today', sub: 'Thursday', cards: [{ kind: 'mail', line: 'Omar’s marathon is on Sunday. Wish him luck?', why: 'Met at Gulf Tech Expo · he mentioned the race', yes: 'Send a note', no: 'Not now' }, { kind: 'check', line: 'You promised Sara the pilot scope by Thursday.', why: 'Said in your voice note · 14 Oct', yes: 'Draft it', no: 'Later' }, { kind: 'mail', line: 'Yusuf changed company. Congratulate him?', why: 'Introduced by Omar · now at Al Noor', yes: 'Send a note', no: 'Not now' }] },
    },
        story: {
      alt: 'Three colleagues laughing over coffee at a table.',
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
      h2: 'One tap. The card is the door, not the product.',
      p: 'A tap card in our design, with your photo, logo and words. Tap it on any phone: your page opens, your details are exchanged with one yes, and both of you leave with the moment saved. Never required: a QR, a badge or a photo of a paper card does the same.',
      bullets: ['Works on iPhone and Android without an app', 'Your palette, light or dark; Arabic and English', 'Met in person: the only proof is two phones, one moment, two yeses'],
      cta: 'Get the card: {price} with a year of Plus',
    },
        trust: {
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
      perOrder: 'Companies and events: priced per order, by a person.',
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
export default page_home_en;
