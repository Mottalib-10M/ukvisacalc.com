import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.family, T = K.P.processing;
const appt = '2026-11-02';
const abroad = K.decisionDate('partner', 'outside', appt);
const here = K.decisionDate('partner', 'inside', appt);
const ilrT = K.decisionDate('ilr', 'inside', appt);
const noReq = K.addMonths(appt, F.decisionWeeks.insideNoRequirementsMonths);

export default definePage({
  id: 'spouse-visa-processing-time',
  group: 'family',
  order: 70,
  nav: 'Processing time',
  card: 'Published decision times for partner visas abroad and in the UK, and what speeds them up.',
  title: 'Spouse Visa Processing Time 2026: Weeks Abroad and in UK',
  description: `Spouse visa processing time: ${F.decisionWeeks.outside} weeks from abroad, ${F.decisionWeeks.inside} weeks in the UK when you meet the rules, about ${F.decisionWeeks.insideNoRequirementsMonths} months if not, and the ${K.gbp(K.FEE.superPriorityInside())} super priority option.`,
  h1: 'How long a spouse visa decision takes',
  intro: `UKVI aims to decide partner visas within ${F.decisionWeeks.outside} weeks from abroad and ${F.decisionWeeks.inside} weeks inside the UK, counted from your biometrics appointment. Enter that date to get your expected decision day.`,
  resume: `Partner and spouse applications are measured against service standards that UKVI publishes and updates; the tables read on ${K.date(T.updated)} give ${F.decisionWeeks.outside} weeks for applications made outside the UK and ${F.decisionWeeks.inside} weeks for those made inside it, provided the applicant meets the minimum income and English language requirements. In-country partner cases that rely on the private life exceptions, without meeting those requirements, take about ${F.decisionWeeks.insideNoRequirementsMonths} months and have no service standard. The clock starts when you prove your identity, either at a visa application centre or UKVCAS appointment or through the ID Check app, not when you pay. Weeks are counted in UK working weeks, which include UK public holidays but not holidays abroad. Inside the UK, super priority costs ${K.gbp(K.FEE.superPriorityInside())} and normally brings a decision within about one working day of the appointment. Settlement applications that follow, five years later, take up to ${T.ilrMonths} months.`,
  tool: { kind: 'time', props: { initialRoute: 'partner', initialWhere: 'outside', title: 'Spouse visa decision date from your appointment' } },
  body: (h) => `
<h2>Three standards, depending on where and how you apply</h2>
<p>The Home Office does not promise a date. It publishes how long most applications of each type take once they are complete, and contacts you within that time if yours will run longer. For partners there are three published figures, taken from the GOV.UK tables updated on ${K.date(T.updated)}.</p>
${h.table(['Application', 'Published time', 'Appointment on ' + K.date(appt), 'Source'], [
    ['Partner or spouse, from outside the UK', `${F.decisionWeeks.outside} weeks`, K.date(abroad.expected!), h.src('times_outside', 'outside the UK')],
    ['Partner or spouse in the UK, income and English met', `${F.decisionWeeks.inside} weeks`, K.date(here.expected!), h.src('times_inside', 'inside the UK')],
    ['Partner or spouse in the UK, private life exceptions', `about ${F.decisionWeeks.insideNoRequirementsMonths} months, no standard`, K.date(noReq), h.src('times_inside', 'inside the UK')],
    ['Indefinite leave to remain as a partner', `${T.ilrMonths} months`, K.date(ilrT.expected!), h.src('ilr_family', 'ILR, family')],
  ], 'Expected dates computed by the decision-date engine from a biometrics appointment on a Monday.', ['l', 'l', 'r', 'l'])}
<p>The first two figures apply to fiancé applications, to children applying with a parent and to extensions. The third is the waiting time for couples who cannot meet the financial requirement or the English test and ask to stay under paragraph EX.1 of Appendix FM, for example because of a British child. Parents applying in the UK on the parent route wait the same ${F.decisionWeeks.insideNoRequirementsMonths} months or so.</p>
<h2>When the clock starts and what stops it</h2>
<p>Paying the fee and submitting the form does not start the count. UKVI starts when your identity has been verified: at a visa application centre abroad, at a UKVCAS service point in the UK, or through the UK Immigration: ID Check app if you are told you can use it. GOV.UK warns that the visa application centre may be in another country, so the real wait from submission includes the time to get an appointment and travel to it.</p>
<p>GOV.UK lists the usual reasons a case falls outside the standard: information that does not match, documents that need verifying, a request for further evidence such as proof of funds, an interview, a criminal record, very high demand or a technical outage. If the standard has passed and nobody has contacted you, you can then contact UKVI; before that, enquiries are not answered.</p>
${h.box('Do not book travel before the decision', '<p>UKVI says plainly not to book flights until you have a decision, will not reimburse travel if a decision is late or negative, and refunds the application fee only if processing has not started.</p>')}
<h2>Buying a faster decision</h2>
<p>Inside the UK, super priority costs ${K.gbp(K.FEE.superPriorityInside())} on top of the fee and surcharge; the calculator above places the decision ${T.superPriorityWorkingDays} working day after a weekday appointment, as GOV.UK describes for in-country super priority. It is available on extensions and switches and on the later settlement application, but not to adult dependent relatives.</p>
<p>Outside the UK, the Home Office fee table lists a priority service for settlement-type visas at ${K.gbp(K.FEE.prioritySettlementOutside())} and super priority at ${K.gbp(K.FEE.superPriorityOutside())}. Whether you can buy them depends on the visa application centre; where a centre offers neither, ${F.decisionWeeks.outside} weeks is the realistic minimum. Paying for speed does not change the requirements, and UKVI warns that a complex case can still take longer, for example when documents need verifying.</p>
<p>Plan around the end of your current permission rather than the standard alone. Applying in the UK before your visa expires lets you stay lawfully until the decision, so a late decision does not leave you without status. The ${h.a('spouse-visa-extension', 'extension page')} explains when to apply, and the ${h.a('uk-visa-processing-times', 'processing times for every route')} compare partner visas with work and study routes.</p>`,
  faqs: [
    { q: 'Is the 12-week spouse visa standard counted in calendar weeks?', a: 'Effectively yes. UKVI counts UK working weeks, Monday to Friday, and includes UK bank holidays in them, so 12 working weeks equal 12 calendar weeks from the appointment. Public holidays in your own country are not counted or added. The calculator above adds the weeks to your appointment date and shows the first day on which you can contact UKVI about a late decision.' },
    { q: 'Do I get my passport back while the spouse visa is processed?', a: 'Usually on the same day. You take your passport to the biometrics appointment and it is normally returned before you leave. If the visa application centre keeps it, or other original documents, you can ask for them back urgently, but you may have to cancel the application to get them. If you left your passport at the centre, do not return there until you are contacted.' },
    { q: 'Why is my in-country partner application taking 12 months?', a: `Because it is being handled as a private life or exceptions case, where you did not meet the income or English requirements and asked to stay under paragraph EX.1 or on human rights grounds. UKVI has no service standard for these and currently quotes about ${F.decisionWeeks.insideNoRequirementsMonths} months. Applications that meet both requirements are aimed at ${F.decisionWeeks.inside} weeks instead.` },
  ],
  related: ['spouse-visa-uk', 'spouse-visa-extension', 'uk-visa-processing-times', 'spouse-visa-uk-cost', 'ilr-processing-time'],
  sources: ['times_outside', 'times_inside', 'family_visa', 'fees_table'],
});
