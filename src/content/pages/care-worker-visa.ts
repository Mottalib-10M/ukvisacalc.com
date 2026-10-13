import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const care = K.occ('6135');
const senior = K.occ('6136');
const until = K.date(S.careSwitchUntil);
const cut = K.date(S.mediumSkilledCutoff);
const switchCost = K.visaCost({ route: 'health-and-care', where: 'inside', months: 36, partner: false, children: 0 });

export default definePage({
  id: 'care-worker-visa',
  group: 'work',
  order: 150,
  nav: 'Care worker visa',
  card: 'Overseas recruitment of care workers has closed; the in-country switch stays open until July 2028.',
  title: 'Care Worker Visa 2026: Who Can Still Switch Before 2028',
  description: `Care worker visa rules since ${cut}: no new recruits from abroad, a switch inside the country after three months with the sponsor until ${until}.`,
  h1: 'Care worker visa: the switch that stays open until 2028',
  intro: `Since ${cut}, codes 6135 and 6136 cannot be sponsored from abroad. You can still switch inside the country after three months working for the sponsor, if you apply before ${until}.`,
  resume: `A care worker or senior care worker (occupation codes 6135 and 6136) can no longer get a first visa from outside the country: rule SW 6.1B of Appendix Skilled Worker, in force since ${cut}, accepts these codes only in an application for permission to stay. Two groups still qualify. The first is anyone already sponsored as a Skilled Worker in one of these codes, who can extend or move to another sponsor. The second is someone in the country on another visa who has worked legally for the new sponsor in the care job for at least three months before the certificate of sponsorship is issued, and who applies before ${until}. The job is on the Immigration Salary List until that same date, the employer in England must be registered with the Care Quality Commission, and the application goes through the Health and Care Worker visa, at ${K.gbp(K.FEE.healthCare('inside', 3))} for up to three years with no health surcharge. Partners and children are restricted.`,
  tool: { kind: 'sw', props: { initialCode: '6135', initialSalary: 26000, title: 'Care worker code check (choose "Inside UK")' } },
  body: (h) => `
<h2>What closed on ${cut}</h2>
<p>The checker above opens on code ${care.code}, ${care.title.toLowerCase()}. Left on "Outside UK", it returns a refusal on the code itself, because SW 6.1B makes these two occupations available only to people applying from inside the country. Switch the toggle to "Inside UK" and the salary test appears. The same rule covers ${senior.code}, ${senior.title.toLowerCase()}, whose example titles include ${K.listOf(senior.examples.slice(0, 3).map((e) => e.toLowerCase()))}. A job abroad advertised as "care worker visa sponsorship" therefore cannot lead to a visa in these codes, whatever the recruiter says.</p>
<p>Nothing changed for people already on the route. Someone holding Skilled Worker permission in 6135 or 6136 (or the old SOC 2010 codes 6145 and 6146) keeps access to these codes for every later extension or change of employer, and is not caught by the ${until} deadline.</p>
<h2>The three-month switch, step by step</h2>
<p>The in-country route is narrow. You must already have permission to be here on a visa that allows switching: visitors, short-term students, seasonal workers, domestic workers in a private household and people on immigration bail cannot switch and would have to leave. You must then work legally for the employer that will sponsor you, in a care role, for at least the three months that end on the day it issues your certificate of sponsorship. Part-time care work done under another visa can count, provided that visa allowed it. The application itself must be dated before ${until}: from that day, SW 6.1B(a)(ii) is no longer met.</p>
<p>A switch costs ${K.gbp(switchCost.total)} for up to three years on the Health and Care Worker visa, with nothing added for the health surcharge, and UKVI aims to decide in ${K.P.healthAndCare.decisionWeeks.inside} weeks. The ${h.a('health-and-care-worker-visa', 'Health and Care Worker visa page')} covers the rest of the route.</p>
<h2>The sponsor: CQC registration and no private households</h2>
<p>For a job based in England, the employer must be registered with the Care Quality Commission and currently carrying on a regulated activity; a licence alone is not enough. Private households and individuals cannot sponsor, except a sole trader sponsoring someone for the business. One exception protects long-serving staff: a worker first sponsored in the old care codes before 11 March 2024, continuously since, and staying with the same sponsor is not subject to the CQC condition (SW 6.1C). Before accepting an offer, look the company up on the ${h.a('register-of-licensed-sponsors', 'register of licensed sponsors')} and on the CQC register.</p>
<h2>Pay and family</h2>
<p>Both codes sit on the Immigration Salary List until ${care.isl!.until}. Under the general table that means at least ${K.gbp(S.isl.floor)}, as the checker shows. A care job can, however, count as a "Health and Care ASHE salary job" in the sense of SW A1.1, for example when the care is provided under CQC registration in England or by a registered care service in Scotland or Wales, and those jobs may use options F to J: on the salary list that is ${K.gbp(S.transitional.isl)} or the lower going rate of ${K.gbp(care.goingRateTransitional!)}, whichever is higher. Ask the sponsor which option it relies on before the certificate is assigned.</p>
<p>Family is the hardest part. A care worker can sponsor a partner or children only if continuously employed in care on a Skilled Worker or Health and Care Worker visa since before 11 March 2024, or for a child born in the country, or as the only living parent responsible for the child, or when the other parent is also a sponsored care worker. A family switching alongside you cannot take dependant status from your care visa; they keep their own visas until those end. The ${h.a('skilled-worker-dependants', 'dependants page')} sets out the general rules.</p>`,
  faqs: [
    { q: 'Can I still apply for a care worker visa from abroad?', a: `No. Since ${cut} codes 6135 and 6136 are accepted only in applications made inside the country, by people already sponsored in these codes or switching after three months with the sponsor. Senior roles in nursing or therapy remain open from abroad through the Health and Care Worker visa if you hold the qualification.` },
    { q: 'Does the three months have to be with the same employer that sponsors me?', a: 'Yes. Rule SW 6.1B(a) requires at least three months of legal work for the sponsor itself, in one of the two care codes, ending on the date that sponsor issues the certificate of sponsorship. Care work for a different employer, including shifts placed through an agency, does not count towards them.' },
    { q: `What happens to care workers after ${until}?`, a: `Workers who already hold Skilled Worker permission in 6135 or 6136 by then can keep extending and changing sponsor under SW 6.1B(b). Only new switches from other visas end on that date. The Immigration Salary List entry for both codes also runs until ${until}; any later change would need a new Statement of Changes.` },
    { q: 'Can a care worker bring a spouse after switching?', a: 'Usually not. Dependants are allowed only if you have been continuously employed in care on a Skilled Worker or Health and Care Worker visa since before 11 March 2024, or in a few listed situations such as a child born in the country. A partner who is already here on their own visa can keep it.' },
  ],
  related: ['health-and-care-worker-visa', 'immigration-salary-list', 'register-of-licensed-sponsors', 'skilled-worker-dependants', 'skilled-worker-visa'],
  sources: ['appendix_sw', 'hcw_visa', 'appendix_isl', 'appendix_aso', 'fees_table'],
});
