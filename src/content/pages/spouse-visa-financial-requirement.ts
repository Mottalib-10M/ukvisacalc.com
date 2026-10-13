import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family;
const base = { other: 0, savings: 0, legacy: false, children: 0 } as const;
// Three couples, computed by the engine (Appendix FM E-ECP.3.1 / E-ILRP.1.3(1A)).
const noSalary = K.spouseTest({ ...base, employment: 0, stage: 'entry' });
const mixed = K.spouseTest({ ...base, employment: 21000, other: 3000, stage: 'entry' });
const mixedIlr = K.spouseTest({ ...base, employment: 21000, other: 3000, stage: 'settlement' });

export default definePage({
  id: 'spouse-visa-financial-requirement',
  group: 'family',
  order: 20,
  nav: 'Financial requirement',
  card: 'Which income and savings count, the payslip rules of Appendix FM-SE and worked savings sums.',
  title: 'Spouse Visa Financial Requirement: Income, Savings, Proof',
  description: `Spouse visa financial requirement: the income sources Appendix FM accepts, six months of payslips, the ${K.gbp(F.savingsBase)} savings formula and exempting benefits.`,
  h1: 'The spouse visa financial requirement, source by source',
  intro: `You need ${K.gbp(F.minimumIncome)} of gross annual income from accepted sources, or savings above ${K.gbp(F.savingsBase)} worth ${F.savingsMultiplier} times any shortfall. Enter your figures to see which way you pass.`,
  resume: `The financial requirement for a partner visa is set by paragraph E-ECP.3.1 of Appendix FM (E-LTRP.3.1 inside the UK) and proved with the documents listed in Appendix FM-SE. You must show a specified gross annual income of ${K.gbp(F.minimumIncome)}, or combine income with cash savings: the first ${K.gbp(F.savingsBase)} of savings is ignored, and each pound of missing income needs ${F.savingsMultiplier} pounds above that. A couple relying on savings alone therefore needs ${K.gbp(noSalary.savingsOnlyNeeded)}. Countable sources are the sponsor's employment or self-employment, pensions, maternity or bereavement payments, other income such as rent and dividends, and savings held for six months; the applicant's own UK earnings join in once they are in the UK with permission to work. Loans, Universal Credit, Child Benefit and tax credits do not count. If the sponsor receives a listed disability or carer benefit, the fixed figure is replaced by an adequate maintenance test.`,
  tool: { kind: 'spouse', props: { initialEmployment: 21000, initialStage: 'entry', title: 'Financial requirement calculator: income plus savings' } },
  body: (h) => `
<h2>Which money counts, and whose</h2>
<p>Paragraph E-ECP.3.2 is a closed list. For an application from abroad, the sources taken into account are: the partner's income from specified employment or self-employment (which can include work overseas when the partner is returning to the UK with you); specified pension income of either of you; maternity allowance, bereavement benefit or HM Forces payments; other specified income of either of you; and specified savings of either of you. The applicant's own salary from a job abroad is not on the list, which surprises many couples where the overseas partner is the higher earner.</p>
<p>Inside the UK the list in E-LTRP.3.2 widens. The applicant's employment counts if they are working legally, and an adult dependent child in the household can contribute income and savings. Paragraph 21 of Appendix FM-SE closes the door on the rest: loans and credit, income-related benefits, Child Benefit, Working Tax Credit, Child Tax Credit, Universal Credit and promises of help from relatives are all excluded. A cash gift is accepted only as savings, once it has sat in your account for six months.</p>
<h2>Salaried work: the six-month rule in Appendix FM-SE</h2>
<p>How a salary is counted depends on how long the person has been with their current employer.</p>
<ul>
<li><strong>Six months or more</strong> (paragraph 13(a)): the annual salary you rely on counts, provided every payslip in the six months before the application was at that level or higher. Send six months of payslips, the matching bank statements showing the pay going in, and a letter from the employer confirming the salary, the start date, the period paid at that rate and the type of contract.</li>
<li><strong>Less than six months</strong> (13(b) and 15): the current annual salary must reach the level, and the person's actual earnings over the previous 12 months must reach it too. Under paragraph 15(b)(iv), this second limb cannot be topped up with savings.</li>
<li><strong>Self-employed or company director</strong> (13(e)): income comes from the last full financial year, or the average of the last two, shown on tax returns and accounts. Savings cannot be added to self-employed income (13(f)).</li>
<li><strong>Returning to the UK</strong> (13(c) and 13(d)): a partner working abroad who will start a UK job within three months of returning must meet the level on both the overseas salary and the UK offer.</li>
</ul>
<p>The most recent document in any series must be dated no earlier than 28 days before you apply (paragraph 1(l)), so a payslip run that ends two months before submission fails. Unpaid maternity, paternity or sick leave in the last year is ignored when counting the six months.</p>
<h2>Savings: the formula and three worked cases</h2>
<p>Savings must be cash, in an account that can be accessed immediately, in the name of the applicant, the partner or both, and held at or above the amount relied on for the full six months before the application (paragraph 11). Two exceptions shorten the six months: money moved into cash from shares, bonds or investment funds you already owned, and the net proceeds of selling a property you owned at the start of the period (paragraph 11A). The source of the money has to be declared.</p>
${h.table(['Couple', 'Income counted', 'Shortfall', 'Multiplier', 'Savings needed'], [
    ['No income, savings only (first visa)', K.gbp(noSalary.income), K.gbp(noSalary.incomeGap), String(noSalary.multiplier), K.gbp(noSalary.savingsNeeded)],
    ['Salary plus rental income (first visa)', K.gbp(mixed.income), K.gbp(mixed.incomeGap), String(mixed.multiplier), K.gbp(mixed.savingsNeeded)],
    ['Same couple at settlement', K.gbp(mixedIlr.income), K.gbp(mixedIlr.incomeGap), String(mixedIlr.multiplier), K.gbp(mixedIlr.savingsNeeded)],
  ], `Savings needed = ${K.gbp(F.savingsBase)} + multiplier × shortfall; computed by the calculator above.`, ['l', 'r', 'r', 'r', 'r'])}
<p>In the second case a sponsor earns ${K.gbp(mixed.income - 3000)} from a job held for over a year and receives ${K.gbp(3000)} a year in rent. The total of ${K.gbp(mixed.income)} leaves a shortfall of ${K.gbp(mixed.incomeGap)}, so the couple needs ${K.gbp(mixed.savingsNeeded)} in cash. Five years later, at the indefinite leave stage, paragraph E-ILRP.1.3(1A) removes the words "2.5 times", and the same couple would need only ${K.gbp(mixedIlr.savingsNeeded)}. Income and savings in a foreign currency are converted to pounds at the spot rate for the date of application, as Appendix Finance sets out.</p>
<h2>When there is no fixed figure</h2>
<p>If the sponsor receives Disability Living Allowance, Severe Disablement Allowance, Industrial Injuries Disablement Benefit, Attendance Allowance, Carer's Allowance, Personal Independence Payment, Armed Forces Independence Payment, a War Pensions Scheme payment, Police Injury Pension, or one of the Scottish disability and carer payments, paragraph E-ECP.3.3 applies. You show instead that the sponsor can maintain and accommodate the family adequately without further public funds; the caseworker compares your income with your housing costs.</p>
<p>Where the rules are not met but refusal would breach the right to family life, for example because of a British child, the decision maker must also weigh other credible sources under paragraph 21A, such as a guarantee of support from a third party. A grant on that basis leads to settlement after 10 years rather than five. The ${h.a('spouse-visa-uk', 'spouse visa overview')} covers the other requirements, and ${h.a('spouse-visa-extension', 'the extension page')} explains the lower figure for couples first granted before ${K.date(F.legacy.cutoff)}.</p>`,
  faqs: [
    { q: 'Can a relative in the UK pay or guarantee our income?', a: `Not under the standard rules. Paragraph 1(b) of Appendix FM-SE rejects promises of third-party support. A gift of cash is acceptable only as savings in your or your partner's name, held for six months with its source declared. A third-party guarantee is weighed only when refusal would breach human rights under paragraph 21A, and leave granted that way is on the ten-year route.` },
    { q: 'Do I use gross or net pay for the spouse visa?', a: `Gross pay, before tax and National Insurance. The ${K.gbp(F.minimumIncome)} level is a gross annual figure, and the employer's letter must state the gross salary. Where the gross amount cannot be properly evidenced, paragraph 1(k) says the net amount is counted instead, which makes passing harder. Cash wages on which the correct tax was paid can count if the bank statements match.` },
    { q: 'Can savings held abroad be used?', a: 'Yes. Cash savings in an overseas bank count if the institution is regulated in its country and the account allows immediate access. The balance must have been held for six months and is converted into pounds at the date of application. Statements must be on official stationery or stamped by the bank, with a certified translation if they are not in English or Welsh.' },
    { q: 'What if my partner changed jobs four months ago?', a: 'Then the less-than-six-months method applies. The new salary at the date of application must reach the level, and the gross earnings from all employment over the previous 12 months must reach it as well. You cannot fill a gap in that 12-month figure with savings, so a recent job change sometimes means waiting until six months have passed.' },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-extension', 'spouse-visa-uk-cost', 'ilr-after-spouse-visa', 'family-visa-uk'],
  sources: ['family_income', 'appendix_fm', 'appendix_fm_se', 'family_visa'],
});
