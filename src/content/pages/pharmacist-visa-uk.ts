import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const ph = K.occ('2251'), tech = K.occ('3212');
const N = ['England', 'Scotland', 'Wales', 'Northern Ireland'] as const;
const band = (b: string, n: (typeof N)[number]) => K.payOptions(ph, n).find((x) => x.label === b)!.rate;
const hc = K.visaCost({ route: 'health-and-care', where: 'outside', months: 60, partner: true, children: 0 });
const sw = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: true, children: 0 });
const techStd = K.checkSkilledWorker({ code: '3212', salary: 0, hours: 37.5, situation: 'standard', nation: 'England', islCriteria: true });

export default definePage({
  id: 'pharmacist-visa-uk',
  group: 'work',
  order: 290,
  nav: 'Pharmacist visa',
  card: 'Pharmacists (2251) and pharmacy technicians (3212): pay band rates, Salary List entry and the Health and Care fee.',
  title: 'Pharmacist Visa 2026: SOC 2251 Pay Bands, Technician Rules',
  description: `Pharmacist visa: SOC 2251 uses Agenda for Change bands, ${K.gbp(band('Band 6', 'England'))} at Band 6 in England. Pharmacy technicians (3212) qualify through the Immigration Salary List.`,
  h1: 'Pharmacist visa: band rates, technicians and which visa to use',
  intro: `Pharmacists are a Table 3 health code: the threshold is the Agenda for Change band of the post, ${K.gbp(band('Band 7', 'England'))} at Band 7 in England, with a ${K.gbp(S.healthEducation.floor)} floor.`,
  resume: `Pharmacists are sponsored under SOC code 2251, one of the health codes of Table 3 of Appendix Skilled Occupations. Their going rate is the NHS Agenda for Change band the post is graded at, in the nation where it is: ${K.gbp(band('Band 6', 'England'))} at Band 6 and ${K.gbp(band('Band 7', 'England'))} at Band 7 in England, ${K.gbp(band('Band 7', 'Scotland'))} at Band 7 in Scotland. Those rates apply in community and hospital pharmacy alike, private employers included, and the general threshold of ${K.gbp(S.general)} does not: the floor for listed health jobs is ${K.gbp(S.healthEducation.floor)}. Pharmacy technicians are a different case. Code 3212 is medium skilled, so it is open to new applicants only because it is on the Immigration Salary List, until ${tech.isl!.until}, at a threshold of ${K.gbp(techStd.required)}. A pharmacist working for the NHS or an eligible health employer can apply for the Health and Care Worker visa, with a lower fee and no health surcharge.`,
  tool: { kind: 'sw', props: { initialCode: '2251', initialSalary: 44000, title: 'Pharmacist salary check: choose the band' } },
  body: (h) => `
<h2>Band rates for pharmacists by nation</h2>
${h.table(['Band', ...N], ['Band 6', 'Band 7', 'Band 8a', 'Band 8b'].map((b) => [b, ...N.map((n) => K.gbp(band(b, n)))]), 'Going rates for listed healthcare occupations, Appendix Skilled Occupations Table 4, full time.', ['l', 'r', 'r', 'r', 'r'])}
<p>The band is the one of the job, as the employer grades it, not your own experience. A private employer that does not use Agenda for Change still has to pay at least the rate of the equivalent band, and the certificate of sponsorship states it. For part-time posts the band rate is pro-rated to the weekly hours; the ${K.gbp(S.healthEducation.floor)} floor is not.</p>
<h2>Pharmacists and technicians compared</h2>
${h.table(['', ph.code + ' ' + ph.title, tech.code + ' ' + tech.title], [
    ['Table', ph.table, tech.table],
    ['Open to new applicants', 'yes', `through the Immigration Salary List, until ${tech.isl!.until}`],
    ['Threshold, full time in England', 'band rate, floor ' + K.gbp(S.healthEducation.floor), K.gbp(techStd.required)],
    ['Visa fee from abroad, up to 3 years', K.gbp(K.FEE.healthCare('outside', 3)) + ' (Health and Care)', K.gbp(K.FEE.skilledWorker('outside', 3, true)) + ' (Salary List)'],
  ], 'Appendix Skilled Occupations, Appendix Immigration Salary List and the fee table.', ['l', 'l', 'l'])}
<p>A technician's job sits on the Salary List in all four nations, which lowers the floor to ${K.gbp(S.isl.floor)} and the fee, but the going rate of the code still applies in full. Technicians employed by the NHS or by a regulated care provider can also use the lower transitional rates that the rules give to "Health and Care ASHE salary jobs": choose that employer type in the checker.</p>
<h2>Worked examples</h2>
<p>A hospital pharmacist offered ${K.gbp(45000)} for a full-time Band 6 post in England clears the band rate of ${K.gbp(band('Band 6', 'England'))}; the same salary for a Band 7 post falls ${K.gbp(band('Band 7', 'England') - 45000)} short. A part-time Band 7 post of 30 hours in Wales must pay at least ${K.gbp(K.checkSkilledWorker({ code: '2251', salary: 0, hours: 30, situation: 'standard', nation: 'Wales', payRate: band('Band 7', 'Wales') }).required)}, the band rate scaled to the hours. For a pharmacy technician in Scotland, the threshold is the code's going rate of ${K.gbp(tech.goingRate!)} or the ${K.gbp(S.isl.floor)} Salary List floor, whichever is higher.</p>
<p>The checker applies the same arithmetic: choose 2251 or 3212, then the band, the nation and the hours. It also flags the transitional rates for technicians at an NHS or regulated care employer.</p>
<h2>Which visa and what it costs</h2>
<p>The Health and Care Worker visa is the Skilled Worker route for qualified health professionals working for the NHS, an NHS supplier or in adult social care. For a pharmacist and partner on a five-year visa from abroad it costs ${K.gbp(hc.total)}, against ${K.gbp(sw.total)} on the standard Skilled Worker visa, because the fee is lower and nobody pays the surcharge. A pharmacist sponsored by a retail chain that does not provide NHS services takes the standard visa. Both visas lead to settlement after five years on the same terms, so the choice changes the bill, not the route. The ${h.a('health-and-care-worker-visa', 'Health and Care Worker page')} sets out who qualifies.</p>`,
  faqs: [
    { q: 'Is pharmacist on the shortage list?', a: `Pharmacists (2251) are not on the Immigration Salary List and do not need to be: as a Table 3 health code they are open to new applicants at their band rate, with a ${K.gbp(S.healthEducation.floor)} floor. Pharmacy technicians (3212) are on the Salary List until ${tech.isl!.until}, which is what keeps that medium skilled code open.` },
    { q: 'Can a community pharmacy sponsor a pharmacist?', a: 'Yes, if it holds a sponsor licence and pays at least the band rate of the post. Whether the pharmacist can use the cheaper Health and Care Worker visa depends on the employer: one that provides NHS services can qualify, a purely private one leads to the standard Skilled Worker visa and its health surcharge.' },
    { q: 'Which band is a newly qualified pharmacist?', a: 'The rules do not fix it: the going rate is whatever band the job is graded at, and the employer states it on the certificate of sponsorship. Ask for the band in writing, then check in the calculator that the salary offered reaches its rate for your nation and hours.' },
  ],
  related: ['health-and-care-worker-visa', 'nurse-visa-uk', 'doctor-visa-uk', 'immigration-salary-list', 'skilled-worker-visa-salary-threshold'],
  sources: ['appendix_aso', 'appendix_isl', 'hcw_visa', 'fees_table'],
});
