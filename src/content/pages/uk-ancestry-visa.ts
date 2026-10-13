import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = K.P.settlement;
const first = K.FEE.ancestry(), ext = K.FEE.leaveToRemainOther();
const fam = K.visaCost({ route: 'ancestry', where: 'outside', months: 60, partner: true, children: 1 });
const solo = K.visaCost({ route: 'ancestry', where: 'outside', months: 60, partner: false, children: 0 });
const renew = K.visaCost({ route: 'ancestry', where: 'inside', months: 60, partner: false, children: 0 });
const APPENDIX = 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-uk-ancestry';

export default definePage({
  id: 'uk-ancestry-visa',
  group: 'work',
  order: 180,
  nav: 'UK Ancestry visa',
  card: 'Five years to live and work for Commonwealth citizens with a grandparent born in the UK, then extension or settlement.',
  title: 'Ancestry Visa 2026: Grandparent Rule, Fees and Settlement',
  description: `UK Ancestry visa for Commonwealth citizens with a grandparent born in the UK: ${K.gbp(first)} from abroad, ${K.gbp(ext)} to extend, 5 years per grant, ILR after 5 years.`,
  h1: 'UK Ancestry visa: the grandparent rule, cost and settlement',
  intro: `A Commonwealth citizen aged 17 or over with a grandparent born in the UK, the Channel Islands or the Isle of Man can come for ${ST.ancestryYears} years to work. The visa costs ${K.gbp(first)}, plus the surcharge.`,
  resume: `The UK Ancestry visa lets a Commonwealth citizen aged 17 or over live and work in the country for ${ST.ancestryYears} years if one grandparent was born in the UK, the Channel Islands or the Isle of Man, or in what is now Ireland before 31 March 1922. There is no sponsor, no salary threshold and no English test at entry: you must be able and intend to work, and support and house yourself and any family without public funds. The first visa costs ${K.gbp(first)} from abroad, and you cannot switch into the route from another visa. The immigration health surcharge of ${K.gbp(K.P.ihs.standard)} a year is added for each adult, so one person pays ${K.gbp(solo.total)} for five years. A further ${ST.ancestryYears}-year grant costs ${K.gbp(ext)} from inside the country, but after ${ST.ancestryYears} continuous years most holders can apply for indefinite leave to remain instead, with the Life in the UK test and English at B1, or B2 from 26 March 2027.`,
  tool: { kind: 'cost', props: { initialRoute: 'ancestry', initialMonths: 60, initialPartner: true, initialChildren: 1, title: 'UK Ancestry visa cost, five years' } },
  body: (h) => `
<h2>The grandparent: where and how they were born</h2>
<p>The claim rests on one grandparent, on either side of the family. Rule UKA 4.1 of ${h.ext(APPENDIX, 'Appendix UK Ancestry')} asks only that they were born in the UK or the Islands; GOV.UK adds two other places of birth that count: what is now the Republic of Ireland before 31 March 1922, and a ship or aircraft registered in the UK or belonging to the UK government. Adoption counts (yours or your parent's), and so does descent through parents or grandparents who were not married. Descent through a step-parent does not.</p>
<p>The evidence is a chain of full birth certificates: yours, the parent's through whom you claim, and the grandparent's. Where a surname changed, add the marriage or civil partnership certificate or deed poll that links the names, and adoption papers if relevant. Every link has to be documented, so obtain any missing certificate before you start the form.</p>
<h2>Who else meets the conditions</h2>
<p>GOV.UK lists five groups who can apply: Commonwealth citizens, British overseas citizens, British overseas territories citizens, British nationals (overseas) and citizens of Zimbabwe. You must be at least 17 on the date you intend to arrive. Two further tests apply. The work test asks that you are able to work and intend to seek and take a job; a job offer helps but is not required, and self-employment counts, so a business plan is acceptable evidence. The money test asks that you can maintain and house yourself and any dependants without public funds; bank statements must be dated within 31 days of the application, and a credible promise of support from a relative or friend can be taken into account under UKA 5.3.</p>
<h2>Five years, then a choice</h2>
<p>Each grant lasts ${ST.ancestryYears} years. During it you can work in any job, paid or voluntary, employed or self-employed, full or part time, and study. A partner and children can join you; they apply separately and pay ${K.gbp(first)} each, and a child is surcharged at the reduced ${K.gbp(K.P.ihs.reduced)} a year. A couple with one child applying together for five years pays ${K.gbp(fam.fees)} in fees and ${K.gbp(fam.ihsTotal)} in surcharge, ${K.gbp(fam.total)} in total.</p>
<p>At the end of the five years there are two paths. An extension costs ${K.gbp(ext)} and another five years of surcharge, ${K.gbp(renew.total)} for one person, and can be repeated as often as you like. Settlement under UKA 13 to 16 needs ${ST.ancestryYears} years on the route, continuous residence (no more than ${ST.maxAbsenceDays} days outside the country in any 12 months), the same work and money tests, Commonwealth citizenship on the date you apply, English at B1 for an application before 26 March 2027 and B2 from that date, and the Life in the UK test if you are 18 to 64. You may apply up to ${ST.applyEarlyDays} days early; the fee is ${K.gbp(K.FEE.ilr())} per person. The ${h.a('ilr-absence-calculator', 'absence calculator')} checks your trips against the 180-day rule before you pay.</p>`,
  faqs: [
    { q: 'Can I get a UK Ancestry visa through my great-grandparent?', a: 'No. The rules require a grandparent born in the UK or the Islands (or one of the other listed places), so a great-grandparent does not qualify you directly. For other family links, such as a parent who may hold British citizenship by descent, a solicitor or an adviser registered with the Immigration Advice Authority can check whether another route fits.' },
    { q: 'Do I need a job offer before applying for a UK Ancestry visa?', a: 'No. You must show that you are able to work and intend to look for and take employment, which offers, applications, a business plan for self-employment or a CV with a realistic plan can support. Once here you can do any job, at any salary, for any employer, with no sponsor involved.' },
    { q: 'Can I switch to the UK Ancestry visa from inside the country?', a: `No. The first Ancestry visa must be obtained from abroad before travel; an in-country application on this route is only possible as an extension of an existing Ancestry grant, at ${K.gbp(ext)}. Someone already here on a different visa would need to leave and apply from outside.` },
    { q: 'Is the Ancestry visa time enough for British citizenship?', a: `Not by itself. Settlement comes first, after five years on the route, and naturalisation then normally requires a further ${K.P.citizenship.ilrHeldMonths} months holding indefinite leave to remain, ${K.P.citizenship.residenceYears} years of residence and no more than ${K.P.citizenship.maxAbsence5y} days abroad in that period. The citizenship calculator dates both steps from your arrival.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-absence-calculator', 'british-citizenship-application', 'immigration-health-surcharge', 'skilled-worker-visa'],
  sources: ['ancestry_visa', 'fees_table', 'ihs', 'continuous_residence', 'hc_1691'],
});
