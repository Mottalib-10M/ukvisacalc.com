import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family;
const fi = K.visaCost({ route: 'fiance', where: 'outside', months: F.fianceMonths, partner: false, children: 0 });
const sw = K.visaCost({ route: 'partner', where: 'inside', months: F.extensionMonths, partner: false, children: 0 });
const ab = K.visaCost({ route: 'partner', where: 'outside', months: F.firstLeaveMonths, partner: false, children: 0 });
const ilr = K.FEE.ilr(), lit = K.FEE.lifeInUk();
// Fiancé route: 6 months that do not count, then two in-country grants of 30 months to reach 60.
const viaFiance = fi.total + 2 * sw.total + ilr + lit;
// Marrying abroad first: one overseas grant of 33 months, one extension.
const viaSpouse = ab.total + sw.total + ilr + lit;

export default definePage({
  id: 'fiance-visa-uk',
  group: 'family',
  order: 50,
  nav: 'Fiancé visa',
  card: 'Six months to marry in the UK, no work allowed, then a switch to the partner route.',
  title: 'Fiancé Visa UK 2026: Six Months to Marry, Fee and Switch',
  description: `Fiancé visa for 2026: ${F.fianceMonths} months to marry in the UK, no work, the ${K.gbp(fi.fees)} fee with no surcharge, then the in-country switch to a spouse visa and its cost.`,
  h1: 'Fiancé visa: coming to the UK to marry and stay',
  intro: `The fiancé visa costs ${K.gbp(fi.fees)}, carries no health surcharge and lasts ${F.fianceMonths} months. You must marry in that time, then switch to a spouse visa from inside the UK.`,
  resume: `The fiancé, fiancée or proposed civil partner visa is the entry route for couples who want to marry or form a civil partnership in the UK and then live here. It is granted for ${F.fianceMonths} months, during which you must hold the ceremony; you may not work or study and you cannot claim public funds. The requirements mirror the spouse visa: your partner is British, Irish or settled, you are both 18 or over and have met in person, any earlier marriage has ended, you pass an A1 English test and the couple shows ${K.gbp(F.minimumIncome)} of income or the matching savings. The application from abroad costs ${K.gbp(fi.fees)}, and because the grant is for ${F.fianceMonths} months from outside the UK there is no immigration health surcharge. After the wedding you switch to the partner route inside the UK for ${K.gbp(sw.total)}, fee and surcharge included. The ${F.fianceMonths} months as a fiancé do not count towards settlement.`,
  tool: { kind: 'cost', props: { initialRoute: 'fiance', initialWhere: 'outside', initialChildren: 0, title: 'Fiancé visa cost, then the switch to spouse' } },
  body: (h) => `
<h2>What the six months allow, and what they do not</h2>
<p>A fiancé visa is a short permission with one purpose. Paragraph D-ECP.1.1 of Appendix FM grants it for no more than ${F.fianceMonths} months, with a prohibition on employment and a no recourse to public funds condition. You may live with your partner, arrange the wedding and give notice of marriage at a register office; you may not take a job, run a business or enrol on a course. Your partner keeps working as normal.</p>
<p>Two extra conditions apply to fiancés. The two of you must be coming to the UK so that the marriage or civil partnership can take place here (paragraph E-ECP.2.8), and neither of you may be married to or in a civil partnership with anyone else on the date you apply. Everything else is the partner test: a sponsor who is British, Irish, settled or in one of the other listed categories, a genuine relationship, adequate accommodation, English at A1 in speaking and listening, and the financial requirement. Because the sponsor's income is all that counts before arrival, a sponsor without a salary needs savings of ${K.gbp(K.spouseTest({ employment: 0, other: 0, savings: 0, legacy: false, children: 0, stage: 'entry' }).savingsOnlyNeeded)} on their own.</p>
<p>The application is made online from outside the UK. You cannot switch into it from a visitor visa, and a visitor or ETA holder cannot give notice of marriage either. UKVI aims to decide within ${F.decisionWeeks.outside} weeks of the biometrics appointment.</p>
<h2>After the wedding: switching to a spouse visa</h2>
<p>Once married, you apply inside the UK for permission to stay as a partner. This is one of the few cases where a visa of six months or less can be switched without leaving: paragraph E-LTRP.2.1 makes an exception for fiancés. The switch is an application for ${F.extensionMonths} months at the in-country fee of ${K.gbp(sw.fees)} plus ${K.gbp(sw.ihsTotal)} of surcharge, and the financial and English rules are checked again. When it is granted, the work ban ends.</p>
<p>If the ceremony could not happen in time, for example because of illness or a delay at the register office, paragraph E-LTRP.1.11 lets you apply for a further ${F.fianceMonths} months as a fiancé, provided there is good reason and evidence that the marriage will take place in the next six months. The ban on work continues.</p>
${h.box('Rule for couples first granted before 11 April 2024', `<p>If your fiancé visa came from an application made before ${K.date(F.legacy.cutoff)}, the switch and later extensions use the transitional level of ${K.gbp(F.legacy.base)} plus children (E-LTRP.3.5), not ${K.gbp(F.minimumIncome)}. The ${h.a('spouse-visa-extension', 'extension page')} sets out that rule.</p>`)}
<h2>Fiancé route or marry abroad first?</h2>
<p>The fiancé visa is not the cheapest way to settlement, because the ${F.fianceMonths} months are excluded from the five years and the partner grants that follow are the shorter in-country ones. To reach ${F.settlementYears} years as a partner you need two grants of ${F.extensionMonths} months after the switch.</p>
${h.table(['Route to settlement', 'Visas paid for', 'Total in Home Office charges'], [
    ['Fiancé visa, then two in-UK partner grants', `${F.fianceMonths} + ${F.extensionMonths} + ${F.extensionMonths} months`, K.gbp(viaFiance)],
    ['Marry abroad, spouse visa, one in-UK extension', `${F.firstLeaveMonths} + ${F.extensionMonths} months`, K.gbp(viaSpouse)],
  ], 'One adult; both totals include indefinite leave and the Life in the UK test, at current fees.', ['l', 'l', 'r'])}
<p>The gap of ${K.gbp(viaFiance - viaSpouse)} and an extra half-year before settlement are the price of holding the wedding in the UK. Some couples prefer it anyway: the ceremony happens with family present, and the partner abroad does not need to organise a marriage recognised in the UK from overseas. Couples who only want a UK wedding and will leave afterwards need neither route; the Marriage Visitor visa covers that. The ${h.a('spouse-visa-uk', 'spouse visa guide')} explains the partner route, and the ${h.a('spouse-visa-uk-cost', 'spouse visa cost page')} prices it with children.</p>`,
  faqs: [
    { q: 'Can I work while on a fiancé visa?', a: 'No. The grant carries a prohibition on employment, which covers paid and unpaid work and self-employment, and you cannot study either. The ban lasts until your in-country application to switch to the partner route is approved. Working in breach of the condition can lead to refusal of that switch, so wait for the new grant before starting a job.' },
    { q: 'What if we do not marry within six months?', a: `Apply for a further ${F.fianceMonths} months as a fiancé before your permission ends, explaining why the marriage did not happen and showing it will take place within the next six months, for example a booking with a register office. Without good reason the extension can be refused. If you have separated, the fiancé permission no longer has a purpose and you should leave or seek advice.` },
    { q: 'Do fiancé visa applicants pay the immigration health surcharge?', a: `Not on the fiancé visa itself: a grant of six months or less applied for from outside the UK carries no surcharge, so you pay only the ${K.gbp(fi.fees)} fee. You will pay the surcharge when you switch to the partner route inside the UK, ${K.gbp(sw.ihsTotal)} for the ${F.extensionMonths}-month grant at the current rate.` },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-extension', 'spouse-visa-uk-cost', 'spouse-visa-financial-requirement', 'standard-visitor-visa-uk'],
  sources: ['family_visa', 'appendix_fm', 'fees_table', 'ihs_who', 'times_outside'],
});
