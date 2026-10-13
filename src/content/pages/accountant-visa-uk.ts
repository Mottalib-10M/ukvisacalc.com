import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const acc = K.occ('2421');
const FIN = ['2421', '2422', '2423', '2431', '2433', '3533', '3534', '4122'].map((c) => K.occ(c)).filter((o) => o);
const row = (o: ReturnType<typeof K.occ>) => [`${o.code} ${o.title}`, o.table === 'Table 1' ? 'open' : o.tsl ? 'Temporary Shortage List' : o.table === 'Table 6' ? 'not eligible' : 'existing workers only', o.goingRate ? K.gbp(o.goingRate) : '–'];
const trainee = K.checkSkilledWorker({ code: '2421', salary: 0, hours: 37.5, situation: 'new-entrant', nation: 'England' });
const std = K.checkSkilledWorker({ code: '2421', salary: 0, hours: 37.5, situation: 'standard', nation: 'England' });

export default definePage({
  id: 'accountant-visa-uk',
  group: 'work',
  order: 250,
  nav: 'Accountant visa',
  card: 'Code 2421 and the finance codes around it: going rates, trainee rate and which roles are still open.',
  title: 'Accountant Visa 2026: SOC 2421 Going Rate and Trainee Rate',
  description: `Accountant visa: qualified accountants (SOC 2421) need ${K.gbp(std.required)} or more; trainees working towards chartered status can be paid ${K.gbp(trainee.required)}. Finance codes compared.`,
  h1: 'Accountant visa: the going rate for qualified and trainee accountants',
  intro: `Chartered and certified accountants (code 2421) must earn at least ${K.gbp(std.required)}, the going rate; a trainee working towards chartered status can be sponsored from ${K.gbp(trainee.required)}.`,
  resume: `Qualified accountants are sponsored under SOC code 2421, "chartered and certified accountants", a higher skilled code in Table 1 of Appendix Skilled Occupations that is open to new applicants. Its going rate is ${K.gbp(acc.goingRate!)} a year for 37.5 hours, above the general threshold of ${K.gbp(S.general)}, so the going rate is the figure to beat: an offer of ${K.gbp(S.general)} for a qualified auditor is not enough. Because the code is eligible for PhD points, the discounted rates are ${K.gbp(acc.r90!)} (relevant PhD) and ${K.gbp(acc.r80!)} (STEM PhD). The more common discount in accountancy is the new entrant rate, which covers people "working towards full registration or chartered status" in the job they are sponsored for: ${K.gbp(trainee.required)}, 70% of the going rate. The neighbouring finance codes do not all share that position: several technician and clerical roles moved to the medium skilled table in July 2025. The checker above applies the rules to your offer.`,
  tool: { kind: 'sw', props: { initialCode: '2421', initialSalary: 52000, title: 'Accountant salary check' } },
  body: (h) => `
<h2>Which finance roles can still be sponsored</h2>
${h.table(['Occupation code', 'New applicants', 'Going rate'], FIN.map(row), `Appendix Skilled Occupations; "Temporary Shortage List" means certificates issued before ${K.SOC.tslUntil}.`, ['l', 'l', 'r'])}
<p>The split follows the July 2025 reform, which kept degree-level occupations open and moved the rest to Table 1a. Book-keepers and payroll clerks (4122) and financial and accounting technicians (3533) sit on the Temporary Shortage List, which keeps them open to new applicants, at the higher of the general threshold and the going rate (${K.gbp(K.occ('3533').goingRate!)} for technicians, well above the floor), only for certificates assigned before ${K.SOC.tslUntil} and without dependants joining. The examples listed under 2421 (${K.listOf(acc.examples.slice(0, 5).map((e) => e.toLowerCase()))}) show what the Home Office expects the job to be: a qualified role. An "accounts assistant" offer coded 2421 would be the kind of mismatch SW 6.2 allows a caseworker to refuse.</p>
<h2>Trainees, part qualifiers and graduates</h2>
<p>A graduate trainee on an ACA, ACCA or CIMA scheme can usually rely on two of the new entrant grounds at once: working towards chartered status, and often being under 26 or switching from a Student or Graduate visa. Either way the floor is ${K.gbp(S.newEntrant.floor)} and the rate 70% of ${K.gbp(acc.goingRate!)}, and the total time on new entrant terms is capped at ${S.newEntrant.maxStayYears} years, Graduate visa time included. Once that window closes, the worker must be paid the full going rate at the next extension. A firm planning to keep its trainees should budget for that step.</p>
<p>For a part-time contract the going rate shrinks with the hours but the ${K.gbp(S.general)} floor does not: a qualified accountant on 30 hours a week needs ${K.gbp(K.checkSkilledWorker({ code: '2421', salary: 0, hours: 30, situation: 'standard', nation: 'England' }).required)}, the floor, not the pro-rated rate. Only guaranteed basic pay counts, so a bonus or a study allowance does not help to meet it.</p>
<h2>Costs on both sides</h2>
<p>The accountant pays ${K.gbp(K.FEE.skilledWorker('outside', 3))} for a visa of up to three years from abroad and the health surcharge of ${K.gbp(K.P.ihs.standard)} a year; the firm pays ${K.gbp(K.FEE.cosWorker())} for the certificate and the immigration skills charge, ${K.gbp(K.skillsCharge(36, false))} for three years at a medium or large practice. Small practices pay the lower rates of ${K.gbp(K.FEE.licenceSmall())} for the licence and ${K.gbp(K.skillsCharge(36, true))} of skills charge. The ${h.a('sponsor-licence', 'sponsor licence calculator')} adds them up; the ${h.a('new-entrant-salary', 'new entrant page')} details the trainee rate.</p>`,
  faqs: [
    { q: 'Is accountancy on a shortage list for the Skilled Worker visa?', a: `Qualified accountancy (code 2421) is not on the Immigration Salary List and does not need to be: it is a higher skilled code, open to new applicants at its going rate of ${K.gbp(acc.goingRate!)}. Financial and accounting technicians and book-keepers are on the Temporary Shortage List, which keeps them open only until ${K.SOC.tslUntil}.` },
    { q: 'Can a part-qualified accountant get a Skilled Worker visa?', a: `Yes, if the job is coded 2421 and the person is working towards chartered or certified status in it: the new entrant rate then applies, ${K.gbp(trainee.required)} for a full-time post. The employer must describe the qualification route on the certificate, and the discount lasts for at most ${S.newEntrant.maxStayYears} years in total.` },
    { q: 'Which code do tax advisers use?', a: `Taxation experts have their own code, 2423, also open to new applicants, with a going rate of ${K.gbp(K.occ('2423').goingRate!)}. Payroll managers and clerks are coded 4122 instead, a medium skilled code that is open only through the Temporary Shortage List and its deadline.` },
  ],
  related: ['skilled-worker-going-rates', 'new-entrant-salary', 'temporary-shortage-list', 'soc-code-checker', 'sponsor-licence'],
  sources: ['appendix_aso', 'appendix_sw', 'sw_paid_less', 'fees_table'],
});
