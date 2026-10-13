import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const o = K.occ('2134');
const at = (hours: number, situation: 'standard' | 'new-entrant' | 'phd-stem' = 'standard') =>
  K.checkSkilledWorker({ code: '2134', salary: 0, hours, situation, nation: 'England' }).required;
const NEAR = ['2133', '2135', '2136', '2139', '2141'].map((c) => K.occ(c));
const cost = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: false, children: 0 });

export default definePage({
  id: 'software-developer-visa-uk',
  group: 'work',
  order: 200,
  nav: 'Software developer visa',
  card: `Code 2134: going rate ${K.gbp(o.goingRate!)}, eligible without a shortage list, with PhD and new entrant rates.`,
  title: 'Software Developer Visa 2026: SOC 2134 and Its Going Rate',
  description: `Software developer Skilled Worker visa: SOC 2134 is a Table 1 code with a going rate of ${K.gbp(o.goingRate!)} for 37.5 hours, ${K.gbp(o.r70!)} at 70 % and lower with a relevant PhD.`,
  h1: 'Software developer visa: what code 2134 has to pay',
  intro: `Programmers and software developers (SOC 2134) are eligible for a Skilled Worker visa. The bar is the going rate of ${K.gbp(o.goingRate!)} for a 37.5-hour week, well above the ${K.gbp(S.general)} general floor.`,
  resume: `Code 2134, "programmers and software development professionals", sits in Table 1 of Appendix Skilled Occupations, the higher skilled list, so a licensed sponsor can recruit into it from abroad without any shortage list. Because its going rate of ${K.gbp(o.goingRate!)} is above the general threshold of ${K.gbp(S.general)}, the going rate is the number that decides: a full-time developer must be paid at least that, and the figure moves with the hours on the certificate of sponsorship. Three groups may be paid less. A new entrant needs ${K.gbp(o.r70!)}, 70 % of the rate. A holder of a STEM doctorate relevant to the job needs ${K.gbp(o.r80!)}, and a holder of a relevant doctorate in another subject ${K.gbp(o.r90!)}. The code is not on the Immigration Salary List or the Temporary Shortage List and has no postdoctoral discount. Someone first sponsored before 4 April 2024 and continuously since is assessed on the older rate of ${K.gbp(o.goingRateTransitional!)}. The checker above starts on code 2134.`,
  tool: { kind: 'sw', props: { initialCode: '2134', initialSalary: 52000, title: 'Code 2134: salary check for a developer job' } },
  body: (h) => `
<h2>Verdict for code 2134</h2>
${h.table(['Test', 'Result for 2134'], [
    ['Table', `${o.table} (higher skilled)`],
    ['Going rate, 37.5 hours', K.gbp(o.goingRate!)],
    ['New entrant (70 %)', K.gbp(o.r70!)],
    ['Relevant STEM PhD (80 %)', K.gbp(o.r80!)],
    ['Relevant PhD, other subject (90 %)', K.gbp(o.r90!)],
    ['Immigration Salary List', o.isl ? `yes, until ${o.isl.until}` : 'no'],
    ['Temporary Shortage List', o.tsl ? 'yes' : 'no'],
    ['First sponsored before 4 April 2024', K.gbp(o.goingRateTransitional!)],
  ], 'SOC 2020 code 2134, Appendix Skilled Occupations and Appendix Skilled Worker as in force on 8 October 2026.', ['l', 'r'])}
<p>The titles the classification places here are ${K.listOf(o.examples.map((e) => e.toLowerCase()))}. A job title alone settles nothing: the duties written on the certificate have to match what SOC 2020 describes for the code. The employer chooses the code, but a caseworker can refuse if a cheaper code was picked for a job that is really development work, under SW 6.2 of the rules.</p>
<h2>Contract hours change the threshold</h2>
<p>Developer contracts are often written for 35 or 40 hours rather than 37.5, and the going rate is pro-rated to whatever the certificate says. At 35 hours the threshold is ${K.gbp(at(35))}; at 45 hours it rises to ${K.gbp(at(45))}. Only the first ${S.maxCountedHours} hours a week are counted, so a contract for more hours cannot inflate the salary on paper. The ${K.gbp(S.general)} floor is not pro-rated, but with this code it never decides. A new entrant on a 35-hour contract needs ${K.gbp(at(35, 'new-entrant'))}, and a STEM doctorate holder on 40 hours ${K.gbp(at(40, 'phd-stem'))}.</p>
<p>Only guaranteed basic gross pay is tested. Equity, bonuses, overtime, allowances and other benefits in kind are left out, so a package that looks generous on paper can still fall short if the base salary is below the line. Each monthly payslip has to reach the pro-rated rate on its own.</p>
<p>Developers who came on a Skilled Worker visa before 4 April 2024 and have held it without a break are measured against the older table for applications made before ${K.date(S.transitional.until)}. For them code 2134 needs ${K.gbp(o.goingRateTransitional!)} at 37.5 hours, with a floor of ${K.gbp(S.transitional.general)}, which is why a long-standing developer can change employer at a salary that a newcomer could not be offered. Choose that answer under "Already a Skilled Worker?" in the checker to see the difference for your hours.</p>
<h2>Neighbouring codes a sponsor might use</h2>
<p>Many technology jobs straddle two codes. If yours is closer to architecture, security, testing or infrastructure work, a different code may describe it better, with its own rate:</p>
${h.table(['Code', 'Occupation', 'Going rate', 'New entrant'], NEAR.map((x) => [x.code, x.title, K.gbp(x.goingRate!), K.gbp(x.r70!)]), 'Table 1 codes near 2134, going rates for 37.5 hours, Appendix Skilled Occupations.', ['l', 'l', 'r', 'r'])}
<p>A lower rate is not a reason to choose a code. The duties on the certificate must match the code's description, and a DevOps engineer coded as a tester to fit a lower rate is exactly what SW 6.2 targets. The ${h.a('soc-code-checker', 'SOC code checker')} searches every title.</p>
<h2>Fees on top of the salary test</h2>
<p>The developer pays ${K.gbp(K.FEE.skilledWorker('outside', 3))} for a visa of up to three years from abroad and the health surcharge of ${K.gbp(K.P.ihs.standard)} a year, ${K.gbp(cost.total)} for three years in all. The employer pays ${K.gbp(K.FEE.cosWorker())} for the certificate of sponsorship and the immigration skills charge, which code 2134 does not escape. Settlement is possible after ${K.P.settlement.skilledWorkerYears} years if the salary still meets the rate then in force. Moving to another company is a new application with a new certificate, not a notification: from inside the country it costs ${K.gbp(K.FEE.skilledWorker('inside', 3))} for up to three years, and the new salary is tested against the rates in force on the day you apply. To see whether a given company already holds a licence, search the ${h.a('register-of-licensed-sponsors', 'register of licensed sponsors')}.</p>`,
  faqs: [
    { q: 'Is a software developer on the Immigration Salary List?', a: `No. Code 2134 is not on the Immigration Salary List or the Temporary Shortage List, so there is no lower list rate and no reduced visa fee. It does not need one: as a Table 1 code it is eligible for new applicants in its own right, at the going rate of ${K.gbp(o.goingRate!)}.` },
    { q: 'Which SOC code is a web developer?', a: `The duties decide. Code 2141, web design professionals, covers UI and UX designers, application designers and web designers, at a going rate of ${K.gbp(K.occ('2141').goingRate!)}; code 2134 covers programmers and software developers. A web role that is mostly programming sits more naturally in 2134, one that is mostly design in 2141.` },
    { q: 'Does a part-time developer job qualify for a Skilled Worker visa?', a: `It can, but the going rate shrinks with the hours while the ${K.gbp(S.general)} floor does not. At 30 hours code 2134 needs ${K.gbp(at(30))}, still above that floor, so a part-time developer job can qualify if the pay matches the hours. Below ${(S.general / o.goingRate! * S.goingRateHours).toFixed(1)} hours a week the floor takes over.` },
    { q: 'Can a games programmer use code 2134?', a: 'Yes. Computer games designers and computer programmers are both example titles under 2134, so a games studio sponsoring a programmer will normally use this code. Artists and animators sit elsewhere, for example in code 2142 for multimedia designers, which has its own lower rate.' },
  ],
  related: ['skilled-worker-visa', 'soc-code-checker', 'skilled-worker-going-rates', 'data-analyst-visa-uk', 'register-of-licensed-sponsors'],
  sources: ['appendix_aso', 'appendix_sw', 'sw_visa', 'sponsor_guide', 'fees_table'],
});
