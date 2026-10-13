import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const D = S.dependantFunds;
const fam3 = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: true, children: 2 });
const fam5 = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: true, children: 2 });
const couple3 = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: true, children: 0 });
const funds = (children: number) => D.partner + (children > 0 ? D.firstChild + (children - 1) * D.otherChild : 0);
const famFunds = S.maintenance + funds(2);

export default definePage({
  id: 'skilled-worker-dependants',
  group: 'work',
  order: 120,
  nav: 'Dependants',
  card: 'Who can join you, the limits for care and medium skilled jobs, the money to show and the family bill.',
  title: 'Skilled Worker Dependants 2026: Partner, Children and Costs',
  description: `Skilled Worker dependants: who can join you, limits for care workers and medium skilled jobs, ${K.gbp(D.partner)} and ${K.gbp(D.firstChild)} funds, and the fee and surcharge per family member.`,
  h1: 'Bringing your partner and children on a Skilled Worker visa',
  intro: `Your partner and children under 18 can usually join you, each paying the same fee and the health surcharge. A family of four applying for three years from abroad pays ${K.gbp(fam3.total)}.`,
  resume: `A Skilled Worker can usually bring a husband, wife, civil partner or unmarried partner of at least two years, and children under 18, as dependants. Each one makes a separate application, pays the same fee as you for the same length of stay, and pays the immigration health surcharge, ${K.gbp(K.P.ihs.standard)} a year for adults and ${K.gbp(K.P.ihs.reduced)} for children. Their permission normally ends on the same date as yours, and partners can work in almost any job. The family rights are not universal any more. Dependants are only allowed when your job is in Table 1, 2 or 3 of Appendix Skilled Occupations, which shuts out new care workers and people sponsored in medium skilled codes through a shortage list, apart from narrow exceptions. On top of your own ${K.gbp(S.maintenance)}, the family must show ${K.gbp(D.partner)} for a partner, ${K.gbp(D.firstChild)} for the first child and ${K.gbp(D.otherChild)} for each other child, unless your sponsor certifies maintenance or everyone has been in the UK for a year. The calculator above prices your family.`,
  tool: { kind: 'cost', props: { initialRoute: 'skilled-worker', initialMonths: 36, initialPartner: true, initialChildren: 2, title: 'Visa fees and surcharge for your family' } },
  body: (h) => `
<h2>Who counts as a dependant</h2>
<p>A partner is your spouse or civil partner in a relationship recognised in the UK, or an unmarried partner you have lived with for at least two years. Couples together for two years who cannot live together, for work, study or cultural reasons, can also qualify if they prove an ongoing commitment: regular contact, financial support, shared care of children, time spent together. A child must be under 18, or over 18 and already in the UK as your dependant, must live with you unless away in full-time education, and must not be married or in a civil partnership.</p>
<p>The first family member to apply can get a family linking code so that the applications travel together. From abroad, each person applies before travelling and, where Appendix Tuberculosis applies, provides a TB certificate. If your job is in one of the health, education or social care codes that need a criminal record certificate, your partner needs one too.</p>
<h2>Jobs whose family cannot join</h2>
<p>Rules SW 29.1A and SW 32A.2 tie dependants to the table of your occupation code. A job in Table 1, 2 or 3 brings full family rights. A medium skilled job from Table 1a, 2aa, 2a or 3a does not, and that includes care workers (codes ${K.listOf(S.careWorkerCodes)}) and anyone sponsored through the Temporary Shortage List or a medium skilled entry on the Immigration Salary List. The exceptions:</p>
<ul>
<li>you were sponsored in a medium skilled code under the rules before ${K.date(S.mediumSkilledCutoff)}, or as a care worker before 11 March 2024, and have held Skilled Worker permission in those codes ever since;</li>
<li>the child was born in the UK;</li>
<li>for a child already in the UK: you are the sole surviving parent or have sole responsibility, or the other parent is also a sponsored worker in such a code;</li>
<li>prison officers (code ${S.prisonOfficer.code}) applying from inside the UK.</li>
</ul>
<p>Check the code before accepting an offer if your family's plans depend on it. The ${h.a('soc-code-checker', 'SOC code checker')} shows the table of each code.</p>
<h2>Money to show and the family bill</h2>
<p>Funds have to be held for 28 days in a row, ending no more than 31 days before the application, and are cumulative: for you, a partner and two children that is ${K.gbp(S.maintenance)} + ${K.gbp(D.partner)} + ${K.gbp(D.firstChild)} + ${K.gbp(D.otherChild)} = ${K.gbp(famFunds)}. The money can be held by you, the dependant or, for a child, the other parent. You show nothing if your A-rated sponsor certifies that it will maintain the family to those amounts until the end of the first month, or if each person applying has been in the UK with permission for 12 months.</p>
${h.table(['Family applying from abroad', 'Fees', 'Health surcharge', 'Total upfront'], [
    ['Couple, 3 years', K.gbp(couple3.fees), K.gbp(couple3.ihsTotal), K.gbp(couple3.total)],
    ['Couple and two children, 3 years', K.gbp(fam3.fees), K.gbp(fam3.ihsTotal), K.gbp(fam3.total)],
    ['Couple and two children, 5 years', K.gbp(fam5.fees), K.gbp(fam5.ihsTotal), K.gbp(fam5.total)],
  ], `Priced by this site's engine with the Home Office fee table of ${K.date(K.FEE_DATE)} and the surcharge at ${K.gbp(K.P.ihs.standard)} (adults) and ${K.gbp(K.P.ihs.reduced)} (under 18).`, ['l', 'r', 'r', 'r'])}
<p>A family member who joins later still pays the fee band of your certificate, so a child arriving in year two of a five-year certificate pays the over three years fee and the surcharge for the remaining leave. Health and Care Worker visa families pay no surcharge at all, which changes the sums sharply; see the ${h.a('health-and-care-worker-visa', 'Health and Care Worker visa')}.</p>
<h2>Life in the UK as a dependant</h2>
<p>Partners can work, including self-employment and voluntary work, except as a professional sportsperson or sports coach, and can study. Dependants have no access to public funds. A child born in the UK during your stay is not automatically British and needs a dependant visa to travel in and out. Partners and children can settle with you after five years if they meet the requirements, and dependants in the UK on a visit visa, short-term study or seasonal work cannot switch into this category. The full rules are in ${h.src('appendix_sw', 'Appendix Skilled Worker')}, and the ${h.a('skilled-worker-visa-cost', 'Skilled Worker cost page')} explains the fee bands.</p>`,
  faqs: [
    { q: 'Can my partner work on a Skilled Worker dependant visa?', a: 'Yes. A dependent partner may take any job, work for themselves or volunteer, with one exception: they cannot work as a professional sportsperson, which includes working as a sports coach. They do not need their own sponsor, and there is no minimum salary for their work. They can also study, subject to the ATAS condition for some research subjects.' },
    { q: 'Can care workers bring their families to the UK now?', a: `Only in limited cases. Care worker and senior care worker codes are medium skilled, so new dependants are allowed only if you have been continuously employed as a care worker on a Skilled Worker visa since before 11 March 2024, or for a child born in the UK. Children already in the UK have two further routes: sole responsibility, or another parent also sponsored as a care worker.` },
    { q: 'How much money must my family show for a Skilled Worker visa?', a: `On top of your own ${K.gbp(S.maintenance)}, ${K.gbp(D.partner)} for a partner, ${K.gbp(D.firstChild)} for the first child and ${K.gbp(D.otherChild)} for each additional child, held for 28 consecutive days. A couple with one child needs ${K.gbp(S.maintenance + funds(1))} in all. No evidence is needed if your sponsor certifies maintenance or the family has been in the UK for 12 months.` },
    { q: 'Do my children pay the full immigration health surcharge?', a: `No. Applicants under 18 on the date of application pay the reduced rate of ${K.gbp(K.P.ihs.reduced)} a year instead of ${K.gbp(K.P.ihs.standard)}. They still pay the full visa fee, the same as the main applicant for the same length of stay. On a three-year visa from abroad each child therefore costs ${K.gbp(fam3.lines[2].total)} upfront.` },
  ],
  related: ['skilled-worker-visa-cost', 'skilled-worker-visa', 'immigration-health-surcharge', 'care-worker-visa', 'temporary-shortage-list', 'uk-visa-cost-calculator'],
  sources: ['sw_visa', 'appendix_sw', 'ihs', 'fees_table'],
});
