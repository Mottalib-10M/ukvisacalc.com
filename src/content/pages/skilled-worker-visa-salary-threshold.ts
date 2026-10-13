import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const sw = (code: string, salary: number, hours: number) => K.checkSkilledWorker({ code, salary, hours, situation: 'standard', nation: 'England' });
// Four worked cases, all computed by the engine.
const qa = K.occ('2136'), acc = K.occ('2433'), fin = K.occ('1131'), rd = K.occ('2161');
const qaFull = sw('2136', 41000, 37.5);
const qaPart = sw('2136', 41000, 30);
const accFull = sw('2433', 53000, 37.5);
const finLong = sw('1131', 82000, 42);
const rdRota = sw('2161', 64000, 52);

export default definePage({
  id: 'skilled-worker-visa-salary-threshold',
  group: 'work',
  order: 20,
  nav: 'Salary threshold',
  card: 'The general floor, the going rate, weekly hours, the 48-hour cap and what counts as salary.',
  title: `Skilled Worker Visa Salary Threshold 2026: ${K.gbp(S.general)} Test`,
  description: `Skilled Worker visa salary threshold explained: ${K.gbp(S.general)} or the going rate, pro-rated hours, the 48-hour cap, pay in each pay period and which pay counts now.`,
  h1: 'Skilled Worker visa salary threshold: the figure your job must reach',
  intro: `Your guaranteed basic pay must reach ${K.gbp(S.general)} a year and the going rate of your occupation code, adjusted to your weekly hours. Enter your code, salary and hours to test both.`,
  resume: `The Skilled Worker salary threshold is two tests applied together. The first is a fixed floor of ${K.gbp(S.general)} a year, which never moves with your hours. The second is the going rate of your four-digit occupation code, printed in Appendix Skilled Occupations for a ${S.goingRateHours}-hour week and scaled up or down to the hours written on your certificate of sponsorship. Your threshold is whichever of the two is higher. Pay only counts if it is guaranteed basic gross pay: overtime, shift premiums, bonuses, allowances and benefits in kind are left out, and pay for hours beyond ${S.maxCountedHours} a week is ignored. Since Statement of Changes HC 1691, the required pay must also arrive in every pay period rather than only across the year. An IT tester (code ${qa.code}) on ${K.gbp(41000)} misses the floor by ${K.gbp(-qaFull.gap)} even though the going rate is lower; a financial manager (code ${fin.code}) on ${K.int(42)} hours needs ${K.gbp(finLong.required)}. The checker above runs both tests on your figures.`,
  tool: { kind: 'sw', props: { initialCode: '2136', initialSalary: 41000, title: 'Test your salary against both thresholds' } },
  body: (h) => `
<h2>Floor or going rate: which one binds</h2>
<p>For a first application in a standard job, Appendix Skilled Worker (option A) asks for a salary that equals or exceeds both ${K.gbp(S.general)} per year and the going rate for the occupation code. Neither figure is optional, so the one that bites depends on your code. In ${K.int(K.OCCUPATIONS.filter((o) => o.table === 'Table 1' && (o.goingRate ?? 0) < S.general).length)} of the ${K.int(K.count('Table 1'))} higher skilled codes the going rate sits below ${K.gbp(S.general)}, which means the fixed floor decides. In the others the going rate is the real hurdle.</p>
<p>Two examples show the difference. An IT quality and testing professional (code ${qa.code}) has a going rate of ${K.gbp(qa.goingRate!)}. Offered ${K.gbp(41000)} for a ${S.goingRateHours}-hour week, the worker clears the going rate but not the floor, so the application fails by ${K.gbp(-qaFull.gap)}. A statistician or actuary (code ${acc.code}) offered ${K.gbp(53000)} clears the floor comfortably but falls ${K.gbp(-accFull.gap)} short of the going rate of ${K.gbp(acc.goingRate!)}. Same rule, opposite reasons.</p>
${h.table(['Code and job', 'Hours', 'Salary offered', 'Threshold', 'Result'], [
    [`${qa.code} ${qa.title}`, '37.5', K.gbp(41000), K.gbp(qaFull.required), qaFull.passes ? 'Meets it' : `Short by ${K.gbp(-qaFull.gap)}`],
    [`${qa.code} ${qa.title}`, '30', K.gbp(41000), K.gbp(qaPart.required), qaPart.passes ? 'Meets it' : `Short by ${K.gbp(-qaPart.gap)}`],
    [`${acc.code} ${acc.title}`, '37.5', K.gbp(53000), K.gbp(accFull.required), accFull.passes ? 'Meets it' : `Short by ${K.gbp(-accFull.gap)}`],
    [`${fin.code} ${fin.title}`, '42', K.gbp(82000), K.gbp(finLong.required), finLong.passes ? 'Meets it' : `Short by ${K.gbp(-finLong.gap)}`],
    [`${rd.code} ${rd.title}`, '52', K.gbp(64000), K.gbp(Math.round(rdRota.required)), rdRota.passes ? 'Meets it' : `Short by ${K.gbp(Math.round(-rdRota.gap))}`],
  ], 'Standard rate (option A), worked out by the engine of this site from Appendix Skilled Occupations Table 1.', ['l', 'r', 'r', 'r', 'l'])}
<h2>Hours change the going rate, not the floor</h2>
<p>Going rates assume ${S.goingRateHours} hours a week. Rule SW 14.4 multiplies the printed rate by your weekly hours divided by ${S.goingRateHours}. Work 30 hours as a tester and the going rate drops to ${K.gbp(qaPart.goingRateProRata!)}, but the ${K.gbp(S.general)} floor stays whole, so part-time jobs rarely pass on the standard rate. Work 42 hours as a financial manager (going rate ${K.gbp(fin.goingRate!)}) and the target climbs to ${K.gbp(finLong.required)}.</p>
<p>Long rotas meet a second rule. Under SW 14.3 only the pay for the first ${S.maxCountedHours} hours a week counts towards the threshold, yet SW 14.4(d) still pro-rates the going rate on every hour you work. An R&amp;D manager (code ${rd.code}) on ${K.gbp(64000)} for 52 hours is treated as earning ${K.gbp(Math.round(rdRota.countedSalary))}, against a going rate stretched to ${K.gbp(Math.round(rdRota.required))}. Contracts with uneven weeks can average the hours over a cycle of up to 17 weeks, unpaid rest weeks included.</p>
<h2>Paid in every pay period, not just by December</h2>
<p>HC 1691 added rule SW 14.3B. Your pay in each pay period must cover the going rate for every hour worked in that period. On monthly pay, any three-month stretch must bring in at least a quarter of the annual threshold; on weekly or fortnightly pay, any 12 weeks must reach 12/52 of it. Irregular patterns are tested over 17 weeks. The Home Office explained the change as a way to spot underpayment without waiting a full year, so an annual figure topped up by a December payment no longer saves a thin month.</p>
<h2>What counts as salary and what does not</h2>
<p>SW 14.1 counts guaranteed basic gross pay before tax, including your own pension and National Insurance contributions, plus guaranteed payments treated exactly like basic pay for tax, pension and National Insurance. SW 14.2 then excludes a long list:</p>
<ul>
<li>pay that cannot be guaranteed because the hours fluctuate;</li>
<li>shift, overtime and bonus pay, even when guaranteed;</li>
<li>the employer's pension and National Insurance contributions;</li>
<li>allowances for accommodation or cost of living;</li>
<li>benefits in kind such as shares, health insurance, school fees, company cars or food;</li>
<li>one-off sums such as golden hellos, payments towards visa costs or the health charge, and business expenses.</li>
</ul>
<p>Money you pay back to the sponsor, such as salary deductions or loan repayments, is subtracted and averaged over the sponsorship period, unless it is a genuine optional benefit like salary sacrifice. Lower thresholds exist for new entrants, relevant PhDs, postdoctoral posts and Immigration Salary List jobs: see ${h.a('new-entrant-salary', 'the new entrant rate')}, ${h.a('phd-salary-discount', 'the PhD discount')} and ${h.a('immigration-salary-list', 'the Immigration Salary List')}. The rules are in ${h.src('appendix_sw', 'Appendix Skilled Worker')} and the rates in ${h.src('appendix_aso', 'Appendix Skilled Occupations')}.</p>`,
  faqs: [
    { q: 'Is the Skilled Worker threshold reduced for part-time work?', a: `Only half of it. The going rate is pro-rated to your weekly hours, so it falls for a part-time contract, but the fixed floor of ${K.gbp(S.general)} a year is not pro-rated. A part-time job therefore has to pay a full-time salary of at least ${K.gbp(S.general)} on the standard rate, which is why few part-time roles qualify unless a lower option applies.` },
    { q: 'Does a guaranteed bonus help me reach the salary threshold?', a: 'No. Rule SW 14.2 excludes bonus, overtime and shift pay whether or not the contract guarantees it, along with allowances, benefits in kind and one-off payments. Only guaranteed basic gross pay, including your own pension and National Insurance contributions, counts. An amount only starts to count once it is moved into guaranteed basic pay on the contract.' },
    { q: 'What happens if one month of my pay is below the going rate?', a: 'Since HC 1691, rule SW 14.3B asks for the going rate in every pay period and, on monthly pay, a quarter of the annual threshold over any three months. UKVI can act on a short month without waiting for the year to end, and the sponsor is asked to explain or put it right. The rule allows variations already set out in the rules, such as uneven working patterns confirmed by the sponsor, but a year-end top-up no longer cures a shortfall.' },
    { q: 'Do hours above 48 a week raise my counted salary?', a: `No. Under SW 14.3 only the pay for the first ${S.maxCountedHours} hours a week is counted, while the going rate is still pro-rated on all the hours you work. Long fixed rotas can therefore push the target up and the counted salary down at the same time. Patterns with uneven weeks may average hours over a cycle of up to 17 weeks.` },
  ],
  related: ['skilled-worker-visa', 'skilled-worker-going-rates', 'soc-code-checker', 'new-entrant-salary', 'phd-salary-discount', 'immigration-salary-list'],
  sources: ['appendix_sw', 'appendix_aso', 'sw_visa', 'hc_1691'],
});
