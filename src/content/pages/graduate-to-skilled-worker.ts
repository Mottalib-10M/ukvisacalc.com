import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const ST = K.P.student;
const NE = S.newEntrant;
const gradNow = ST.graduateYears, gradLater = ST.graduateYearsFrom2027;
const leftNow = NE.maxStayYears - gradNow, leftLater = NE.maxStayYears - gradLater;
const fmtYears = (y: number) => { const m = Math.round(y * 12); return m === 12 ? '1 year' : m % 12 === 0 ? `${m / 12} years` : m < 24 ? `${m} months` : `${Math.floor(m / 12)} years and ${m % 12} months`; };
const sw2 = K.visaCost({ route: 'skilled-worker', where: 'inside', months: Math.round(leftNow * 12), partner: false, children: 0 });
const tester = K.occ('2136');
const neTester = K.checkSkilledWorker({ code: '2136', salary: 0, hours: 37.5, situation: 'new-entrant', nation: 'England' }).required;
const stdTester = K.checkSkilledWorker({ code: '2136', salary: 0, hours: 37.5, situation: 'standard', nation: 'England' }).required;
const startLater = '2027-02-01';
const endLater = K.addMonths(startLater, Math.round(gradLater * 12));
const capLater = K.addMonths(startLater, NE.maxStayYears * 12);

