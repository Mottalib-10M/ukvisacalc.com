import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Dates already in the Immigration Rules (params-2026.json) or in the Home Office response of November 2026 (CP 1707).
const S = K.P.student;
const ST = K.P.settlement;
const g = (m: number) => K.visaCost({ route: 'graduate', where: 'inside', months: m, partner: false, children: 0 });
const g24 = g(24), g18 = g(18);
const tslCount = K.tsl().length;

export default definePage({
  id: 'uk-visa-changes-2027',
  group: 'costs',
  order: 5,
  slug: 'uk-visa-changes',
  nav: 'Visa changes in 2027',
  card: 'Graduate visa cut to 18 months, B2 English for ILR, earned settlement and the shortage list: dates and status.',
  title: 'Visa Changes UK 2027: Graduate 18 Months, B2 English, ILR',
  description: `UK visa changes in 2027: the Graduate visa at 18 months from 1 January, B2 English for ILR from 26 March, earned settlement and fees: what is law, what is not.`,
  h1: 'UK visa changes in 2027: what is already law and what is still a plan',
  intro: `Two changes are fixed in the Immigration Rules: the Graduate visa drops to 18 months for applications from ${K.date(S.graduateChange)}, and settlement needs B2 English from ${K.date(ST.englishB2SettlementFrom)}. Earned settlement has a government response but no rules yet.`,
  resume: `UK immigration in 2027 changes on several dates, and not all of them have the same legal weight. Already in the Immigration Rules: the Graduate visa lasts 18 months instead of ${S.graduateYears} years for applications made on or after ${K.date(S.graduateChange)}, PhD graduates keeping ${S.graduatePhdYears} years; and from ${K.date(ST.englishB2SettlementFrom)}, applicants for indefinite leave to remain on most routes must show English at level B2 instead of B1, under the Statement of Changes HC 1691. Announced but not yet law: earned settlement, the move of the usual qualifying period for ILR from ${ST.skilledWorkerYears} to 10 years, confirmed by the Home Office response to the consultation in November 2026 with no commencement date. Undecided: which of the ${tslCount} Temporary Shortage List occupations stay open after December 2026, where the Migration Advisory Committee recommended 28, and whether fees and the health surcharge rise in April 2027, as they did in 2025 and 2026. On ${K.date(K.P.retrieved_at)} no fee increase for 2027 had been laid.`,
  tool: { kind: 'cost', props: { initialRoute: 'graduate', initialWhere: 'inside', initialMonths: 18, title: 'Graduate visa cost from January 2027 (18 months)' } },
  body: (h) => `
<h2>Visa changes UK 2027, date by date</h2>
${h.table(['Date', 'Change', 'Status'], [
    [K.date(S.graduateChange), `Graduate visa: 18 months instead of ${S.graduateYears} years for applications made from this date (PhD: ${S.graduatePhdYears} years)`, 'In the Immigration Rules'],
    ['1 February 2027', 'Care workers whose sponsor lost its licence: 120 days to find a new sponsor', 'Announced in the government response (CP 1707)'],
    [K.date(ST.englishB2SettlementFrom), 'ILR: English at B2 instead of B1 on routes that test English at settlement', 'In the Immigration Rules (HC 1691)'],
    ['April 2027', 'Usual month for fee and health surcharge changes', 'Nothing laid on the date of this page'],
    ['2027, date not set', 'Earned settlement: 10-year baseline for ILR, 3 or 5 years for some, 20 years after breaches', 'Policy confirmed, rules not laid'],
    ['After 31 December 2026', `Temporary Shortage List: ${tslCount} occupations today, 28 recommended by the MAC`, 'Awaiting a Statement of Changes'],
  ], 'Sources: Immigration Rules and HC 1691, Home Office response CP 1707 (November 2026), MAC stage 2 report (July 2026).', ['l', 'l', 'l'])}
<p>"In the Immigration Rules" means the change has been laid before Parliament in a Statement of Changes and has a commencement date: it will apply unless a later statement reverses it. "Announced" means the Home Office has published a policy, but the rules that would make it binding have not yet been laid, so details and dates can still move. The ${h.src('hc_1691', 'Statement of Changes HC 1691')} carries the English change; the 18-month Graduate visa is already written into the rules on GOV.UK’s ${h.src('graduate_visa', 'Graduate visa page')}.</p>

<h2>The Graduate visa at 18 months</h2>
<p>The length depends on the date of the application, not on the date of graduation. A student whose results are confirmed in December 2026 and who applies by the 31st still gets ${S.graduateYears} years; one who applies in January gets 18 months. The fee stays at ${K.gbp(K.FEE.graduate())}, but the health surcharge falls with the shorter stay, so the total for one person goes from ${K.gbp(g24.total)} to ${K.gbp(g18.total)}. The calculator above is set to 18 months; change the length to compare. Shorter Graduate time also shortens the window to switch to a Skilled Worker visa at the new entrant rate: the ${h.a('graduate-visa-uk', 'Graduate visa page')} and the ${h.a('graduate-to-skilled-worker', 'switching guide')} work through both cases.</p>
${h.table(['Applied', 'Length', 'Fee', 'Surcharge', 'Total, one person'], [
    ['By 31 December 2026', `${S.graduateYears} years`, K.gbp(K.FEE.graduate()), K.gbp(g24.total - K.FEE.graduate()), K.gbp(g24.total)],
    [`From ${K.date(S.graduateChange)}`, '18 months', K.gbp(K.FEE.graduate()), K.gbp(g18.total - K.FEE.graduate()), K.gbp(g18.total)],
  ], 'Fee and surcharge at the rates in force on the date of this page.', ['l', 'l', 'r', 'r', 'r'])}

<h2>B2 English for settlement from 26 March 2027</h2>
<p>From ${K.date(ST.englishB2SettlementFrom)}, an application for indefinite leave to remain on a route that tests English at settlement must show B2, an upper-intermediate level, instead of B1. An application made on 25 March 2027 is assessed under the old level. Exemptions are unchanged: people aged 65 or over, people with a long-term condition that prevents them from learning, and nationals of majority English-speaking countries, as well as degrees taught in English that meet the rules. Anyone whose qualifying period ends in early 2027 and who holds only a B1 certificate has a reason to apply in the 28 days before the end of the period rather than later. The ${h.a('ilr-requirements', 'ILR requirements page')} lists the tests and the routes concerned.</p>

<h2>Earned settlement: confirmed, not yet law</h2>
<p>The Home Office published its response to the earned settlement consultation in November 2026 (${h.src('earned_settlement_response', 'CP 1707')}). It confirms a baseline of 10 years for most people, a 5-year pathway for those earning at least £50,271 in three of the last five years, eligible health and education workers and some British connections, a 3-year pathway at £125,141, and longer periods after immigration breaches or illegal entry. Partners of British citizens keep their 5-year route. What it does not give is a commencement date: the government says further guidance will come before implementation, and nothing changes for an application until the rules are laid. Today, a Skilled Worker still qualifies after ${ST.skilledWorkerYears} years. The ${h.a('earned-settlement', 'earned settlement page')} sets out the model in detail.</p>

<h2>The Temporary Shortage List after December 2026</h2>
<p>The list of ${tslCount} occupations that can be sponsored below degree level was set up until 31 December 2026. In July 2026 the ${h.src('mac_tsl_stage2', 'Migration Advisory Committee')} recommended keeping 28 of them, for up to three years each, and removing the rest. The government had not laid its decision on the date of this page; until it does, sponsors cannot rely on the recommendation. The ${h.a('temporary-shortage-list', 'Temporary Shortage List page')} shows the current codes and their conditions.</p>

<h2>Fees and the health surcharge in 2027</h2>
<p>Visa fees are set by regulations and the health surcharge by order; both rose in April 2025 and April 2026. No increase for 2027 had been laid on ${K.date(K.P.retrieved_at)}, so every cost on this site uses the fees in force since ${K.date(K.FEE_DATE)} and a surcharge of ${K.gbp(K.P.ihs.standard)} a year. A fee rise usually appears in a fees order a few weeks before it applies; the ${h.a('uk-visa-fees', 'visa fees table')} and the ${h.a('immigration-health-surcharge', 'surcharge page')} will change the same day. No estimate of a 2027 fee is shown anywhere on the site.</p>`,
  faqs: [
    { q: 'What are the UK visa changes in 2027?', a: `Two are already in the rules: the Graduate visa lasts 18 months for applications from ${K.date(S.graduateChange)}, and indefinite leave to remain needs B2 English from ${K.date(ST.englishB2SettlementFrom)}. Earned settlement, a 10-year baseline for ILR, is confirmed as policy but has no start date, and the Temporary Shortage List after December 2026 is still to be decided.` },
    { q: 'Is the 10-year ILR rule in force in 2027?', a: `Not yet. The Home Office confirmed the 10-year baseline in its November 2026 response, but the Immigration Rules that would apply it have not been laid and no commencement date has been given. Until then, the qualifying period on the Skilled Worker route stays at ${ST.skilledWorkerYears} years.` },
    { q: 'Will UK visa fees go up in April 2027?', a: `Nothing had been laid when this page was last checked. Fees rose in April 2025 and April 2026, and changes are usually published a few weeks before they apply. The calculators on this site use the fees in force since ${K.date(K.FEE_DATE)} until a new fees order is published.` },
    { q: 'Should I apply for my Graduate visa before January 2027?', a: `If you can, yes: an application made on or before 31 December 2026 gives ${S.graduateYears} years, one made from ${K.date(S.graduateChange)} gives 18 months. You need the university to have reported your successful completion first, and you must still hold your Student visa on the day you apply.` },
  ],
  related: ['graduate-visa-uk', 'ilr-requirements', 'earned-settlement', 'temporary-shortage-list', 'uk-visa-fees', 'home-office-fees'],
  sources: ['hc_1691', 'graduate_visa', 'earned_settlement_response', 'mac_tsl_stage2', 'fees_table', 'ihs'],
});
