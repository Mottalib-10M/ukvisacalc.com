import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const o = K.occ('2211');
const spec = K.occ('2212');
const NATIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland'] as const;
const eng = K.payOptions(o, 'England');
const find = (n: (typeof NATIONS)[number], re: RegExp) => K.payOptions(o, n).find((r) => re.test(r.label))!.rate;
const str = eng.find((r) => /ST\/CT1-2/.test(r.label))!;
const need = (hours: number) => K.checkSkilledWorker({ code: '2211', salary: 0, hours, situation: 'standard', nation: 'England', payRate: str.rate }).required;
const base = o.scaleHours!;

export default definePage({
  id: 'doctor-visa-uk',
  group: 'work',
  order: 220,
  nav: 'Doctor visa',
  card: 'Codes 2211 and 2212: the going rate is the grade on the doctors\' pay scale, nation by nation, on a 40-hour base.',
  title: 'Doctor Visa 2026: Salary by Grade, Nation and Rota Hours',
  description: `Doctor visa: SOC 2211 and 2212 use the grade rate of the national pay scale, from ${K.gbp(eng[0].rate)} for F1 in England, pro-rated from ${base} hours, Health and Care fees.`,
  h1: 'Doctor visa: the salary your grade must reach',
  intro: `For a doctor (SOC 2211 or 2212) the going rate is the national rate for the grade, set for a ${base}-hour week: ${K.gbp(str.rate)} for a specialty registrar at ST1 or ST2 in England. Pick the grade and hours above.`,
  resume: `Doctors are sponsored on the Health and Care Worker visa in two occupation codes: 2211, generalist medical practitioners, and 2212, specialist medical practitioners, which uses the same rates. Both are in Table 3 of Appendix Skilled Occupations, open to applicants from abroad. The salary test has no single going rate. It takes the national rate for the grade of the post in the nation where you will work, from foundation year 1 up to consultant, and it assumes a ${base}-hour week rather than the ${S.goingRateHours} hours used for most jobs. In England the rates run from ${K.gbp(eng[0].rate)} for F1 to ${K.gbp(eng[eng.length - 1].rate)} for a consultant; in Scotland a consultant is ${K.gbp(find('Scotland', /^Consultant/))}, in Wales ${K.gbp(find('Wales', /^Consultant/))} and in Northern Ireland ${K.gbp(find('Northern Ireland', /^Consultant/))}. Rotas longer than ${base} hours raise the threshold in proportion, while basic pay is only counted for the first ${S.maxCountedHours} hours. The visa fee is ${K.gbp(K.FEE.healthCare('outside', 3))} for up to three years, with no health surcharge.`,
  tool: { kind: 'sw', props: { initialCode: '2211', initialSalary: 50000, title: 'Doctor salary check by grade and hours' } },
  body: (h) => `
<h2>Verdict for codes 2211 and 2212</h2>
<p>Both codes are higher skilled and in ${o.table}, so a hospital trust, health board, GP practice or other NHS sponsor can bring a doctor from abroad or switch one already in the country. Code 2211 covers titles such as ${K.listOf(o.examples.map((e) => e.toLowerCase()))}; code 2212 covers specialists such as ${K.listOf(spec.examples.filter((e) => !/Homeopath|acupuncturist/i.test(e)).map((e) => e.toLowerCase()))}, and Appendix Skilled Occupations gives it no rates of its own: it uses those of 2211. Neither code is on the Immigration Salary List. The salary is tested under option K, against the pay scale for the grade, with a floor of ${K.gbp(S.healthEducation.floor)}; GOV.UK describes the new entrant and PhD reductions only for ten other health codes, not for doctors.</p>
${h.table(['Grade (England)', 'Rate for 40 hours'], eng.map((r) => [r.label, K.gbp(r.rate)]), `Going rates for SOC 2211 and 2212 in England, Appendix Skilled Occupations (source scale: ${o.scaleSource}).`, ['l', 'r'])}
<h2>The four nations do not share a scale</h2>
<p>Each nation has its own pay scale and its own grade names, and the checker reads the one for the nation you select. Scotland lists one specialty registrar rate, ${K.gbp(find('Scotland', /^Specialty registrar/))}, where England splits it at CT3/ST3; Wales and Northern Ireland split it between core years and ST3 and above. A foundation year 1 post needs ${K.gbp(find('England', /^Foundation year 1/))} in England, ${K.gbp(find('Scotland', /^Foundation year 1/))} in Scotland, ${K.gbp(find('Wales', /^Foundation year 1/))} in Wales and ${K.gbp(find('Northern Ireland', /^Foundation year 1/))} in Northern Ireland. A salaried GP post needs ${K.gbp(find('England', /^Salaried General/))} in England and ${K.gbp(find('Wales', /^Salaried General/))} in Wales. The nation is where the job is based, not where the employer has its head office.</p>
<h2>Rotas: hours above ${base} and the ${S.maxCountedHours}-hour limit</h2>
<p>Because the doctors' rates assume ${base} hours, a contract for more hours pushes the threshold up. A specialty registrar at ST1 or ST2 in England needs ${K.gbp(str.rate)} at ${base} hours but ${K.gbp(need(44))} at 44 hours and ${K.gbp(need(48))} at ${S.maxCountedHours}. Past ${S.maxCountedHours} hours the rule cuts the other way: the going rate keeps rising with every contracted hour, but only the pay for the first ${S.maxCountedHours} hours counts towards meeting it. When hours vary from week to week, the weeks above ${S.maxCountedHours} hours can still count if the average over a regular cycle of up to 17 weeks stays at ${S.maxCountedHours} or below (SW 14.3A). Supplements and allowances paid on top of basic pay are left out.</p>
<h2>Fees, English and the extra work you may do</h2>
<p>Each person pays ${K.gbp(K.FEE.healthCare('outside', 3))} for up to three years and ${K.gbp(K.FEE.healthCare('outside', 5))} for longer, inside or outside the country, and no surcharge. A doctor who has passed an English assessment accepted by the medical regulator does not need a separate test for the visa. From abroad you need a criminal record certificate and, from listed countries, a tuberculosis test. Once here, overtime in the sponsored job has no cap, other work of up to 20 hours a week is allowed in an eligible job, and a doctor who completes GP training may do four months of additional paid work. The ${h.a('health-and-care-worker-visa', 'Health and Care Worker visa page')} covers family members and settlement.</p>`,
  faqs: [
    { q: 'Which going rate applies to a consultant on a Health and Care visa?', a: `The consultant rate of the nation where the post is based, for ${base} hours: ${K.gbp(find('England', /^Consultant/))} in England, ${K.gbp(find('Scotland', /^Consultant/))} in Scotland, ${K.gbp(find('Wales', /^Consultant/))} in Wales and ${K.gbp(find('Northern Ireland', /^Consultant/))} in Northern Ireland. Specialists in code 2212 use the same figures as 2211, and the rate is pro-rated if the job plan is for more or fewer than ${base} hours a week.` },
    { q: 'Do doctors get the new entrant discount on the salary threshold?', a: `No. Doctors are in Table 3, where the salary is tested against the pay scale for the grade under option K. GOV.UK lists the 70 % new entrant rate and the PhD reductions only for ten other health codes with their own salary rules. A foundation doctor is simply tested against the F1 or F2 rate of the nation.` },
    { q: 'Is a GP practice able to sponsor a doctor on the Health and Care visa?', a: 'Yes, if the practice holds a worker sponsor licence and provides medical services to the NHS, which makes the job eligible for the Health and Care Worker visa. A salaried GP post is then tested against the salaried GP rate for the nation. A practice without a licence must apply for one first.' },
    { q: 'What if my contract is 48 hours but my basic pay is set for 40?', a: `The threshold is pro-rated to all ${S.maxCountedHours} contracted hours, so basic pay set for ${base} hours at exactly the grade rate will fall short. At ST1 or ST2 in England, ${S.maxCountedHours} hours need ${K.gbp(need(48))}. Ask the employer to state the guaranteed basic pay for the full contracted hours on the certificate.` },
  ],
  related: ['health-and-care-worker-visa', 'nurse-visa-uk', 'skilled-worker-visa', 'register-of-licensed-sponsors', 'indefinite-leave-to-remain'],
  sources: ['hcw_visa', 'appendix_aso', 'appendix_sw', 'fees_table'],
});
