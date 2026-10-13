import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const cur = K.FEES.lines.filter((l) => l.current != null);
const sec = (n: number) => cur.filter((l) => l.section.startsWith(`${n}.`));
const clean = (s: string) => s.replace(/\s*\[Footnotes?[^\]]*\]/gi, '').replace(/ - main applicant and dependants\s*$/i, '').replace(/where a certificate of sponsorship has been issued or approval to sponsor under Spons?o?r a Worker has been given for /i, '').trim();
const rows = (n: number, filter: (l: string) => boolean = () => true) => sec(n).filter((l) => filter(l.label)).map((l) => [clean(l.label), K.gbp(l.current!)]);
const prev = K.FEES.versions[K.FEES.versions.length - 2];
const ups = cur.map((l) => [l.amounts['2025-11-11'], l.amounts['2026-04-08']]).filter(([a, b]) => a && b && b !== a).map(([a, b]) => b! / a! - 1).sort((x, y) => x - y);
const medianUp = ups[Math.floor(ups.length / 2)];
const changed = cur.filter((l) => l.amounts[prev.date] != null && l.amounts[prev.date] !== l.current).length;

export default definePage({
  id: 'uk-visa-fees',
  group: 'costs',
  order: 10,
  nav: 'UK visa fees',
  card: 'Every Home Office application fee in the table of 8 October 2026, with a family cost calculator.',
  title: 'Visa Fees UK 2026: Every Home Office Fee from 8 October',
  description: `UK visa fees in the Home Office table of ${K.date(K.FEE_DATE)}: work, family, study, visit, ILR and citizenship, plus the health surcharge and a family calculator.`,
  h1: 'UK visa fees: the Home Office table of 8 October 2026',
  intro: `${K.int(cur.length)} fees are in force. A Skilled Worker visa from abroad costs ${K.gbp(K.FEE.skilledWorker('outside', 3))}, a partner visa ${K.gbp(K.FEE.familyOutside())}, settlement ${K.gbp(K.FEE.ilr())}; most add the health surcharge.`,
  resume: `The Home Office sets every UK immigration and nationality fee in a single table, republished each time a fee changes; the version in force was published for ${K.date(K.FEE_DATE)} and lists ${K.int(cur.length)} charges, from the ${K.gbp(K.FEE.eta())} electronic travel authorisation to the ${K.gbp(K.FEE.ilr())} settlement fee. Compared with the previous table of ${K.date(prev.date)}, ${changed === 0 ? 'no fee moved: the October table restates the April uplift' : `${K.int(changed)} lines changed`}. The application fee is only part of the bill. Visas of more than six months add the immigration health surcharge of ${K.gbp(K.P.ihs.standard)} a year per person (${K.gbp(K.P.ihs.reduced)} for students and children), partners and children each pay their own fee, and a faster decision costs ${K.gbp(K.FEE.priorityInside())} or ${K.gbp(K.FEE.superPriorityInside())} more. The calculator above adds all of it for your route, length of stay and family; the tables below reproduce the main sections of the official spreadsheet line by line.`,
  tool: { kind: 'cost', props: { initialRoute: 'skilled-worker', initialMonths: 36, title: 'Visa fees and surcharge for your family' } },
  body: (h) => `
<h2>How to read the fee table</h2>
<p>The spreadsheet is organised by where the application is made, not by visa: section 1 holds visas applied for outside the UK, section 2 work visas from abroad, section 7 the same work routes from inside the UK, and so on down to nationality and sponsorship. A route that appears twice can therefore have two prices. The label also tells you who pays: "main applicant and dependants" means the same amount for each person, while a "dependants only" line prices family members alone: the partner and children of a Global Talent holder, or the families of routes closed to new applicants such as Tier 1. Skilled Worker lines are split by the length on the certificate of sponsorship, three years or less, or more than three years, and a child who joins later pays the fee for the parent's full length, not the time left.</p>
<p>The table moves more often than most people think: ${K.FEES.versions.length} versions since ${K.date(K.FEES.versions[0].date)}, some changing a single line. The amounts below are read from the current file, and the calculator uses the same lines, so the figure you see here is the figure you will be asked to pay on the day this table applies.</p>
<h2>Work visas</h2>
<p>Most work routes charge one fee per person, the main applicant and each dependant alike, and the fee depends on where you apply. Applying from inside the UK (an extension or a switch) is dearer than an entry clearance from abroad for Skilled Worker, Innovator Founder and the overseas business routes; it is the same for Global Talent, Scale-up and the High Potential Individual route.</p>
${h.table(['Fee (applications made outside the UK)', 'Amount'], rows(2, (l) => !/Tier 1|Start-up|contact point/i.test(l)), `Section 2 of the Home Office fee table of ${K.date(K.FEE_DATE)}.`, ['l', 'r'])}
${h.table(['Fee (applications made in the UK)', 'Amount'], rows(7, (l) => !/Tier 1|Start-up|contact point/i.test(l)), 'Section 7 of the same table.', ['l', 'r'])}
<h2>Family, settlement and citizenship</h2>
<p>The family route has two fees only: ${K.gbp(K.FEE.familyOutside())} for a partner, child or parent joining from abroad (the table calls it "route to settlement") and ${K.gbp(K.FEE.leaveToRemainOther())} for an extension or a switch inside the UK. Settlement is ${K.gbp(K.FEE.ilr())} for each person on any route. Naturalisation is ${K.gbp(K.FEE.naturalisation())} plus the ${K.gbp(K.FEE.ceremony())} ceremony, which the table says is added to the application fee; registering a child as British costs ${K.gbp(K.FEE.registrationChild())}.</p>
${h.table(['Fee', 'Amount'], [...rows(9, (l) => /Indefinite leave to remain|Leave to remain - Other|Life in the UK|Visitor extension|Administrative Review/i.test(l)), ...rows(10, (l) => /^Naturalisation \(British|citizenship ceremony|registration as a British citizen - (adult|child)/i.test(l))], 'Sections 9 and 10 of the fee table.', ['l', 'r'])}
<h2>Study, visits and optional services</h2>
<p>A Student visa costs ${K.gbp(K.FEE.student('outside'))} from abroad or in the UK, and the Graduate visa, applied for in the UK only, ${K.gbp(K.FEE.graduate())}. Visitors pay ${K.gbp(K.FEE.visitor6m())} for six months; nationals who do not need a visa pay ${K.gbp(K.FEE.eta())} for an electronic travel authorisation instead. Priority and super priority services are optional and sold per application where the visa centre offers them.</p>
${h.table(['Fee', 'Amount'], [...rows(1, (l) => /^Visit visa|electronic travel/i.test(l)), ...rows(3), ...rows(4, (l) => /Priority/i.test(l)), ...rows(5, (l) => /Priority/i.test(l))], 'Sections 1, 3, 4 and 5 of the fee table.', ['l', 'r'])}
<p>The sponsorship fees paid by employers (licence, certificates of sponsorship) are on the ${h.a('sponsor-licence', 'sponsor licence page')}, and the way each fee moved since ${K.date(K.FEES.versions[0].date)} on the ${h.a('home-office-fees', 'fee history page')}. The ${h.src('fees_table', 'official spreadsheet')} remains the reference: if a fee here ever differs from it, the Home Office figure applies.</p>`,
  faqs: [
    { q: 'When did UK visa fees last go up?', a: `The last general uplift took effect on 8 April 2026, when the fees that moved rose by ${K.pct(medianUp, 1)} at the median; the table of ${K.date(K.FEE_DATE)} kept those amounts. The fee history page on this site lists, for each main fee, every change since ${K.date(K.FEES.versions[0].date)}.` },
    { q: 'Do children pay the same visa fee as adults?', a: `On almost every route, yes: each child pays the full application fee for the same length of stay as the parent. The difference is the health surcharge, ${K.gbp(K.P.ihs.reduced)} a year for an applicant under 18 instead of ${K.gbp(K.P.ihs.standard)}. Registering a child as a British citizen has its own fee of ${K.gbp(K.FEE.registrationChild())}.` },
    { q: 'Is the visa fee refunded if the application is refused?', a: 'No. The application fee pays for the decision, so it is kept whether the answer is yes or no; it is refunded only if processing has not started when you withdraw. The immigration health surcharge, by contrast, is refunded in full when a visa is refused.' },
    { q: 'Can I pay the visa fee in another currency?', a: 'The Home Office sets its fees in pounds. When you pay online from abroad, your card is charged the pound amount and your bank converts it; visa application centres may also show a local equivalent. Budget a margin for the exchange rate and bank charges, and warn your bank before a large card payment.' },
  ],
  related: ['uk-visa-cost-calculator', 'home-office-fees', 'immigration-health-surcharge', 'skilled-worker-visa-cost', 'spouse-visa-uk-cost', 'british-citizenship-cost'],
  sources: ['fees_table', 'ihs', 'family_visa', 'sw_costs', 'citizenship'],
});
