import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const NE = S.newEntrant;
const at = (code: string, situation: 'standard' | 'new-entrant') => K.checkSkilledWorker({ code, salary: 0, hours: 37.5, situation, nation: 'England' }).required;
const rows = ['2433', '1131', '2136', '2115', '2471'].map((c) => ({ o: K.occ(c), std: at(c, 'standard'), ne: at(c, 'new-entrant') }));
const stat = rows[0];
const stat30 = K.checkSkilledWorker({ code: '2433', salary: 0, hours: 30, situation: 'new-entrant', nation: 'England' }).required;

export default definePage({
  id: 'new-entrant-salary',
  group: 'work',
  order: 80,
  nav: 'New entrant rate',
  card: `Who counts as a new entrant, the ${K.pct(NE.share)} going rate, the ${K.gbp(NE.floor)} floor and the four-year limit.`,
  title: `New Entrant Salary for Skilled Worker: ${K.pct(NE.share)} Rate and Rules`,
  description: `New entrant salary for the Skilled Worker visa: ${K.pct(NE.share)} of the going rate with a ${K.gbp(NE.floor)} floor if you are under ${NE.underAge}, a recent graduate or in training, for ${NE.maxStayYears} years at most.`,
  h1: 'New entrant salary rate on the Skilled Worker visa',
  intro: `New entrants can be paid ${K.pct(NE.share)} of the going rate, never below ${K.gbp(NE.floor)}, instead of the usual ${K.gbp(S.general)}. Pick "new entrant" in the checker to see your lower threshold.`,
  resume: `The new entrant rate is option E of Appendix Skilled Worker. It lets an employer sponsor you at ${K.pct(NE.share)} of the going rate for your occupation code, pro-rated to your hours, as long as the salary is at least ${K.gbp(NE.floor)} a year. The general ${K.gbp(S.general)} floor does not apply. You qualify if one condition is met on the date you apply: you are under ${NE.underAge}; your most recent permission was as a Student on a UK bachelor's, master's or doctoral course (or PGCE or PGDE) that you have finished or are about to finish, or expired less than two years ago; your most recent permission was a Graduate visa, current or expired less than two years ago; or the job is in a regulated profession or leads to full registration or chartered status that you are working towards. The catch is time. Your combined permission as a Skilled Worker, Graduate and Tier 2 migrant cannot exceed ${NE.maxStayYears} years when granted this way. For a statistician (code ${stat.o.code}) the threshold drops from ${K.gbp(stat.std)} to ${K.gbp(stat.ne)}.`,
  tool: { kind: 'sw', props: { initialCode: '2433', initialSalary: 39000, initialSituation: 'new-entrant', title: 'New entrant threshold for your code and hours' } },
  body: (h) => `
<h2>Six ways to count as a new entrant</h2>
<p>Rule SW 12.2 lists the routes into option E. Only one needs to apply, and it is checked on the date of your application, not the date the job starts:</p>
<ul>
<li><strong>Age.</strong> You are under ${NE.underAge} on the day you apply. Turning ${NE.underAge} the week after does not matter for that application.</li>
<li><strong>Student.</strong> Your last permission (ignoring any visit) was as a Student sponsored for a UK bachelor's, master's, PhD or other doctorate, a PGCE or a PGDE. You have completed it, are applying within three months of the expected end, or have done at least 12 months of a UK PhD. An expired Student permission must have ended less than two years before you apply.</li>
<li><strong>Graduate.</strong> Your last permission was a Graduate visa, still running or expired less than two years ago.</li>
<li><strong>Regulated profession.</strong> The job is in a UK regulated profession and you are working towards the recognised UK qualification for it.</li>
<li><strong>Registration or chartership.</strong> You are working towards full registration or chartered status with the professional body for the job.</li>
<li><strong>Postdoctoral post.</strong> The job is a postdoctoral position in one of ${S.postdoc.codes.length} science and higher education codes; the ${h.a('phd-salary-discount', 'PhD page')} covers it.</li>
</ul>
<p>The Student and Graduate conditions look at your most recent permission. If you moved from a Graduate visa to another route in between, the link is broken, even if you studied in the UK.</p>
<h2>What the threshold becomes</h2>
<p>The going rate for your code is multiplied by ${K.pct(NE.share)} and compared with the ${K.gbp(NE.floor)} floor; the higher figure is your threshold. Appendix Skilled Occupations prints the ${K.pct(NE.share)} column for every code, already rounded and lifted to the floor where needed. For codes with modest going rates the floor decides, which is why several rows below show the same figure.</p>
${h.table(['Code and occupation', 'Standard threshold', 'New entrant threshold', 'Difference'],
    rows.map((r) => [`${r.o.code} ${r.o.title}`, K.gbp(r.std), K.gbp(r.ne), K.gbp(r.std - r.ne)]),
    `Full-time (${S.goingRateHours} hours), first application, England. Computed by this site's engine from Table 1 of Appendix Skilled Occupations.`, ['l', 'r', 'r', 'r'])}
<p>Hours still move the going rate part of the test. A new entrant statistician on 30 hours a week needs ${K.gbp(stat30)}, because the pro-rated ${K.pct(NE.share)} figure falls under the floor and the floor itself is not pro-rated. Only guaranteed basic pay counts, exactly as on the standard rate.</p>
<h2>The ${NE.maxStayYears}-year clock and what comes after</h2>
<p>SW 12.3 caps the time: granting the application must not take your combined permission as a Skilled Worker, Graduate and Tier 2 migrant past ${NE.maxStayYears} years, whether or not the periods were continuous. Time on a Graduate visa therefore uses up part of the allowance before you even start. A certificate that would run past the allowance cannot be granted on this option, so its length has to fit what remains.</p>
<p>When the allowance runs out, your next application is judged on the standard rate: ${K.gbp(S.general)} or the full going rate, whichever is higher, for most codes. Plan the pay rise before the extension rather than after it. The same applies at settlement, where Appendix Skilled Occupations says only the full going rate column counts, so a salary that still sits at ${K.pct(NE.share)} after five years will not support indefinite leave on its own. For Graduate visa holders the timing is set out on the ${h.a('graduate-to-skilled-worker', 'Graduate to Skilled Worker page')}, and the rule text is in ${h.src('sw_paid_less', 'GOV.UK: when you can be paid less')}.</p>`,
  faqs: [
    { q: 'Does the new entrant rate stop when I turn 26?', a: `No. Age is tested only on the date of application, so a grant made while you were under ${NE.underAge} lasts for the period on the certificate. Your next application is tested again: if no other new entrant condition applies by then, or the ${NE.maxStayYears}-year limit is used up, the standard threshold applies.` },
    { q: 'Does my Graduate visa time count towards the four-year limit?', a: `Yes. Rule SW 12.3 adds together all permission as a Skilled Worker, a Graduate and a Tier 2 migrant, continuous or not. Someone who spent two years on a Graduate visa has at most two years left at the new entrant rate, and the certificate of sponsorship must end within that allowance.` },
    { q: `Can a new entrant be paid less than ${K.gbp(NE.floor)}?`, a: `Not under option E. The floor of ${K.gbp(NE.floor)} applies whatever ${K.pct(NE.share)} of the going rate works out at. Lower figures exist only on other options, such as listed health and education jobs on national pay scales from ${K.gbp(S.healthEducation.floor)}, or for workers who keep the transitional rules from before ${K.date(S.transitional.cutoff)}.` },
    { q: 'Is a master’s graduate from abroad a new entrant?', a: `Only through another condition. The Student and Graduate routes into option E require UK permission as a Student or Graduate, and a degree from a university outside the UK does not satisfy them. Being under ${NE.underAge}, or working towards a UK professional registration, chartership or regulated qualification, can still qualify you.` },
  ],
  related: ['graduate-to-skilled-worker', 'skilled-worker-visa-salary-threshold', 'phd-salary-discount', 'skilled-worker-going-rates', 'graduate-visa-uk', 'skilled-worker-visa'],
  sources: ['sw_paid_less', 'appendix_sw', 'appendix_aso'],
});
