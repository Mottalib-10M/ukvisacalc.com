import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const o = K.occ('2237');
const NATIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland'] as const;
const rate = (band: string, n: (typeof NATIONS)[number]) => K.payOptions(o, n).find((r) => r.label === band)!.rate;
const b5 = rate('Band 5', 'England');
const part = K.checkSkilledWorker({ code: '2237', salary: 0, hours: 30, situation: 'standard', nation: 'England', payRate: b5 }).required;
const fam = K.visaCost({ route: 'health-and-care', where: 'outside', months: 36, partner: true, children: 1 });
const famSw = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: true, children: 1 });
const NURSING = ['2231', '2232', '2233', '2234', '2235', '2236', '2237'].map((c) => K.occ(c));

export default definePage({
  id: 'nurse-visa-uk',
  group: 'work',
  order: 210,
  nav: 'Nurse visa',
  card: 'Code 2237 and the other nursing codes: pay band thresholds by nation, the Health and Care visa fee, English via the regulator.',
  title: 'Nurse Visa 2026: Band 5 Threshold, Fees and Nursing Codes',
  description: `Nurse visa: code 2237 is paid on Agenda for Change bands and Band 5 is ${K.gbp(b5)} in England, with the Health and Care fee of ${K.gbp(K.FEE.healthCare('outside', 3))} and no health surcharge.`,
  h1: 'Nurse visa: pay band, fees and which nursing code applies',
  intro: `A staff nurse (SOC 2237) qualifies when paid at least the full-time rate of the job's Agenda for Change band: ${K.gbp(b5)} at Band 5 in England. Choose the band in the checker.`,
  resume: `Nurses are sponsored on the Health and Care Worker visa, the reduced-fee version of the Skilled Worker route. Code 2237, "other registered nursing professionals", is in Table 3 of Appendix Skilled Occupations: it is higher skilled and open to applicants from abroad, and its going rate is not a single figure but the national pay scale. The salary must reach the full-time rate of the Agenda for Change band the post is graded at, for the nation where you will work, and at least ${K.gbp(S.healthEducation.floor)}. Band 5 is ${K.gbp(b5)} in England, ${K.gbp(rate('Band 5', 'Scotland'))} in Scotland, ${K.gbp(rate('Band 5', 'Wales'))} in Wales and ${K.gbp(rate('Band 5', 'Northern Ireland'))} in Northern Ireland, all for 37.5 hours. The visa fee is ${K.gbp(K.FEE.healthCare('outside', 3))} for up to three years with no immigration health surcharge, so a nurse bringing a partner and one child for three years pays ${K.gbp(fam.total)} instead of ${K.gbp(famSw.total)} on the standard route. The checker opens on Band 3, the first line of the scale: pick the band written on your offer.`,
  tool: { kind: 'sw', props: { initialCode: '2237', initialSalary: 31000, title: 'Nurse salary check: choose your pay band' } },
  body: (h) => `
<h2>Verdict for code 2237</h2>
<p>Code 2237 is eligible from abroad and from inside the country, with no shortage list involved: it is in ${o.table}, it is not a medium skilled code, and it is not on the Immigration Salary List. The going rate is the band, so two posts in the same code can face different thresholds: if one is graded Band 5 and another Band 7, both are 2237 jobs, but the second needs the Band 7 rate. Its example titles are ${K.listOf(o.examples.map((e) => e.toLowerCase()))}.</p>
${h.table(['Band', ...NATIONS], ['Band 5', 'Band 6', 'Band 7'].map((b) => [b, ...NATIONS.map((n) => K.gbp(rate(b, n)))]), 'Going rates for nursing jobs on Agenda for Change, full time (37.5 hours), Appendix Skilled Occupations Table 4.', ['l', 'r', 'r', 'r', 'r'])}
<p>The rate is pro-rated for part-time hours. A Band 5 post in England at 30 hours needs ${K.gbp(part)}, which is above the ${K.gbp(S.healthEducation.floor)} floor, so the band remains the test. Unsocial-hours enhancements and overtime do not count towards it; only guaranteed basic pay does.</p>
<h2>Which nursing code the employer chooses</h2>
<p>Seven nursing codes share the same rules and the same Agenda for Change rates. The employer must pick the one that matches the duties; 2237 is the general code for ward and staff nurses when no specialist code fits better.</p>
${h.table(['Code', 'Occupation', 'Example titles'], NURSING.map((x) => [x.code, x.title, x.examples.slice(0, 3).join(', ')]), 'Nursing occupation codes in Table 3 of Appendix Skilled Occupations, all eligible for the Health and Care Worker visa.', ['l', 'l', 'l'])}
<p>Nursing auxiliaries and assistants are a separate code, 6131, which is also eligible for the Health and Care visa and is on the Immigration Salary List; it is a different job from a registered nurse post and is tested on its own rules.</p>
<h2>English, records and documents</h2>
<p>The visa asks for English at level B2. A nurse or midwife who has already passed an English language assessment accepted by the relevant professional regulator does not need a separate Secure English Language Test for the visa, and nationals of majority English-speaking countries are exempt. From outside the country you also need a criminal record certificate from each country where you have lived for 12 months or more in the last ten years (since your 18th birthday if you are under 28), and a tuberculosis test if your country is on the list. GOV.UK asks that you are a qualified nurse; which professional registration the post itself requires is a matter for the employer and the regulator, and this page does not cover it.</p>
<h2>Cost and family</h2>
<p>Each family member pays the same Health and Care fee, ${K.gbp(K.FEE.healthCare('outside', 3))} for up to three years or ${K.gbp(K.FEE.healthCare('outside', 5))} for longer, and nobody pays the surcharge. Nursing is a higher skilled occupation, so the restrictions on dependants that apply to care workers do not apply: a partner and children can come with you from the start. You need ${K.gbp(S.maintenance)} of your own savings unless the employer certifies maintenance on the certificate of sponsorship or you have already lived here for 12 months. After ${K.P.settlement.skilledWorkerYears} years you can apply to settle; the ${h.a('indefinite-leave-to-remain', 'ILR calculator')} works out the earliest date.</p>`,
  faqs: [
    { q: 'What band does a nurse need for a Health and Care visa?', a: `There is no minimum band. The salary must reach the rate of the band the job is graded at, in the nation where you will work. A post graded Band 5 in England needs ${K.gbp(b5)} for 37.5 hours, and no nursing post can pay less than ${K.gbp(S.healthEducation.floor)}, which is above the Band 3 rate in England, Wales and Northern Ireland.` },
    { q: 'Can a nurse working in a private care home get a Health and Care visa?', a: 'Yes, if the care home provides adult social care and holds a sponsor licence. The nursing job is still tested against the rate of its pay band. A private hospital that does not supply the NHS can sponsor the same nurse on the standard Skilled Worker visa, with the higher fee and the surcharge.' },
    { q: 'Do overseas nurses pay the immigration health surcharge?', a: `Not on the Health and Care Worker visa, which covers nurses sponsored by the NHS, its suppliers or adult social care. Over three years that saves ${K.gbp(K.ihs(36, 'outside', false))} for each adult and ${K.gbp(K.ihs(36, 'outside', true))} for each child compared with the standard Skilled Worker route.` },
    { q: 'Does a midwife use the same salary rates as a nurse?', a: `Yes. Midwives are in code 2231, midwifery nurses, which is also a Table 3 code on the Agenda for Change scale, so the threshold is the rate of the band in the nation of work, for example ${K.gbp(rate('Band 6', 'Wales'))} for a Band 6 post in Wales. The fee and the surcharge exemption are the same.` },
  ],
  related: ['health-and-care-worker-visa', 'doctor-visa-uk', 'care-worker-visa', 'skilled-worker-visa', 'indefinite-leave-to-remain'],
  sources: ['hcw_visa', 'appendix_aso', 'appendix_sw', 'fees_table', 'ihs_who'],
});
