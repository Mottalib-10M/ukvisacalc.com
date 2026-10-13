import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
const W = K.P.skilledWorker;
const b2 = K.date(S.englishB2SettlementFrom);
const cut = K.date(S.longResidenceLegacy.cutoff);
// A Global Talent holder endorsed under exceptional talent, arrived 6 February 2024, two short trips.
const gt = K.settlementDate('global-talent-3', '2024-02-06', [{ out: '2024-12-20', back: '2025-01-04' }, { out: '2025-08-02', back: '2025-08-24' }]);

export default definePage({
  id: 'ilr-requirements',
  group: 'settlement',
  order: 30,
  nav: 'ILR requirements',
  card: 'The checklist route by route: time, absences, tests, salary and the documents to send.',
  title: 'ILR Requirements 2026: Checklist by Route and Evidence',
  description: `ILR requirements route by route: qualifying period, unbroken residence, Life in the UK, English, Skilled Worker salary, time that does not count and documents.`,
  h1: 'Requirements for indefinite leave to remain, route by route',
  intro: `Every settlement application passes the same five gates: suitability, a qualifying period, unbroken residence, Life in the UK and, depending on the route and date, English. Then each route adds its own condition. Check your dates first with the calculator.`,
  resume: `Indefinite leave to remain has a shared core and route-specific extras. The core: you must not fall for refusal under Part Suitability; you must have completed the qualifying period of your route (${S.skilledWorkerYears} years for most, ${S.globalTalentFastYears} on the fast Global Talent path, ${S.longResidenceYears} for long residence) with permission throughout; you must have stayed within ${S.maxAbsenceDays} days abroad in any 12 months; and, aged 18 to 64, you must pass the Life in the UK test. English depends on the route until ${b2}, when B2 becomes the standard on most of them. On top of that, a Skilled Worker needs a sponsor still licensed and a salary at the settlement threshold, a Global Talent holder needs earnings in their field, a UK Ancestry holder must still be able and willing to work, and a long residence applicant must usually have held the current permission for 12 months. Time as a dependant or as a fiancé does not count where the rules exclude it.`,
  tool: { kind: 'ilr', props: { initialRoute: 'global-talent-3', title: 'Qualifying date for your route and trips' } },
  body: (h) => `
<h2>The extra condition each route adds</h2>
${h.table(['Route', 'Period', 'Route-specific condition', 'English at settlement'], [
    ['Skilled Worker', `${S.skilledWorkerYears} years`, `sponsor licensed on the decision date; still needed; salary of ${K.gbp(W.general)} and the going rate (lower rows for some)`, `none before ${b2}, then B2`],
    ['Global Talent', `${S.globalTalentFastYears} or ${S.globalTalentYears} years`, 'money earned in the endorsed or prize field; endorsement not withdrawn', 'yes; B2 from ' + b2],
    ['UK Ancestry', `${S.ancestryYears} years`, 'Commonwealth citizen, able to work and intending to, no recourse to public funds', 'yes; B2 from ' + b2],
    ['Long residence', `${S.longResidenceYears} years`, `current permission held 12 months if granted on or after ${cut}`, 'B1 before ' + b2 + ', then B2'],
  ], 'Main conditions of settlement in the route appendices (SW 21 to 24, GT 10 to 14, UKA 10 to 16, LR 9 to 14). Partner routes are covered on their own page.', ['l', 'l', 'l', 'l'])}
<p>For Skilled Workers the salary test is not a formality. SW 24.3 sets rows by situation: ${K.gbp(W.general)} and the going rate in the usual case, ${K.gbp(W.isl.floor)} if your latest job was on the Immigration Salary List, ${K.gbp(W.transitional.general)} with the lower going rate if your first certificate of sponsorship came before ${K.date(W.transitional.cutoff)}, and ${K.gbp(W.healthEducation.floor)} with the pay-scale rate for listed health and education roles. The sponsor must confirm both the job and the pay "for the foreseeable future", so a planned move to a lower salary can sink the application.</p>
<p>On the fast Global Talent path, endorsement by the Royal Society, British Academy, Royal Academy of Engineering or UKRI, exceptional talent with Arts Council England or Tech Nation, or a listed prize gives settlement after ${S.globalTalentFastYears} years (GT 11.1). Someone endorsed in early February 2024 with two short trips could apply from ${K.date(gt.earliestApply)}, as the calculator shows. Exceptional promise endorsements take ${S.globalTalentYears} years.</p>
<h2>Time that does not count</h2>
<p>Most refusals on the qualifying period come from time the applicant assumed would count. The rules exclude, among others:</p>
<ul>
<li><strong>Dependant time, for a main applicant.</strong> A Skilled Worker cannot count years spent in the UK as someone else's partner or child; SW 21.2 requires permission "not as a dependant". The same wording sits in GT 11.3.</li>
<li><strong>Student and Graduate time on the work routes.</strong> They are not in the list of routes that combine with Skilled Worker time. They do count towards long residence.</li>
<li><strong>Fiancé(e) time.</strong> On the family routes, months spent as a fiancé, fiancée or proposed civil partner are left out of the five years.</li>
<li><strong>Visitor, short-term study, Seasonal Worker and Ukraine scheme permission</strong>, for long residence (LR 11.1).</li>
<li><strong>Immigration bail, temporary admission, prison and overstaying gaps</strong>, which never count and may break continuous residence altogether (CR 2.1 and CR 4.1).</li>
</ul>
<p>Absences are their own test: no more than ${S.maxAbsenceDays} whole days outside the UK in any rolling 12 months, with exceptions for documented emergencies. The ${h.a('ilr-absence-calculator', 'absence calculator')} tests every window.</p>
<h2>Evidence to have ready</h2>
<p>The online form tells you which documents to upload, and you can have them scanned at the UKVCAS appointment instead. Expect to provide:</p>
<ul>
<li>your current passport and every passport you held during the qualifying period, which is how travel dates are checked;</li>
<li>your biometric residence permit, even expired, or a share code from your eVisa;</li>
<li>the Life in the UK unique reference number, or the older test reference ID for tests before 17 December 2019;</li>
<li>for Skilled Workers, the sponsor's confirmation that you are still needed and of your salary, with payslips that match it;</li>
<li>for children over 16 on the form, proof of where they live (bank statement, NHS registration, a letter from their school) no more than a month old, and three months of bank statements if they live away from home;</li>
<li>certified translations of anything not in English or Welsh.</li>
</ul>
<p>Keep your own list of trips with dates before you start: the form asks for every absence, and gaps in your records are what slow a file down. The ${h.a('indefinite-leave-to-remain', 'ILR overview')} sets out the timing, and the ${h.a('ilr-fee', 'fee page')} what each person pays.</p>`,
  faqs: [
    { q: 'Can time as my partner’s dependant count towards my own Skilled Worker ILR?', a: `No. SW 21.2 counts only time with permission on the listed routes "not as a dependant". If you spent two years as a dependant and then switched to your own Skilled Worker visa, your five years start from the switch. Your partner's ILR application, if you settle with them as a dependant, is the other way to settle earlier.` },
    { q: 'Does my employer have to support my ILR application?', a: `Yes, on the Skilled Worker route. The sponsor named in your latest permission must still hold its licence on the decision date and must confirm that it still needs you and will keep paying at least the settlement salary. If you changed employer, it is the new sponsor that confirms, so a job change shortly before applying needs care.` },
    { q: 'Which ILR applicants need an English test before March 2027?', a: `Those on routes that already ask for English at settlement, such as long residence (B1 in speaking and listening), UK Ancestry and Global Talent, unless exempt (aged 65 or over, for instance) or able to rely on a degree taught in English or the nationality of a majority English-speaking country. Skilled Workers applying before ${b2} need nothing more than what they proved for the visa. From that date B2 is required on most routes.` },
    { q: 'What if I cannot document why I was abroad for a long time?', a: `Then the Home Office will normally count the whole absence. Excluded reasons under CR 3.4, such as a serious illness in the family, need evidence: letters, medical certificates, proof of travel disruption. Without it, an absence that takes a 12-month window over ${S.maxAbsenceDays} days breaks continuous residence. Take advice before applying if this is your situation.` },
  ],
  related: ['indefinite-leave-to-remain', 'ilr-absence-calculator', 'long-residence-ilr', 'ilr-fee', 'ilr-after-spouse-visa', 'skilled-worker-visa-salary-threshold'],
  sources: ['ilr_sw', 'appendix_sw', 'appendix_gt', 'continuous_residence', 'long_residence', 'ilr_family', 'life_in_uk', 'hc_1691'],
});
