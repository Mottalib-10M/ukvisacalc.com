import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SP = K.P.sponsor;
const small1 = K.sponsorCost(true, 1, 36, false, false), large5 = K.sponsorCost(false, 5, 60, false, false);

export default definePage({
  id: 'sponsor-licence',
  group: 'employers',
  order: 20,
  nav: 'Sponsor licence cost',
  card: 'What an employer pays to sponsor workers: licence, certificates and immigration skills charge.',
  title: 'Sponsor Licence 2026: Cost, Eligibility and Employer Charges',
  description: `Sponsor licence cost for UK employers in 2026: ${K.gbp(K.FEE.licenceSmall())} or ${K.gbp(K.FEE.licenceLarge())}, ${K.gbp(K.FEE.cosWorker())} per certificate, immigration skills charge, licence ratings and the usual 8-week decision.`,
  h1: 'Sponsor licence: what an employer pays to hire from abroad',
  intro: `A small company pays ${K.gbp(small1.total)} to license itself and sponsor one worker for three years; a large one sponsoring five workers for five years, ${K.gbp(large5.total)}.`,
  resume: `A UK employer needs a sponsor licence from the Home Office before it can hire someone on a Skilled Worker or other sponsored work visa. The licence costs ${K.gbp(K.FEE.licenceSmall())} for small companies and charities and ${K.gbp(K.FEE.licenceLarge())} for medium and large organisations, and most applications are decided in under ${SP.decisionWeeks} weeks, or within ${SP.priorityDays} working days for an extra ${K.gbp(K.FEE.licencePriority())} where places allow. Each worker then costs the employer ${K.gbp(K.FEE.cosWorker())} for the certificate of sponsorship and the immigration skills charge: ${K.gbp(SP.isc.small.first12)} for the first year and ${K.gbp(SP.isc.small.perHalf)} for each further six months for a small sponsor, ${K.gbp(SP.isc.large.first12)} and ${K.gbp(SP.isc.large.perHalf)} for a large one. These charges belong to the employer and may not be passed on to the worker. The calculator above adds them for your size, number of hires and length of each certificate; the worker's own visa fee and health surcharge are separate.`,
  tool: { kind: 'licence', props: { title: 'Employer cost of sponsoring workers' } },
  body: (h) => `
<h2>Small or large: which fee applies</h2>
<p>An organisation is usually a small sponsor if at least two of these are true: annual turnover of ${K.gbp(SP.small.turnover)} or less, total assets of ${K.gbp(SP.small.assets)} or less, ${K.int(SP.small.employees)} employees or fewer. Registered charities in any part of the UK, excepted and exempt charities and ecclesiastical corporations count as charitable sponsors and pay the small rate. Everyone else pays the large rate, for the licence and for the skills charge. A sponsor that has told UKVI it is now small or charitable pays the small rate from then on, and is refunded the difference if the large charge was taken after that notice.</p>
${h.table(['Employer cost', 'Small or charitable', 'Medium or large'], [
    ['Worker licence', K.gbp(K.FEE.licenceSmall()), K.gbp(K.FEE.licenceLarge())],
    ['Certificate of sponsorship, each', K.gbp(K.FEE.cosWorker()), K.gbp(K.FEE.cosWorker())],
    ['Skills charge, first 12 months', K.gbp(SP.isc.small.first12), K.gbp(SP.isc.large.first12)],
    ['Skills charge, each further 6 months', K.gbp(SP.isc.small.perHalf), K.gbp(SP.isc.large.perHalf)],
    ['One worker for 3 years, licence included', K.gbp(K.sponsorCost(true, 1, 36, false, false).total), K.gbp(K.sponsorCost(false, 1, 36, false, false).total)],
    ['One worker for 5 years, licence included', K.gbp(K.sponsorCost(true, 1, 60, false, false).total), K.gbp(K.sponsorCost(false, 1, 60, false, false).total)],
  ], `Home Office fee table of ${K.date(K.FEE_DATE)} and immigration skills charge on GOV.UK.`, ['l', 'r', 'r'])}
<h2>Getting and keeping the licence</h2>
<p>The application is made online with supporting documents, and UKVI may visit the business before deciding. An employer cannot get a licence with unspent convictions for immigration offences or crimes such as fraud or money laundering, nor within 12 months of a revocation (24 months after more than one), and will not usually be granted one within 6 months of a refusal. It must appoint key personnel, an authorising officer among them, and have systems to monitor its sponsored workers. The job itself must respect the minimum wage and working time rules and the salary and skill rules of the route.</p>
<p>A Worker licence covers Skilled Worker, Senior or Specialist Worker, Minister of Religion and International Sportsperson; a Temporary Worker licence covers routes such as Creative Worker, Charity Worker, Government Authorised Exchange, Seasonal Worker and Scale-up. The ${h.a('register-of-licensed-sponsors', 'register of licensed sponsors')} lists who holds which, and the ${h.a('immigration-skills-charge', 'skills charge page')} explains exemptions and refunds.</p>
<h2>What a sponsor commits to</h2>
<p>Sponsorship is a continuing duty, not a one-off purchase. The sponsor must keep records, report changes such as a worker who stops coming to work or a change of salary, and make sure the job stays the one on the certificate. If it falls short, UKVI can downgrade the licence to a B rating, which blocks new certificates until an action plan costing ${K.gbp(K.FEE.actionPlan())} is completed, or revoke it. Significant changes to the business must be reported within 20 working days, and a change request handled through the priority service costs ${K.gbp(K.FEE.smsPriority())}.</p>`,
  faqs: [
    { q: 'Can the worker pay for the sponsor licence or skills charge?', a: 'No. The employer must pay the immigration skills charge and the certificate of sponsorship itself; asking the worker to pay them, or to repay them later, can lead to the licence being revoked. The worker’s own application fee and health surcharge are different: the worker can pay them, and the employer may choose to reimburse them.' },
    { q: 'How long does a sponsor licence last?', a: 'GOV.UK says a licence usually stays valid for as long as the sponsor keeps meeting the eligibility requirements; it can be downgraded, suspended or revoked if it does not. Licences for Scale-up Workers and UK Expansion Workers are the exception: they last 4 years and cannot be applied for again.' },
    { q: 'Which jobs can a licensed employer sponsor?', a: `Only jobs whose occupation code is eligible for the route and whose pay meets the threshold: for a Skilled Worker, ${K.gbp(K.P.skilledWorker.general)} or the going rate, with exceptions. Since 22 July 2025 most jobs below degree level can be sponsored only when they are on the Immigration Salary List or the Temporary Shortage List.` },
  ],
  related: ['register-of-licensed-sponsors', 'immigration-skills-charge', 'skilled-worker-visa', 'skilled-worker-visa-salary-threshold', 'visa-sponsors-by-city'],
  sources: ['sponsor_guide', 'fees_table', 'sponsor_register', 'appendix_sw'],
});
