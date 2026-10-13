import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.student;
const c = (m: number, p = false, k = 0) => K.visaCost({ route: 'student', where: 'outside', months: m, partner: p, children: k });
const lens: Array<[string, number]> = [['Pre-sessional or short course, 6 months', 6], ['One-year master’s (visa about 16 months)', 16], ['Two-year master’s or foundation (about 28 months)', 28], ['Three-year bachelor’s (about 40 months)', 40], ['Four-year PhD (about 52 months)', 52]];
const phd = c(52, true, 1);

export default definePage({
  id: 'student-visa-uk-cost',
  group: 'study',
  order: 20,
  nav: 'Student visa cost',
  card: 'Fee, student surcharge and the money to show, by course length and family.',
  title: 'Student Visa UK Cost 2026: Fee, Surcharge, Funds by Course',
  description: `Student visa UK cost: ${K.gbp(K.FEE.student('outside'))} per person, surcharge at ${K.gbp(K.P.ihs.reduced)} a year, plus fees and living costs to show. Totals for a master's, a bachelor's and a PhD in 2026.`,
  h1: 'What a UK Student visa costs, course by course',
  intro: `For a one-year master's, the Home Office takes ${K.gbp(c(16).total)}: ${K.gbp(K.FEE.student('outside'))} of fee and ${K.gbp(c(16).ihsTotal)} of surcharge. The money you must show comes on top.`,
  resume: `Two kinds of money are involved in a Student visa, and only one of them is spent. What you pay the Home Office is the visa fee of ${K.gbp(K.FEE.student('outside'))}, the same from abroad or in the UK, and the immigration health surcharge at the student rate of ${K.gbp(K.P.ihs.reduced)} for each year of the visa, half a year for a remainder of six months or less. A visa runs longer than the course itself, so a one-year master's usually means a visa of around 16 months and a surcharge of ${K.gbp(K.ihs(16, 'outside', true))}. What you must show, but keep, is the unpaid first-year tuition plus living costs for up to nine months, ${K.gbp(S.maintenance.outside)} a month outside London or ${K.gbp(S.maintenance.london)} in London, and ${K.gbp(S.maintenanceFrom.outside)} or ${K.gbp(S.maintenanceFrom.london)} for applications from ${K.date(S.maintenanceFrom.date)}. The calculator above prices the visa for any length and family; the money test is on the Student visa page.`,
  tool: { kind: 'cost', props: { initialRoute: 'student', initialMonths: 16, title: 'Student visa fee and surcharge' } },
  body: (h) => `
<h2>Typical totals by type of course</h2>
${h.table(['Course', 'Fee', 'Surcharge', 'Paid to the Home Office'], lens.map(([l, m]) => { const x = c(m); return [l, K.gbp(x.fees), K.gbp(x.ihsTotal), K.gbp(x.total)]; }), `One student applying from abroad; visa lengths are typical, the CAS dates set the real one. Fee table of ${K.date(K.FEE_DATE)}, surcharge at ${K.gbp(K.P.ihs.reduced)} a year.`, ['l', 'r', 'r', 'r'])}
<p>The surcharge rises in half-year steps, so the visa length matters more than the course: a course that ends in September with a visa running into the following January costs half a year more than one whose visa stops in December. You cannot choose the end date, which the Home Office sets from the course dates, but you can check the surcharge before paying: it is shown when you request the reference number.</p>
<h2>Paid once, shown once</h2>
<p>Students often add the money to show to the money to pay, and overestimate the cost by thousands. The fee and the surcharge are spent the day you apply; the tuition and living-cost figures are a balance to prove, which then pays your rent and your fees as normal. If your university has already received part of the tuition, the CAS records it and the amount to show falls by the same sum, so paying a deposit early can make the bank test easier, never the Home Office bill smaller.</p>
<h2>A family on a PhD</h2>
<p>Partners and children may come only with a government-sponsored student or a research postgraduate (a PhD, another doctorate or a research master's) on a course of nine months or more. Each pays the ${K.gbp(K.FEE.student('outside'))} fee and the student surcharge for the same length. A PhD student with a partner and one child on a visa of about 52 months pays ${K.gbp(phd.total)}, of which ${K.gbp(phd.ihsTotal)} is surcharge, and must also show ${K.gbp(S.dependants.outside)} a month for each dependant outside London (${K.gbp(S.dependants.london)} in London), for up to nine months.</p>
<h2>Costs that are easy to forget</h2>
<ul>
<li>The English test, if your university asks for one, booked with an approved provider.</li>
<li>Tuberculosis test results, if you live in one of the countries where the test is required.</li>
<li>An ATAS certificate, if your course and nationality require one: apply early, as it must be valid when you apply for the visa.</li>
<li>Priority or super priority service, where the visa centre offers them, at ${K.gbp(K.FEE.priorityOutside())} or ${K.gbp(K.FEE.superPriorityOutside())}.</li>
<li>At the end of the course, the ${h.a('graduate-visa-uk', 'Graduate visa')}: ${K.gbp(K.FEE.graduate())} and the full-rate surcharge of ${K.gbp(K.P.ihs.standard)} a year.</li>
</ul>
<p>If the visa is refused, the surcharge is refunded in full and the fee is not. Students from the EU, Switzerland, Norway, Iceland or Liechtenstein who hold a European health insurance card and do not work can claim the surcharge back. The ${h.a('immigration-health-surcharge', 'surcharge page')} explains both refunds.</p>`,
  faqs: [
    { q: 'Is the student visa fee the same from inside the UK?', a: `Yes. The Student visa costs ${K.gbp(K.FEE.student('inside'))} whether you apply from abroad or extend or switch inside the UK, unlike work visas, which are dearer inside. The surcharge differs only for very short visas: six months or less is free from abroad but costs half a year from inside the UK.` },
    { q: 'Do I pay the surcharge for the whole course at once?', a: 'Yes, for the full length of the visa, before you pay the application fee. A three-year degree with a visa of about 40 months is charged three and a half years at the student rate in one payment. There is no instalment option, so the amount has to be available on your card when you apply.' },
    { q: 'Is the money I show for living costs paid to anyone?', a: 'No. It is evidence that you can support yourself: it must stay in the account for 28 days in a row, ending within 31 days of the application, and then it is yours to spend during your studies. Only the fee and the surcharge are paid to the Home Office.' },
  ],
  related: ['student-visa-uk', 'student-visa-uk-requirements', 'immigration-health-surcharge', 'uk-visa-cost-calculator', 'graduate-visa-uk'],
  sources: ['student_visa', 'fees_table', 'ihs', 'hc_584'],
});
