import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.P.citizenship;
const nat = K.FEE.naturalisation(), cer = K.FEE.ceremony(), reg = K.FEE.registrationChild();
const ilr = K.FEE.ilr(), liuk = K.FEE.lifeInUk();
const adult = nat + cer;
const parentKids = K.visaCost({ route: 'citizenship', where: 'inside', months: 0, partner: false, children: 2 });
// Fee lines in every Home Office table since 31 January 2024, keeping only the changes.
const changes = (l: ReturnType<typeof K.feeLine>) => { const x = K.feeHistory(l); return x.filter((p, i) => i === 0 || p.amount !== x[i - 1].amount); };
const natSteps = changes(K.HISTORY_SERIES.find((s) => s.id === 'citizenship')!.line());
const regSteps = changes(K.feeLine(10, [/^Nationality registration as a British citizen - child/i]));
const cerSteps = changes(K.feeLine(10, [/^The arrangement of a citizenship ceremony/i]));
// From settlement to citizenship for two adults and two children, everyone settling together.
const e2e = { ilr: 4 * ilr, liuk: 2 * liuk, nat: 2 * adult, reg: 2 * reg };
const e2eTotal = e2e.ilr + e2e.liuk + e2e.nat + e2e.reg;

export default definePage({
  id: 'british-citizenship-cost',
  group: 'settlement',
  order: 100,
  nav: 'Citizenship cost',
  card: `${K.gbp(adult)} for an adult, ${K.gbp(reg)} per child, and the full bill from settlement to passport.`,
  title: 'Citizenship Cost UK 2026: Adult, Child and Full Family Bill',
  description: `British citizenship cost in 2026: ${K.gbp(nat)} naturalisation plus ${K.gbp(cer)} ceremony per adult, ${K.gbp(reg)} to register a child, fee history and the total from ILR onwards.`,
  h1: 'What British citizenship costs, for one adult and for a family',
  intro: `An adult pays ${K.gbp(adult)} to naturalise: ${K.gbp(nat)} for the application and ${K.gbp(cer)} for the ceremony. Each child registered costs ${K.gbp(reg)}. Price your household with the calculator below.`,
  resume: `Naturalisation as a British citizen costs ${K.gbp(nat)} under the Home Office fee table of ${K.date(K.FEE_DATE)}, and every adult also pays ${K.gbp(cer)} for the citizenship ceremony at the same time, so the amount to budget is ${K.gbp(adult)} per adult. There is no health surcharge and no charge for biometrics. Children do not naturalise: they are registered, for ${K.gbp(reg)} each, a fee that fell in April 2026 and can be waived for a child whose family cannot afford it. A child who turns 18 during the process also pays the ${K.gbp(cer)} ceremony fee. The Life in the UK test (${K.gbp(liuk)}) is only an extra cost if you did not pass it for settlement. Seen from the start of settlement, an adult who settles and then naturalises pays ${K.gbp(ilr + liuk + adult)} in Home Office fees, and a couple with two children settling and becoming British together pays ${K.gbp(e2eTotal)}.`,
  tool: { kind: 'cost', props: { initialRoute: 'citizenship', initialPartner: false, initialChildren: 2, title: 'Citizenship fees for you and your children' } },
  body: (h) => `
<h2>The adult bill</h2>
<p>The naturalisation fee and the ceremony fee are paid together with the application, ${K.gbp(adult)} in all. The ceremony is not optional: the fee covers the administration of the citizenship oath and pledge, and the process is only complete after it. Nothing else on the Home Office side is compulsory. Is it worth paying at all, once you hold ILR? Settlement costs nothing to keep, but it lapses after ${K.P.settlement.loseIlrAfterYears} years in a row abroad; you would then need a Returning Resident visa to come back. Removing that risk is one of the reasons people pay to naturalise. Biometrics at the UKVCAS appointment are free, and if you passed the Life in the UK test for your ILR, that pass is reused.</p>
<p>The naturalisation line has moved with the fee tables:</p>
${h.table(['Fee table from', 'Naturalisation', 'Ceremony', 'Child registration'], [...new Set([...natSteps, ...regSteps, ...cerSteps].map((p) => p.date))].sort().map((d) => {
    const at = (xs: Array<{ date: string; amount: number }>) => [...xs].reverse().find((p) => p.date <= d)!.amount;
    return [K.date(d), K.gbp(at(natSteps)), K.gbp(at(cerSteps)), K.gbp(at(regSteps))];
  }), 'Home Office fee tables since 31 January 2024, rows where at least one of the three lines changed.', ['l', 'r', 'r', 'r'])}
<p>Since January 2024 the adult application has risen from ${K.gbp(natSteps[0].amount)} to ${K.gbp(nat)} and the ceremony from ${K.gbp(cerSteps[0].amount)} to ${K.gbp(cer)}, while child registration went the other way, down from ${K.gbp(regSteps[0].amount)} to ${K.gbp(reg)} in the table of ${K.date(regSteps[regSteps.length - 1].date)}. The ${h.a('home-office-fees', 'Home Office fees page')} follows the other lines.</p>
${h.tool({ kind: 'history', props: { initial: 'citizenship' } })}
<h2>Children: registration rather than naturalisation</h2>
<p>A child born abroad, or born in the UK before you obtained indefinite leave to remain, becomes British by registration, applied for separately from your own application at ${K.gbp(reg)} each. A parent with two such children pays ${K.gbp(parentKids.fees)} for the three applications. Two cases cost less:</p>
<ul>
<li>a child born in the UK after you got ILR may already be British, in which case there is nothing to register and you apply straight for a passport;</li>
<li>a child under 18 whose family cannot afford the fee may qualify for a fee waiver.</li>
</ul>
<p>And one costs more: a child who turns 18 while the application is under way pays the ${K.gbp(cer)} ceremony fee, as an adult would.</p>
<p>Once registered or confirmed as British, the child needs a passport to travel as a citizen: GOV.UK points under-16s to a child passport and those over 16 to an adult one. Each child's application is separate from yours and from each other's, with its own fee and its own decision, and the registration guidance on GOV.UK sets the conditions a child has to meet.</p>
<h2>From settlement to passport: the whole bill</h2>
<p>Most families meet these fees after paying for settlement, and the two often fall within about a year of each other. Here is the Home Office side of the journey for two adults and two children, all settling on one form and then becoming British, with both adults sitting the Life in the UK test once:</p>
${h.table(['Step', 'Who pays', 'Amount'], [
    ['Indefinite leave to remain', `4 people at ${K.gbp(ilr)}`, K.gbp(e2e.ilr)],
    ['Life in the UK test', `2 adults at ${K.gbp(liuk)}`, K.gbp(e2e.liuk)],
    ['Naturalisation and ceremony', `2 adults at ${K.gbp(adult)}`, K.gbp(e2e.nat)],
    ['Registration', `2 children at ${K.gbp(reg)}`, K.gbp(e2e.reg)],
    ['<strong>Total</strong>', '', `<strong>${K.gbp(e2eTotal)}</strong>`],
  ], `Fees from the table of ${K.date(K.FEE_DATE)}. Excludes priority services, English tests, translations and passport fees.`, ['l', 'l', 'r'])}
<p>For a single adult the same path costs ${K.gbp(ilr + liuk + adult)}. The ${C.ilrHeldMonths}-month wait between the two steps is time for the fee table to change, so check the current amounts when you budget the second half. Passport fees come on top and are not part of this table. The ${h.a('ilr-fee', 'ILR fee page')} covers the first step and the ${h.a('british-citizenship-application', 'citizenship application page')} the dates.</p>`,
  faqs: [
    { q: `Is the ${K.gbp(cer)} ceremony fee paid separately?`, a: `It is paid with the application, as part of the ${K.gbp(adult)} that GOV.UK quotes: ${K.gbp(nat)} for naturalisation and ${K.gbp(cer)} for the ceremony. Every adult applicant pays it, because the ceremony is a required step. Children registered under 18 do not, unless they turn 18 during the application, in which case they need a ceremony too.` },
    { q: 'How much does it cost to register a child as a British citizen?', a: `${K.gbp(reg)} per child in the table of ${K.date(K.FEE_DATE)}, down from ${K.gbp(regSteps[0].amount)} before April 2026. Each child is a separate application. A fee waiver may be available for a child under 18 if the family cannot afford it, and a child born in the UK after a parent obtained ILR may not need to register at all.` },
    { q: 'What is the total cost from ILR to British citizenship?', a: `For one adult, ${K.gbp(ilr)} for ILR, ${K.gbp(liuk)} for the Life in the UK test and ${K.gbp(adult)} for naturalisation and ceremony: ${K.gbp(ilr + liuk + adult)} in Home Office fees. A couple with two children settling together and then becoming British pays ${K.gbp(e2eTotal)}. Passport fees, English tests and any priority service come on top.` },
    { q: 'Can I pay extra for a faster citizenship decision?', a: `GOV.UK says you may be able to pay for a faster decision, but the citizenship page does not give the price, so check the options shown when you apply. Without it, a decision usually comes within ${C.decisionMonths} months. Whatever you pay, check the residence dates and good character requirement first: the calculator finds the first date your absences allow.` },
  ],
  related: ['british-citizenship-application', 'british-citizenship-requirements', 'ilr-fee', 'home-office-fees', 'uk-visa-fees'],
  sources: ['citizenship', 'fees_table', 'life_in_uk', 'ilr_sw'],
});
