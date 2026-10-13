import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const eng = K.occ('2124');

export default definePage({
  id: 'skilled-worker-visa-requirements',
  group: 'work',
  order: 50,
  nav: 'Requirements',
  card: 'The 70 points, the sponsor and certificate, English at B2, savings, TB test and criminal record.',
  title: 'Skilled Worker Visa Requirements 2026: 70 Points Checklist',
  description: `Skilled Worker visa requirements in 2026: the 70 points, an A-rated sponsor, the certificate of sponsorship, B2 English, ${K.gbp(S.maintenance)} savings, TB and record checks.`,
  h1: 'Skilled Worker visa requirements: the full checklist',
  intro: `You need 70 points: a certificate from an A-rated sponsor, an eligible job, English at ${S.englishLevel} and a qualifying salary, plus ${K.gbp(S.maintenance)} in savings unless your employer covers you.`,
  resume: `The Skilled Worker visa works on points, and every applicant needs the same 70. Fifty are mandatory: 20 for a valid certificate of sponsorship from an employer rated A on the register of licensed sponsors, 20 for a job in an eligible occupation code, and 10 for English at level ${S.englishLevel} of the Common European Framework, the level required for new applicants since ${K.date(S.englishB2From)}. The last 20 come from the salary, through one of the options in Appendix Skilled Worker. Around the points sit further conditions: you must be 18 or over, hold ${K.gbp(S.maintenance)} for 28 days unless the sponsor certifies maintenance or you have been in the UK for a year, provide a tuberculosis certificate if you live in a listed country, and supply criminal record certificates for jobs in health, education and social care. You must apply within ${S.cosApplyWithinMonths} months of receiving the certificate and no more than ${S.applyBeforeStartMonths} months before the job starts. The checker above covers the job and salary points.`,
  tool: { kind: 'sw', props: { initialCode: '2124', initialSalary: 54000, title: 'Check the job and salary points of your offer' } },
  body: (h) => `
<h2>The points table</h2>
${h.table(['Requirement', 'Points', 'Type', 'Rules'], [
    ['Certificate of sponsorship from a licensed, A-rated sponsor', 20, 'Mandatory', 'SW 5.1 to 5.7'],
    ['Job in an eligible occupation code', 20, 'Mandatory', 'SW 6.1 to 6.5'],
    [`English at ${S.englishLevel} (B1 for some existing visa holders)`, 10, 'Mandatory', 'SW 7.1 to 7.3'],
    ['Salary through one of the options A to K', 20, 'Tradeable', 'SW 4.2 to 4.4, 8 to 14'],
  ], 'Appendix Skilled Worker, points requirement: 70 points in total.', ['l', 'r', 'l', 'l'])}
<p>The salary points are only awarded if the sponsorship and skill points are also awarded, so the four lines rise or fall together. A strong salary cannot rescue a job in the wrong code, and a perfect code cannot rescue a salary under the threshold.</p>
<h2>Sponsor and certificate</h2>
<p>Your employer must hold a Skilled Worker licence and appear as A-rated on the register; the only exception is a Skilled Worker staying with the sponsor of their last permission. The ${h.a('register-of-licensed-sponsors', 'sponsor search')} lets you check the register before you resign from anything. The certificate of sponsorship itself is an electronic record with a reference number. Under SW 5.1 it must name you, describe the job and salary, carry a start date no more than three months after your application, and not have been used in an application that was granted or refused. For applications from abroad the certificate must have been allocated by the Home Office for that job. The sponsor must also have paid any immigration skills charge in full.</p>
<p>The caseworker can still refuse if there are reasonable grounds to think the job does not exist, is a sham, was created mainly to get you a visa, amounts to supplying you to a third party, or breaks minimum wage or working time law. The code must be the most appropriate one for the duties: the ${h.a('soc-code-checker', 'SOC code checker')} explains rule SW 6.2.</p>
<h2>English, money and documents</h2>
<p><strong>English.</strong> New applicants need ${S.englishLevel} in reading, writing, speaking and listening. You can show it with a GCSE, A Level or Scottish qualification in English begun before 18, a degree taught in English (an Ecctis check is needed for one awarded outside the UK), a secure English language test from an approved provider, or a passport from a majority English-speaking country such as Australia, Canada, Jamaica, New Zealand or the USA. If your most recent Skilled Worker permission was granted at B1, you stay on B1 for extensions and changes of employer. People switching from another route need ${S.englishLevel}, except from Health and Care Worker.</p>
<p><strong>Money.</strong> Hold ${K.gbp(S.maintenance)} for 28 days in a row, with day 28 no more than 31 days before you apply, unless your A-rated sponsor ticks "sponsor certifies maintenance" on the certificate or you have been in the UK with permission for 12 months. Each partner or child adds a sum of their own (${h.a('skilled-worker-dependants', 'dependants page')}).</p>
<p><strong>Tuberculosis and criminal record.</strong> Applicants from countries listed in Appendix Tuberculosis need a valid medical certificate showing they were screened and are clear of active pulmonary TB. From abroad, jobs in listed health, education, therapy and social care codes need a criminal record certificate from every country where you spent 12 months or more in the last 10 years since turning 18; a partner coming with you needs one too. An ATAS certificate is required for some research at PhD level, and an Ecctis reference if you claim PhD points for an overseas doctorate.</p>
<h2>Who cannot apply this way</h2>
<p>You must be 18 or over. From abroad you need entry clearance before you travel, and since HC 1691 entry clearance applications from Afghan nationals are refused. From inside the UK you cannot switch from a visit visa, short-term study, Parent of a Child Student, seasonal work, domestic work in a private household, immigration bail or permission outside the rules. A Student switching must have finished the course, start work after it ends, or have studied full time for a PhD for 24 months. As a worked case, an electronics engineer (code ${eng.code}) offered ${K.gbp(54000)} clears the salary points at a going rate of ${K.gbp(eng.goingRate!)}; the sponsor rating and the English evidence are what remain to check. Fees and timings are on the ${h.a('skilled-worker-visa-cost', 'cost page')} and the ${h.a('skilled-worker-visa-processing-time', 'processing time page')}, and the full text is in ${h.src('appendix_sw', 'Appendix Skilled Worker')}.</p>`,
  faqs: [
    { q: 'Do I still need B2 English if I already hold a Skilled Worker visa?', a: `Not if your most recent Skilled Worker permission was granted with a B1 requirement: you can extend or change employer at B1 and need not prove it again. ${S.englishLevel} applies to first applications made since ${K.date(S.englishB2From)} and to most people switching from another route. Switching from a Health and Care Worker visa does not require fresh evidence.` },
    { q: 'Can my employer cover the savings requirement for me?', a: `Yes. If the sponsor is A-rated, it can certify on the certificate of sponsorship that it will maintain and accommodate you up to the end of your first month, to at least ${K.gbp(S.maintenance)}. You then show no bank statements. You also skip the requirement if you have been in the UK with permission for 12 months or more when you apply.` },
    { q: 'Which jobs need a criminal record certificate from abroad?', a: 'Jobs in the occupation codes listed in rule SW 16.1, mostly in health, education, therapy, social work and care: doctors, nurses, pharmacists, teachers, social workers, care workers and their managers, among others. The certificate must come from each country where you spent 12 months or more in the ten years before applying, counting only time aged 18 or over.' },
    { q: 'Can I apply before my job offer is confirmed?', a: `No. The application needs the reference number of a certificate of sponsorship already assigned by a licensed sponsor for that job and salary. Once you receive it you have ${S.cosApplyWithinMonths} months to apply, and the start date on the certificate must fall no more than ${S.applyBeforeStartMonths} months after the date you apply.` },
  ],
  related: ['skilled-worker-visa', 'soc-code-checker', 'skilled-worker-visa-salary-threshold', 'skilled-worker-visa-cost', 'skilled-worker-dependants', 'register-of-licensed-sponsors'],
  sources: ['appendix_sw', 'sw_visa', 'english', 'hc_1691', 'sponsor_register'],
});
