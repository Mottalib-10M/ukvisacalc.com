import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const F = K.FEE;
const two = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 24, partner: false, children: 0 });
const fiveIn = K.visaCost({ route: 'skilled-worker', where: 'inside', months: 60, partner: false, children: 0 });
const islThree = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: false, children: 0, isl: true });
const iscLarge3 = K.skillsCharge(36, false), iscSmall3 = K.skillsCharge(36, true);
const I = K.P.sponsor.isc;
const threeOut = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: false, children: 0 });
const twoIn = K.visaCost({ route: 'skilled-worker', where: 'inside', months: 24, partner: false, children: 0 });
const fiveOut = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: false, children: 0 });

export default definePage({
  id: 'skilled-worker-visa-cost',
  group: 'work',
  order: 60,
  nav: 'Visa cost',
  card: 'Application fee, health surcharge and savings for you, and the charges your employer pays.',
  title: 'Skilled Worker Visa Cost 2026: Fee, IHS and Employer Charges',
  description: `Skilled Worker visa cost in 2026: ${K.gbp(F.skilledWorker('outside', 3))} to ${K.gbp(F.skilledWorker('inside', 5))} fee, ${K.gbp(K.P.ihs.standard)} a year surcharge per person, savings, and the certificate fee and skills charge only employers pay.`,
  h1: 'Skilled Worker visa cost: what you pay and what the employer pays',
  intro: `From abroad the fee is ${K.gbp(F.skilledWorker('outside', 3))} for up to three years, plus ${K.gbp(K.P.ihs.standard)} of health surcharge per year. A two-year visa costs ${K.gbp(two.total)} upfront.`,
  resume: `A Skilled Worker visa has two costs for the applicant and a separate set for the employer. You pay the application fee, which depends on where you apply and how long the certificate of sponsorship runs: ${K.gbp(F.skilledWorker('outside', 3))} from outside the UK for up to three years and ${K.gbp(F.skilledWorker('outside', 5))} for longer, ${K.gbp(F.skilledWorker('inside', 3))} and ${K.gbp(F.skilledWorker('inside', 5))} from inside the UK. Jobs on the Immigration Salary List pay ${K.gbp(F.skilledWorker('outside', 3, true))} or ${K.gbp(F.skilledWorker('outside', 5, true))} wherever you apply. You also pay the immigration health surcharge upfront, ${K.gbp(K.P.ihs.standard)} for each year of leave, and may need to show ${K.gbp(S.maintenance)} of savings, which you keep. The employer pays its own charges and may not recover them from you: ${K.gbp(F.cosWorker())} for the certificate of sponsorship and the immigration skills charge, ${K.gbp(I.large.first12)} for the first year at a medium or large company or ${K.gbp(I.small.first12)} at a small one or charity. The calculator above adds up fee and surcharge for your length of stay.`,
  tool: { kind: 'cost', props: { initialRoute: 'skilled-worker', initialMonths: 36, title: 'Skilled Worker fee and surcharge for your stay' } },
  body: (h) => `
<h2>The application fee</h2>
<p>The fee is fixed by the Home Office fee table in force from ${K.date(K.FEE_DATE)}. Two things move it: whether you apply from abroad or from inside the UK (an extension, a switch or a change of employer), and whether the certificate of sponsorship covers more than three years.</p>
${h.table(['Length of the certificate', 'Outside the UK', 'Inside the UK', 'Immigration Salary List job'], [
    ['Up to 3 years', K.gbp(F.skilledWorker('outside', 3)), K.gbp(F.skilledWorker('inside', 3)), K.gbp(F.skilledWorker('outside', 3, true))],
    ['More than 3 years', K.gbp(F.skilledWorker('outside', 5)), K.gbp(F.skilledWorker('inside', 5)), K.gbp(F.skilledWorker('outside', 5, true))],
  ], `Fee per person, Home Office fee table of ${K.date(K.FEE_DATE)}. The Immigration Salary List fee is the same inside and outside the UK.`, ['l', 'r', 'r', 'r'])}
<p>The fee is per person. A partner or child pays the fee for the same length as you, even if they apply later, so a family joining a five-year visa in its second year still pays the over three years rate. Health and care jobs on the ${h.a('health-and-care-worker-visa', 'Health and Care Worker visa')} have a lower fee and no surcharge.</p>
<h2>The health surcharge is usually the bigger bill</h2>
<p>The immigration health surcharge is ${K.gbp(K.P.ihs.standard)} per year of leave for adults and ${K.gbp(K.P.ihs.reduced)} for applicants under 18, paid in full when you apply. Part years of six months or less count as half a year, longer ones as a full year. Three examples, priced by this site's engine:</p>
<ul>
<li>Two years from abroad, standard job: ${K.gbp(two.fees)} fee plus ${K.gbp(two.ihsTotal)} surcharge, ${K.gbp(two.total)} in total. GOV.UK uses the same case and reaches the same figure.</li>
<li>Five years from inside the UK, switching from another visa: ${K.gbp(fiveIn.fees)} plus ${K.gbp(fiveIn.ihsTotal)}, ${K.gbp(fiveIn.total)}.</li>
<li>Three years from abroad in an Immigration Salary List job: ${K.gbp(islThree.fees)} plus ${K.gbp(islThree.ihsTotal)}, ${K.gbp(islThree.total)}.</li>
</ul>
<p>The length of the first certificate matters over time. Three years from abroad followed by a two-year extension inside the UK costs ${K.gbp(threeOut.total)} and then ${K.gbp(twoIn.total)}, ${K.gbp(threeOut.total + twoIn.total)} across five years. A single five-year certificate from abroad costs ${K.gbp(fiveOut.total)} at once. ${fiveOut.total < threeOut.total + twoIn.total ? `The single certificate is ${K.gbp(threeOut.total + twoIn.total - fiveOut.total)} cheaper overall and` : `The two-step path is cheaper overall, while the single certificate`} spares you an extension application, but it asks for more money on day one and depends on the employer offering a five-year certificate.</p>
<p>Optional extras sit on top. From abroad, where it is offered, priority costs ${K.gbp(F.priorityOutside())} and super priority ${K.gbp(F.superPriorityOutside())}; inside the UK, ${K.gbp(F.priorityInside())} and ${K.gbp(F.superPriorityInside())}. You may also pay for an English test, a TB test or translations. Savings of ${K.gbp(S.maintenance)} for 28 days are a proof of funds, not a charge, and your employer can certify maintenance instead.</p>
<h2>Charges that belong to the employer</h2>
<p>The sponsor guidance is blunt: the employer must pay the certificate of sponsorship fee and the immigration skills charge itself, and its licence may be revoked if it asks the worker to pay them or any costs linked to its application. These are not part of your visa fee and should never be deducted from your pay.</p>
${h.table(['Employer charge', 'Small sponsor or charity', 'Medium or large sponsor'], [
    ['Sponsor licence application', K.gbp(F.licenceSmall()), K.gbp(F.licenceLarge())],
    ['Certificate of sponsorship, per worker', K.gbp(F.cosWorker()), K.gbp(F.cosWorker())],
    ['Immigration skills charge, first 12 months', K.gbp(I.small.first12), K.gbp(I.large.first12)],
    ['Immigration skills charge, each further 6 months', K.gbp(I.small.perHalf), K.gbp(I.large.perHalf)],
    ['Skills charge for a three-year certificate', K.gbp(iscSmall3), K.gbp(iscLarge3)],
  ], `GOV.UK sponsor guidance and fee table of ${K.date(K.FEE_DATE)}. Small: turnover up to ${K.gbp(K.P.sponsor.small.turnover)}, assets up to ${K.gbp(K.P.sponsor.small.assets)}, ${K.P.sponsor.small.employees} employees or fewer.`, ['l', 'r', 'r'])}
<p>The skills charge is not due for the worker's partner or children, nor for research codes such as ${K.listOf(K.P.sponsor.iscExemptCodes.slice(0, 4))}. It is refunded if the visa is refused or withdrawn. Your employer may choose to reimburse your own fee and surcharge, which is a matter for your contract, but reimbursement is not salary: payments towards immigration costs do not count towards the salary threshold. The ${h.a('immigration-skills-charge', 'skills charge calculator')} and the ${h.a('skilled-worker-dependants', 'family cost page')} go further, and the official figures are in ${h.src('sw_costs', 'GOV.UK: how much it costs')}.</p>`,
  faqs: [
    { q: 'Is the Skilled Worker fee cheaper if I apply from abroad?', a: `Yes, for standard jobs. Up to three years it is ${K.gbp(F.skilledWorker('outside', 3))} from outside the UK against ${K.gbp(F.skilledWorker('inside', 3))} from inside, and over three years ${K.gbp(F.skilledWorker('outside', 5))} against ${K.gbp(F.skilledWorker('inside', 5))}. For an Immigration Salary List job the fee is the same either way. The health surcharge is the same per year wherever you apply.` },
    { q: 'Can my employer make me pay the immigration skills charge?', a: 'No. GOV.UK states that the sponsor must pay the immigration skills charge and the certificate of sponsorship fee itself, and that its licence may be revoked if it asks the worker to pay them or any costs linked to its sponsorship. A clawback clause for these charges in a contract is a matter to raise with the employer or an adviser.' },
    { q: 'Do I get the health surcharge back if I leave early?', a: 'The surcharge is paid for the whole period of leave when you apply. GOV.UK refunds it in full if the visa is refused or you withdraw before a decision, and in part if you are granted less time than you asked for or pay twice for the same period. Leaving the UK before the visa ends, or not travelling once it is granted, gives no refund.' },
    { q: 'Does the lower Immigration Salary List fee cover my family too?', a: `Yes. When your job is on the Immigration Salary List, you and each partner or child applying as your dependants pay the reduced fee: ${K.gbp(F.skilledWorker('outside', 3, true))} for up to three years or ${K.gbp(F.skilledWorker('outside', 5, true))} for longer, from inside or outside the UK. The health surcharge is not reduced, and dependants are only allowed when the job sits in Table 1, 2 or 3.` },
  ],
  related: ['uk-visa-cost-calculator', 'skilled-worker-dependants', 'immigration-health-surcharge', 'immigration-skills-charge', 'skilled-worker-visa', 'uk-visa-fees'],
  sources: ['sw_costs', 'fees_table', 'ihs', 'sponsor_guide'],
});
