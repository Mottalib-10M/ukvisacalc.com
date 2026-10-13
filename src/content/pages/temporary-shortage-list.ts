import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const L = K.tsl();
const until = K.SOC.tslUntil;
const restricted = L.filter((o) => o.tsl!.jobs.length);
const run = (code: string, salary: number, situation: 'standard' | 'new-entrant' = 'standard') => K.checkSkilledWorker({ code, salary, hours: 37.5, situation, nation: 'England' });
const elec = K.occ('5241'), elecStd = run('5241', 0), elecNe = run('5241', 0, 'new-entrant');
const plan = K.occ('3116'), planStd = run('3116', 0);
const ship = K.occ('3512'), shipStd = run('3512', 0);
const onBoth = L.filter((o) => o.isl).map((o) => o.code);

export default definePage({
  id: 'temporary-shortage-list',
  group: 'work',
  order: 110,
  nav: 'Temporary Shortage List',
  card: `${L.length} medium skilled codes open until certificates issued before ${until}, at the ${K.gbp(S.general)} threshold.`,
  title: `Temporary Shortage List 2026: ${L.length} Codes Open Until December`,
  description: `Temporary Shortage List, Skilled Worker visa: ${L.length} medium skilled codes, the ${until} certificate deadline, the ${K.gbp(S.general)} threshold, no new dependants.`,
  h1: 'Temporary Shortage List for Skilled Worker jobs',
  intro: `${L.length} medium skilled occupation codes stay open to new Skilled Worker applicants if the certificate of sponsorship is issued before ${until}. The usual ${K.gbp(S.general)} threshold still applies.`,
  resume: `The Temporary Shortage List is set out in rule SW 6.1A of Appendix Skilled Worker, not in the Immigration Salary List. After the July 2025 reform raised the Skilled Worker skill level to degree level, it keeps ${L.length} medium skilled codes from Table 1a open to new applicants for a limited time. Technicians, skilled trades such as electricians, welders and plumbers, data analysts, legal and HR officers and several finance roles are on it. The deadline is strict: the application must use a certificate of sponsorship issued before ${until}. Being on this list gives eligibility and nothing else. The salary test is the ordinary one, ${K.gbp(S.general)} or the going rate for the code, whichever is higher, the visa fee is the standard fee, and a worker who comes in through the list cannot bring a partner or children unless they were already sponsored in a medium skilled job before ${K.date(S.mediumSkilledCutoff)}. An electrician (code ${elec.code}) needs ${K.gbp(elecStd.required)}.`,
  tool: { kind: 'sw', props: { initialCode: '5241', initialSalary: 42000, title: 'Check a shortage list job and salary' } },
  body: (h) => `
<h2>Eligibility only: the salary rule stays the same</h2>
<p>A code on the Temporary Shortage List is treated as eligible for the job points, so a sponsor can recruit into it from abroad or sponsor a switch. The salary points are then awarded under the normal options. For most applicants that is option A, the higher of ${K.gbp(S.general)} and the going rate. Because most of these codes have going rates well below the floor, the floor decides: an electrician (code ${elec.code}) has a going rate of ${K.gbp(elec.goingRate!)} but a threshold of ${K.gbp(elecStd.required)}, and a planning or production technician (code ${plan.code}) the same ${K.gbp(planStd.required)}. A few codes go higher, such as ship and hovercraft officers (code ${ship.code}) at ${K.gbp(shipStd.required)}.</p>
<p>The lower options can still be used where you meet their own conditions. Table 1a prints a ${K.pct(S.newEntrant.share)} column, so a new entrant electrician needs ${K.gbp(elecNe.required)} rather than ${K.gbp(elecStd.required)}. What the list does not give an ordinary applicant is the lower floor of the Immigration Salary List, which applies at the full going rate, or that list's reduced fee. A handful of codes sit on both lists (${K.listOf(onBoth)}); for them the Immigration Salary List terms apply where its conditions are met.</p>
<h2>The ${L.length} codes and their limits</h2>
<p>${restricted.length} entries cover only named job types inside the code, for example business systems analysts and clinical coders within code 3549, or builders, divers and steel fixers within code 5319. For every other code, all jobs in the code count. The occupation code still has to be the most appropriate one for the duties.</p>
${h.table(['Code', 'Occupation', 'Going rate', 'Only these jobs'],
    L.map((o) => [o.code, o.title, o.goingRate ? K.gbp(o.goingRate) : 'n/a', o.tsl!.jobs.length ? o.tsl!.jobs.join(', ') : 'All jobs']),
    `Temporary Shortage List, rule SW 6.1A of Appendix Skilled Worker (updated ${K.date(K.SOC.swUpdated)}); going rates from Table 1a of Appendix Skilled Occupations, ${S.goingRateHours}-hour week.`, ['l', 'l', 'r', 'l'])}
<h2>No new dependants, and a hard deadline</h2>
<p>Under rules SW 29.1A and SW 32A.2, a partner or child can only be sponsored as a dependant of a Skilled Worker whose job is in Table 1, 2 or 3 of Appendix Skilled Occupations. Table 1a jobs reached through this list fall outside that, so a new worker comes alone. The exceptions are narrow: workers already sponsored in a medium skilled job since before ${K.date(S.mediumSkilledCutoff)}, a child born in the UK, or a child in the UK whose other parent is also sponsored in a medium skilled job or for whom you are the sole surviving parent. The ${h.a('skilled-worker-dependants', 'dependants page')} sets out each case.</p>
<p>The date in SW 6.1A is about the certificate, not the application: the certificate must be issued before ${until}. An application made a few weeks later on such a certificate is still on time, as long as it is made within ${S.cosApplyWithinMonths} months of receiving the certificate. As the rules stood on ${K.date(K.P.retrieved_at)}, nothing replaced the list after that date. A later extension in the same code would need a new certificate, so check the rules in force when the time comes; workers granted before ${K.date(S.mediumSkilledCutoff)} keep their transitional access to medium skilled codes regardless. The list is printed in ${h.src('appendix_sw', 'Appendix Skilled Worker')}; the jobs with a lower floor are on the ${h.a('immigration-salary-list', 'Immigration Salary List page')}.</p>`,
  faqs: [
    { q: 'Is the Temporary Shortage List the same as the Immigration Salary List?', a: `No. The Immigration Salary List lowers the salary floor to ${K.gbp(S.isl.floor)} and the visa fee. The Temporary Shortage List only makes ${L.length} medium skilled codes eligible for new applicants, with the standard ${K.gbp(S.general)} or going rate threshold and the standard fee. A few codes appear on both, and the list rules differ for dependants as well.` },
    { q: 'Can I bring my partner if my job is on the Temporary Shortage List?', a: `Not as a new applicant. Dependants are tied to jobs in Tables 1, 2 and 3 of Appendix Skilled Occupations, and shortage list codes come from Table 1a. A partner or child can join only if you have been sponsored in a medium skilled job since before ${K.date(S.mediumSkilledCutoff)}; a child born in the UK can also apply.` },
    { q: 'What happens after the Temporary Shortage List deadline?', a: `Certificates of sponsorship for these codes must be issued before ${until} to count. The rules in force on ${K.date(K.P.retrieved_at)} contain nothing that replaces the list after that date, so new recruitment into these codes would close unless the Home Office lays a change. Read any Statement of Changes published before the deadline.` },
  ],
  related: ['immigration-salary-list', 'soc-code-checker', 'skilled-worker-visa-salary-threshold', 'skilled-worker-dependants', 'skilled-worker-visa', 'skilled-worker-going-rates'],
  sources: ['appendix_sw', 'appendix_aso', 'sw_visa'],
});
