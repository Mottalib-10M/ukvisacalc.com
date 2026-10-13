import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.processing;
const S = K.P.skilledWorker;
const F = K.FEE;
const wOut = T.outside['skilled-worker'], wIn = T.inside['skilled-worker'];
const abroad = K.decisionDate('skilled-worker', 'outside', '2026-11-02');
const inUk = K.decisionDate('skilled-worker', 'inside', '2026-12-14');

export default definePage({
  id: 'skilled-worker-visa-processing-time',
  group: 'work',
  order: 70,
  nav: 'Processing time',
  card: `${wOut} weeks from abroad, ${wIn} weeks in the UK, faster services and what slows a decision.`,
  title: `Skilled Worker Visa Processing Time: ${wOut} or ${wIn} Weeks in 2026`,
  description: `Skilled Worker visa processing time: ${wOut} weeks from outside the UK, ${wIn} weeks inside, when the clock starts, priority and super priority fees, and what slows it.`,
  h1: 'Skilled Worker visa processing time and your decision date',
  intro: `UKVI aims to decide a Skilled Worker application in ${wOut} weeks from abroad and ${wIn} weeks from inside the UK, counted from your identity check. Enter that date to get yours.`,
  resume: `Processing time for a Skilled Worker visa is a service standard, not a promise. UKVI's tables updated on ${K.date(T.updated)} give ${wOut} weeks for applications from outside the UK and ${wIn} weeks for extensions, switches and changes of employer made inside it. The clock does not start when you pay: it starts once you have proved your identity, either by scanning your passport with the UK Immigration: ID Check app or by giving fingerprints and a photo at a visa application centre or UKVCAS service point. Weeks are UK working weeks and include UK public holidays. Where the service is offered you can pay for a faster decision, ${K.gbp(F.priorityOutside())} for priority or ${K.gbp(F.superPriorityOutside())} for super priority from abroad, aimed at ${T.priorityWorkingDays} working days and ${T.superPriorityWorkingDays} working day respectively. Cases that need document checks, an interview or a closer look at a criminal record can take longer. The date tool above turns your appointment date into an expected decision date.`,
  tool: { kind: 'time', props: { initialRoute: 'skilled-worker', initialWhere: 'outside', title: 'Expected decision date for your application' } },
  body: (h) => `
<h2>When the clock starts and stops</h2>
<p>Your application is "made" when you submit and pay online, but UKVI starts counting only after your identity step. With the ID Check app that is the day you scan your document and upload your evidence; otherwise it is your appointment at a visa application centre abroad or a UKVCAS or Service and Support Centre in the UK. GOV.UK warns that you may need to allow extra time when an appointment is required, since the standard only begins once it has taken place, and the nearest centre can be in another country.</p>
<p>The clock stops when the decision letter or email is sent. A worked example from this site's date engine: an applicant abroad who gives biometrics on ${K.date('2026-11-02')} can expect a decision by ${K.date(abroad.expected!)}. A worker extending in the UK who completes the identity step on ${K.date('2026-12-14')} has a standard date of ${K.date(inUk.expected!)}, because the Christmas bank holidays sit inside the ${wIn} weeks rather than being added to them.</p>
${h.table(['Where you apply', 'Standard', 'Priority', 'Super priority'], [
    ['Outside the UK', `${wOut} weeks`, `${K.gbp(F.priorityOutside())}, about ${T.priorityWorkingDays} working days`, `${K.gbp(F.superPriorityOutside())}, about ${T.superPriorityWorkingDays} working day`],
    ['Inside the UK (extend, switch, update)', `${wIn} weeks`, `${K.gbp(F.priorityInside())}, about ${T.priorityWorkingDays} working days`, `${K.gbp(F.superPriorityInside())}, about ${T.superPriorityWorkingDays} working day`],
  ], `UKVI processing times updated ${K.date(T.updated)}; priority fees from the Home Office fee table of ${K.date(K.FEE_DATE)}. Faster services are not always offered; you are told when you apply.`, ['l', 'l', 'l', 'l'])}
<h2>What makes a Skilled Worker case take longer</h2>
<p>UKVI lists the usual reasons a decision runs past the standard:</p>
<ul>
<li>information in the application is inaccurate or needs further consideration;</li>
<li>more evidence is needed, for example of your savings;</li>
<li>supporting documents have to be verified with the issuer;</li>
<li>you are asked to attend an interview;</li>
<li>your personal circumstances need a closer look, for example a criminal conviction;</li>
<li>demand is unusually high, or a technical outage hits the visa systems.</li>
</ul>
<p>Skilled Worker cases have a further layer: under SW 6.3 the caseworker may weigh whether the sponsor has shown a genuine need for the job, whether you have the skills it describes and the sponsor's record of paying sponsored workers, and may ask the sponsor for more information. If a case runs past the standard and nobody has contacted you, UKVI asks you to get in touch; within the standard, it says contacting it will not tell you anything new.</p>
<h2>Planning around the wait</h2>
<p>From abroad you can apply up to ${S.applyBeforeStartMonths} months before the start date on your certificate, and you must apply within ${S.cosApplyWithinMonths} months of receiving it. Applying early is the cheapest way to make the standard fit. Do not book travel before the decision: UKVI does not repay travel costs if a case is refused or slow.</p>
<p>Inside the UK, apply before your current permission expires. While the application is pending you must not travel outside the UK, Ireland, the Channel Islands or the Isle of Man, or it will be treated as withdrawn. If you are changing employer you can keep working in your current job, or work out your notice, while UKVI decides, but you should not start the new job until the new permission is confirmed. Partners and children usually get the same standard, ${wOut} weeks from abroad or ${wIn} in the UK. Employers waiting for a licence face a separate timetable of about ${K.P.sponsor.decisionWeeks} weeks, explained on the ${h.a('sponsor-licence', 'sponsor licence page')}; costs are on the ${h.a('skilled-worker-visa-cost', 'Skilled Worker cost page')}. The figures come from ${h.src('times_outside', 'UKVI processing times outside the UK')} and ${h.src('times_inside', 'inside the UK')}.</p>`,
  faqs: [
    { q: 'Does the Skilled Worker processing time include weekends?', a: `The standard is counted in UK working weeks, Monday to Friday, and UK public holidays fall inside it rather than being added on. In practice a standard of ${wOut} weeks ends ${wOut} calendar weeks after your identity check. Public holidays in the country where you applied are not taken into account.` },
    { q: 'Can I pay for a faster Skilled Worker decision from inside the UK?', a: `Sometimes. A faster service is not always available, and you are told when you apply whether it is offered to you. Inside the UK priority costs ${K.gbp(F.priorityInside())} with a target of about ${T.priorityWorkingDays} working days, and super priority costs ${K.gbp(F.superPriorityInside())} with a target of about ${T.superPriorityWorkingDays} working day, both on top of the normal fee and surcharge.` },
    { q: 'Can I start working for my new employer while I wait?', a: 'No. When you change employer you apply to update your visa, and GOV.UK says you should not start the new job until the new permission is confirmed. You can carry on in your current sponsored job, or work out your notice period, while the application is pending, provided you applied before your current visa expired.' },
    { q: 'What happens if my decision takes longer than the standard?', a: 'UKVI says it will contact you within the standard if your case needs more time, for example to verify documents or arrange an interview. If the standard passes with no contact at all, you can contact UKVI about the application. A delay does not refund any travel you booked, which is why it advises against booking before a decision.' },
  ],
  related: ['uk-visa-processing-times', 'skilled-worker-visa-cost', 'skilled-worker-visa-requirements', 'skilled-worker-visa', 'sponsor-licence', 'graduate-to-skilled-worker'],
  sources: ['times_outside', 'times_inside', 'sw_visa', 'fees_table'],
});
