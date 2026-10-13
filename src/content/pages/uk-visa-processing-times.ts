import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.processing;
const LABEL: Record<string, string> = { 'skilled-worker': 'Skilled Worker', 'health-and-care': 'Health and Care Worker', student: 'Student', visitor: 'Standard Visitor', partner: 'Partner or spouse', 'global-talent': 'Global Talent', hpi: 'High Potential Individual', ancestry: 'UK Ancestry', graduate: 'Graduate' };
const w = (x: number | null | undefined) => (x == null ? 'not available' : `${x} weeks`);
const ex = K.decisionDate('skilled-worker', 'outside', '2026-12-14');

export default definePage({
  id: 'uk-visa-processing-times',
  group: 'costs',
  order: 50,
  nav: 'Visa processing times',
  card: 'UKVI service standards by route, from abroad and in the UK, with the date to expect a decision.',
  title: 'Visa Processing Times UK 2026: Decision Date by Route',
  description: `UK visa processing times of ${K.date(T.updated)}: 3 weeks for most visas from abroad, 8 weeks in the UK, 12 for partners, 6 months for ILR, with the date to expect.`,
  h1: 'UK visa processing times and your decision date',
  intro: `Most visas applied for from abroad are decided within ${T.outside['skilled-worker']} weeks, in-UK applications within ${T.inside['skilled-worker']}, partner visas from abroad within ${T.outside.partner}. Enter your appointment date to see yours.`,
  resume: `UK Visas and Immigration publishes a service standard for each type of application, the time within which it aims to decide most cases; the figures in force were updated on ${K.date(T.updated)}. From abroad, almost every work, study and visit visa has a standard of ${T.outside['skilled-worker']} weeks and partner, parent and child visas ${T.outside.partner} weeks. From inside the UK, extensions and switches usually take ${T.inside['skilled-worker']} weeks, the Health and Care Worker visa ${T.inside['health-and-care']}, and settlement and citizenship ${T.ilrMonths} months. The clock starts when you prove your identity, at a visa centre or through the ID Check app, not when you pay, and it counts the UK working week with public holidays included, so ${T.outside['skilled-worker']} weeks means about ${T.outside['skilled-worker'] * 7} calendar days. An appointment on ${K.date('2026-12-14')} for a Skilled Worker visa from abroad therefore points to a decision by ${K.date(ex.expected!)}. Inside the UK, priority and super priority services buy a decision within 5 working days or by the end of the next working day; abroad, faster services are sold where the visa centre offers them.`,
  tool: { kind: 'time', props: { initialRoute: 'skilled-worker', title: 'When to expect your decision' } },
  body: (h) => `
<h2>Service standards by route</h2>
${h.table(['Application', 'From outside the UK', 'Inside the UK'], Object.keys(LABEL).map((k) => [LABEL[k], w((T.outside as Record<string, number | null>)[k]), w((T.inside as Record<string, number | null>)[k])]), `UKVI visa processing times, updated ${K.date(T.updated)}. Graduate applications can only be made inside the UK.`, ['l', 'r', 'r'])}
<p>Two in-UK family cases have no service standard: a partner who does not meet the income and English requirements and applies on the basis of private life, and a parent. UKVI states they currently take around ${K.P.family.decisionWeeks.insideNoRequirementsMonths} months. Indefinite leave to remain and naturalisation are usually decided within ${T.ilrMonths} months of the biometrics appointment.</p>
<h2>Planning around the standard</h2>
<p>Skilled Workers can apply up to three months before the start date on their certificate of sponsorship, and students up to six months before their course from abroad: with a standard of a few weeks, applying early leaves room for a request for more evidence. For an extension, apply before the current visa expires, then stay within the UK, Ireland, the Channel Islands and the Isle of Man until the decision: GOV.UK warns that travelling further withdraws the application.</p>
<h2>What makes an application take longer</h2>
<p>The standards describe straightforward cases. UKVI lists the usual reasons for a longer wait: documents that need checking, information that does not match, a request for more evidence (bank statements, for instance), an interview, a criminal record or other personal circumstances, and periods of high demand or technical outages. In those cases it should contact you within the standard to say that the decision will take longer. Booking travel before the decision is at your own risk: UKVI does not reimburse tickets if a visa is late or refused.</p>
<h2>Paying for a faster decision</h2>
<p>Inside the UK, priority costs ${K.gbp(K.FEE.priorityInside())} for a decision within 5 working days, and super priority ${K.gbp(K.FEE.superPriorityInside())} for a decision by the end of the next working day after a weekday appointment (2 working days after a weekend one; for settlement, 2 working days). Working days exclude weekends and bank holidays. Outside the UK the fee table prices priority at ${K.gbp(K.FEE.priorityOutside())} and super priority at ${K.gbp(K.FEE.superPriorityOutside())}, in the countries and visa centres that sell them, with the timing stated when you book. Places are limited and some routes, such as adults coming to be cared for by a relative, are excluded. The fee buys speed, not a better chance: a weak application is refused faster.</p>
<p>When the standard has passed and nobody has contacted you, UKVI asks applicants to get in touch through its contact centre; the calculator gives that date. For the cost of each service with the visa itself, see the ${h.a('uk-visa-cost-calculator', 'cost calculator')}; for Skilled Worker and partner cases in detail, the ${h.a('skilled-worker-visa-processing-time', 'Skilled Worker')} and ${h.a('spouse-visa-processing-time', 'spouse visa')} timing pages.</p>`,
  faqs: [
    { q: 'Do visa processing times include weekends?', a: `They are counted in UK working weeks, Monday to Friday, and UK public holidays are included in that count rather than added on. In practice a standard of ${T.outside['skilled-worker']} weeks runs about ${T.outside['skilled-worker'] * 7} calendar days from your biometrics or ID check. Public holidays in your own country are not taken into account and can delay the visa centre.` },
    { q: 'Can I track my UK visa application?', a: 'UKVI does not offer step-by-step tracking. It asks applicants not to contact it while the application is within the published standard, as it cannot give an update. For visits, study and work, an online service gives the date you can expect a decision; once the published time has passed without news, UKVI asks you to contact it.' },
    { q: 'Does the decision time start when I submit online?', a: 'No. It starts when you have proved your identity and provided your documents: either through the UK Immigration: ID Check app, which is immediate, or at your appointment at a visa application centre. The days between submitting the form and attending the appointment do not count.' },
  ],
  related: ['skilled-worker-visa-processing-time', 'spouse-visa-processing-time', 'ilr-processing-time', 'uk-visa-cost-calculator', 'standard-visitor-visa-uk', 'student-visa-uk'],
  sources: ['times_outside', 'times_inside', 'fees_table', 'ilr_sw'],
});
