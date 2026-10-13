import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const el = K.occ('5241');
const std = K.checkSkilledWorker({ code: '5241', salary: 0, hours: 37.5, situation: 'standard', nation: 'England' });
const h45 = K.checkSkilledWorker({ code: '5241', salary: 0, hours: 45, situation: 'standard', nation: 'England' });
const h50 = K.checkSkilledWorker({ code: '5241', salary: 0, hours: 50, situation: 'standard', nation: 'England' });
const TRADES = ['5241', '5246', '5249', '5250', '3112', '2123', '5231'].map((c) => K.occ(c));

export default definePage({
  id: 'electrician-visa-uk',
  group: 'work',
  order: 270,
  nav: 'Electrician visa',
  card: 'Code 5241 on the Temporary Shortage List: the £41,700 test, long hours and the electrical trades nearby.',
  title: 'Electrician Visa 2026: SOC 5241, Shortage List and £41,700',
  description: `Electrician visa: code 5241 can be sponsored through the Temporary Shortage List until the end of 2026 at ${K.gbp(std.required)} a year. Hours, overtime and nearby trades.`,
  h1: 'Electrician visa: the shortage list, the threshold and the hours',
  intro: `Electricians and electrical fitters (code 5241) can be sponsored on certificates issued before ${K.SOC.tslUntil}, for at least ${K.gbp(std.required)} a year of guaranteed basic pay.`,
  resume: `Electricians are one of the skilled trades that the July 2025 reform moved below the Skilled Worker skill threshold: code 5241, electricians and electrical fitters, is now in Table 1a, the medium skilled list. It stays open to new applicants because it is on the Temporary Shortage List of Appendix Skilled Worker, for certificates of sponsorship issued before ${K.SOC.tslUntil}. The going rate is ${K.gbp(el.goingRate!)} for a 37.5-hour week, below the general threshold, so a full-time electrician needs ${K.gbp(S.general)} of guaranteed basic pay. Long weeks change the arithmetic: the going rate grows with the hours, up to ${K.gbp(h50.goingRateProRata!)} for 50 hours, while only the first ${S.maxCountedHours} hours of pay count towards the threshold. Overtime, call-out and shift premiums are excluded. The examples under the code (${K.listOf(el.examples.slice(0, 5).map((e) => e.toLowerCase()))}) show that installation work in renewables is covered too.`,
  tool: { kind: 'sw', props: { initialCode: '5241', initialSalary: 43000, initialSituation: 'standard', title: 'Electrician salary check' } },
  body: (h) => `
<h2>Electrical trades: which are open</h2>
${h.table(['Code', 'New applicants', 'Going rate (37.5 h)'], TRADES.map((o) => [`${o.code} ${o.title}`, o.table === 'Table 1' ? 'open' : o.tsl ? `Temporary Shortage List, until ${K.SOC.tslUntil}` : 'existing workers only', o.goingRate ? K.gbp(o.goingRate) : '–']), 'Appendix Skilled Occupations and SW 6.1A of Appendix Skilled Worker.', ['l', 'l', 'r'])}
<p>Electrical engineers (2123) are a degree-level code, permanently open, at a going rate of ${K.gbp(K.occ('2123').goingRate!)}. Electrical service and maintenance mechanics (5246) and trades supervisors (5250) are medium skilled but not on the shortage list: only workers already sponsored in them before 22 July 2025 can stay in them. Vehicle electricians belong to 5231, also on the list. The code must fit the duties, so an employer cannot move a maintenance mechanic into 5241 to use the list.</p>
<h2>Hours, overtime and the threshold</h2>
<p>Site work often means long contracted weeks. The rules treat them in two opposite ways. The going rate is pro-rated to the weekly hours on the certificate, without limit: at 45 hours a week it becomes ${K.gbp(h45.goingRateProRata!)}, still below the ${K.gbp(S.general)} floor, so the floor remains the test (${K.gbp(h45.required)}). The salary, on the other hand, counts only for the first ${S.maxCountedHours} hours: on a 50-hour contract, the caseworker looks at 48/50 of the pay. And it must be guaranteed basic pay, paid in every pay period at no less than the going rate for the hours worked; overtime, call-outs and bonuses never count.</p>
<p>Take a contract of 50 hours a week paid ${K.gbp(44000)} a year. The going rate for those hours is ${K.gbp(h50.goingRateProRata!)} and the floor ${K.gbp(S.general)}; the pay counted is 48/50 of the salary, ${K.gbp(K.checkSkilledWorker({ code: '5241', salary: 44000, hours: 50, situation: 'standard', nation: 'England' }).countedSalary)}, which clears both. The same pay spread over 60 hours would count only ${K.gbp(K.checkSkilledWorker({ code: '5241', salary: 44000, hours: 60, situation: 'standard', nation: 'England' }).countedSalary)} and fail.</p>
<p>A worker on a fixed day rate should make sure the contract states the hours and an annual salary that meets both tests once the extra hours are stripped out. The checker above does that calculation when you enter the weekly hours.</p>
<h2>Before and after the deadline</h2>
<p>The Temporary Shortage List is time-limited: a certificate assigned on or before ${K.SOC.tslUntil} can be used, after it the code closes to new recruits unless the Home Office extends it. Workers recruited through the list cannot bring dependants on the same route, and the new entrant rate (${K.gbp(K.checkSkilledWorker({ code: '5241', salary: 0, hours: 37.5, situation: 'new-entrant', nation: 'England' }).required)}) is available to apprentices and those under 26 who qualify. Employers in the trade pay the usual costs: ${K.gbp(K.FEE.cosWorker())} per certificate and the immigration skills charge, ${K.gbp(K.skillsCharge(36, true))} for three years at a small firm. The ${h.a('temporary-shortage-list', 'Temporary Shortage List page')} lists every code with the same deadline.</p>`,
  faqs: [
    { q: 'Do electricians need a UK qualification to get the visa?', a: 'The Skilled Worker rules test the job, the code and the salary; the employer certifies that you have the skills the job needs and must keep evidence of your qualifications. Whether you can work on electrical installations is a matter of UK competence schemes and the employer’s requirements, which the visa does not decide.' },
    { q: 'Can an electrician’s overtime count towards the salary threshold?', a: `No. Only guaranteed basic gross pay counts. Overtime, shift premiums, call-out payments and bonuses are excluded even if regular, and pay for hours beyond ${S.maxCountedHours} a week is ignored. A contract that reaches ${K.gbp(S.general)} only with overtime does not meet the threshold.` },
    { q: 'Is the electrician job on the Immigration Salary List?', a: `No. Code 5241 is on the Temporary Shortage List, which keeps it eligible but gives no salary discount and no fee reduction. The Immigration Salary List covers other trades, such as bricklayers, roofers, carpenters and welders, with a ${K.gbp(S.isl.floor)} floor and a lower visa fee.` },
  ],
  related: ['temporary-shortage-list', 'skilled-worker-visa-salary-threshold', 'engineer-visa-uk', 'immigration-salary-list', 'sponsor-licence'],
  sources: ['appendix_sw', 'appendix_aso', 'appendix_isl', 'sponsor_guide'],
});
