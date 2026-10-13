import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.student;
const ex = K.studentFunds(false, 12, 18000, 0, '2026-10-13');
const exNew = K.studentFunds(false, 12, 18000, 0, S.maintenanceFrom.date);
const ma16 = K.visaCost({ route: 'student', where: 'outside', months: 16, partner: false, children: 0 });

export default definePage({
  id: 'student-visa-uk',
  group: 'study',
  order: 10,
  nav: 'Student visa',
  card: 'Money to show, fee and surcharge, dependants and the Graduate visa after the course.',
  title: 'Student Visa UK 2026: Money to Show, Fee and Surcharge',
  description: `Student visa UK 2026: course fees plus ${K.gbp(S.maintenance.london)} or ${K.gbp(S.maintenance.outside)} a month for up to 9 months, rising on 30 November 2026; ${K.gbp(K.FEE.student('outside'))} visa fee and the health surcharge.`,
  h1: 'Student visa: how much money you need to show and pay',
  intro: `You must show the first year of course fees plus living costs for up to 9 months: ${K.gbp(S.maintenance.london)} a month in London, ${K.gbp(S.maintenance.outside)} elsewhere, rising on ${K.date(S.maintenanceFrom.date)}.`,
  resume: `A Student visa needs an unconditional offer from a licensed student sponsor, confirmed by a Confirmation of Acceptance for Studies (CAS), English at the level the course requires, and money: the course fees for the first academic year still unpaid, shown on the CAS, plus living costs of ${K.gbp(S.maintenance.london)} a month in London or ${K.gbp(S.maintenance.outside)} outside it, for up to ${S.maintenance.maxMonths} months. For applications made from ${K.date(S.maintenanceFrom.date)}, the Statement of Changes HC 584 raises those figures to ${K.gbp(S.maintenanceFrom.london)} and ${K.gbp(S.maintenanceFrom.outside)}. The money must sit in the account for 28 days in a row, ending no more than 31 days before you apply, unless you have already lived in the UK with a visa for 12 months. On top of that you pay the visa fee of ${K.gbp(K.FEE.student('outside'))} and the health surcharge at the student rate of ${K.gbp(K.P.ihs.reduced)} a year: ${K.gbp(ma16.total)} for a typical 16-month master's visa. The calculator above works out both sums for your course.`,
  tool: { kind: 'student', props: { title: 'Student visa money and fees' } },
  body: (h) => `
<h2>The money test in practice</h2>
<p>Take a one-year master's outside London with ${K.gbp(18000)} of fees still to pay. Applying before ${K.date(S.maintenanceFrom.date)}, the student must show ${K.gbp(ex.total)}: the fees plus ${ex.months} months at ${K.gbp(ex.monthly)}. The same application made on or after that date needs ${K.gbp(exNew.total)}. Fees you have already paid are taken off the amount shown on the CAS, and a deposit paid for your accommodation in the UK can reduce the living costs you must show, up to a cap the Home Office raises with the maintenance figures (the accommodation offset). "London" means the City of London and the 32 London boroughs; a campus of a London university outside them counts as outside London.</p>
<p>If a student loan or an official financial sponsor pays, you send their letter instead of statements for that part. Nationals of the countries on the "differential evidence" list (from Australia and the United States to Malaysia, Thailand and the EU states) do not have to send the bank evidence with the application, but must hold the money and can be asked for it before the decision.</p>
<h2>Who can bring a family</h2>
<p>Only two groups can bring a partner or children: government-sponsored students on a course of more than six months, and full-time postgraduate students on a course of 9 months or more which, for courses starting since 1 January 2024, must be a PhD or another doctorate or a research-based higher degree. A taught master's no longer qualifies. Each dependant pays the same ${K.gbp(K.FEE.student('outside'))} fee and student surcharge, and must show ${K.gbp(S.dependants.london)} a month in London or ${K.gbp(S.dependants.outside)} elsewhere, for up to ${S.maintenance.maxMonths} months.</p>
${h.tool({ kind: 'cost', props: { initialRoute: 'student', initialMonths: 40, initialPartner: true, title: 'Fees and surcharge for a PhD student with a partner' } })}
<h2>Timing and what comes after</h2>
<p>From abroad you can apply up to 6 months before the course and must do so within 6 months of receiving the CAS; from inside the UK, up to 3 months before, with the new course starting within 28 days of the old visa's end. Decisions usually take ${K.P.processing.outside.student} weeks from abroad and ${K.P.processing.inside.student} in the UK. You may arrive up to a month before a course of more than six months, never before the start date of the visa.</p>
<p>After a degree, the ${h.a('graduate-visa-uk', 'Graduate visa')} lets you stay without a sponsor: ${S.graduateYears} years if you apply by 31 December 2026, 18 months from ${K.date(S.graduateChange)}, ${S.graduatePhdYears} years after a PhD. A Skilled Worker job can follow at the new entrant rate, as the ${h.a('graduate-to-skilled-worker', 'switching guide')} shows.</p>`,
  faqs: [
    { q: 'How much bank balance is needed for a UK student visa?', a: `The unpaid first-year course fees on your CAS plus living costs for up to ${S.maintenance.maxMonths} months: ${K.gbp(S.maintenance.london * 9)} for London or ${K.gbp(S.maintenance.outside * 9)} elsewhere at the current rates, and ${K.gbp(S.maintenanceFrom.london * 9)} or ${K.gbp(S.maintenanceFrom.outside * 9)} for applications from ${K.date(S.maintenanceFrom.date)}. The money must be held for 28 consecutive days.` },
    { q: 'Can I work on a Student visa?', a: 'Often yes, but the hours depend on the level of the course and on whether it is term time, and they are written on your visa. Some work is never allowed, for instance as a professional sportsperson or sports coach, and you cannot claim benefits. Check the conditions printed on your eVisa before accepting a job.' },
    { q: 'How long can I stay on a Student visa?', a: 'For adults, usually up to five years of study at degree level and up to two years below it. The exact end date is set from the course dates on your CAS, and the health surcharge is charged for the whole of that period.' },
  ],
  related: ['student-visa-uk-cost', 'student-visa-uk-requirements', 'graduate-visa-uk', 'immigration-health-surcharge', 'graduate-to-skilled-worker'],
  sources: ['student_visa', 'hc_584', 'ihs', 'fees_table', 'graduate_visa'],
});
