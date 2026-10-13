import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.student;
const g = (m: number) => K.visaCost({ route: 'graduate', where: 'inside', months: m, partner: false, children: 0 });
const fam = K.visaCost({ route: 'graduate', where: 'inside', months: 24, partner: true, children: 1 });

export default definePage({
  id: 'graduate-visa-uk',
  group: 'study',
  order: 40,
  nav: 'Graduate visa',
  card: 'Two years until 31 December 2026, 18 months after: fee, surcharge and what to do next.',
  title: 'Graduate Visa UK 2026: Cost, 2 Years or 18 Months, Switch',
  description: `Graduate visa 2026: ${K.gbp(K.FEE.graduate())} fee plus surcharge, two years if you apply by 31 December 2026, 18 months from January 2027, three after a PhD. Cost and switch.`,
  h1: 'Graduate visa: cost, length and the 2027 change',
  intro: `Applied for by 31 December 2026, the Graduate visa lasts ${S.graduateYears} years and costs one person ${K.gbp(g(24).total)}; applied for from ${K.date(S.graduateChange)}, it lasts 18 months.`,
  resume: `The Graduate visa lets a student who has completed an eligible UK degree stay and work, or look for work, without a sponsor. It is applied for from inside the UK, before the Student visa expires, once the university has told the Home Office that the course was completed; there is no salary, English or savings test. The application fee is ${K.gbp(K.FEE.graduate())} and the health surcharge is charged at the full rate of ${K.gbp(K.P.ihs.standard)} a year, not the student rate. Its length depends on the date of application: ${S.graduateYears} years for applications made on or before 31 December 2026, 18 months for those made from ${K.date(S.graduateChange)}, and ${S.graduatePhdYears} years after a PhD or other doctorate either way. For one person that is ${K.gbp(g(24).total)} for two years, ${K.gbp(g(18).total)} for 18 months and ${K.gbp(g(36).total)} for three. The visa cannot be extended; people who want to stay usually switch to a Skilled Worker visa, where recent graduates can be paid the lower new entrant rate.`,
  tool: { kind: 'cost', props: { initialRoute: 'graduate', initialWhere: 'inside', initialMonths: 24, title: 'Graduate visa cost' } },
  body: (h) => `
<h2>Applying before or after 1 January 2027</h2>
<p>The cut-off is the date of the application, not the date of graduation: a student whose results are confirmed in December 2026 and who applies by the 31st gets two years; one who waits until January gets 18 months. The visa starts on the day it is approved, so time spent waiting for a decision (usually up to ${K.P.processing.inside.graduate} weeks) does not shorten it. You can apply as soon as the university has reported successful completion, without waiting for the graduation ceremony, but always before your Student visa runs out.</p>
${h.table(['Applied', 'Length', 'Fee', 'Surcharge', 'Total, one person'], [
    ['By 31 December 2026', `${S.graduateYears} years`, K.gbp(K.FEE.graduate()), K.gbp(K.ihs(24, 'inside', false)), K.gbp(g(24).total)],
    ['From 1 January 2027', '18 months', K.gbp(K.FEE.graduate()), K.gbp(K.ihs(18, 'inside', false)), K.gbp(g(18).total)],
    ['After a PhD, any date', `${S.graduatePhdYears} years`, K.gbp(K.FEE.graduate()), K.gbp(K.ihs(36, 'inside', false)), K.gbp(g(36).total)],
  ], 'Home Office fee table and surcharge rules; the surcharge for 18 months is one year plus half a year.', ['l', 'l', 'r', 'r', 'r'])}
<p>GOV.UK's Graduate visa page prints £1,152.50 for the 18-month surcharge; the surcharge rules give ${K.gbp(K.ihs(18, 'inside', false))}, which is what the table above uses. The exact amount is computed when you apply.</p>
<h2>Who qualifies</h2>
<p>You must be in the UK on a Student visa (or the old Tier 4 visa) and have completed a UK bachelor's degree, a postgraduate degree or another eligible course, having studied in the UK for at least 12 months of a course longer than that, or for the whole of a shorter course. Breaks and weekends spent abroad still count as study in the UK when the university did not need you there. Partners and children can stay with you only if they were already your dependants on the Student visa; a child born in the UK during your Graduate visa can now be added (HC 259). A family of three applying together pays ${K.gbp(fam.total)} for two years.</p>
<h2>What to do with it</h2>
<p>The visa allows almost any work, self-employment and job-hunting, but not work as a professional sportsperson, and no access to benefits. Time on it does not count towards settlement, so the usual next step is a Skilled Worker visa with a licensed employer: within two years of a Student or Graduate visa you can be paid the new entrant rate, 70% of the going rate with a ${K.gbp(K.P.skilledWorker.newEntrant.floor)} floor, for up to four years in total. The ${h.a('graduate-to-skilled-worker', 'switching guide')} and the ${h.a('new-entrant-salary', 'new entrant calculator')} show the threshold for your job; graduates of the top universities abroad look instead at the ${h.a('high-potential-individual-visa', 'High Potential Individual visa')}.</p>`,
  faqs: [
    { q: 'Can I extend a Graduate visa?', a: 'No. It is granted once, for two years, 18 months or three years depending on your degree and the date you apply, and cannot be renewed. To stay longer you need to switch, before it ends, to another route such as a Skilled Worker visa with a licensed employer or a Global Talent visa.' },
    { q: 'Do I need a job offer for the Graduate visa?', a: 'No. There is no sponsor, no salary threshold and no English test: the visa rests on the degree you completed on your Student visa. You can work for any employer, part time or full time, be self-employed or look for work for the whole length of the visa.' },
    { q: 'Does time on a Graduate visa count towards ILR?', a: 'No. The Graduate route does not lead to settlement and its time is not counted in the five years of the Skilled Worker route. The clock starts when you switch to a route to settlement; ten years of lawful residence in the UK, including study, can however count for long residence.' },
  ],
  related: ['graduate-to-skilled-worker', 'student-visa-uk', 'new-entrant-salary', 'high-potential-individual-visa', 'long-residence-ilr'],
  sources: ['graduate_visa', 'appendix_sw', 'fees_table', 'ihs'],
});
