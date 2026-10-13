import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const series = K.HISTORY_SERIES.map((s) => ({ s, h: K.feeHistory(s.line()) }));
const first = K.FEES.versions[0].date;
const rise = (h: Array<{ amount: number }>) => h[h.length - 1].amount / h[0].amount - 1;
const top = [...series].sort((a, b) => rise(b.h) - rise(a.h))[0];
const V = K.FEES.versions.map((v) => v.date);
const moves = V.slice(1).map((b, i) => { const a = V[i]; const r = K.FEES.lines.filter((l) => l.amounts[a] != null && l.amounts[b] != null && l.amounts[a] !== l.amounts[b]).map((l) => l.amounts[b] / l.amounts[a] - 1).sort((x, y) => x - y); return { date: b, n: r.length, median: r.length ? r[Math.floor(r.length / 2)] : 0 }; });
const big = moves.filter((m) => m.n >= 50);
const quiet = moves.filter((m) => m.n === 0).length;
const path = (i: 0 | 1) => ['sw-out-5', 'ilr', 'citizenship'].map((id) => { const x = series.find((y) => y.s.id === id)!.h; return i === 0 ? x[0].amount : x[x.length - 1].amount; }).reduce((a, b) => a + b, 0);
const sw = series.find((x) => x.s.id === 'sw-out-3')!;

export default definePage({
  id: 'home-office-fees',
  group: 'costs',
  order: 40,
  nav: 'Home Office fee history',
  card: 'How each main fee moved across the Home Office tables since January 2024.',
  title: 'Home Office Fees 2026: How Each Visa Fee Changed Since 2024',
  description: `Home Office fees across ${K.FEES.versions.length} tables since ${K.date(first)}: Skilled Worker, spouse, student, ILR, citizenship and sponsor fees, every change dated and in per cent.`,
  h1: 'Home Office fees: what each visa cost, table by table',
  intro: `Since ${K.date(first)} the Home Office has published ${K.FEES.versions.length} fee tables. A Skilled Worker visa from abroad went from ${K.gbp(sw.h[0].amount)} to ${K.gbp(sw.h[sw.h.length - 1].amount)}.`,
  resume: `Home Office fees are set by regulations and published as a table, and every change produces a new version of it: ${K.FEES.versions.length} versions between ${K.date(first)} and ${K.date(K.FEE_DATE)}. ${K.int(quiet)} of them changed no amount at all and others touched a handful of lines; only ${big.length === 2 ? 'two' : K.int(big.length)} moved almost every price: ${big.map((m) => `${K.date(m.date)} (${K.int(m.n)} lines, ${K.pct(m.median, 1)} at the median)`).join(' and ')}. The latest uplift took the Skilled Worker visa from abroad to ${K.gbp(sw.h[sw.h.length - 1].amount)}, the settlement fee to ${K.gbp(K.FEE.ilr())} and naturalisation to ${K.gbp(K.FEE.naturalisation())}. Of the main fees followed here, the ${top.s.label.toLowerCase()} rose most, by ${K.pct(rise(top.h))} over the period. The tool above shows any of them version by version, and the table below sums up the change since the first table of 2024.`,
  tool: { kind: 'history', props: { initial: 'sw-out-3', title: 'Fee history, table by table' } },
  body: (h) => `
<h2>Main fees since January 2024</h2>
${h.table(['Fee', `On ${K.date(first)}`, `On ${K.date(K.FEE_DATE)}`, 'Change'], series.map(({ s, h: x }) => [s.label, K.gbp(x[0].amount), K.gbp(x[x.length - 1].amount), K.pct(rise(x))]), `First and current amount of each line, Home Office immigration and nationality fee tables. Lines whose label changed are followed through the change.`, ['l', 'r', 'r', 'r'])}
<h2>Why the tables change so often</h2>
<p>The Home Office republishes the whole table whenever one amount or one label changes. Between ${K.date(first)} and ${K.date(K.FEE_DATE)}, the versions that changed something touched these numbers of lines:</p>
${h.table(['Table of', 'Lines whose amount changed', 'Median change'], moves.map((m) => [K.date(m.date), K.int(m.n), m.n ? K.pct(m.median, 1) : '–']), 'Comparison of each fee table with the one before it, same line followed through label changes.', ['l', 'r', 'r'])}
<p>The two broad uplifts came in April, applied to applications made from their start date. The other versions added routes, corrected labels or moved a few specialised fees, which is why a new table can appear with no visible change for most applicants.</p>
<p>What counts is the date you submit and pay, not the date of the decision or of the job offer. If an uplift is announced and you are ready, applying before it starts keeps the old fee; the surcharge too is charged at the rate of the day you pay it.</p>
<h2>Reading a change correctly</h2>
<p>A percentage on its own can mislead. The Skilled Worker fee for a job on the Immigration Salary List replaced the old shortage occupation fee in April 2024, so its history begins with a different label; the tool follows the line through such renamings when the Home Office kept the same meaning. Health and Care Worker fees moved less than the standard Skilled Worker fees, and the sponsor fees moved in steps of their own. For the full cost of an application today, use the ${h.a('uk-visa-cost-calculator', 'cost calculator')}; for every current line, the ${h.a('uk-visa-fees', 'fee table page')}.</p>
<h2>The whole road, then and now</h2>
<p>For one person, the three fees of the usual work route to a British passport (a five-year Skilled Worker visa from abroad, settlement, then naturalisation, ceremony excluded) added up to ${K.gbp(path(0))} in the table of ${K.date(first)} and come to ${K.gbp(path(1))} today, ${K.pct(path(1) / path(0) - 1)} more. The health surcharge over the five years, paid once with the visa, comes on top: ${K.gbp(K.ihs(60, 'outside', false))} at the current rate. A family multiplies everything except the employer's costs, which is why planning the timing of each step, and the length asked for at each one, saves more than any single fee.</p>
<p>The figures on this page are read from the spreadsheets themselves, every version listed by the Home Office on ${h.src('fees_table', 'GOV.UK')}, not from news reports. When a new table is published, the site reads it, adds a column to this history and switches every calculator to it on the same day.</p>`,
  faqs: [
    { q: 'Will UK visa fees go up again in 2027?', a: 'No new uplift had been announced when these pages were last checked. The two broad increases of the period took effect in April 2025 and April 2026, so April is the month to watch; the site updates its tables as soon as a new version appears on GOV.UK.' },
    { q: 'Why did the fee I paid last year differ from today’s?', a: 'Because the table in force on the day you applied was an earlier version. Choose your fee in the history tool to see the amount of each table; the date of each version is the day from which it applied. The difference is not refunded or charged afterwards: each application pays the fee of its own date.' },
    { q: 'Has the immigration health surcharge changed too?', a: `Not in the tables followed here: the surcharge is set separately and has stayed at ${K.gbp(K.P.ihs.standard)} a year, ${K.gbp(K.P.ihs.reduced)} for students and children, since its last increase. It is shown with the fees in the cost calculator of this site.` },
  ],
  related: ['uk-visa-fees', 'uk-visa-cost-calculator', 'immigration-health-surcharge', 'skilled-worker-visa-cost', 'ilr-fee', 'british-citizenship-cost'],
  sources: ['fees_table', 'ihs', 'sw_costs'],
});
