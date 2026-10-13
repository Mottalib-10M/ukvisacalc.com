import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const FE = K.FEE;
const v6 = FE.visitor6m(), v2 = FE.visitor2y(), v5 = FE.visitor5y(), v10 = FE.visitor10y();
const academic = K.feeLine(1, [/^Visiting academic/i]).current as number;
const medical = K.feeLine(1, [/^Private medical treatment visa/i]).current as number;
const transit = K.feeLine(1, [/^Transit visit visa - \(landside transit\)/i]).current as number;
const ext = FE.visitorExtension();
const eta = FE.eta();
// A family of four on a short visit: each person applies and pays.
const four = K.visaCost({ route: 'visitor', where: 'outside', months: 6, partner: true, children: 2 });
const T = K.P.processing;

export default definePage({
  id: 'standard-visitor-visa-uk',
  group: 'costs',
  order: 90,
  nav: 'Standard Visitor visa',
  card: 'Fees for 6 months and for 2, 5 or 10 years, the extension charge, and when an ETA is enough.',
  title: 'Standard Visitor Visa UK 2026: Fees, Long-Term Visas, ETA',
  description: `Standard Visitor visa fees for 2026: ${K.gbp(v6)} for six months, ${K.gbp(v2)} to ${K.gbp(v10)} for 2 to 10 years, ${K.gbp(ext)} to extend, no surcharge, and the ${K.gbp(eta)} ETA as an alternative.`,
  h1: 'Standard Visitor visa: what it costs and whether you need one',
  intro: `A Standard Visitor visa costs ${K.gbp(v6)} for a stay of up to six months. Visitors from Europe, the United States, Canada, Australia and similar countries usually need only an ETA at ${K.gbp(eta)}.`,
  resume: `The Standard Visitor visa covers tourism, seeing family and friends, business meetings, short courses of up to six months, medical treatment and a list of other permitted activities, for stays of up to six months at a time. Whether you need one depends on your nationality: some travellers must apply for the visa before travelling, others need an electronic travel authorisation (ETA) costing ${K.gbp(eta)}, and some need neither. The visa costs ${K.gbp(v6)} for up to six months. Frequent visitors can buy a long-term visa valid for 2, 5 or 10 years, at ${K.gbp(v2)}, ${K.gbp(v5)} and ${K.gbp(v10)}, still with a maximum of six months per visit. Visitors pay no immigration health surcharge. Staying longer inside the UK, where the rules allow it, costs ${K.gbp(ext)} per application, plus ${K.gbp(FE.superPriorityInside())} for super priority. You cannot work, claim public funds, marry or live in the UK through repeated visits on this visa.`,
  tool: { kind: 'cost', props: { initialRoute: 'visitor', initialWhere: 'outside', initialMonths: 6, title: 'Visitor visa cost for you and your family' } },
  body: (h) => `
<h2>Visa, ETA or nothing at all</h2>
<p>GOV.UK sorts visitors into three groups by nationality. Visa nationals apply online for a Standard Visitor visa and attend a visa application centre for fingerprints and a photo; the earliest you can apply is three months before you travel, and UKVI aims to decide within ${T.outside.visitor} weeks of that appointment. Most others, including Europeans, Americans, Canadians and Australians, apply for an ${h.src('eta', 'ETA')}: ${K.gbp(eta)}, usually decided within a day and at most three working days, valid for two years or until the passport expires, for as many trips as you like. British and Irish citizens, and anyone who already has a UK visa or permission to live here, need neither.</p>
<p>An ETA lets you visit for up to six months for the same purposes as a visitor visa, but it does not guarantee entry. GOV.UK suggests that someone with a criminal record or a past refusal of entry may want to apply for a visa even when an ETA would be enough, so the decision is made before travel. Each person needs their own ETA, babies included.</p>
${h.table(['Option', 'Fee', 'Length of each stay', 'Valid for'], [
    ['ETA (visa-exempt nationalities)', K.gbp(eta), 'up to 6 months', '2 years or passport expiry'],
    ['Standard Visitor visa', K.gbp(v6), 'up to 6 months', '6 months'],
    ['Long-term visitor visa, 2 years', K.gbp(v2), 'up to 6 months', '2 years'],
    ['Long-term visitor visa, 5 years', K.gbp(v5), 'up to 6 months', '5 years'],
    ['Long-term visitor visa, 10 years', K.gbp(v10), 'up to 6 months', '10 years'],
    ['Visitor for private medical treatment', K.gbp(medical), 'up to 11 months', '11 months'],
    ['Visiting academic', K.gbp(academic), 'up to 12 months', '12 months'],
    ['Visitor in transit (landside)', K.gbp(transit), 'transit only', 'single journey'],
  ], `Home Office fee table of ${K.date(K.FEE_DATE)}; ETA fee from the same table. No health surcharge on any of these.`, ['l', 'r', 'l', 'l'])}
<h2>When a long-term visa pays off</h2>
<p>A long-term visa costs more up front and saves applications later. At current fees, someone visiting every year pays ${K.gbp(2 * v6)} for two six-month visas against ${K.gbp(v2)} for a two-year visa, and ${K.gbp(10 * v6)} for ten single visas against ${K.gbp(v10)} for one ten-year visa, before counting appointment travel. The Home Office can issue a shorter visa than requested if it doubts you will meet the rules for the whole period, and the fee is not refunded in that case or on refusal. A long-term visa issued to someone under 18 ends six months after their 18th birthday. Travel history over the last ten years may be asked for, and the visa can be cancelled if your trips show you are in effect living here.</p>
<p>Family members each make their own application and pay their own fee; there is no discount for children. A couple travelling with two children on six-month visas pays ${K.gbp(four.total)}. The ${h.a('uk-visa-cost-calculator', 'cost calculator')} handles longer visas and other routes.</p>
<h2>Staying longer, and what a visitor cannot do</h2>
<p>Most visitors cannot extend beyond six months in total. Someone admitted for less can apply inside the UK to top up to six months, paying ${K.gbp(ext)} whatever their nationality, and the decision takes about ${T.inside.visitor} weeks unless you add super priority at ${K.gbp(FE.superPriorityInside())}. Longer stays are possible only for private medical treatment (six months at a time, with no limit on the number of extensions), visiting academics (up to 12 months in total) and doctors retaking the PLAB test or doing a clinical attachment (up to 18 months). You must not leave the UK, Ireland, the Channel Islands or the Isle of Man while an extension is pending.</p>
<p>The visa does not allow paid or unpaid work for a UK organisation, apart from permitted paid engagements and certain business activities, and it does not allow you to claim benefits. It also cannot be used to marry, register a civil partnership or give notice of either: that needs a Marriage Visitor visa, or, to marry and stay, the ${h.a('fiance-visa-uk', 'fiancé visa')}. A visitor cannot switch to a spouse or family visa from inside the UK, so a couple planning to live together should apply for the ${h.a('spouse-visa-uk', 'spouse visa')} from abroad.</p>`,
  faqs: [
    { q: 'Do I need an ETA or a visa to visit the UK?', a: `It depends on the passport you travel on. Nationals of countries such as the United States, Canada, Australia and EU states usually need an ETA, which costs ${K.gbp(eta)} and covers visits of up to six months over two years. Other nationalities must apply for a Standard Visitor visa at ${K.gbp(v6)} before travelling. GOV.UK has an online checker by nationality.` },
    { q: 'Is the visitor visa fee refunded if the application is refused?', a: 'No. The fee pays for the decision, so it is kept whether the visa is granted, refused or issued for a shorter period than you asked for. It is refunded only if you withdraw before processing starts. Because visitors pay no health surcharge, there is no surcharge refund to claim either. An ETA fee is never refunded once you have applied.' },
    { q: 'Can I visit my partner in the UK on a visitor visa while we plan to marry?', a: 'Yes, to visit, provided you will leave at the end and are not living here through frequent or successive visits. You cannot marry, enter a civil partnership or give notice of one as a Standard Visitor, and you cannot switch to a family visa from inside the UK. To marry in the UK and stay, apply for the fiancé visa from abroad.' },
  ],
  related: ['uk-visa-fees', 'uk-visa-cost-calculator', 'uk-visa-processing-times', 'fiance-visa-uk', 'spouse-visa-uk', 'home-office-fees'],
  sources: ['visitor_visa', 'eta', 'fees_table', 'times_outside', 'ihs_who'],
});
