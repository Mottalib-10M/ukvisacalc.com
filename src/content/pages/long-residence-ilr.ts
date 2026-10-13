import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tripDays } from '../../lib/engine/settlement';

const S = K.P.settlement;
const L = S.longResidenceLegacy;
const cut = K.date(L.cutoff);
const b2 = K.date(S.englishB2SettlementFrom);
const ext = K.FEE.leaveToRemainOther();
// Arrived as a student on 21 November 2016: one long trip in 2019, one in 2024 under the new rule.
const t2019 = { out: '2019-01-05', back: '2019-07-01' };
const t2024 = { out: '2024-09-01', back: '2024-12-10' };
const ok = K.settlementDate('long-residence', '2016-11-21', [t2019, t2024]);
// Same person, but the 2019 trip ran to 20 July.
const t2019long = { out: '2019-01-05', back: '2019-07-20' };
const single = K.settlementDate('long-residence', '2016-11-21', [t2019long, t2024]);
// Four long trips before April 2024: the total, not any single trip, breaks residence.
const many = [{ out: '2017-03-01', back: '2017-08-15' }, { out: '2018-02-01', back: '2018-07-20' }, { out: '2020-01-10', back: '2020-06-30' }, { out: '2022-05-01', back: '2022-09-30' }];
const total = K.settlementDate('long-residence', '2016-11-21', many);
const manyDays = many.map(tripDays);

