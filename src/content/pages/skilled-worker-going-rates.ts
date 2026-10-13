import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const T1 = K.OCCUPATIONS.filter((o) => o.table === 'Table 1').sort((a, b) => (a.code < b.code ? -1 : 1));
const n1 = T1.length;
const byRate = [...T1].sort((a, b) => (b.goingRate ?? 0) - (a.goingRate ?? 0));
const top = byRate[0], bottom = byRate[byRate.length - 1];
const belowFloor = T1.filter((o) => (o.goingRate ?? 0) < S.general).length;
const phdYes = T1.filter((o) => o.phd).length;
// Hourly minimum behind every Table 1 rate: the new entrant floor over a 37.5-hour year.
const hourlyFloor = Math.round((S.newEntrant.floor / (S.goingRateHours * 52)) * 100) / 100;
const stat = K.occ('2433'), mgr = K.occ('1243'), arch = K.occ('2115');

export default definePage({
  id: 'skilled-worker-going-rates',
  group: 'work',
  order: 30,
  nav: 'Going rates',
  card: `All ${n1} higher skilled codes with their going rate, the 70% rate and PhD eligibility.`,
  title: `Skilled Worker Going Rates 2026: All ${n1} Codes and 70% Rates`,
  description: `Going rate for every Skilled Worker visa code in Table 1: full rate, 70% new entrant rate and PhD eligibility, plus the 25th percentile rates for older visas.`,
  h1: 'Going rates for the Skilled Worker visa, code by code',
  intro: `Going rates run from ${K.gbp(bottom.goingRate!)} to ${K.gbp(top.goingRate!)} a year across the ${n1} higher skilled codes. Find yours in the table below or test a salary against it.`,
  resume: `A going rate is the minimum annual pay the Home Office accepts for one occupation code, set from the Annual Survey of Hours and Earnings and printed in Appendix Skilled Occupations. For new applicants, Table 1 uses the median earnings of each occupation, with a minimum of ${K.gbp(hourlyFloor)} an hour, for a ${S.goingRateHours}-hour week. The ${n1} higher skilled codes in that table range from ${K.gbp(bottom.goingRate!)} to ${K.gbp(top.goingRate!)} (code ${top.code}, ${top.title.toLowerCase()}). Workers first sponsored before ${K.date(S.transitional.cutoff)} can still use Table 2, built on the lower 25th percentile. Next to each going rate the table prints the 90%, 80% and 70% figures used by the PhD and new entrant options, already rounded and raised to the floor. A going rate is only half the test: the job must also pay ${K.gbp(S.general)} on the standard route, which settles the matter for the ${belowFloor} codes whose going rate is lower. The calculator above pro-rates any rate to your hours.`,
  tool: { kind: 'sw', props: { initialCode: '2433', initialSalary: 52000, title: 'Compare a salary with the going rate of its code' } },
  body: (h) => `
<h2>Median or 25th percentile: two tables, two groups</h2>
<p>Appendix Skilled Occupations publishes several sets of rates, and the one you are measured against depends on when your Skilled Worker journey began. Table 1 is the current table. Its going rates come from the median earnings of each occupation in the Annual Survey of Hours and Earnings, so half of the people doing that job in the UK earn more and half earn less. Table 2 carries the older yardstick, the 25th percentile, which sits well below the median.</p>
<p>Table 2 applies through options F to J of Appendix Skilled Worker to people granted permission under the rules before ${K.date(S.transitional.cutoff)} who have held Skilled Worker permission without a break since, for applications made before ${K.date(S.transitional.until)}. For a statistician (code ${stat.code}) the gap is wide: ${K.gbp(stat.goingRate!)} on the median table against ${K.gbp(stat.goingRateTransitional!)} on the transitional one. Medium skilled codes have their own pair of tables, 1a and 2aa, for jobs on a shortage list or held since before ${K.date(S.mediumSkilledCutoff)}; a logistics manager (code ${mgr.code}, Table 1a) has a going rate of ${K.gbp(mgr.goingRate!)}.</p>
<h2>How the printed rates are built</h2>
<p>Every rate in Tables 1 to 2a assumes ${S.goingRateHours} hours a week and is pro-rated to the hours on the certificate of sponsorship. Each also has an hourly minimum of ${K.gbp(hourlyFloor)}: where the survey figure would fall below it, the floor replaces it, which is why several codes show exactly ${K.gbp(S.newEntrant.floor)}. The appendix adds that when ${K.gbp(hourlyFloor)} an hour works out higher than 70%, 80% or 90% of a rate, that floor is treated as the discounted rate anyway. You can see it on social and humanities scientists (code ${arch.code}): a going rate of ${K.gbp(arch.goingRate!)}, but a 70% column of ${K.gbp(arch.r70!)} rather than a straight 70%.</p>
<p>Two more details matter in practice. At settlement only the full going rate column applies, so a discount you used on entry does not carry into an application for indefinite leave. And the code drives the rate, not your job title: the ${h.a('soc-code-checker', 'SOC code checker')} helps match duties to a code.</p>
<h2>All ${n1} higher skilled codes in Table 1</h2>
<p>The table lists each Table 1 code with the going rate used for a standard application (option A) and for an Immigration Salary List job (option D), the 70% rate used by new entrants and postdoctoral posts (option E), and whether the code accepts PhD points. ${phdYes} of the ${n1} codes accept them. Rates are annual for ${S.goingRateHours} hours; the threshold for option A is still the higher of the going rate and ${K.gbp(S.general)}.</p>
${h.table(['Code', 'Occupation', 'Going rate', '70% rate', 'PhD points'],
    T1.map((o) => [o.code, o.title, K.gbp(o.goingRate!), o.r70 != null ? K.gbp(o.r70) : 'n/a', o.phd ? 'Yes' : 'No']),
    `Appendix Skilled Occupations, Table 1 (updated ${K.date(K.SOC.asoUpdated)}), ${S.goingRateHours}-hour week.`, ['l', 'l', 'r', 'r', 'l'])}
<p>A going rate is a minimum, not a market salary, and it moves when the Home Office updates the appendix with new survey data. Your threshold for a renewal is worked out on the rates in force on the date you apply, so a rate that was met three years ago may have risen since. The ${h.a('skilled-worker-visa-salary-threshold', 'salary threshold page')} shows how hours, the 48-hour cap and pay periods change the figure, and the ${h.src('appendix_aso', 'appendix itself')} prints the hourly equivalent of every rate.</p>`,
  faqs: [
    { q: 'Where does the Home Office get its going rates from?', a: `From the Annual Survey of Hours and Earnings. Table 1 of Appendix Skilled Occupations uses the median pay of each occupation code for a 37.5-hour week, with an hourly minimum, while Table 2 keeps the lower 25th percentile for workers first sponsored under the rules before ${K.date(S.transitional.cutoff)}.` },
    { q: 'Can I use the lower 25th percentile going rate?', a: `Only if you were granted Skilled Worker permission under the rules in place before ${K.date(S.transitional.cutoff)} and have held Skilled Worker permission continuously since, and only for applications made before ${K.date(S.transitional.until)}. Everyone else, including people switching from the Graduate or Student routes, is measured against the median rates in Table 1.` },
    { q: 'Why is the 70% column higher than 70% of the going rate?', a: `Because of the hourly minimum. Where ${K.gbp(hourlyFloor)} an hour for a ${S.goingRateHours}-hour week works out above 70%, 80% or 90% of a going rate, Appendix Skilled Occupations prints that minimum in the discounted column instead. For many codes the 70% rate is therefore exactly ${K.gbp(S.newEntrant.floor)}, the same as the new entrant salary floor.` },
    { q: 'Do going rates change while I hold my visa?', a: 'Your current permission is not affected, but each new application, whether an extension, a change of employer or settlement, is tested against the rates in force on its date of application. The Home Office updates Appendix Skilled Occupations from time to time, so check the current rate before a renewal rather than relying on the figure on your first certificate.' },
  ],
  related: ['skilled-worker-visa-salary-threshold', 'soc-code-checker', 'new-entrant-salary', 'phd-salary-discount', 'skilled-worker-visa', 'temporary-shortage-list'],
  sources: ['appendix_aso', 'appendix_sw', 'sw_visa'],
});
