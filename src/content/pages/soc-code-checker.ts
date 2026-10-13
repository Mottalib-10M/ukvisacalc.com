import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const total = K.OCCUPATIONS.length;
const c = (t: string) => K.count(t);
const tester = K.occ('2136'), techQa = K.occ('3131'), devops = K.occ('2139');
const brick = K.occ('5313'), demo = K.occ('8159');
const no = ['5435', '4216', '6221', '8211', '7111'].map((x) => K.occ(x));

export default definePage({
  id: 'soc-code-checker',
  group: 'work',
  order: 40,
  nav: 'SOC code checker',
  card: 'Find the four-digit occupation code that matches your duties and see whether it is eligible.',
  title: `SOC Code Checker for the Skilled Worker Visa: ${total} Codes`,
  description: `SOC code checker for the Skilled Worker visa: search ${total} SOC 2020 codes by job title, see the table each sits in and why choosing the wrong code gets refused.`,
  h1: 'SOC codes for the Skilled Worker visa: find yours and check it',
  intro: `Every Skilled Worker job is filed under one of ${total} four-digit SOC 2020 codes. Only ${c('Table 1')} are open without conditions; search by job title above to see where yours sits.`,
  resume: `The occupation code, or SOC code, is the four-digit number from the Standard Occupational Classification 2020 that your sponsor writes on the certificate of sponsorship. It decides almost everything about a Skilled Worker application: whether the job is eligible at all, which going rate applies, whether PhD points or the Immigration Salary List can be used, and whether your family can join you. Appendix Skilled Occupations sorts the ${total} codes into tables: ${c('Table 1')} higher skilled codes open to anyone, ${c('Table 1a')} medium skilled codes open only through a shortage list or to people already sponsored, ${c('Table 3')} health and education codes paid on national scales, ${c('Table 3a')} further health and education codes kept for existing workers, and ${c('Table 6')} codes that cannot be sponsored. The sponsor picks the code, but rule SW 6.2 lets a caseworker refuse when a less appropriate code was chosen to dodge a higher going rate or an ineligible code. The search above shows each code's table and going rate.`,
  tool: { kind: 'sw', props: { initialCode: '2471', initialSalary: 42000, title: 'Search a job title and check its occupation code' } },
  body: (h) => `
<h2>Match the duties, not the job title</h2>
<p>A code describes what you do all day. Titles are loose: one employer's "tester" is another's "quality engineer", and the classification places them by the tasks and skill level of the work. GOV.UK points people to the ${h.src('cascot', 'CASCOT coding tool')} from the University of Warwick, which suggests SOC 2020 codes for a job title, and then to the eligibility table to check each candidate. Not every title is in CASCOT, so try neighbouring titles and read the examples listed under each code.</p>
<p>Neighbouring codes can land in different tables. ${tester.title} (code ${tester.code}) sit in ${tester.table}, while ${techQa.title} (code ${techQa.code}), whose examples include quality assurance testers and network administrators, sit in ${techQa.table}, open to new applicants only while the code is on the Temporary Shortage List. ${devops.title} (code ${devops.code}), the home of DevOps engineers and IT consultants, is in ${devops.table}. Construction shows the same split: ${brick.title.toLowerCase()} (code ${brick.code}) are on the Immigration Salary List, while ${demo.title.toLowerCase()} (code ${demo.code}), which covers demolition workers and cable layers, are in ${demo.table}.</p>
<h2>The five tables at a glance</h2>
${h.table(['Table', 'Codes', 'What it means for a new applicant'], [
    ['Table 1', c('Table 1'), `Higher skilled (degree level, RQF 6 and above). Eligible; going rate on the median, threshold usually the higher of that rate and ${K.gbp(S.general)}.`],
    ['Table 1a', c('Table 1a'), `Medium skilled (RQF 3 to 5). Only through the Immigration Salary List or the Temporary Shortage List, or for workers sponsored since before ${K.date(S.mediumSkilledCutoff)}.`],
    ['Table 3', c('Table 3'), `Health and education jobs. Eligible; going rate from the national pay scale, floor ${K.gbp(S.healthEducation.floor)}.`],
    ['Table 3a', c('Table 3a'), `Further health and education jobs, kept for workers sponsored since before ${K.date(S.mediumSkilledCutoff)}.`],
    ['Table 6', c('Table 6'), 'Not eligible for the Skilled Worker route.'],
  ], `Appendix Skilled Occupations, SOC 2020, ${total} codes (updated ${K.date(K.SOC.asoUpdated)}).`, ['l', 'r', 'l'])}
<p>The eligible tables decide more than access. A worker in a Table 1a code who joins through a shortage list cannot bring a partner or children under the current rules, because dependants are tied to jobs in Tables 1, 2 or 3. Care worker codes ${K.listOf(S.careWorkerCodes)} sit in Table 1a but are closed to applications from abroad altogether. Some codes are only partly eligible: a handful of entries list the precise job titles that qualify inside a code and leave the rest in Table 6.</p>
<h2>When the code chosen is the wrong one</h2>
<p>Rule SW 6.2 says the sponsor must choose an appropriate code, and the caseworker must not have reasonable grounds to believe a less appropriate one was picked because the right code:</p>
<ul>
<li>is not eligible for the Skilled Worker route;</li>
<li>has a higher going rate than the salary offered;</li>
<li>is not on the Immigration Salary List, while the application claims list points;</li>
<li>is not eligible for PhD points, while the application claims them.</li>
</ul>
<p>To test this, SW 6.3 lets the caseworker look at whether the sponsor has shown a genuine need for the job as described, whether you have the skills and experience for it, the sponsor's record of paying sponsored workers properly, and any extra information. In practice the job description on the certificate has to read like the code it claims. A shortfall on the code is a refusal, not a correction, and the certificate cannot be reused after a refusal.</p>
<h2>Codes that cannot be sponsored</h2>
<p>Table 6 holds ${c('Table 6')} codes. Among them: ${K.listOf(no.map((o) => `${o.title.toLowerCase()} (${o.code})`))}. If your work honestly fits one of these, no salary changes the answer on this route; the ${h.a('skilled-worker-visa', 'Skilled Worker overview')} lists the routes that do not need an eligible occupation. Once you have a code, the ${h.a('skilled-worker-going-rates', 'going rates table')} gives its rate and the ${h.a('skilled-worker-visa-salary-threshold', 'threshold page')} adjusts it to your hours.</p>`,
  faqs: [
    { q: 'Who chooses the SOC code on a certificate of sponsorship?', a: 'The sponsor does, when it assigns the certificate, and you will see the code in the details it gives you. You can and should check that it fits your duties, because the application is yours. If the code looks wrong, raise it with the employer before applying: a refusal under SW 6.2 costs the fee and the certificate.' },
    { q: 'Can my employer use a different code to get a lower going rate?', a: 'Not safely. Rule SW 6.2 lets the caseworker refuse where there are reasonable grounds to believe a less appropriate code was chosen because the correct one has a higher going rate than the salary, is not eligible, or is not on a list the application relies on. The duties described on the certificate are compared with the code claimed.' },
    { q: 'What does it mean if my code is in Table 6?', a: 'It means the occupation cannot be sponsored on the Skilled Worker route, whatever the salary. Table 6 covers roles such as cooks, receptionists, hairdressers, retail assistants and lorry drivers. Some codes are split, with a short list of named job titles eligible and the rest in Table 6, so read the entry for your code in full.' },
    { q: 'Is the CASCOT result binding on the Home Office?', a: 'No. CASCOT, the coding tool from the University of Warwick that GOV.UK recommends, only suggests likely codes for a job title. The Home Office looks at the actual duties, skills and pay of the job, so treat the tool as a starting point and compare its suggestion with the example titles listed in Appendix Skilled Occupations.' },
  ],
  related: ['skilled-worker-going-rates', 'skilled-worker-visa-salary-threshold', 'skilled-worker-visa', 'temporary-shortage-list', 'immigration-salary-list', 'skilled-worker-visa-requirements'],
  sources: ['appendix_aso', 'appendix_sw', 'cascot', 'sw_visa'],
});
