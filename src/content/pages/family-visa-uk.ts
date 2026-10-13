import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family;
const out = K.FEE.familyOutside(), inn = K.FEE.leaveToRemainOther();
const adrOther = K.feeLine(1, [/^Route to Settlement - other dependant relative/i]).current as number;
const adrRefugee = K.feeLine(1, [/^Route to Settlement - refugee dependant relative/i]).current as number;
// A parent joining a British partner with two children under 18, from abroad.
const fam = K.visaCost({ route: 'partner', where: 'outside', months: F.firstLeaveMonths, partner: false, children: 2 });
const adult = fam.lines[0], child = fam.lines[1];
const T = K.P.processing;

export default definePage({
  id: 'family-visa-uk',
  group: 'family',
  order: 60,
  nav: 'Family visa',
  card: 'Partner, parent, child and adult dependent relative visas compared: who qualifies and what each costs.',
  title: 'Family Visa UK 2026: Partner, Parent, Child and Relative',
  description: `Family visa routes compared for 2026: partner, parent, child and adult dependent relative, fees of ${K.gbp(out)} to ${K.gbp(adrOther)}, child surcharge and decision times.`,
  h1: 'Family visas: the four routes and what each one costs',
  intro: `Most family visas cost ${K.gbp(out)} per person from abroad or ${K.gbp(inn)} inside the UK, plus the health surcharge, which is lower for children. Adult relatives who need care pay ${K.gbp(adrOther)}.`,
  resume: `"Family visa" is the umbrella name GOV.UK uses for permission to live in the UK with a relative who is British, Irish, settled or has protection status. There are four main routes under Appendix FM and its companion appendices: as a partner (spouse, civil partner, fiancé or unmarried partner), as the parent of a child living here, as a child joining a parent, and as an adult who needs long-term care from a relative. Partners, parents and children pay ${K.gbp(out)} each from abroad and ${K.gbp(inn)} each inside the UK, plus the immigration health surcharge, which is ${K.gbp(K.P.ihs.standard)} a year for adults and ${K.gbp(K.P.ihs.reduced)} for children under 18. An adult dependent relative pays ${K.gbp(adrOther)}, or ${K.gbp(adrRefugee)} when joining a relative with protection status. A family of one adult and two children joining a British partner pays ${K.gbp(fam.total)} for the first ${F.firstLeaveMonths} months.`,
  tool: { kind: 'cost', props: { initialRoute: 'partner', initialWhere: 'outside', initialMonths: F.firstLeaveMonths, initialChildren: 2, title: 'Family visa cost for a parent and children' } },
  body: (h) => `
<h2>Which route fits your family</h2>
${h.table(['Route', 'You are joining', 'Main tests', 'First grant', 'Fee abroad / in UK'], [
    ['Partner', 'your spouse, civil partner, fiancé or partner of two years', `${K.gbp(F.minimumIncome)} income or savings, English A1`, `${F.firstLeaveMonths} months (fiancé ${F.fianceMonths})`, `${K.gbp(out)} / ${K.gbp(inn)}`],
    ['Parent', 'your child under 18 who lives in the UK', 'parental responsibility, active role, English A1, adequate maintenance', `${F.firstLeaveMonths} months`, `${K.gbp(out)} / ${K.gbp(inn)}`],
    ['Child', 'a parent who is settled or applying on a family route', 'under 18, not living an independent life', 'in line with the parent', `${K.gbp(out)} / ${K.gbp(inn)}`],
    ['Adult dependent relative', 'a son, daughter, parent, grandchild, brother or sister settled here', 'need for long-term care not available or affordable at home', 'unlimited if the relative is British or settled', `${K.gbp(adrOther)} / ${K.gbp(inn)}`],
  ], `Fees from the Home Office table of ${K.date(K.FEE_DATE)}; the relative route costs ${K.gbp(adrRefugee)} from abroad when the relative holds protection status.`, ['l', 'l', 'l', 'l', 'r'])}
<p>The routes are not interchangeable. If you are eligible to apply as a partner, you must apply as a partner even if you also have a child here; the parent route is for a parent who is not in a relationship with the child's other parent, for example after a separation, and who has sole or shared parental responsibility. The parent must show they take an active role in the child's upbringing, with letters from the school, the GP or a court rather than photographs and messages.</p>
<p>English is required only of partners and parents: an A1 speaking and listening test or an English-taught degree for the first grant, A2 for the second, then B1 at settlement. Children and adult dependent relatives are exempt, as are applicants aged over 65 and nationals of majority English speaking countries such as Jamaica, Canada or Australia.</p>
<p>A family visa is not available to join someone who is in the UK on a temporary work or study visa. Their family come as dependants on that route instead, with its own fees and conditions; the ${h.a('skilled-worker-dependants', 'Skilled Worker dependants page')} covers the most common case.</p>
<h2>What children and relatives pay</h2>
<p>A child added to a parent's application pays the same application fee as an adult. The saving is on the surcharge, because applicants under 18 on the date of application pay the reduced rate. For the ${F.firstLeaveMonths}-month first grant that means ${K.gbp(child.ihs)} for each child against ${K.gbp(adult.ihs)} for the adult.</p>
${h.table(['Person', 'Fee', 'Surcharge', 'Total'], fam.lines.map((l) => [l.who, K.gbp(l.fee), K.gbp(l.ihs), K.gbp(l.total)]).concat([['Family', K.gbp(fam.fees), K.gbp(fam.ihsTotal), `<strong>${K.gbp(fam.total)}</strong>`]]), 'One adult and two children joining a British partner from abroad, priced by the cost engine.', ['l', 'r', 'r', 'r'])}
<p>The adult dependent relative route is priced differently because it leads straight to settlement: a relative joining someone British or settled receives permission with no time limit, so there is no extension to pay for later and, as indefinite leave, no surcharge. The fee abroad is ${K.gbp(adrOther)}. When the relative in the UK has refugee status or humanitarian protection, the fee falls to ${K.gbp(adrRefugee)} and permission runs as long as theirs. The test is strict: the applicant must need help with everyday personal and household tasks because of illness, disability or age, and show that the care is not available or not affordable in their own country. Super priority is not offered on this route.</p>
<h2>How long decisions take on each route</h2>
<p>Applications from outside the UK on all four routes share the same published standard of ${T.outside.partner} weeks from the biometrics appointment. Inside the UK the picture splits. Partners who meet the income and English rules, children and adult dependent relatives are decided in about ${T.inside.partner} weeks. Parents, and partners relying on the exceptions in paragraph EX.1, currently wait about ${F.decisionWeeks.insideNoRequirementsMonths} months, and UKVI says there is no service standard for them (${h.src('times_inside', 'processing times inside the UK')}).</p>
<p>A fee waiver is open on the partner, parent and child routes for people who cannot afford housing or essential living costs, or whose child's welfare would suffer from paying. Partners and parents can usually settle after ${F.settlementYears} years on the route, and children with them. The ${h.a('spouse-visa-uk', 'spouse visa guide')} goes deeper on the partner route, and the ${h.a('uk-visa-cost-calculator', 'cost calculator')} handles other lengths and in-country applications.</p>`,
  faqs: [
    { q: 'Can I bring my parents to live with me in the UK?', a: `Only through the adult dependent relative route, and only if your parent needs long-term personal care because of illness, disability or age that is not available or affordable where they live. You must be British, settled or have protection status, and be able to support and house them without public funds. The fee is ${K.gbp(adrOther)}, and the visa cannot be used simply to retire near family.` },
    { q: 'Does a child born in the UK need a family visa?', a: 'Not if a parent was British or settled when the child was born, because the child is then usually British automatically. A child born in the UK to parents with limited leave gets the same permission as the parent, either added to the parent\'s next application or by applying separately, and must live with that parent and not be married or living independently.' },
    { q: 'Which family visa should I use if I am married and also have a British child?', a: 'The partner route. GOV.UK says that if you are eligible to apply as a partner, you must do so rather than apply as a parent. Your British child matters in another way: if you cannot meet the income or English rules, paragraph EX.1 can still lead to a grant, although that grant is on the 10-year route to settlement.' },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-uk-cost', 'fiance-visa-uk', 'immigration-health-surcharge', 'skilled-worker-dependants', 'uk-visa-cost-calculator'],
  sources: ['family_visa', 'appendix_fm', 'fees_table', 'ihs', 'times_outside', 'times_inside'],
});