export default definePage({
  id: 'long-residence-ilr',
  group: 'settlement',
  order: 50,
  nav: 'Long residence (10 years)',
  card: `Ten lawful years on any mix of visas, the ${L.totalDays} and ${L.singleDays}-day limits before ${cut}, and the ${K.gbp(ext)} extension.`,
  title: 'Long Residence ILR: 10 Years, Old Absence Limits and Fees',
  description: `Long residence ILR after ${S.longResidenceYears} lawful years: visas that count, the ${L.totalDays}/${L.singleDays}-day limits for trips before ${cut}, the 12-month rule and the ${K.gbp(ext)} extension.`,
  h1: 'Long residence: settling after ten lawful years in the UK',
  intro: `Ten years of lawful, continuous residence on almost any combination of visas can lead to settlement. Trips that began before ${cut} are tested against ${L.totalDays} days in total and ${L.singleDays} at a time; later ones against ${S.maxAbsenceDays} in any 12 months.`,
  resume: `The long residence route in Appendix Long Residence rewards time rather than a particular visa: you need a qualifying period of ${S.longResidenceYears} years spent lawfully in the UK, which can mix Student, Graduate, Skilled Worker, family and most other permissions, but not visitor, short-term study, Seasonal Worker or Ukraine scheme permission. Absences follow two regimes. Any absence that began before ${cut} is checked against the old limits, ${L.singleDays} days in a single trip and ${L.totalDays} days in total; absences that began on or after that date must stay within ${S.maxAbsenceDays} days in any rolling 12 months. If your current permission was granted on or after ${cut} you must normally have held it for 12 months. Settlement then needs English (B1 now, B2 for applications from ${b2}) and the Life in the UK test. If you meet the time but not those two tests, you can apply for 24 months' permission instead, for ${K.gbp(ext)}. Dependants cannot be included and apply in their own right.`,
  tool: { kind: 'ilr', props: { initialRoute: 'long-residence', title: 'Long residence date with old and new absence limits' } },
  body: (h) => `
<h2>Which years count towards the ten</h2>
<p>${h.ext('https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-long-residence', 'Appendix Long Residence')} (LR 11.1) accepts time with any permission except as a visitor, a short-term English language student, a Seasonal Worker or under the Ukraine schemes. Time exempt from immigration control counts, as does time as an EEA national exercising treaty rights before the end of 2020, and time as a British citizen unless citizenship was later taken away. That breadth is the route's attraction: a degree, a Graduate visa, a few years of sponsored work and a spell as a dependant can add up, where each route on its own would fall short.</p>
<p>What does not count is set out in LR 11.2: immigration bail, temporary admission or release, and any gap between permissions when you were overstaying, even a gap the rules later forgave. A gap does not only fail to count, it can break continuous residence altogether under CR 4.1. Removal from the UK breaks it too. If you have had a gap, take advice from a solicitor or an adviser registered with the Immigration Advice Authority before paying the fee.</p>
<h2>Absences: the old limits and the new rule</h2>
<p>Long residence is the one route where absences before ${cut} keep their old treatment (CR 3.3). Take someone who arrived as a student on ${K.date(ok.start)}:</p>
${h.table(['Scenario', 'Trips', 'What the calculator finds', 'Earliest application'], [
    ['Six months away in 2019, three in 2024', `${tripDays(t2019)} days, then ${tripDays(t2024)} days`, 'under both regimes', K.date(ok.earliestApply)],
    ['The 2019 trip runs to 20 July', `${tripDays(t2019long)} days in one absence`, `over ${L.singleDays} days at a time`, K.date(single.earliestApply)],
    ['Four long trips between 2017 and 2022', manyDays.join(' + ') + ' days', `over ${L.totalDays} days in total`, K.date(total.earliestApply)],
  ], `Whole days only. Absences that began before ${cut} use the ${L.singleDays}/${L.totalDays}-day limits; later ones the rolling ${S.maxAbsenceDays}-day rule.`, ['l', 'l', 'l', 'r'])}
<p>The first case shows why the transition matters: a ${tripDays(t2019)}-day trip would be close to the rolling limit today, but in 2019 it only had to stay under ${L.singleDays}. In the second, nineteen extra days abroad push one trip past the single-absence limit and the ten years start again from the return in July 2019. In the third, no trip is long on its own, but the total passes ${L.totalDays}. Where a trip started before ${cut} and ended after it, the guidance says the rolling 12-month count only begins with the next absence. The tool restarts the period after a breach; the Home Office may instead accept a permitted reason under CR 3.4, such as serious illness or travel disruption.</p>
<h2>The 12-month rule on your current permission</h2>
<p>Since ${cut}, LR 11.3 asks that you have held permission on your current route for at least 12 months on the date of application. A switch to a new route shortly before the tenth anniversary can therefore delay the application, even when the ten years are complete. If your current permission was granted before ${cut}, the rule does not apply to you (LR 11.4). You must be in the UK when you apply, and you cannot add a partner or children: each needs their own route, often as the partner or child of a settled person once you have ILR.</p>
<h2>When the tests are not ready: the 24-month permission</h2>
<p>If you meet the time, the residence and suitability but not English or Life in the UK, the same appendix grants permission to stay for 24 months (LR 7.1) on an application costing ${K.gbp(ext)}, decided in about 8 weeks. It allows work and study but no public funds. That buys time to pass the tests; settlement itself costs ${K.gbp(K.FEE.ilr())}. Note the date: from ${b2} the English level for long residence rises from B1 to B2 (LR 13.1). The government's ${h.a('earned-settlement', 'earned settlement consultation')} proposed folding long residence into a single adjustable system; that is a proposal, and the route stands in the rules in force on ${K.date(K.P.retrieved_at)}. The ${h.a('ilr-absence-calculator', 'absence calculator')} explains the rolling rule in detail.</p>`,
  faqs: [
    { q: 'Do years on a Student visa count for long residence?', a: `Yes. Student permission is lawful permission and counts towards the ${S.longResidenceYears} years, as do Graduate, work and family visas. Only visitor, short-term English study, Seasonal Worker and Ukraine scheme permission are excluded, together with immigration bail and overstaying gaps. Study time does not count for the five-year Skilled Worker route, which is why many former students settle this way.` },
    { q: 'Are absences before April 2024 judged under the 548-day rule?', a: `On the long residence route, yes. An absence that began before ${cut} must not exceed ${L.singleDays} days on its own, and those absences together must not exceed ${L.totalDays} days during the qualifying period. Absences that began on or after that date are tested instead against ${S.maxAbsenceDays} days in any rolling 12 months.` },
    { q: 'Can I include my partner in a long residence application?', a: `No. Appendix Long Residence has no provision for dependants. Your partner and children apply separately if they qualify on long residence themselves, or, once you are settled, as the partner or child of a settled person. Children over 18 who qualify on neither basis may have to leave, so check their position before you apply.` },
    { q: 'What does the long residence extension give me?', a: `Permission to stay for 24 months, for ${K.gbp(ext)}, if you meet the residence and suitability rules but not yet the English or Life in the UK requirement. You can work and study, without access to public funds. It is a bridge, not settlement: you apply for ILR once you have passed the tests, paying the settlement fee then.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-absence-calculator', 'ilr-requirements', 'ilr-fee', 'graduate-visa-uk', 'earned-settlement'],
  sources: ['long_residence', 'continuous_residence', 'cr_guidance', 'hc_1691', 'fees_table'],
});
