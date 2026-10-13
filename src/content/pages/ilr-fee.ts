import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
const fee = K.FEE.ilr();
const liuk = K.FEE.lifeInUk();
const fam = K.visaCost({ route: 'ilr', where: 'inside', months: 0, partner: true, children: 2 });
const famSuper = K.visaCost({ route: 'ilr', where: 'inside', months: 0, partner: true, children: 2, priority: 'super' });
const couple = K.visaCost({ route: 'ilr', where: 'inside', months: 0, partner: true, children: 0 });
// Fee line since January 2024: keep only the tables where the amount changed.
const series = K.HISTORY_SERIES.find((s) => s.id === 'ilr')!;
const hist = K.feeHistory(series.line());
const steps = hist.filter((x, i) => i === 0 || x.amount !== hist[i - 1].amount);
const first = steps[0], last = steps[steps.length - 1];
// A partner not yet eligible keeps extending as a Skilled Worker dependant: fee + surcharge for 3 years.
const depFee = K.FEE.skilledWorker('inside', 3);
const depIhs = K.ihs(36, 'inside', false);

export default definePage({
  id: 'ilr-fee',
  group: 'settlement',
  order: 40,
  nav: 'ILR fee',
  card: `${K.gbp(fee)} per person, priority options, the Life in the UK test and how the fee has moved.`,
  title: 'ILR Fee 2026: Cost per Person, Priority and Family Total',
  description: `ILR fee from ${K.date(K.FEE_DATE)}: ${K.gbp(fee)} for each person, priority ${K.gbp(K.FEE.priorityInside())} or super priority ${K.gbp(K.FEE.superPriorityInside())}, Life in the UK test ${K.gbp(liuk)}, family totals and fee history since 2024.`,
  h1: 'ILR fee: what settlement costs per person and per family',
  intro: `Indefinite leave to remain costs ${K.gbp(fee)} for each person on the application, adults and children alike, with no health surcharge. A couple with two children pays ${K.gbp(fam.fees)} before any faster service.`,
  resume: `The Home Office fee table in force from ${K.date(K.FEE_DATE)} prices indefinite leave to remain at ${K.gbp(fee)} for the main applicant and the same for every dependant, whatever their age. There is no immigration health surcharge on a settlement application, and giving fingerprints and a photo at the UKVCAS appointment is free. Adults aged 18 to 64 also need a Life in the UK pass, at ${K.gbp(liuk)} per attempt. To shorten the usual ${S.decisionMonths}-month wait you can add ${K.gbp(K.FEE.priorityInside())} for a decision within 5 working days or ${K.gbp(K.FEE.superPriorityInside())} for super priority, charged once per application. The fee has risen twice since early 2024, from ${K.gbp(first.amount)} to ${K.gbp(last.amount)}, so check the current table before you budget. A family of four settling together pays ${K.gbp(fam.fees)}, or ${K.gbp(famSuper.total)} with super priority. The calculator above prices your own household.`,
  tool: { kind: 'cost', props: { initialRoute: 'ilr', initialWhere: 'inside', initialPartner: true, initialChildren: 2, title: 'Settlement fees for your household' } },
  body: (h) => `
<h2>One flat fee, charged per head</h2>
<p>Unlike a work or family visa, settlement has no length to price and no surcharge to add: the ${K.gbp(fee)} buys permanent permission, and each person on the form pays it. A newborn on the application costs the same as the main applicant. What changes the bill is the number of people and whether you pay to be decided faster.</p>
${h.table(['Household', 'Application fees', 'With super priority'], [
    ['One adult', K.gbp(fee), K.gbp(fee + K.FEE.superPriorityInside())],
    ['Couple', K.gbp(couple.fees), K.gbp(couple.fees + K.FEE.superPriorityInside())],
    ['Couple with two children', K.gbp(fam.fees), K.gbp(famSuper.total)],
  ], `Fees from the Home Office table of ${K.date(K.FEE_DATE)}. Super priority is charged once per application.`, ['l', 'r', 'r'])}
<p>Two smaller costs sit around the fee. Each adult who has to sit the Life in the UK test pays ${K.gbp(liuk)} per booking, again for each resit, and only gets a refund if they cancel at least three days before. The other is the cost of evidence: certified translations, and for some routes an English test. GOV.UK lists no fee for the biometrics itself.</p>
<h2>Paying for a faster decision</h2>
<p>The ${K.gbp(K.FEE.priorityInside())} priority service aims for a decision within 5 working days of your biometrics; ${K.gbp(K.FEE.superPriorityInside())} super priority aims for the end of the next working day after a weekday appointment, or 2 working days after a weekend one. Working days exclude bank holidays. Availability is limited, and the GOV.UK long residence page lists only the super priority option, so check what the form offers on the day. The extra fee is worth it mainly when you have a reason to travel soon, since you must stay in the UK, Ireland, the Channel Islands or the Isle of Man until the decision. The ${h.a('ilr-processing-time', 'processing time page')} has a date calculator.</p>
<h2>How the fee line has moved</h2>
<p>The settlement fee follows the Home Office tables, which have changed several times a year since 2024, though not every revision touched this line. Here are the tables where the amount actually changed:</p>
${h.table(['Fee table from', 'ILR fee per person', 'Change'], steps.map((x, i) => [K.date(x.date), K.gbp(x.amount), i === 0 ? '' : '+' + K.pct((x.amount - steps[i - 1].amount) / steps[i - 1].amount, 1)]), 'Indefinite leave to remain, main applicant and dependants, from the Home Office fee tables since 31 January 2024.', ['l', 'r', 'r'])}
<p>Over the period the fee rose by ${K.gbp(last.amount - first.amount)} per person, or ${K.gbp((last.amount - first.amount) * 4)} for a family of four. The history tool below follows the same line table by table.</p>
${h.tool({ kind: 'history', props: { initial: 'ilr' } })}
<h2>Settling together or one at a time</h2>
<p>Dependants do not have to settle with the main applicant. A partner who has not yet completed five years as your dependant, or a child who does not qualify, can apply later on their own form, and in the meantime keep extending as a dependant even after you settle. Waiting is not free, though. A Skilled Worker dependant extending inside the UK for three years pays the visa fee of ${K.gbp(depFee)} plus ${K.gbp(depIhs)} of health surcharge, ${K.gbp(depFee + depIhs)} in all, and then the settlement fee on top. When everyone qualifies, one application is almost always the cheaper path. Check the children first: a child can join your form when both parents are settling or already settled (or you have sole responsibility), and a child who has turned 18 only if they were under 18 when first granted as your dependant and still live as part of the family, with the Life in the UK test and English to pass. The ${h.a('uk-visa-cost-calculator', 'visa cost calculator')} prices the extension route, and the ${h.a('british-citizenship-cost', 'citizenship cost page')} the next step after settlement.</p>`,
  faqs: [
    { q: 'Do children pay the full ILR fee?', a: `Yes. The fee table has one line for indefinite leave to remain, "main applicant and dependants", so each child on the form pays ${K.gbp(fee)} like an adult. There is no reduced rate by age, unlike the health surcharge on temporary visas. Children under 18 do not need the Life in the UK test or an English test.` },
    { q: 'Is there a health surcharge on an ILR application?', a: `No. The immigration health surcharge applies to temporary permission only. Once settled you can use public services, healthcare included, without paying it. If a dependant is not ready to settle and extends their visa instead, that extension does carry the surcharge, which is one reason to settle the whole family together when everyone qualifies.` },
    { q: 'Is the ILR priority fee paid for each family member?', a: `No. The priority or super priority fee buys faster handling of the application, and the calculator charges it once for the household when everyone is on the same form. The ${K.gbp(fee)} application fee, by contrast, is paid for each person. If dependants apply on separate forms, each form that wants the faster service pays it again.` },
    { q: 'Is the Life in the UK test fee charged per attempt?', a: `Yes, ${K.gbp(liuk)} each time you book, with no limit on the number of attempts. You get the money back only if you cancel at least three days (72 hours) before the test. Anyone aged 18 to 64 applying for settlement needs a pass; those under 18 or 65 and over are exempt, and a pass is reused for citizenship.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-processing-time', 'uk-visa-fees', 'british-citizenship-cost', 'uk-visa-cost-calculator', 'home-office-fees'],
  sources: ['fees_table', 'ilr_sw', 'long_residence', 'life_in_uk'],
});
