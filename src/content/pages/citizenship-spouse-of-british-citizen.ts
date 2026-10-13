import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.P.citizenship;
const start = '2026-11-02', ilrOn = '2031-10-10';
const clean = K.citizenshipDate(start, ilrOn, [], true);
const startTrip = { out: '2028-10-01', back: '2028-11-15' };
const atStart = K.citizenshipDate(start, ilrOn, [startTrip], true);
const summer = { out: '2031-05-01', back: '2031-08-15' };
const late = K.citizenshipDate(start, ilrOn, [summer], true);
const standard = K.citizenshipDate(start, ilrOn, [summer], false);
const fee = K.FEE.naturalisation(), cer = K.FEE.ceremony();

export default definePage({
  id: 'citizenship-spouse-of-british-citizen',
  group: 'settlement',
  order: 120,
  nav: 'Citizenship as a spouse',
  card: 'Naturalising after three years when married to a British citizen, with no 12-month wait after ILR.',
  title: 'Citizenship as Spouse of a British Citizen: 3-Year Route',
  description: `Naturalisation as the spouse of a British citizen: ${C.spouseResidenceYears} years in the UK, at most ${C.spouseMaxAbsence3y} days away, ${C.spouseMaxAbsence12m} in the last year, no 12-month wait after ILR, ${K.gbp(fee + cer)} in fees.`,
  h1: 'Applying for citizenship when your spouse is British',
  intro: `Married to a British citizen, you can apply as soon as you hold indefinite leave, once you have lived here ${C.spouseResidenceYears} years. The fee is ${K.gbp(fee)} plus ${K.gbp(cer)} for the ceremony.`,
  resume: `Naturalisation for the husbands, wives and civil partners of British citizens is shorter than the standard one in two ways. The residence period is ${C.spouseResidenceYears} years instead of ${C.residenceYears}, and you can apply on the day you receive indefinite leave to remain, settled status or indefinite leave to enter, without the ${C.ilrHeldMonths}-month wait that applies to everyone else. You must be 18 or over and still married to, or in a civil partnership with, the British citizen. In the ${C.spouseResidenceYears} years before the Home Office receives your application you may have spent no more than ${C.spouseMaxAbsence3y} days outside the UK, and no more than ${C.spouseMaxAbsence12m} in the last 12 months, and you must have been physically in the UK on the first day of that period. English at B1, the Life in the UK test and good character are required. The cost is ${K.gbp(fee)} for the application and ${K.gbp(cer)} for the citizenship ceremony, ${K.gbp(fee + cer)} in total, and a decision usually arrives within ${C.decisionMonths} months.`,
  tool: { kind: 'citizenship', props: { initialRoute: 'family', title: 'Citizenship date for the spouse of a British citizen' } },
  body: (h) => `
<h2>Three tests on the calendar</h2>
<p>The spouse route still counts days, just fewer of them. The calculator above checks three conditions for each possible application date, using whole days away (the day you leave and the day you come back are both treated as days in the UK).</p>
<ul>
<li><strong>The ${C.spouseResidenceYears}-year window</strong>: no more than ${C.spouseMaxAbsence3y} days outside the UK in the ${C.spouseResidenceYears} years before the Home Office receives your application.</li>
<li><strong>The last 12 months</strong>: no more than ${C.spouseMaxAbsence12m} days away in that year.</li>
<li><strong>The first day</strong>: you must have been physically present in the UK exactly ${C.spouseResidenceYears} years before the application is received. GOV.UK gives the example of an application received on 20 June 2022 by someone who returned from abroad on 25 June 2019: they had to wait until 24 June 2022.</li>
</ul>
<p>On top of these, you need indefinite leave (or settled status) on the date you apply. Time spent in the UK as a diplomat, a member of a diplomat's household or visiting armed forces does not count, and the residence should not have been in breach of immigration law; with indefinite leave, the Home Office will not usually look back at breaches before it was granted.</p>
<h2>Three couples, three dates</h2>
<p>Each example below is a spouse who started living in the UK on ${K.date(start)} on a partner visa and was granted indefinite leave on ${K.date(ilrOn)}, computed by the citizenship engine.</p>
${h.table(['Travel history', 'Earliest application', 'Why'], [
    ['Short holidays only', K.date(clean.earliest!), 'the day indefinite leave is granted'],
    [`Abroad ${K.date(startTrip.out)} to ${K.date(startTrip.back)}`, K.date(atStart.earliest!), 'must be in the UK on the first day of the three years'],
    [`Abroad ${K.date(summer.out)} to ${K.date(summer.back)}`, K.date(late.earliest!), `wait until the last 12 months fall to ${C.spouseMaxAbsence12m} days`],
    ['Same trip, not married to a British citizen', K.date(standard.earliest!), `${C.ilrHeldMonths} months after indefinite leave, five-year rules`],
  ], 'Dates from the citizenship calculator, spouse and standard rules.', ['l', 'r', 'l'])}
<p>The third case is the common trap: a long summer abroad in the year before applying. The ${C.spouseMaxAbsence12m}-day limit is strict on paper, and the extra time only stops counting once the trip slides out of the 12-month window. GOV.UK says special circumstances are considered for the first-day test, such as illness or travel restrictions, but the calculator cannot judge them, so it shows the date on which none is needed. The last line shows what the same person would wait without a British spouse: a full year after settlement.</p>
<h2>Applying, and what happens after</h2>
<p>Most people apply online, which means the Home Office receives the application on the same day; postal applications are received later, which matters for the first-day test. You then give fingerprints and a photo at a UKVCAS service point, where documents can be uploaded or scanned. You need English at B1 or above in speaking and listening (or a degree taught in English), unless exempt, and a Life in the UK pass. A pass from your settlement application is reused through its reference number, so you do not sit the test again.</p>
<p>The Home Office aims to decide within ${C.decisionMonths} months and tells you before then if it needs longer. If approved, you are invited to a citizenship ceremony, and your permission to stay must last until it has taken place. If you held a biometric residence permit, it must be returned within five working days of receiving your certificate, cut into four pieces. You then need a British passport (or a certificate of entitlement) to travel back into the UK.</p>
<p>The route closes if your British partner dies before you apply; you would then use the ${h.a('british-citizenship-application', 'standard naturalisation route')}. People with pre-settled status who are EU citizens or their family members, or who are exempt because their spouse works abroad for the UK government, have their own arrangements set out on ${h.src('citizenship_spouse', 'GOV.UK')}. For a complex history or character concerns, see a solicitor or an adviser registered with the Immigration Advice Authority. The ${h.a('ilr-after-spouse-visa', 'ILR after a spouse visa page')} covers the step before this one.</p>`,
  faqs: [
    { q: 'Do I need to wait 12 months after ILR if my wife or husband is British?', a: `No. Married to, or in a civil partnership with, a British citizen, you can apply on the day you get indefinite leave to remain, settled status or indefinite leave to enter, provided you have also lived here ${C.spouseResidenceYears} years and meet the absence limits. The ${C.ilrHeldMonths}-month wait after settlement applies only to the standard ${C.residenceYears}-year route.` },
    { q: 'Can an unmarried partner of a British citizen use the three-year route?', a: `No. The shorter route is for spouses and civil partners only, and you must be married or in the civil partnership on the date you apply. An unmarried partner who has settled uses the standard route: ${C.residenceYears} years of residence, ${C.maxAbsence5y} days of absence at most, and indefinite leave held for ${C.ilrHeldMonths} months.` },
    { q: 'How do I prove my absences for naturalisation?', a: 'List every trip on the form with the dates you left and returned, using your own records such as boarding passes, emails or passport stamps. GOV.UK says the Home Office then checks its own travel records and fills gaps or corrects dates itself. Count only whole days abroad; the calculator applies that method automatically to the dates you enter.' },
  ],
  related: ['british-citizenship-application', 'british-citizenship-requirements', 'british-citizenship-cost', 'ilr-after-spouse-visa', 'spouse-visa-uk'],
  sources: ['citizenship_spouse', 'citizenship', 'fees_table', 'life_in_uk', 'english'],
});
