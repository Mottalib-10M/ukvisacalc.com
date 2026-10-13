import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family;
const cost = (where: 'outside' | 'inside', months: number, children: number, priority: 'none' | 'super' = 'none') =>
  K.visaCost({ route: 'partner', where, months, partner: false, children, priority });
// One adult joining a British partner.
const e1 = cost('outside', F.firstLeaveMonths, 0);
const x1 = cost('inside', F.extensionMonths, 0);
const ilr = K.FEE.ilr();
const lit = K.FEE.lifeInUk();
const cit = K.visaCost({ route: 'citizenship', where: 'inside', months: 0, partner: false, children: 0 });
const settle1 = e1.total + x1.total + ilr + lit;
const british1 = settle1 + cit.total;
// The same applicant bringing two children under 18.
const e3 = cost('outside', F.firstLeaveMonths, 2);
const x3 = cost('inside', F.extensionMonths, 2);
const settle3 = e3.total + x3.total + 3 * ilr + lit;
const superX = K.FEE.superPriorityInside();

export default definePage({
  id: 'spouse-visa-uk-cost',
  group: 'family',
  order: 30,
  nav: 'Spouse visa cost',
  card: 'Every fee from the first visa to citizenship, with the health surcharge, for one adult or a family.',
  title: 'Spouse Visa Cost 2026: Fees, Surcharge and Five-Year Total',
  description: `Spouse visa cost in 2026: ${K.gbp(K.FEE.familyOutside())} fee from abroad, ${K.gbp(e1.ihsTotal)} surcharge, extension and ILR fees, and the full five-year total for one adult or for a family.`,
  h1: 'What a spouse visa costs, from first application to settlement',
  intro: `One adult applying from abroad pays ${K.gbp(e1.total)} up front. Taking the extension and indefinite leave into account, the route to settlement costs ${K.gbp(settle1)} at current rates.`,
  resume: `A spouse visa is paid for three times before you are settled, and each payment combines an application fee with, for the two temporary grants, the immigration health surcharge. From outside the UK the fee is ${K.gbp(K.FEE.familyOutside())} and the surcharge for the ${F.firstLeaveMonths}-month grant is ${K.gbp(e1.ihsTotal)}, ${K.gbp(e1.total)} in all. The in-country extension costs ${K.gbp(x1.fees)} plus ${K.gbp(x1.ihsTotal)} of surcharge for ${F.extensionMonths} months, ${K.gbp(x1.total)}. Indefinite leave to remain is ${K.gbp(ilr)} with no surcharge, and the Life in the UK test adds ${K.gbp(lit)}. One adult therefore pays ${K.gbp(settle1)} over five years in Home Office charges, and ${K.gbp(british1)} if they go on to naturalise as the spouse of a British citizen. Children pay the same fees and the reduced surcharge of ${K.gbp(K.P.ihs.reduced)} a year. The calculator above prices any mix of stage, length and family.`,
  tool: { kind: 'cost', props: { initialRoute: 'partner', initialWhere: 'outside', initialMonths: F.firstLeaveMonths, initialChildren: 0, title: 'Spouse visa cost calculator: fee and surcharge' } },
  body: (h) => `
<h2>The bill, stage by stage</h2>
<p>The figures below come from the Home Office fee table in force since ${K.date(K.FEE_DATE)} and the surcharge rates on GOV.UK. They assume you join a British or settled partner, apply for your first visa from abroad and extend inside the UK. The partner already living here pays nothing.</p>
${h.table(['Payment', 'When', 'One adult', 'Adult and two children'], [
    [`First visa (${F.firstLeaveMonths} months)`, 'year 0, from abroad', K.gbp(e1.total), K.gbp(e3.total)],
    [`Extension (${F.extensionMonths} months)`, 'about year 2¾, in the UK', K.gbp(x1.total), K.gbp(x3.total)],
    ['Life in the UK test', 'before settlement', K.gbp(lit), K.gbp(lit)],
    ['Indefinite leave to remain', `year ${F.settlementYears}`, K.gbp(ilr), K.gbp(3 * ilr)],
    ['Total to settlement', '', `<strong>${K.gbp(settle1)}</strong>`, `<strong>${K.gbp(settle3)}</strong>`],
    ['Naturalisation and ceremony (optional)', 'after settlement', K.gbp(cit.total), 'children register separately'],
  ], 'Fees and surcharge per person, summed by the cost engine; English tests, translations, travel and legal fees are extra.', ['l', 'l', 'r', 'r'])}
<p>The surcharge is worked out in half-years: ${K.gbp(K.P.ihs.standard)} for each full year and half that for a part year of six months or less, so the ${F.firstLeaveMonths}-month grant is charged as three years and the ${F.extensionMonths}-month grant as two and a half. A child under 18 pays ${K.gbp(K.ihs(F.firstLeaveMonths, 'outside', true))} on the first grant instead of ${K.gbp(e1.ihsTotal)}. Settlement and citizenship carry no surcharge at all.</p>
<h2>Paying for speed</h2>
<p>The standard service is included in the fee. Applying inside the UK you can add super priority for ${K.gbp(superX)}, which brings the extension to ${K.gbp(cost('inside', F.extensionMonths, 0, 'super').total)} for one adult; the same option exists when you apply for indefinite leave to remain. The fee table also lists a ${K.gbp(K.FEE.prioritySettlementOutside())} priority service for settlement-type visas abroad and a ${K.gbp(K.FEE.superPriorityOutside())} super priority, but they are not offered in every country, so check availability where you will give biometrics before you budget for them. Priority fees are charged per application; the calculator adds one fee to the total.</p>
<p>Speed money buys a decision date, not a better chance. If the case needs further checks, such as an interview or document verification, the decision can still take longer. The ${h.a('spouse-visa-processing-time', 'processing time page')} compares the standard and fast dates.</p>
<h2>Refunds, waivers and timing tricks</h2>
<p>If a visa is refused, the surcharge is refunded in full to the card that paid it; the application fee is kept once processing has started. An extension made several months before the first grant expires does not lose you those months: when you extend with the same partner, up to 28 days of remaining permission is added to the new grant, and if the surcharge periods overlap you receive a partial refund rounded down to the nearest six months.</p>
<p>A fee waiver is available on the partner route if you have no home and cannot afford one, cannot afford essentials such as food or heating, or have a very low income and the fee would harm your child's welfare. The waiver request is made online, from inside or outside the UK, with evidence of your income and outgoings.</p>
<p>The cheapest legal sequence for most couples is the one shown: first visa abroad, extension inside the UK, settlement after five years. Switching into the route from a Skilled Worker or Student visa skips the overseas fee and pays the in-country ${K.gbp(K.FEE.leaveToRemainOther())} instead, but the five-year count only starts on the day of the switch, because time on other visas does not count. Fees have changed ${K.FEES.versions.length} times since January 2024, which is why the ${h.a('home-office-fees', 'fee history')} and the ${h.a('immigration-health-surcharge', 'surcharge page')} are worth checking before you pay.</p>`,
  faqs: [
    { q: 'Is the spouse visa fee paid per person?', a: `Yes. Each applicant pays the full fee and their own surcharge, and children are not discounted on the fee, only on the surcharge. A mother bringing two children under 18 pays ${K.gbp(e3.fees)} in fees and ${K.gbp(e3.ihsTotal)} in surcharge on the first visa, ${K.gbp(e3.total)} together. The British or settled partner who sponsors the application pays nothing.` },
    { q: 'Can my British partner pay the visa fees for me?', a: 'Yes. GOV.UK expects that someone else may pay: if your partner paid the health surcharge and the application is refused or withdrawn, the refund goes back to them, on the card they used. The fee and surcharge must be paid before the application counts as made. Paying them has no effect on the financial requirement, which looks only at income and savings.' },
    { q: 'How much more does a spouse visa cost from inside the UK?', a: `Less, in fact. Switching or extending in the UK costs ${K.gbp(K.FEE.leaveToRemainOther())} against ${K.gbp(K.FEE.familyOutside())} from abroad, although the in-country grant is shorter, ${F.extensionMonths} months instead of ${F.firstLeaveMonths}, so the surcharge is lower too. You cannot switch from a visitor visa or any visa of six months or less, except from the fiancé visa.` },
    { q: 'Will the cost go up before my extension is due?', a: `It may. The Home Office fee table changed ${K.FEES.versions.length} times between January 2024 and ${K.date(K.FEE_DATE)}, and the surcharge is set separately. You pay the rate in force on the day you submit, so an application made before an increase takes effect costs the old amount. This page reads each new table when the Home Office publishes it, and the calculator follows.` },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-extension', 'family-visa-uk', 'immigration-health-surcharge', 'uk-visa-cost-calculator', 'ilr-fee', 'citizenship-spouse-of-british-citizen'],
  sources: ['fees_table', 'family_visa', 'ihs', 'ilr_family', 'citizenship_spouse', 'times_outside'],
});
