import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
const W = K.P.skilledWorker;
// Worked example: a Skilled Worker who arrived on 14 March 2022 and made three trips.
const trips = [
  { out: '2023-08-05', back: '2023-08-27' },
  { out: '2024-12-18', back: '2025-01-06' },
  { out: '2025-07-12', back: '2025-08-09' },
];
const ex = K.settlementDate('skilled-worker', '2022-03-14', trips);
const b2 = S.englishB2SettlementFrom;
const fam3 = K.visaCost({ route: 'ilr', where: 'inside', months: 0, partner: true, children: 1 });

export default definePage({
  id: 'indefinite-leave-to-remain',
  group: 'settlement',
  order: 10,
  nav: 'Indefinite leave to remain',
  card: 'Qualifying periods by route, the 180-day rule, tests, fee and the date you can apply.',
  title: 'Indefinite Leave to Remain 2026: Dates, Rules and Fee Check',
  description: `Indefinite leave to remain in 2026: qualifying period by route, 28 days early, ${S.maxAbsenceDays}-day rolling rule, Life in the UK, B2 English from 2027 and ${K.gbp(K.FEE.ilr())} fee.`,
  h1: 'Indefinite leave to remain: when you qualify and what it takes',
  intro: `Most work and family routes lead to settlement after ${S.skilledWorkerYears} years, long residence after ${S.longResidenceYears}. You can apply ${S.applyEarlyDays} days early if you stayed within ${S.maxAbsenceDays} days abroad in any 12 months. Enter your start date and trips to get your date.`,
  resume: `Indefinite leave to remain (ILR), also called settlement, ends the time limit on your stay: you can live, work and study in the UK for as long as you like and, usually after 12 months, apply to naturalise. The qualifying period depends on the route you are on. Skilled Worker, Health and Care Worker, UK Ancestry and partner routes need ${S.skilledWorkerYears} continuous years, the Global Talent route ${S.globalTalentFastYears} or ${S.globalTalentYears}, and long residence ${S.longResidenceYears} lawful years on almost any mix of visas. Throughout the period you must not spend more than ${S.maxAbsenceDays} whole days outside the UK in any rolling 12 months, and you may apply up to ${S.applyEarlyDays} days before it ends. Adults aged 18 to 64 pass the Life in the UK test; from ${K.date(b2)} most routes also require English at B2. Skilled Workers still need a sponsor and a salary at the settlement threshold. The fee is ${K.gbp(K.FEE.ilr())} for each person, with a standard decision in about ${S.decisionMonths} months.`,
  tool: { kind: 'ilr', props: { initialRoute: 'skilled-worker', title: 'Your ILR date from your start date and trips abroad' } },
  body: (h) => `
<h2>Your route decides the length of the wait</h2>
<p>Settlement is not one application but a family of them, each written into the appendix of the route you hold. The table gives the usual qualifying period; the rules for each route add their own conditions on top. Time only counts on routes that lead to settlement: a Skilled Worker cannot add years spent as a Student or on the Graduate route, and cannot count time as someone else's dependant. The long residence route is the exception that takes almost any lawful permission, which is why people who studied, then worked, then switched visas often end up there.</p>
${h.table(['Route', 'Qualifying period', 'Condition on top'], [
    ['Skilled Worker, Health and Care Worker', `${S.skilledWorkerYears} years`, 'sponsor still licensed, salary at the settlement threshold'],
    ['Global Talent', `${S.globalTalentFastYears} or ${S.globalTalentYears} years`, 'money earned in your field; 5 years for exceptional promise'],
    ['UK Ancestry', `${S.ancestryYears} years`, 'still able to work and intending to, without public funds'],
    ['Partner of a British or settled person', `${S.familyYears} years`, 'family rules met again (see the spouse ILR page)'],
    ['Long residence', `${S.longResidenceYears} years`, 'lawful stay throughout; current permission held 12 months if granted on or after ' + K.date(S.longResidenceLegacy.cutoff)],
  ], 'Usual qualifying periods for settlement under the Immigration Rules in force on ' + K.date(K.P.retrieved_at) + '.', ['l', 'l', 'l'])}
<p>Skilled Worker time can be combined with Global Talent, Innovator Founder, Scale-up, T2 Minister of Religion, International Sportsperson, Representative of an Overseas Business and most Tier 1 permissions (SW 21.2), so a worker who moved between those routes keeps the clock running. The ${h.a('long-residence-ilr', 'long residence page')} covers the ten-year route, and the ${h.a('ilr-requirements', 'requirements checklist')} lists the evidence route by route.</p>
<h2>Counting to your application date</h2>
<p>Under Appendix Continuous Residence (CR 1.1) the Home Office counts your period back from the date most favourable to you, including any date up to ${S.applyEarlyDays} days after you apply. In practice you can submit ${S.applyEarlyDays} days before the anniversary; any earlier and the application may be refused. Absences are counted in whole days and tested in every 12-month window, not by calendar year.</p>
<p>Take a Skilled Worker who arrived on ${K.date(ex.start)} and spent three spells abroad of ${K.int(ex.totalAbsent)} days in all. No 12-month window holds more than ${K.int(ex.worst.days)} days, so nothing breaks. The five years end on ${K.date(ex.qualifyingEnd)} and the earliest application date is ${K.date(ex.earliestApply)}. That date falls before ${K.date(b2)}, so under SW 22A.1 the new B2 English requirement would not yet apply to that application. Had one trip pushed a window past ${S.maxAbsenceDays} days, the period would have restarted: the ${h.a('ilr-absence-calculator', 'absence calculator')} shows where the limit bites and how many days you have left.</p>
<h2>The tests on the day you apply</h2>
<p><strong>Life in the UK.</strong> Applicants aged 18 to 64 need a pass: 24 questions in 45 minutes, 75% to pass, ${K.gbp(K.FEE.lifeInUk())} each attempt, booked at least three days ahead. The unique reference number goes on the form. A pass counts again later for citizenship.</p>
<p><strong>English.</strong> Skilled Workers proved English when they got the visa and, for applications made before ${K.date(b2)}, prove nothing more at settlement. The Statement of Changes HC 1691 raises the settlement requirement to B2 from ${K.date(b2)} on most routes (Skilled Worker, Global Talent, UK Ancestry, long residence and family life among them), and it applies to people already on the path. Routes that ask for B1 today move to B2 on that date.</p>
<p><strong>Salary, for Skilled Workers.</strong> Your sponsor must still hold its licence, confirm it needs you for the foreseeable future, and pay at least the settlement salary in SW 24.3: ${K.gbp(W.general)} and the going rate for most people, ${K.gbp(W.isl.floor)} for a job on the Immigration Salary List, ${K.gbp(W.transitional.general)} if your first certificate of sponsorship predates ${K.date(W.transitional.cutoff)}, and ${K.gbp(W.healthEducation.floor)} with the pay-scale rate for listed health and education jobs. A salary that only met the threshold with allowances will fail here as it would on an extension.</p>
<p><strong>Suitability.</strong> Criminal convictions and immigration breaches are assessed under Part Suitability on every route. For a refusal history or a conviction, take advice from a solicitor or an adviser registered with the Immigration Advice Authority.</p>
<h2>Fee, decision and keeping the status</h2>
<p>The application costs ${K.gbp(K.FEE.ilr())} for each person, with no health surcharge and no fee for biometrics. A worker settling with a partner and one child pays ${K.gbp(fam3.fees)}. A standard decision usually takes ${S.decisionMonths} months from the biometrics appointment; ${K.gbp(K.FEE.priorityInside())} buys the priority service (5 working days) and ${K.gbp(K.FEE.superPriorityInside())} super priority (the next working day after a weekday appointment). Until you hear, stay in the UK, Ireland, the Channel Islands or the Isle of Man, or the application is withdrawn. The ${h.a('ilr-fee', 'ILR fee page')} and the ${h.a('ilr-processing-time', 'processing time page')} go into both.</p>
<p>Once granted, settlement does not expire, but it lapses if you spend more than ${S.loseIlrAfterYears} years in a row outside the UK; you would then need a Returning Resident visa. Twelve months after the grant most people can apply for ${h.a('british-citizenship-application', 'British citizenship')}. The ${h.a('earned-settlement', 'earned settlement page')} explains the reform the government consulted on; the rules in force on ${K.date(K.P.retrieved_at)} still give the periods above.</p>`,
  faqs: [
    { q: 'Can I apply for ILR before my five years are complete?', a: `Yes, up to ${S.applyEarlyDays} days before. Appendix Continuous Residence lets the Home Office count the qualifying period back from any date up to ${S.applyEarlyDays} days after you apply, so an application made inside that window is treated as if the period were complete. Earlier than that and the application may be refused, so check the date twice before you pay.` },
    { q: 'Do I need to pass an English test to settle on a Skilled Worker visa?', a: `Not for an application made before ${K.date(b2)}: you proved English when the visa was granted. From that date the rules (SW 22A.1, added by HC 1691) ask for B2 in speaking and listening unless an exemption applies, including for people who arrived under the old rules. Plan a test well before the application if your date falls after it.` },
    { q: 'Does time on a Graduate or Student visa count towards ILR?', a: `Not on the Skilled Worker route: only time with permission on the routes listed in SW 21.2, as the main applicant, counts. Student and Graduate time does count towards the ${S.longResidenceYears}-year long residence route, which accepts almost any lawful permission apart from visitor, short-term study, Seasonal Worker and Ukraine scheme permission.` },
    { q: 'Can I change jobs once I have indefinite leave to remain?', a: `Yes. The sponsor and salary conditions apply up to the decision, not afterwards: with ILR you can work for any employer, run a business, study and use public services such as healthcare and schools, and apply for benefits if eligible. The grant comes as an eVisa, a digital record of your status. Changing jobs while the application is pending is different, as the sponsor must still confirm it needs you.` },
    { q: 'Can I lose indefinite leave to remain once I have it?', a: `Yes, mainly through absence: it lapses if you stay outside the UK for more than ${S.loseIlrAfterYears} years at a time, and you would need a Returning Resident visa to come back. Holding it does not depend on a job or a sponsor any more. Naturalising removes the absence risk, which is one reason many people apply for citizenship after the 12-month wait.` },
    { q: 'Is indefinite leave to remain the same as settled status?', a: `Both are permanent permission to stay, but settled status is the version granted under the EU Settlement Scheme to EU, EEA and Swiss citizens and their families who lived in the UK by 31 December 2020. Everyone else settles through the route they hold. Either one, held for 12 months, opens the way to naturalisation.` },
  ],
  related: ['ilr-absence-calculator', 'ilr-requirements', 'ilr-fee', 'long-residence-ilr', 'ilr-processing-time', 'earned-settlement', 'british-citizenship-application', 'skilled-worker-visa'],
  sources: ['ilr', 'ilr_sw', 'continuous_residence', 'cr_guidance', 'life_in_uk', 'hc_1691', 'appendix_sw', 'fees_table'],
});