export default definePage({
  id: 'graduate-to-skilled-worker',
  group: 'work',
  order: 130,
  nav: 'Graduate to Skilled Worker',
  card: 'Switching from the Graduate visa: the new entrant rate, the four-year clock, the in-country fee and timing.',
  title: 'Graduate to Skilled Worker Visa Switch: Salary, Fee, Timing',
  description: `Graduate to Skilled Worker switch: the ${K.pct(NE.share)} new entrant rate and ${K.gbp(NE.floor)} floor, Graduate time and the ${NE.maxStayYears}-year limit, in-UK fees and the 2027 cut to ${fmtYears(gradLater)}.`,
  h1: 'Switching from the Graduate visa to a Skilled Worker visa',
  intro: `A Graduate visa holder can switch inside the UK at the new entrant rate: ${K.pct(NE.share)} of the going rate, at least ${K.gbp(NE.floor)}. Graduate time counts towards the ${NE.maxStayYears}-year limit on that rate.`,
  resume: `The Graduate visa cannot be extended, so staying on means switching to another route, and GOV.UK gives the Skilled Worker visa as its example. The switch has a clear advantage: because your most recent permission is as a Graduate, you count as a new entrant, and your job only needs to pay ${K.pct(NE.share)} of the going rate for its code with a floor of ${K.gbp(NE.floor)}, instead of ${K.gbp(S.general)} or the full rate. An IT tester (code ${tester.code}) would need ${K.gbp(neTester)} rather than ${K.gbp(stdTester)}. The limit is time. Your combined Graduate and Skilled Worker permission on that rate cannot exceed ${NE.maxStayYears} years, so a ${gradNow}-year Graduate visa leaves ${fmtYears(leftNow)} at the new entrant rate. Graduate visas applied for from ${K.date(ST.graduateChange)} last ${fmtYears(gradLater)}, leaving ${fmtYears(leftLater)}. Switching inside the UK costs ${K.gbp(K.FEE.skilledWorker('inside', 3))} for up to three years plus the health surcharge. The checker above is set to the new entrant rate.`,
  tool: { kind: 'sw', props: { initialCode: '2136', initialSalary: 34000, initialSituation: 'new-entrant', title: 'Your salary test after the Graduate visa' } },
  body: (h) => `
<h2>Why Graduate visa holders get the lower rate</h2>
<p>Rule SW 12.2(f) treats you as a new entrant if your most recent permission, ignoring any visit, was as a Graduate, and if that permission has expired, it expired less than two years before you apply. You do not need to be under ${NE.underAge}. The employer sponsors you at option E: the ${K.pct(NE.share)} column of Appendix Skilled Occupations, never below ${K.gbp(NE.floor)}. The job must still be in an eligible code, normally one of the ${K.count('Table 1')} higher skilled codes in Table 1, with a sponsor that is A-rated on the register.</p>
<p>The link is to your most recent permission. Move from Graduate to another visa first and you lose the Graduate route into option E, though you may still qualify through age or professional training. Students who finish a UK degree can also go straight to Skilled Worker as new entrants without passing through the Graduate visa, if the job starts after the course ends.</p>
<h2>The four-year clock and the 2027 change</h2>
<p>Rule SW 12.3 adds up your permission as a Skilled Worker, Graduate and Tier 2 migrant: granting a new entrant application must not take the total past ${NE.maxStayYears} years. What you spend on the Graduate visa is deducted first.</p>
${h.table(['Graduate visa', 'Graduate leave', 'Left at the new entrant rate'], [
    [`Applied for on or before ${K.date(K.addDays(ST.graduateChange, -1))}`, fmtYears(gradNow), fmtYears(leftNow)],
    [`Applied for on or after ${K.date(ST.graduateChange)}`, fmtYears(gradLater), fmtYears(leftLater)],
    ['PhD or other doctorate', fmtYears(ST.graduatePhdYears), fmtYears(NE.maxStayYears - ST.graduatePhdYears)],
  ], 'Graduate leave from GOV.UK; remaining time if you use the whole Graduate visa before switching.', ['l', 'l', 'l'])}
<p>Switching earlier keeps more of the allowance. A graduate who starts a Graduate visa of ${fmtYears(gradLater)} on ${K.date(startLater)} would see it end on ${K.date(endLater)}, and the ${NE.maxStayYears}-year allowance measured from the same day would run out around ${K.date(capLater)}; a certificate of sponsorship has to fit inside that. After it, the next application is tested at ${K.gbp(S.general)} or the full going rate, and settlement also uses the full going rate, so the salary has to grow before then.</p>
<h2>Applying from inside the UK</h2>
<p>You switch online before the Graduate visa expires and wait in the UK. The fee is the in-country one, ${K.gbp(K.FEE.skilledWorker('inside', 3))} for up to three years or ${K.gbp(K.FEE.skilledWorker('inside', 5))} for longer, plus the health surcharge for the new leave. A switch for ${fmtYears(leftNow)} costs ${K.gbp(sw2.fees)} plus ${K.gbp(sw2.ihsTotal)}, ${K.gbp(sw2.total)} in total. The standard decision time is ${K.P.processing.inside['skilled-worker']} weeks, and you must not travel outside the UK, Ireland, the Channel Islands or the Isle of Man until it arrives.</p>
<p>Two requirements are often easier at this point. If you have been in the UK with permission for 12 months, you do not need to show the ${K.gbp(S.maintenance)} of savings. And a degree awarded by a UK institution and taught in English proves English at the level required, ${S.englishLevel}. Your employer pays the certificate of sponsorship and, unless an exemption applies, the immigration skills charge; neither can be passed to you. Partners and children who were not with you on the Graduate visa can apply to join you once you hold Skilled Worker permission, if your code allows dependants. The ${h.a('new-entrant-salary', 'new entrant page')} lists the other routes into the lower rate, the ${h.a('graduate-visa-uk', 'Graduate visa page')} covers the visa itself, and ${h.src('graduate_visa', 'GOV.UK: Graduate visa')} has the official text.</p>`,
  faqs: [
    { q: 'Can I switch from a Graduate visa that has already expired?', a: 'You cannot switch inside the UK once your Graduate permission has ended; the application must be made while it is still valid. You can still apply from abroad. For the new entrant rate, a Graduate visa counts if it was your most recent permission and expired less than two years before the date of the Skilled Worker application.' },
    { q: 'Do I keep the new entrant rate if I change employer?', a: `Each new application is tested again. If your most recent permission is now Skilled Worker, the Graduate condition no longer applies, but rule SW 12.2 still lets a new entrant grant continue while you meet another condition and the ${NE.maxStayYears}-year total is not exceeded.` },
    { q: 'Will the shorter Graduate visa from 2027 affect my switch?', a: `Only if you apply for the Graduate visa on or after ${K.date(ST.graduateChange)}: that visa lasts ${fmtYears(gradLater)} instead of ${gradNow} years. Less Graduate time means more of the ${NE.maxStayYears}-year new entrant allowance left for Skilled Worker, ${fmtYears(leftLater)} instead of ${fmtYears(leftNow)}, but less time to find a sponsor before the visa ends.` },
  ],
  related: ['new-entrant-salary', 'graduate-visa-uk', 'skilled-worker-visa', 'skilled-worker-visa-cost', 'register-of-licensed-sponsors', 'skilled-worker-visa-processing-time'],
  sources: ['graduate_visa', 'sw_paid_less', 'appendix_sw', 'sw_visa'],
});
