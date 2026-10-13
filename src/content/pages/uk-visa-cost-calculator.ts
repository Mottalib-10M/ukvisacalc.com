import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

type R = Parameters<typeof K.visaCost>[0]['route'];
const fam = (route: R, where: 'outside' | 'inside', months: number) => K.visaCost({ route, where, months, partner: true, children: 2 });
const cases: Array<[string, R, 'outside' | 'inside', number]> = [
  ['Skilled Worker, 5 years, from abroad', 'skilled-worker', 'outside', 60],
  ['Skilled Worker, 3 years, extension in the UK', 'skilled-worker', 'inside', 36],
  ['Health and Care Worker, 5 years', 'health-and-care', 'outside', 60],
  ['Global Talent, 5 years', 'global-talent', 'outside', 60],
  ['Student with family, 16 months', 'student', 'outside', 16],
  ['Graduate, 2 years', 'graduate', 'inside', 24],
];
const sw5 = fam('skilled-worker', 'outside', 60), hc5 = fam('health-and-care', 'outside', 60);
const single = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: false, children: 0 });

export default definePage({
  id: 'uk-visa-cost-calculator',
  group: 'costs',
  order: 20,
  nav: 'Visa cost calculator',
  card: 'Fee and health surcharge for each person, priority options, total for the family.',
  title: 'Visa Cost Calculator UK 2026: Fees, Surcharge and Family',
  description: `UK visa cost calculator: application fee and immigration health surcharge for each family member, any route and length, Home Office table of ${K.date(K.FEE_DATE)}.`,
  h1: 'UK visa cost calculator for the whole family',
  intro: `A family of four on a five-year Skilled Worker visa pays ${K.gbp(sw5.total)} when applying, ${K.gbp(sw5.ihsTotal)} of it in health surcharge. Choose your route to see your own total.`,
  resume: `The cost of a UK visa is the application fee of every person plus the immigration health surcharge of every person for every year, and the surcharge is usually the larger part: on a five-year Skilled Worker visa from abroad, one adult pays ${K.gbp(K.FEE.skilledWorker('outside', 5))} in fee and ${K.gbp(K.ihs(60, 'outside', false))} in surcharge, ${K.gbp(single.total)} in all. Partners pay the same, children the same fee but the reduced surcharge of ${K.gbp(K.P.ihs.reduced)} a year, so a couple with two children reaches ${K.gbp(sw5.total)}. Some routes change the picture completely: on the Health and Care Worker visa the fee falls to ${K.gbp(K.FEE.healthCare('outside', 5))} and nobody pays the surcharge, so the same family pays ${K.gbp(hc5.total)}. The calculator applies the fee table of ${K.date(K.FEE_DATE)} and the surcharge rules of GOV.UK to your route, length of stay and family, line by line, with the optional priority services; nothing you enter leaves the page.`,
  tool: { kind: 'cost', props: { initialRoute: 'skilled-worker', initialMonths: 60, initialPartner: true, initialChildren: 2, title: 'UK visa cost calculator' } },
  body: (h) => `
<h2>What a family pays on the main routes</h2>
<p>The table runs the calculator for a couple with two children under 18, all applying together, without priority service. It shows how much the route matters: the same family pays several times more on one visa than on another, mostly because of the surcharge.</p>
${h.table(['Route and length', 'Fees', 'Surcharge', 'Total'], cases.map(([l, r, w, m]) => { const c = fam(r, w, m); return [l, K.gbp(c.fees), K.gbp(c.ihsTotal), K.gbp(c.total)]; }), `Couple and two children, Home Office fees of ${K.date(K.FEE_DATE)} and surcharge of ${K.gbp(K.P.ihs.standard)} (adults) and ${K.gbp(K.P.ihs.reduced)} (children, students) a year.`, ['l', 'r', 'r', 'r'])}
<h2>Three rules that change the total</h2>
<p><strong>The length you ask for.</strong> The surcharge is charged by the year, with half a year for a remainder of six months or less and a full year above that. A visa of 2 years and 7 months therefore costs three years of surcharge. For a Skilled Worker, the visa ends 14 days after the end of the certificate of sponsorship, so a certificate that is a few days over a whole number of years can add half a year per person; ask the sponsor for clean dates.</p>
<p><strong>Where you apply.</strong> Several routes cost more from inside the UK: a Skilled Worker extension of up to three years is ${K.gbp(K.FEE.skilledWorker('inside', 3))} against ${K.gbp(K.FEE.skilledWorker('outside', 3))} from abroad. A visa of six months or less applied for from abroad carries no surcharge at all, while the same length from inside the UK costs half a year.</p>
<p><strong>Who is a child.</strong> The reduced surcharge applies to applicants under 18 on the date of application. A 17-year-old who applies with the family pays ${K.gbp(K.P.ihs.reduced)} a year for the whole visa, even if they turn 18 during it; a child who joins later pays at the age they then have.</p>
${h.box('What the calculator leaves out', `<p>Money you must show but do not pay to the Home Office (the ${K.gbp(K.P.skilledWorker.maintenance)} of savings for a Skilled Worker, the living costs of a student), English tests, tuberculosis tests, translations, and the employer's own costs (licence, ${K.gbp(K.FEE.cosWorker())} certificate, immigration skills charge), which are on the ${h.a('sponsor-licence', 'sponsor licence calculator')}.</p>`)}
<h2>Paying, and getting money back</h2>
<p>The surcharge is paid first, online, which gives a reference number; the fee is paid at the end of the application form, by card. If the visa is refused, the surcharge comes back automatically within about six weeks, but the application fee does not. People who paid the surcharge on another visa while working in health or care can claim it back for periods of six months or more spent in that work. The ${h.a('immigration-health-surcharge', 'surcharge page')} details the refund rules, and the ${h.a('uk-visa-fees', 'fee table page')} lists every fee.</p>`,
  faqs: [
    { q: 'Why is the health surcharge more than the visa fee?', a: `Because it is charged for every year of the visa, per person, at ${K.gbp(K.P.ihs.standard)} for adults, while the fee is paid once. On a five-year visa the surcharge reaches ${K.gbp(K.ihs(60, 'outside', false))} per adult, about three times the fee. It funds NHS treatment during the stay, which is then free at the point of use like for residents.` },
    { q: 'Does my employer have to pay my visa costs?', a: 'No rule obliges a sponsor to pay the worker’s own fee or surcharge, although many employers reimburse them. What the employer must pay itself, and may never recover from you, is the certificate of sponsorship and the immigration skills charge. Any clawback clause in a contract should be checked against the sponsor guidance.' },
    { q: 'Do I pay again when I extend my visa?', a: 'Yes. An extension is a new application with its own fee, at the in-UK rate of the route, and a new surcharge for the extra period. If the new grant overlaps a period already paid, the overlap of six months or more is refunded in part, rounded down to the nearest six months.' },
  ],
  related: ['uk-visa-fees', 'immigration-health-surcharge', 'skilled-worker-visa-cost', 'spouse-visa-uk-cost', 'student-visa-uk-cost', 'health-and-care-worker-visa'],
  sources: ['fees_table', 'ihs', 'sw_costs', 'family_visa', 'appendix_sw'],
});
