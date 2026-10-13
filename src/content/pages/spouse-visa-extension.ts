import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family;
const L = F.legacy;
const x1 = K.visaCost({ route: 'partner', where: 'inside', months: F.extensionMonths, partner: false, children: 0 });
const x2 = K.visaCost({ route: 'partner', where: 'inside', months: F.extensionMonths, partner: false, children: 1 });
// A couple first granted in 2023 with two non-British children, earning £20,000 together.
const legacyCase = K.spouseTest({ employment: 20000, other: 0, savings: 0, legacy: true, children: 2, stage: 'extension' });
// Same income under the current rule.
const newCase = K.spouseTest({ employment: 20000, other: 0, savings: 0, legacy: false, children: 2, stage: 'extension' });
const kidsRows = [0, 1, 2, 3, 4, 5].map((n) => [n === 0 ? 'No child counted' : `${n} ${n === 1 ? 'child' : 'children'}`, K.gbp(K.requiredIncome(true, n)), K.gbp(K.requiredIncome(false, n))]);

export default definePage({
  id: 'spouse-visa-extension',
  group: 'family',
  order: 40,
  nav: 'Spouse visa extension',
  card: 'Renewing for 30 months inside the UK: the pre-April 2024 income rule, A2 English and the fee.',
  title: 'Spouse Visa Extension: 30 Months, Income Rule and Fee',
  description: `Spouse visa extension inside the UK: ${F.extensionMonths} more months, ${K.gbp(L.base)} income for couples first granted before ${K.date(L.cutoff)}, A2 English, the fee and surcharge.`,
  h1: 'Extending a spouse visa inside the UK',
  intro: `The extension gives ${F.extensionMonths} more months and costs ${K.gbp(x1.total)} for one adult. Couples first granted before ${K.date(L.cutoff)} keep the old ${K.gbp(L.base)} income level.`,
  resume: `Near the end of your first ${F.firstLeaveMonths}-month grant you apply, from inside the UK, for a further ${F.extensionMonths} months as a partner; with that second grant you reach the ${F.settlementYears} years needed for indefinite leave to remain. The caseworker checks the same things as the first time with three changes. Your own UK earnings now count towards the income test. If your first application as a partner or fiancé was made before ${K.date(L.cutoff)} and you are extending with the same partner, the income level is ${K.gbp(L.base)}, plus ${K.gbp(L.firstChild)} for the first non-British child and ${K.gbp(L.otherChild)} for each further one, never more than ${K.gbp(L.cap)}; everyone else needs ${K.gbp(F.minimumIncome)}. And if your English was proved with an A1 test, you now need A2. The application fee is ${K.gbp(x1.fees)} and the surcharge ${K.gbp(x1.ihsTotal)}, ${K.gbp(x1.total)} for one adult, with super priority available for ${K.gbp(K.FEE.superPriorityInside())}.`,
  tool: { kind: 'spouse', props: { initialEmployment: 20000, initialStage: 'extension', title: 'Spouse visa extension: income test at renewal' } },
  body: (h) => `
<h2>When to apply and what is checked again</h2>
<p>You can apply at any time before your current permission expires, and you should not let it lapse: once you have applied before it ends, you can stay in the UK until the decision. Applying early costs little, because GOV.UK adds up to 28 days of any time left on your current permission to the new grant when you extend with the same partner. Much earlier than that and you give up months you have already paid surcharge for, although an overlapping surcharge is partly refunded.</p>
<p>Paragraph E-LTRP.1.10 adds a test that did not exist at entry: you must show that you have lived together in the UK since the first visa was granted, or give a good reason for any time apart that fits a continuing plan to live together permanently. Tenancy agreements, Council Tax bills and bank statements at the same address over the whole period are the usual evidence. The accommodation must still be adequate, and the relationship must still be genuine and subsisting.</p>
<p>The English level moves up one step. Paragraph E-LTRP.4.1A says that someone who passed at A1 for the first visa must now show A2 in speaking and listening, unless they are a national of a majority English speaking country, have a degree taught in English, are 65 or over, or have a disability that prevents them from taking the test. An A2 or higher result already accepted in an earlier application can be reused if the certificate has not been withdrawn.</p>
<h2>Which income level applies to you</h2>
<p>The rule depends on when the route began. Paragraph E-LTRP.3.5 keeps the transitional figure for a person who made their first successful application as a fiancé, proposed civil partner or partner before ${K.date(L.cutoff)}, and who now extends with that same partner. Change partner and the full ${K.gbp(F.minimumIncome)} applies, with a new five-year count.</p>
${h.table(['Children to count', 'Transitional level (E-LTRP.3.7)', 'Current level (E-LTRP.3.1)'], kidsRows, `A child counts only if they are not British, settled or holding EU Settlement Scheme status; the transitional figure is capped at ${K.gbp(L.cap)} (E-LTRP.3.8).`, ['l', 'r', 'r'])}
<p>An example shows how much this matters. A couple first granted in 2023, with two children who are not British, earn ${K.gbp(legacyCase.income)} between them. Under the transitional rule they need ${K.gbp(legacyCase.required)}, a shortfall of ${K.gbp(legacyCase.incomeGap)} that ${K.gbp(legacyCase.savingsNeeded)} of savings would close. Under the current rule the same household would face a gap of ${K.gbp(newCase.incomeGap)} and need ${K.gbp(newCase.savingsNeeded)} in savings. Use the toggle in the calculator above to switch between the two.</p>
<p>The applicant's own salary from legal work in the UK now joins the sponsor's, and so does the income of a dependent child aged 18 or over who still lives with you. Self-employed income is taken from the last full financial year, so a business started after arrival may not yet show. Couples whose partner receives Carer's Allowance, Personal Independence Payment or another listed benefit take the adequate maintenance test instead of a fixed figure.</p>
<h2>Fee, timing and what happens if you fall short</h2>
<p>The extension fee is the in-country rate for family leave, ${K.gbp(x1.fees)}, plus the surcharge for ${F.extensionMonths} months, ${K.gbp(x1.ihsTotal)}. An adult with one child under 18 on the same form pays ${K.gbp(x2.total)} in total. You can add super priority for ${K.gbp(K.FEE.superPriorityInside())}. Without it, UKVI aims to decide within ${F.decisionWeeks.inside} weeks of your appointment when you meet the income and English rules (${h.src('times_inside', 'inside-UK processing times')}).</p>
<p>If you cannot meet the money or English rules, the application is not necessarily refused. When paragraph EX.1 applies, for example because you have a British child or there are insurmountable obstacles to family life abroad, the Home Office grants ${F.extensionMonths} months on the 10-year route instead, and GOV.UK currently quotes about ${F.decisionWeeks.insideNoRequirementsMonths} months to decide those cases. Moving to the 10-year route doubles the time to settlement, so it is worth checking the figures with the calculator before you submit. The ${h.a('spouse-visa-financial-requirement', 'financial requirement page')} lists the documents, and ${h.a('ilr-after-spouse-visa', 'ILR after a spouse visa')} covers the final step.</p>`,
  faqs: [
    { q: 'Can I travel abroad while my spouse visa extension is pending?', a: 'Plan not to. GOV.UK warns that an in-country application for indefinite leave or a visitor extension is withdrawn if you leave the UK, Ireland, the Channel Islands or the Isle of Man before the decision, and your old permission may have expired by then. The partner-route pages are less explicit, so take advice before any trip, even an urgent one.' },
    { q: 'Do we count a child born in the UK for the old income level?', a: `Only if the child is not British. A child born in the UK to a British or settled parent is usually British from birth and is not counted, so the requirement does not rise. A child who holds limited leave as your dependant, or who is applying with you, adds ${K.gbp(L.firstChild)} as the first child or ${K.gbp(L.otherChild)} after that, up to the ${K.gbp(L.cap)} cap.` },
    { q: 'Is the second spouse visa granted for 30 months or longer?', a: `For up to ${F.extensionMonths} months, plus up to 28 days carried over from your current permission. Together with the first grant of ${F.firstLeaveMonths} months this takes you past the ${F.settlementYears}-year point, so you apply for indefinite leave to remain from inside the second grant rather than extending a third time.` },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-financial-requirement', 'spouse-visa-uk-cost', 'ilr-after-spouse-visa', 'spouse-visa-processing-time'],
  sources: ['family_visa', 'family_income', 'appendix_fm', 'times_inside', 'ihs'],
});
