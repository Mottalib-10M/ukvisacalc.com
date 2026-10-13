import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.P.citizenship;
const S = K.P.settlement;
const nat = K.FEE.naturalisation(), cer = K.FEE.ceremony();
// GOV.UK example reproduced by the engine: away 10 to 25 June 2017, ILR held 12 months on 20 June 2022.
const gov = K.citizenshipDate('2016-01-04', '2021-06-20', [{ out: '2017-06-10', back: '2017-06-25' }], false);
// A typical case: arrived 3 February 2020, ILR on 10 January 2025, two trips.
const typ = K.citizenshipDate('2020-02-03', '2025-01-10', [{ out: '2021-07-01', back: '2021-07-21' }, { out: '2025-12-20', back: '2026-01-05' }], false);

export default definePage({
  id: 'british-citizenship-application',
  group: 'settlement',
  order: 90,
  nav: 'Citizenship application',
  card: 'Naturalisation after ILR: the 5-year period, 450 and 90 days, the first-day rule, tests, fee and timing.',
  title: 'Citizenship Application UK 2026: Dates, Absences and Fee',
  description: `Citizenship application after ILR: ${C.residenceYears} years, ${C.ilrHeldMonths} months settled, ${C.maxAbsence5y} and ${C.maxAbsence12m}-day absence limits, presence on the first day, tests, character, ${K.gbp(nat + cer)} and ${C.decisionMonths} months.`,
  h1: 'Applying for British citizenship after indefinite leave to remain',
  intro: `With indefinite leave to remain held for ${C.ilrHeldMonths} months and ${C.residenceYears} years in the UK, you can usually apply to naturalise. Absences must stay within ${C.maxAbsence5y} days over the period and ${C.maxAbsence12m} in the last year. Enter your dates to find your first possible day.`,
  resume: `Naturalisation is the application an adult with settled status makes to become a British citizen. On the usual route you need ${C.residenceYears} years living in the UK before the application and ${C.ilrHeldMonths} months holding indefinite leave to remain, settled status under the EU Settlement Scheme or indefinite leave to enter (the ${C.ilrHeldMonths}-month wait does not apply if you are married to a British citizen). You should not have spent more than ${C.maxAbsence5y} days outside the UK in the ${C.residenceYears} years, or more than ${C.maxAbsence12m} in the last 12 months, and you must have been physically in the UK exactly ${C.residenceYears} years before the day the Home Office receives the form. You also need to be over 18, prove English, have passed the Life in the UK test, be of good character and intend to keep living here. The fee is ${K.gbp(nat)} plus ${K.gbp(cer)} for the ceremony, ${K.gbp(nat + cer)} in all, and a decision usually takes ${C.decisionMonths} months. The calculator finds your earliest date from your trips.`,
  tool: { kind: 'citizenship', props: { initialRoute: 'skilled-worker', title: 'Earliest date to apply for citizenship' } },
  body: (h) => `
<h2>Who naturalises this way</h2>
<p>This page covers the main route: an adult who came on a visa, settled, and now wants a British passport. GOV.UK lists other ways in, such as having a British parent, being born in the UK without automatically being British, being stateless, or the Windrush scheme for Commonwealth citizens who arrived before 1973; each has its own conditions. Married to a British citizen? The ${h.a('citizenship-spouse-of-british-citizen', 'spouse route')} has a shorter period and no wait after settlement. EU, EEA and Swiss citizens with settled status follow the same rules as ILR holders, and some with pre-settled status can apply too.</p>
<p>You need permission to stay until you have attended the citizenship ceremony. ILR and settled status count as that permission, but ILR can lapse after ${S.loseIlrAfterYears} years in a row outside the UK, so a long period abroad after settling can take naturalisation off the table until you return with a Returning Resident visa.</p>
<h2>Finding your first possible day</h2>
<p>Four dates compete, and the latest wins: ${C.residenceYears} years after you began living in the UK, ${C.ilrHeldMonths} months after your ILR, the first day on which your absences in the previous ${C.residenceYears} years and 12 months fit the limits, and a day on which you were in the UK exactly ${C.residenceYears} years earlier.</p>
<p>The last test catches people out, and GOV.UK gives an example. An application received on 20 June 2022 fails if you were abroad from 10 to 25 June 2017, because on 20 June 2017 you were not in the UK. The answer is to wait until 24 June 2022. The calculator reproduces it: with ILR held 12 months on ${K.date(gov.ilrPlus12!)} and that trip entered, the earliest date it returns is ${K.date(gov.earliest!)}. The Home Office can consider special circumstances, such as health reasons or travel restrictions that kept you away at the start of the period.</p>
<p>A more typical file: someone who arrived on 3 February 2020, settled on 10 January 2025 and made two trips totalling ${K.int(typ.checks!.absentPeriod)} days in the window. Neither the absence limits nor the first-day rule bites, so the date is set by the 12-month wait: ${K.date(typ.earliest!)}. "Received" means the day the Home Office gets the form: the same day online, later by post.</p>
<h2>What the application asks you to show</h2>
<ul>
<li><strong>Language.</strong> Proof of your knowledge of English, Welsh or Scottish Gaelic.</li>
<li><strong>Life in the UK.</strong> If you passed it for settlement, the same pass counts; you do not sit it again. Otherwise, ${K.gbp(K.FEE.lifeInUk())} per attempt.</li>
<li><strong>Good character.</strong> Assessed under the Home Office naturalisation guidance, which the citizenship page tells you to read before applying. If anything in your past worries you, take advice first.</li>
<li><strong>Immigration compliance.</strong> You should not have broken immigration laws in the period, although GOV.UK says that once you hold ILR the Home Office will not usually look at breaches before it.</li>
<li><strong>Future intention.</strong> You must intend to keep living in the UK.</li>
</ul>
<p>The form asks for every absence in the period. GOV.UK suggests using your own records, emails and boarding passes, and says the Home Office will check its own data and correct any gaps. A careful list avoids questions later. The ${h.a('british-citizenship-requirements', 'requirements page')} goes through each condition, including what happens above the absence limits.</p>
<h2>Fee, decision, ceremony</h2>
<p>You pay ${K.gbp(nat)} for the application and ${K.gbp(cer)} for the ceremony when you apply, ${K.gbp(nat + cer)} in all; biometrics at the UKVCAS appointment are free. A decision usually comes within ${C.decisionMonths} months, and you will be told before then if yours will take longer. Some applicants are invited to an interview, held without an interpreter. Tell UKVI if your situation changes in the meantime: a move, a marriage, an arrest.</p>
<p>Once approved, you attend a citizenship ceremony, the step that completes the process; your permission to stay must last until then. Within 5 working days of receiving your certificate you must return your biometric residence permit, cut into four pieces with a covering note, or you can be fined. You then apply for a British passport. The ${h.a('british-citizenship-cost', 'citizenship cost page')} adds children's registration and the full bill from settlement onward.</p>`,
  faqs: [
    { q: 'How long after ILR can I apply for British citizenship?', a: `Usually ${C.ilrHeldMonths} months after the grant, provided you have also lived in the UK for ${C.residenceYears} years and your absences fit within ${C.maxAbsence5y} days over that period and ${C.maxAbsence12m} in the last year. If you are married to a British citizen there is no ${C.ilrHeldMonths}-month wait. The calculator checks all the dates together and returns the first one that works.` },
    { q: 'Do I need to retake the Life in the UK test for citizenship?', a: `No, if you passed it for your settlement application: the same pass is accepted and you give its reference number on the citizenship form. If you settled without it, for example because you were under 18 or exempt at the time, you need to pass it before applying to naturalise, unless you are 65 or over.` },
    { q: 'What does physically present five years before the application mean?', a: `On the day exactly ${C.residenceYears} years before the Home Office receives your form, you must have been in the UK. If you were abroad that day, the application may be rejected. GOV.UK's example: received on 20 June 2022 after a trip from 10 to 25 June 2017, so the person should have waited until 24 June 2022. Online forms count as received the same day.` },
    { q: 'Do I need valid permission while my citizenship application is pending?', a: `Yes. GOV.UK says you need permission to stay in the UK until you are granted citizenship, and that it must last until you have had your citizenship ceremony. Indefinite leave to remain and settled or pre-settled status count as that permission. ILR does not expire, but it lapses after ${S.loseIlrAfterYears} years in a row outside the UK.` },
    { q: 'How long does a naturalisation decision take?', a: `Usually within ${C.decisionMonths} months of the application, and GOV.UK says you will be told before ${C.decisionMonths} months have passed if yours will take longer. After approval you are invited to a ceremony, so the date you become a citizen comes a little after the decision. GOV.UK mentions you may be able to pay for a faster decision.` },
    { q: 'Does my child become British when I naturalise?', a: `Not automatically, if the child was born before you settled or abroad: you register them separately, for a fee of ${K.gbp(K.FEE.registrationChild())} each. A child born in the UK after you got indefinite leave to remain may already be a British citizen and can apply straight for a passport. Check the child's position before paying for registration.` },
  ],
  related: ['british-citizenship-requirements', 'british-citizenship-cost', 'indefinite-leave-to-remain', 'citizenship-spouse-of-british-citizen', 'ilr-absence-calculator', 'ilr-processing-time'],
  sources: ['citizenship', 'life_in_uk', 'fees_table', 'citizenship_spouse', 'ilr'],
});
