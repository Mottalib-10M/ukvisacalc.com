import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
const T = K.P.processing;
const b2 = S.englishB2SettlementFrom;
// Biometrics on Thursday 15 October 2026, then on Tuesday 22 December 2026 (Christmas bank holidays in between).
const oct = K.decisionDate('ilr', 'inside', '2026-10-15');
const dec = K.decisionDate('ilr', 'inside', '2026-12-22');
// A worker whose five years end on 7 April 2027: earliest application 28 days before.
const sw = K.settlementDate('skilled-worker', '2022-04-07', []);

export default definePage({
  id: 'ilr-processing-time',
  group: 'settlement',
  order: 60,
  nav: 'ILR processing time',
  card: `${T.ilrMonths} months as standard, 5 working days with priority, and what keeps a file waiting longer.`,
  title: 'ILR Processing Time 2026: 6 Months, Priority and Delays',
  description: `ILR processing time: usually ${T.ilrMonths} months from biometrics, ${T.priorityWorkingDays} working days with priority, next working day with super priority, why files take longer and the travel ban.`,
  h1: 'ILR processing time: from the biometrics appointment to the decision',
  intro: `A settlement application is usually decided within ${T.ilrMonths} months of your fingerprints and photo. Priority (${K.gbp(K.FEE.priorityInside())}) aims for ${T.priorityWorkingDays} working days, super priority (${K.gbp(K.FEE.superPriorityInside())}) for the next working day. Enter your appointment date to see each deadline.`,
  resume: `UK Visas and Immigration's service standard for indefinite leave to remain is a decision within ${T.ilrMonths} months, and the clock starts at the UKVCAS appointment where your fingerprints and photo are taken, not on the day you submit the form online. Two paid services shorten it: ${K.gbp(K.FEE.priorityInside())} for priority, aiming for ${T.priorityWorkingDays} working days, and ${K.gbp(K.FEE.superPriorityInside())} for super priority, aiming for the end of the next working day after a weekday appointment or ${T.superPriorityIlrWorkingDays} working days after a weekend one. Working days run Monday to Friday and skip bank holidays, so an appointment just before Christmas waits longer. Some files fall outside the standard: documents that need checking, an interview, or a criminal record mean you will be contacted and the decision takes longer. Throughout the wait you must stay in the UK, Ireland, the Channel Islands or the Isle of Man, or the application is treated as withdrawn. The date tool above counts each deadline.`,
  tool: { kind: 'time', props: { initialRoute: 'ilr', initialWhere: 'inside', title: 'Expected ILR decision date from your appointment' } },
  body: (h) => `
<h2>Three deadlines from one appointment</h2>
<p>The online form is only the first half of the application. The second is the UKVCAS appointment, where biometrics are taken and documents scanned if you did not upload them, and every published standard runs from that day. Book the appointment soon after paying if you want the decision early.</p>
${h.table(['Appointment', 'Standard', 'Priority', 'Super priority (outer limit)'], [
    [K.date('2026-10-15'), K.date(oct.expected!), K.date(oct.priority!), K.date(oct.superPriority!)],
    [K.date('2026-12-22'), K.date(dec.expected!), K.date(dec.priority!), K.date(dec.superPriority!)],
  ], `Standard of ${T.ilrMonths} months; priority ${T.priorityWorkingDays} working days; super priority shown at ${T.superPriorityIlrWorkingDays} working days. England and Wales bank holidays.`, ['l', 'r', 'r', 'r'])}
<p>The October appointment is a Thursday: priority lands on the Thursday after, and super priority should arrive by the end of Friday 16 October, with the following Monday as the outer limit the table shows. In December, Christmas Day and the substitute Boxing Day holiday on Monday 28 December are not working days, so the 5-day priority stretches to the last day of the year. The standard date is a calendar date and ignores holidays: six months is six months. Within the standard there is no point chasing: UKVI says it will not give status updates. If the standard date passes without a decision or a message, that is the moment to contact UKVI.</p>
<h2>Files that take longer than six months</h2>
<p>GOV.UK names three reasons a case is classed as complex: supporting documents that need verifying, an interview, and personal circumstances such as a criminal conviction. You will be contacted if this happens. Paying for priority does not take a case out of that category. A file is more likely to be straightforward when the evidence answers the questions before they are asked:</p>
<ul>
<li>a full list of trips abroad that matches the passport stamps and the Home Office's own records;</li>
<li>for Skilled Workers, a sponsor confirmation and payslips that show the same salary;</li>
<li>a Life in the UK reference number that matches the name on your passport;</li>
<li>certified translations for every document not in English or Welsh.</li>
</ul>
<h2>Staying put while you wait</h2>
<p>From the moment you apply until the decision, you must not travel outside the UK, Ireland, the Channel Islands or the Isle of Man. Leaving withdraws the application, and on the long residence route GOV.UK adds that the fee is not refunded. That is the practical cost of a six-month standard: a summer abroad or a family visit has to fit before the application or after the decision. If the decision date clashes with a trip you cannot move, priority or super priority is the way to buy the travel back. The ${h.a('ilr-fee', 'ILR fee page')} prices both for a family.</p>
<h2>Choosing the day you apply</h2>
<p>You cannot apply more than ${S.applyEarlyDays} days before the end of your qualifying period, and you should not let your current visa run out first: if it would expire before you become eligible, extend it. Inside that window, the date of application can matter more than the date of decision. The English requirement that HC 1691 brings in on ${K.date(b2)} applies to applications made on or after that day, whenever they are decided. A Skilled Worker whose five years end on ${K.date(sw.qualifyingEnd)} can apply from ${K.date(sw.earliestApply)}, before the new rule, and will not need a B2 test even if the decision comes in the autumn. Wait a month and the same person needs one. The ${h.a('indefinite-leave-to-remain', 'ILR calculator')} gives your earliest day, and the ${h.a('uk-visa-processing-times', 'processing times page')} compares other routes.</p>`,
  faqs: [
    { q: 'When does the six-month ILR clock start?', a: `On the day of your biometrics appointment at a UKVCAS service point, when fingerprints and a photo are taken, not when you submit the form or pay. If the earliest appointment is weeks away, the expected decision moves with it. Children under 6 do not give biometrics, but they are decided with the rest of the application.` },
    { q: 'Can I travel abroad while my ILR application is pending?', a: `Only to Ireland, the Channel Islands or the Isle of Man. Travel anywhere else withdraws the application, and you would have to start a new one. If you must travel, either apply after the trip, within your current visa, or pay for priority or super priority so the decision comes first.` },
    { q: 'Does super priority guarantee a decision the next day?', a: `No. It aims for the end of the next working day after a weekday appointment, or ${T.superPriorityIlrWorkingDays} working days after a weekend one, but complex cases, for example where documents need verifying or an interview is needed, take longer and you will be told. The fee of ${K.gbp(K.FEE.superPriorityInside())} buys faster handling, not a particular outcome.` },
    { q: 'Is the ILR decision date the one that decides the English rule?', a: `No, the application date does. The B2 requirement added by HC 1691 applies to settlement applications made on or after ${K.date(b2)}. An application made the day before is assessed under the earlier English rule, even if the decision comes months later. The ${S.applyEarlyDays}-day early window can therefore make a difference.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-fee', 'uk-visa-processing-times', 'ilr-requirements', 'british-citizenship-application'],
  sources: ['ilr_sw', 'long_residence', 'times_inside', 'hc_1691', 'bank_holidays'],
});
