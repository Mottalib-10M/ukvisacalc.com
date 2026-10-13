import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { absentBetween } from '../../lib/engine/settlement';

const C = K.P.citizenship;
const S = K.P.settlement;
// A frequent traveller who settled on time but used the absence allowance heavily.
const trips = [{ out: '2021-01-10', back: '2021-06-30' }, { out: '2022-03-01', back: '2022-08-15' }, { out: '2023-10-01', back: '2024-03-01' }];
const settle = K.settlementDate('skilled-worker', '2019-09-02', trips);
const cit = K.citizenshipDate('2019-09-02', settle.earliestApply, trips, false);
const inWindow = (d: string) => absentBetween(trips, K.addYears(d, -C.residenceYears), d);
// First day on or after ILR + 12 months when the five-year total is back under the limit.
let under = cit.ilrPlus12!;
while (inWindow(under) > C.maxAbsence5y) under = K.addDays(under, 1);

export default definePage({
  id: 'british-citizenship-requirements',
  group: 'settlement',
  order: 110,
  nav: 'Citizenship requirements',
  card: 'Each condition for naturalisation, what happens above the absence limits, and the limits of this page.',
  title: 'Citizenship Requirements 2026: Residence, Tests, Absences',
  description: `British citizenship requirements in 2026: ${C.residenceYears} years, ${C.ilrHeldMonths} months settled, ${C.maxAbsence5y}/${C.maxAbsence12m} days abroad, English, Life in the UK, character and what happens above the limits.`,
  h1: 'Requirements for naturalisation as a British citizen',
  intro: `Naturalisation asks for residence (${C.residenceYears} years, within ${C.maxAbsence5y} days abroad and ${C.maxAbsence12m} in the last year), settled status held ${C.ilrHeldMonths} months, English, Life in the UK, good character and the intention to stay. Test your travel history against the limits below.`,
  resume: `The requirements for naturalisation after indefinite leave to remain fall into three groups. Residence: you must have lived in the UK for at least ${C.residenceYears} years before the application, been physically present on the day exactly ${C.residenceYears} years before the Home Office receives it, and should not have spent more than ${C.maxAbsence5y} days outside the UK in those ${C.residenceYears} years or more than ${C.maxAbsence12m} in the last 12 months. Status: ILR, settled status or indefinite leave to enter held for ${C.ilrHeldMonths} months (no wait if your spouse is British), and no breach of immigration law in the period. Personal: over 18, knowledge of English, Welsh or Scottish Gaelic, a Life in the UK pass, good character under the Home Office naturalisation guidance, and the intention to continue living in the UK. Settling does not mean you meet the residence test: the ${S.maxAbsenceDays}-day settlement allowance can add up to far more than ${C.maxAbsence5y} days over five years, as the example below shows.`,
  tool: { kind: 'citizenship', props: { initialRoute: 'skilled-worker', title: 'Test your trips against the citizenship limits' } },
  body: (h) => `
<h2>The conditions in one table</h2>
${h.table(['Condition', 'Rule', 'What it means in practice'], [
    ['Age', 'over 18', 'children register instead'],
    ['Residence', `${C.residenceYears} years in the UK before applying`, 'time exempt from immigration control (diplomats, visiting forces) does not count'],
    ['Presence at the start', `in the UK exactly ${C.residenceYears} years before receipt`, 'online forms are received the same day'],
    ['Absences, whole period', `no more than ${C.maxAbsence5y} days`, 'from your own travel records'],
    ['Absences, last 12 months', `no more than ${C.maxAbsence12m} days`, 'often the one that delays applicants'],
    ['Settled status', `held ${C.ilrHeldMonths} months`, 'ILR, EUSS settled status or indefinite leave to enter'],
    ['Immigration compliance', 'no breach in the period', 'pre-ILR breaches not usually checked'],
    ['Language', 'English, Welsh or Scottish Gaelic', 'proved with the application'],
    ['Life in the UK', 'a pass', 'the settlement pass is reused'],
    ['Good character', 'naturalisation guidance', 'read it before applying'],
    ['Future intention', 'to continue living in the UK', 'stated on the form'],
  ], 'Naturalisation with indefinite leave to remain or settled status, GOV.UK requirements read on ' + K.date(K.P.retrieved_at) + '.', ['l', 'l', 'l'])}
<p>The ${h.a('british-citizenship-application', 'application page')} explains how these dates combine into a first possible day and what the form and fee involve.</p>
<h2>Settled, yet over the citizenship limit</h2>
<p>The two sets of absence rules measure different things. Settlement caps any 12 months at ${S.maxAbsenceDays} days; citizenship caps the whole five years at ${C.maxAbsence5y}, an average of ${C.maxAbsence5y / C.residenceYears} a year. Someone can use most of the settlement allowance several times and still settle, then find citizenship further away than expected.</p>
<p>Take a Skilled Worker who arrived on ${K.date(settle.start)} and spent three long spells abroad of ${trips.map((t) => K.int(absentBetween([t], t.out, K.addDays(t.back, 1)))).join(', ')} whole days. No 12-month window exceeds ${S.maxAbsenceDays} days (the worst holds ${K.int(settle.worst.days)}), so ILR comes on time and we assume it is granted on the first day possible, ${K.date(settle.earliestApply)}. Twelve months later, on ${K.date(cit.ilrPlus12!)}, the five years before hold ${K.int(inWindow(cit.ilrPlus12!))} days abroad, above ${C.maxAbsence5y}. The total falls back under the limit on ${K.date(under)}, but that date lands inside the 2021 trip five years earlier, so the presence rule still fails. The calculator's first workable date is ${K.date(cit.earliest!)}, the day after the anniversary of the return.</p>
<h2>When absences are above the limits</h2>
<p>GOV.UK words the absence limits as what you "should not have" spent abroad, not as an automatic bar, and the naturalisation guidance is where the Home Office sets out how it treats an excess. This site does not publish thresholds or outcomes for applications above ${C.maxAbsence5y} or ${C.maxAbsence12m} days, because none are given on the GOV.UK pages we use. What GOV.UK does say:</p>
<ul>
<li>the form asks for every absence, and the Home Office checks its own records and corrects gaps or errors in what you give;</li>
<li>presence on the first day of the period can be excused for special circumstances, such as health reasons or travel restrictions that stopped you living in the UK at the start, or an order to leave that was later overturned;</li>
<li>a long time away after settling can mean the ILR itself has lapsed: more than ${S.loseIlrAfterYears} years at a time, or more than 5 years for EUSS settled status.</li>
</ul>
<p>If you are over a limit, waiting is the only route the calculator can show: it finds the day the window clears. For an application on discretion, talk to a solicitor or an adviser registered with the Immigration Advice Authority first; the fee is high enough to make a check worthwhile.</p>
<h2>Immigration history, character and what this page leaves out</h2>
<p>You should not have broken immigration law during the period, living in the UK illegally being the example GOV.UK gives. Holding ILR helps: the Home Office will not usually check for breaches before it. Good character is assessed under the naturalisation guidance; changes after you apply, such as an arrest, must be reported to UKVI by email.</p>
<p>Two topics are outside this page. Dual nationality: GOV.UK explains how dual citizens can travel to the UK, but whether your other country lets you keep its citizenship is for that country's authorities, and this site does not cover it. And other routes, such as the ${h.a('citizenship-spouse-of-british-citizen', 'spouse of a British citizen')} route or registration for children, have their own conditions. The ${h.a('ilr-absence-calculator', 'ILR absence calculator')} covers the settlement side of the same trips.</p>`,
  faqs: [
    { q: 'What happens if I spent more than 450 days outside the UK?', a: `You do not meet the usual residence requirement, and the calculator moves your earliest date to the first day the five-year window falls back under ${C.maxAbsence5y} days. GOV.UK says you "should not have" exceeded the limit; how the Home Office treats an excess is set out in its naturalisation guidance. Get advice before applying above the limit.` },
    { q: 'Do days in Ireland count as absences for naturalisation?', a: `The citizenship pages count time "outside the UK", and Ireland is outside the UK, so treat those days as absences unless the guidance tells you otherwise. Keep tickets or booking records, since the Home Office compares your list with its own travel records.` },
    { q: 'Can I become British if I broke immigration rules before getting ILR?', a: `Often the question does not arise: GOV.UK says that if you have indefinite leave, the Home Office will not usually check whether you broke immigration laws before then. Breaches within the residence period after settlement, such as living in the UK without permission, are a different matter. Anyone with a history of overstaying should get advice before applying.` },
    { q: 'Will I lose my current nationality if I become British?', a: `That depends on the law of your current country, not on the Home Office, and this site does not cover it. GOV.UK only explains how dual citizens can travel to the UK, for example on an expired UK passport, the other country's passport or a national identity card. Check with your country's authorities before you apply to naturalise.` },
  ],
  related: ['british-citizenship-application', 'british-citizenship-cost', 'ilr-absence-calculator', 'indefinite-leave-to-remain', 'citizenship-spouse-of-british-citizen'],
  sources: ['citizenship', 'life_in_uk', 'ilr', 'cr_guidance'],
});
