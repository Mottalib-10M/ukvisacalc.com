import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const I = K.P.ihs;
const lens: Array<[string, number]> = [['6 months', 6], ['1 year', 12], ['18 months', 18], ['2 years', 24], ['2 years 6 months', 30], ['2 years 9 months', 33], ['3 years', 36], ['5 years', 60]];

export default definePage({
  id: 'immigration-health-surcharge',
  group: 'costs',
  order: 30,
  nav: 'Immigration health surcharge',
  card: 'IHS by length of visa, adult or child, from abroad or in the UK, with exemptions and refunds.',
  title: 'Immigration Health Surcharge 2026: IHS Fee and Calculator',
  description: `Immigration health surcharge 2026: ${K.gbp(I.standard)} a year, ${K.gbp(I.reduced)} for students and under-18s. IHS for any visa length and family, part years, exemptions and refunds.`,
  h1: 'Immigration health surcharge (IHS) calculator',
  intro: `${K.gbp(I.standard)} per person per year, ${K.gbp(I.reduced)} for students, their dependants, Youth Mobility applicants and children; part years are charged by halves.`,
  resume: `The immigration health surcharge is the amount most visa applicants pay, on top of the application fee, to use the NHS during their stay. It is ${K.gbp(I.standard)} per person for each year of the visa, and ${K.gbp(I.reduced)} for students, their dependants, Youth Mobility Scheme applicants and anyone under 18 on the day of the application. It is not charged on visitor visas, on settlement applications, or to Health and Care Worker visa holders and their families, and an application from abroad for six months or less pays nothing. Part years follow a simple rule: six months or less counts as half a year, more than six months as a full year, so a visa of 2 years and 9 months costs three years of surcharge, ${K.gbp(K.ihs(33, 'outside', false))} for an adult. The calculator above gives the surcharge for each person of your family, next to the application fees, and the table below shows the common lengths.`,
  tool: { kind: 'cost', props: { initialRoute: 'partner', initialMonths: 33, initialChildren: 1, title: 'Health surcharge for your family' } },
  body: (h) => `
<h2>Surcharge by length of visa</h2>
${h.table(['Length of the visa', 'Adult, from abroad', 'Adult, in the UK', 'Child or student'], lens.map(([l, m]) => [l, K.gbp(K.ihs(m, 'outside', false)), K.gbp(K.ihs(m, 'inside', false)), K.gbp(K.ihs(m, 'outside', true))]), `Rates of ${K.gbp(I.standard)} and ${K.gbp(I.reduced)} a year, part-year rules of GOV.UK; the child or student column is for an application from abroad.`, ['l', 'r', 'r', 'r'])}
<p>The only difference between the two adult columns is the first line: from inside the UK, a grant of six months or less still costs half a year. Everywhere else the surcharge depends only on the length and on who applies.</p>
<h2>Who does not pay</h2>
<p>The surcharge is not due on an application for indefinite leave to remain or enter, on any visitor visa, or on an application from abroad for six months or less. Health and Care Worker visa holders and their dependants are exempt, which is a large part of why that route is the cheapest way into a health or social care job. Applicants under the EU Settlement Scheme, asylum seekers, victims of trafficking, people applying as stateless, and dependants of the UK armed forces are also exempt, among others listed by ${h.src('ihs_who', 'GOV.UK')}. A settlement applicant who is granted only limited leave must pay the surcharge before the leave is issued.</p>
<p>Holding private health insurance does not remove the surcharge, and paying it does not cover everything: prescriptions in England, dental treatment, eye tests and assisted conception are charged as they are to residents.</p>
<h2>Refunds</h2>
<p>The whole surcharge comes back if the visa is refused, if you withdraw before a decision, or if you paid twice for the same application. Part of it comes back if you are granted less time than you asked for, if a dependant is refused, or if a new in-UK grant overlaps a period already paid by six months or more, in which case the refund is rounded down to the nearest six months. Nothing is refunded if you leave early, do not travel, or switch to a route that is exempt. Refunds go to the card that paid, usually within six weeks of the decision.</p>
<p>Two groups can claim money back afterwards: full-time students from the EU, Switzerland, Norway, Iceland or Liechtenstein who hold a European health card and do not work, and people who worked in health or care for at least six months on a visa for which they paid the surcharge. The ${h.a('uk-visa-cost-calculator', 'cost calculator')} adds the surcharge to every fee, and the ${h.a('uk-visa-fees', 'fee table')} lists the fees themselves.</p>`,
  faqs: [
    { q: 'Is the immigration health surcharge paid every year?', a: 'No. It is paid in full, for the whole length of the visa, when you apply, before the application fee. The amount is fixed at that moment: if the rate rises later, you do not pay the difference until your next application, which will charge the new rate for the new period.' },
    { q: 'Does a newborn baby pay the surcharge?', a: `A child born in the UK who applies for a visa as a dependant pays the reduced rate of ${K.gbp(I.reduced)} a year for the length of the grant, which usually ends with the parent's visa. A child who is British at birth, because a parent is British or settled, needs no visa and pays nothing.` },
    { q: 'What happens if I do not pay the surcharge in full?', a: 'UK Visas and Immigration emails you with the amount missing. You then have 10 working days to pay if you are in the UK, or 7 working days if you are abroad; if you do not pay, the application is refused. Check your junk folder after applying.' },
  ],
  related: ['uk-visa-cost-calculator', 'uk-visa-fees', 'health-and-care-worker-visa', 'student-visa-uk-cost', 'spouse-visa-uk-cost', 'skilled-worker-visa-cost'],
  sources: ['ihs', 'ihs_who', 'fees_table', 'hcw_visa'],
});
