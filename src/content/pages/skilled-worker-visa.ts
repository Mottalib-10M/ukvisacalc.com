import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const t1 = K.count('Table 1'), t1a = K.count('Table 1a'), t3 = K.count('Table 3'), t6 = K.count('Table 6');
const fam = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: true, children: 2 });
const dev = K.occ('2134');

export default definePage({
  id: 'skilled-worker-visa',
  group: 'work',
  order: 10,
  nav: 'Skilled Worker visa',
  card: 'Eligibility by occupation code, salary threshold, fees and the route to settlement.',
  title: 'Skilled Worker Visa 2026: Salary, SOC Code and Cost Check',
  description: `Skilled Worker visa check for your job: SOC code, ${K.gbp(S.general)} threshold or going rate, new entrant and PhD rates, fees and health surcharge from the 2026 table.`,
  h1: 'Skilled Worker visa: check your job, salary and cost',
  intro: `Most new Skilled Worker jobs must pay at least ${K.gbp(S.general)} a year or the going rate of their occupation code, whichever is higher. Pick your code and salary to see where you stand.`,
  resume: `A Skilled Worker visa lets you work in the UK for an employer the Home Office has licensed, in a job whose occupation code is eligible, at a salary that meets two tests at once: the general threshold of ${K.gbp(S.general)} a year and the going rate of the code, pro-rated to your weekly hours. New entrants, holders of a relevant PhD, postdoctoral researchers and jobs on the Immigration Salary List can be paid less, down to ${K.gbp(S.newEntrant.floor)}, and health and education jobs follow national pay scales from ${K.gbp(S.healthEducation.floor)}. Since 22 July 2025 only ${t1} "higher skilled" codes are open to new applicants without conditions; ${t1a} "medium skilled" codes need a place on a shortage list, and ${t6} codes are not eligible at all. The calculator above applies those rules to your code and salary, then prices the visa: from outside the UK the fee is ${K.gbp(K.FEE.skilledWorker('outside', 3))} for up to three years and ${K.gbp(K.FEE.skilledWorker('outside', 5))} for longer, plus the health surcharge of ${K.gbp(K.P.ihs.standard)} a year for each person.`,
  tool: { kind: 'sw', props: { initialCode: '2134', initialSalary: 56000, title: 'Skilled Worker eligibility and salary check' } },
  body: (h) => `
<h2>The three things the Home Office checks</h2>
<p>Every Skilled Worker application scores points, and all 70 must be there: 20 for a certificate of sponsorship from a licensed employer, 20 for a job at the right skill level, 10 for English at level ${S.englishLevel}, and 20 for the salary. The first three are yes or no. The salary is where most refusals happen, because the threshold is not one number: it depends on the occupation code the employer chooses, on your hours, and on who you are.</p>
<p>The employer picks the four-digit code from the Standard Occupational Classification (SOC 2020) and writes it on the certificate. The caseworker may refuse if a less suitable code was chosen to get under a lower going rate, so the code has to match what you will actually do. The ${h.a('soc-code-checker', 'SOC code checker')} searches the ${h.int(K.OCCUPATIONS.length)} codes by job title.</p>
<h2>How the salary threshold is worked out</h2>
<p>For a new applicant in a standard job, the salary must reach both ${K.gbp(S.general)} a year and the going rate printed in Table 1 of Appendix Skilled Occupations. The going rate assumes a ${h.int(S.goingRateHours)}-hour week, so it rises or falls with the hours on the certificate; the ${K.gbp(S.general)} floor does not. A software developer (code ${dev.code}) has a going rate of ${K.gbp(dev.goingRate!)}: at full time the threshold is ${K.gbp(Math.max(S.general, dev.goingRate!))}, at 40 hours it becomes ${K.gbp(Math.max(S.general, dev.goingRate! * 40 / 37.5))}. Hours above ${S.maxCountedHours} a week do not count towards the salary, which stops long rotas from inflating pay on paper.</p>
<p>Since 8 April 2026 the rules also say the pay must hold in every pay period: each month (or week) must reach the going rate for the hours worked that period, so an annual figure propped up by a year-end bonus no longer works. Only guaranteed basic gross pay counts (employee pension and National Insurance contributions included); shift pay, overtime, bonuses, accommodation or cost-of-living allowances and benefits in kind do not.</p>
${h.table(['Situation', 'Floor', 'Share of the going rate', 'Option'], [
    ['Standard job', K.gbp(S.general), '100%', 'A'],
    ['PhD relevant to the job (any subject)', K.gbp(S.phdOther.floor), K.pct(S.phdOther.share), 'B'],
    ['PhD in a STEM subject', K.gbp(S.phdStem.floor), K.pct(S.phdStem.share), 'C'],
    ['Job on the Immigration Salary List', K.gbp(S.isl.floor), '100%', 'D'],
    ['New entrant or postdoctoral position', K.gbp(S.newEntrant.floor), K.pct(S.newEntrant.share), 'E'],
    ['Listed health or education job', K.gbp(S.healthEducation.floor), 'national pay scale', 'K'],
  ], `Salary options for first applications, Appendix Skilled Worker as amended by HC 584 (in force 8 October 2026).`, ['l', 'r', 'r', 'l'])}
<h2>Which occupation codes are still open</h2>
<p>The July 2025 reform raised the skill level to degree level (RQF 6). Codes below it moved to Table 1a and are open to new applicants only while they sit on the Immigration Salary List or the Temporary Shortage List, whose certificates must be issued before ${K.SOC.tslUntil}. Workers already in a medium skilled job before 22 July 2025 keep access to it, with their dependants. Care workers (codes 6135 and 6136) can no longer be recruited from abroad; switching inside the UK is allowed until 22 July 2028 after three months with the sponsor. The ${h.a('immigration-salary-list', 'Immigration Salary List page')} and the ${h.a('temporary-shortage-list', 'Temporary Shortage List page')} give the codes and their conditions.</p>
<h2>What the visa costs a family</h2>
<p>Each person pays the application fee for the same length as the main applicant, and the immigration health surcharge for every year, children at the reduced ${K.gbp(K.P.ihs.reduced)}. A couple with two children applying from abroad for five years pays ${K.gbp(fam.fees)} in fees and ${K.gbp(fam.ihsTotal)} in surcharge, ${K.gbp(fam.total)} in all, before the ${K.gbp(S.maintenance)} of savings each adult may have to show. Jobs on the Immigration Salary List pay a lower fee (${K.gbp(K.FEE.skilledWorker('outside', 3, true))} up to three years), and the Health and Care Worker visa is cheaper again with no surcharge. The ${h.a('uk-visa-cost-calculator', 'cost calculator')} prices any combination.</p>
${h.tool({ kind: 'cost', props: { initialRoute: 'skilled-worker', initialMonths: 60, initialPartner: true, initialChildren: 2, title: 'Skilled Worker visa cost for your family' } })}
<h2>From visa to settlement</h2>
<p>After ${K.P.settlement.skilledWorkerYears} continuous years you can apply for indefinite leave to remain, 28 days early, if you spent no more than ${K.P.settlement.maxAbsenceDays} days abroad in any 12 months and your salary still meets the settlement threshold (${K.gbp(S.general)} or the going rate for most). From 26 March 2027 settlement will need English at B2. The government consulted on "earned settlement" from November 2025; the rules in force on ${K.date(K.P.retrieved_at)} still say five years. The ${h.a('indefinite-leave-to-remain', 'ILR calculator')} dates it from your trips.</p>`,
  faqs: [
    { q: 'What is the minimum salary for a Skilled Worker visa in 2026?', a: `For a first application in a standard job, ${K.gbp(S.general)} a year or the going rate of the occupation code, whichever is higher, pro-rated for hours other than ${S.goingRateHours} a week. New entrants, relevant PhD holders and Immigration Salary List jobs can go down to ${K.gbp(S.newEntrant.floor)}, and listed health and education jobs to ${K.gbp(S.healthEducation.floor)} or the pay scale.` },
    { q: 'Can I apply for a Skilled Worker visa without a job offer?', a: 'No. You need a certificate of sponsorship from an employer on the register of licensed sponsors, for a specific job and salary, and you must apply within three months of receiving it. Without an offer, the Global Talent, High Potential Individual or Graduate routes are the ones that do not need a sponsor.' },
    { q: 'How long does a Skilled Worker visa last?', a: `Up to ${S.maxCosYears} years per grant, ending ${S.leaveAfterCosEndDays} days after the end date on the certificate of sponsorship, and it can be extended as often as needed. After five continuous years you can apply to settle. Changing employer or occupation code needs a new application, not a notification.` },
    { q: 'Does the employer pay any of the costs?', a: `The employer pays its licence, ${K.gbp(K.FEE.cosWorker())} for each certificate of sponsorship and the immigration skills charge, ${K.gbp(K.P.sponsor.isc.large.first12)} for the first year for a medium or large company; it may not pass these on to you. Your own application fee and surcharge can be paid by you or reimbursed by the employer.` },
  ],
  related: ['skilled-worker-visa-salary-threshold', 'skilled-worker-going-rates', 'soc-code-checker', 'health-and-care-worker-visa', 'uk-visa-cost-calculator', 'register-of-licensed-sponsors', 'indefinite-leave-to-remain'],
  sources: ['sw_visa', 'appendix_sw', 'appendix_aso', 'sw_paid_less', 'sw_costs', 'fees_table', 'ihs'],
});
