import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tripDays } from '../../lib/engine/settlement';

const S = K.P.settlement;
// Guidance v10.0, example 3: one absence from 1 July to 10 August.
const summer = { out: '2030-07-01', back: '2030-08-10' };
const summerDays = tripDays(summer);
// Two trips that straddle New Year: each calendar year stays under the limit, one rolling window does not.
const autumn = { out: '2024-08-01', back: '2024-11-20' };
const winter = { out: '2025-01-15', back: '2025-04-10' };
const clean = K.settlementDate('skilled-worker', '2022-05-02', []);
const broken = K.settlementDate('skilled-worker', '2022-05-02', [autumn, winter]);
// Allowance left: a long first trip, then the question asked before booking the next one.
const spring = { out: '2023-01-10', back: '2023-05-20' };
const before = K.settlementDate('skilled-worker', '2021-09-01', [spring], '2023-08-31');

export default definePage({
  id: 'ilr-absence-calculator',
  group: 'settlement',
  order: 20,
  nav: 'ILR absence calculator',
  card: 'Whole days abroad, the rolling 12-month window and what a breach does to your date.',
  title: 'ILR Absence Calculator: the 180-Day Rolling Rule Explained',
  description: `ILR absence calculator: count whole days abroad, test every rolling 12 months against the ${S.maxAbsenceDays}-day limit, see allowed absences and your new date after a breach.`,
  h1: 'ILR absences: the 180 days in any 12 months, counted day by day',
  intro: `For settlement you can spend no more than ${S.maxAbsenceDays} whole days outside the UK in any 12-month window. Add your trips to see your worst window, the days you have left and whether any trip restarts the clock.`,
  resume: `The absence rule for indefinite leave to remain sits in Appendix Continuous Residence, paragraph CR 3.1: you must not have been outside the UK for more than ${S.maxAbsenceDays} days in any 12-month period. Two details decide most cases. First, only whole days count; the Home Office guidance (version 10.0) tells caseworkers to ignore part days, so the day you fly out and the day you land do not add to the total, and a trip from 1 July to 10 August is ${summerDays} days, not 41. Second, for permission granted on or after 11 January 2018 the window rolls: the Home Office can test any 12 consecutive months inside your qualifying period, not only calendar years. Trips for listed reasons, such as a life-threatening illness in the family or travel disruption caused by conflict or a pandemic, are left out of the count. A breach breaks continuous residence; the calculator then restarts your period from the date you came back and shows the new earliest date to apply.`,
  tool: { kind: 'absence', props: { initialRoute: 'skilled-worker', title: 'Days abroad, worst 12 months and days left' } },
  body: (h) => `
<h2>One trip, counted the Home Office way</h2>
<p>The guidance gives its own example: an applicant away from 1 July to 10 August. Calendar arithmetic says 41 days if you count both ends, 40 if you subtract the dates. The caseworker counts ${summerDays}: the departure day and the return day are part days, and "part day absences, less than 24 hours are not counted". The same logic answers the edge case the guidance raises, a traveller who starts the journey home on day 180 and lands on day 181. Day 181 is not a day of absence, so the limit is not passed.</p>
<p>Some time that feels like being in the UK still counts as absence. Work offshore beyond the 12 nautical mile limit, on a ship or an oil rig, is time outside the UK. So is time abroad while an application is pending, and time between getting an entry clearance and actually arriving. Days in the Channel Islands or the Isle of Man, on the other hand, count as UK days when your latest permission was granted in the UK.</p>
<h2>Why the calendar year is the wrong test</h2>
<p>People who count per calendar year are the ones who get caught. Suppose a Skilled Worker who arrived on ${K.date(clean.start)} takes a long autumn assignment abroad (${K.date(autumn.out)} to ${K.date(autumn.back)}, ${tripDays(autumn)} whole days) and then a second spell over the winter (${K.date(winter.out)} to ${K.date(winter.back)}, ${tripDays(winter)} days). Neither 2024 nor 2025 reaches ${S.maxAbsenceDays} days on its own. But the 12 months that begin in early August 2024 hold ${tripDays(autumn) + tripDays(winter)} days of absence, and that single window is enough.</p>
${h.table(['Way of counting', 'Days found', 'Result'], [
    ['Calendar year 2024', tripDays(autumn), 'under the limit'],
    ['Calendar year 2025', tripDays(winter), 'under the limit'],
    ['Rolling 12 months from August 2024', tripDays(autumn) + tripDays(winter), `over ${S.maxAbsenceDays}`],
  ], 'Same two trips, three ways of counting. Whole days only.', ['l', 'r', 'l'])}
<p>Without the trips this worker could apply from ${K.date(clean.earliestApply)}. With them, the calculator restarts the five years on ${K.date(broken.effectiveStart)} and the earliest application moves to ${K.date(broken.earliestApply)}, almost three years later. Permission granted before 11 January 2018 is the exception: absences in that period are tested in fixed 12-month blocks ending on the anniversary of the application date (CR 3.2), which the guidance illustrates with a permission from 2015 to 2018.</p>
<h2>Absences the Home Office leaves out</h2>
<p>CR 3.4 lists absences that are not counted at all, whatever their length:</p>
<ul>
<li>helping with a national or international humanitarian or environmental crisis overseas (with the sponsor's agreement on a sponsored route);</li>
<li>travel disruption caused by a natural disaster, military conflict or pandemic;</li>
<li>compelling and compassionate personal circumstances, such as your own life-threatening illness or the life-threatening illness or death of a close family member;</li>
<li>sponsor-approved research by a Skilled Worker in codes such as 2111 to 2119, 2161, 2162 or 2311, and research by some Global Talent holders;</li>
<li>on the family life route, work, study or supporting family abroad while family life and your permanent home stayed in the UK;</li>
<li>accompanying a partner on Crown service, for example in HM Armed Forces or with the British Council.</li>
</ul>
<p>There is no fixed list of evidence, but the guidance expects it: letters explaining what happened, medical certificates, proof of cancelled flights. Dependants who travelled with the main applicant for one of these reasons have those days left out too (CR 5.1). Enter such a trip in the calculator only if you cannot document the reason, because the tool counts every day you give it.</p>
<h2>Planning the next trip</h2>
<p>The figure that matters before you book is how many days the last 12 months have already used. A worker who arrived on ${K.date(before.start)} and spent ${tripDays(spring)} days abroad in early 2023 has ${K.int(before.allowanceToday ?? 0)} days left on ${K.date('2023-08-31')}, and that headroom only grows back as the old trip slides out of the window from January 2024. The tool's headline figure shows the same count for today's date. Trips that break the limit are not fatal to settlement in every case, since the Home Office can accept a reason under CR 3.4, but the calculator cannot judge reasons: it applies the rule as written and moves the date. For a past breach you want to explain, speak to a solicitor or an adviser registered with the Immigration Advice Authority before you apply. The ${h.a('indefinite-leave-to-remain', 'ILR overview')} covers the other tests, and ${h.a('long-residence-ilr', 'long residence')} has its own older limits for trips that began before ${K.date(S.longResidenceLegacy.cutoff)}.</p>`,
  faqs: [
    { q: 'Do the day I leave and the day I return count as days abroad?', a: `No. The continuous residence guidance tells caseworkers to count whole days only and to ignore part days of less than 24 hours, so both travel days are left out. A trip from Monday morning to the following Sunday evening is five days abroad, not seven. The calculator applies the same rule to every trip you enter.` },
    { q: 'Is the 180-day limit per calendar year or per visa year?', a: `Neither, for permission granted on or after 11 January 2018. The window rolls: any 12 consecutive months inside your qualifying period are tested, whatever date they start on. Two trips either side of New Year can each look small in their own year and still exceed ${S.maxAbsenceDays} days together. Only older permission uses fixed 12-month blocks.` },
    { q: 'What happens to my ILR date if I go over 180 days?', a: `Continuous residence is broken unless one of the reasons in CR 3.4 applies, and you would normally need a fresh qualifying period. The calculator restarts the period from the date you came back and shows the new earliest application date. If you can show a permitted reason, the Home Office may disregard the absence, which no calculator can decide for you.` },
    { q: 'Does time abroad for a family emergency count towards the limit?', a: `It may not. Absences for compelling and compassionate personal circumstances, such as the life-threatening illness or death of a close family member, are excluded by CR 3.4. You need evidence: a letter setting out what happened, with medical certificates or a death certificate. Keep tickets and records showing when you left and came back.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-requirements', 'long-residence-ilr', 'british-citizenship-requirements', 'ilr-processing-time'],
  sources: ['continuous_residence', 'cr_guidance', 'ilr_sw', 'ilr'],
});
