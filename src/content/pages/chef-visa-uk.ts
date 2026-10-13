import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const o = K.occ('5434');
const cut = K.date(S.mediumSkilledCutoff);
const chk = (extra: { transitional?: boolean; mediumBefore2025?: boolean }) =>
  K.checkSkilledWorker({ code: '5434', salary: 0, hours: S.goingRateHours, situation: 'standard', nation: 'England', ...extra }).required;
const since2025 = chk({ mediumBefore2025: true });
const since2024 = chk({ transitional: true });
const ne = K.checkSkilledWorker({ code: '5434', salary: 0, hours: S.goingRateHours, situation: 'new-entrant', nation: 'England', mediumBefore2025: true }).required;
const KITCHEN = ['5434', '5435', '5436', '1222', '1221', '1223', '9261', '9263'].map((c) => K.occ(c));
const status = (x: ReturnType<typeof K.occ>) =>
  x.table === 'Table 1' ? 'open to new applicants'
  : x.table === 'Table 6' ? 'not eligible at all'
  : x.isl ? `salary list only (${x.isl.criteria})`
  : x.tsl ? `shortage list until ${K.SOC.tslUntil}`
  : 'existing Skilled Workers only';

export default definePage({
  id: 'chef-visa-uk',
  group: 'work',
  order: 230,
  nav: 'Chef visa',
  card: `Chefs (5434) became a medium skilled code on ${cut}: who can still be sponsored, at what salary, and the other routes.`,
  title: 'Chef Visa 2026: Why SOC 5434 Is Closed to New Applicants',
  description: `Chef visa: code 5434 is medium skilled and on no shortage list, so no new Skilled Worker visa since ${cut}. Who can still extend and at what pay.`,
  h1: 'Chef visa: what code 5434 still allows',
  intro: `No new chef can be sponsored from abroad: code 5434 has been "medium skilled" since ${cut} and is on neither shortage list. Chefs already sponsored before that date can extend and change employer.`,
  resume: `Chefs are SOC 2020 code 5434, which the July 2025 reform moved to Table 1a of Appendix Skilled Occupations, the "medium skilled" list below degree level. A Table 1a code is open to new applicants only while it appears on the Immigration Salary List or the Temporary Shortage List, and 5434 is on neither. So no employer can sponsor a chef for a first Skilled Worker visa, whether from abroad or by a switch. The door stays open in one case: a chef granted Skilled Worker permission under the rules before ${cut} who has held it continuously since can extend or move to another sponsor in the same code. The pay test then depends on when that first permission started: ${K.gbp(since2025)} for a full-time job if it was on or after 4 April 2024, and ${K.gbp(since2024)} if it was earlier. Head cooks and cooks (5435) are ineligible altogether. Other routes, such as the High Potential Individual or Youth Mobility visas, do not require a sponsor.`,
  tool: { kind: 'sw', props: { initialCode: '5434', initialSalary: 36000, title: 'Chef code 5434: test your situation' } },
  body: (h) => `
<h2>Verdict for code 5434</h2>
<p>Run the checker with the default answer "No, first Skilled Worker visa" and it stops at the code: ${o.table}, medium skilled, not on the Immigration Salary List, not on the Temporary Shortage List, no PhD points. Change the last answer to one of the two "Yes" options and it applies the salary test for existing chefs. SOC 2020 gives the code a single example title, "${o.examples[0]}", so the rank of the post in the kitchen does not move it to another code. For a job outside the continuing rules there is no salary at which the visa becomes possible: pay is not the obstacle, the skill level of the code is.</p>
<h2>Chefs already on a Skilled Worker visa</h2>
<p>Rule SW 6.1(d) keeps Table 1a open to anyone granted Skilled Worker permission under the rules in place before ${cut}, with continuous permission since. That covers extensions with the same restaurant and moves to a new sponsor, as long as the job stays in a medium skilled code. Permission on a different route in between breaks the chain.</p>
${h.table(['First Skilled Worker permission', 'Floor', 'Going rate', 'Full-time threshold'], [
    ['On or after 4 April 2024, before 22 July 2025', K.gbp(S.general), K.gbp(o.goingRate!), K.gbp(since2025)],
    ['Before 4 April 2024, continuous since', K.gbp(S.transitional.general), K.gbp(o.goingRateTransitional!), K.gbp(since2024)],
  ], 'Salary thresholds for an existing chef in code 5434 at 37.5 hours a week, Appendix Skilled Worker options A and F.', ['l', 'r', 'r', 'r'])}
<p>The first group faces the steeper figure. A chef first sponsored between 4 April 2024 and ${cut} is tested on the current general threshold of ${K.gbp(S.general)} at each extension or change of employer, because the ${K.gbp(o.goingRate!)} going rate is lower and the higher of the two applies. A new entrant under 26, or recently out of study, may use ${K.gbp(ne)}, for a total stay of up to ${S.newEntrant.maxStayYears} years on that rate. The second group keeps the older figures until ${K.date(S.transitional.until)}.</p>
<p>A partner and children can stay with an existing chef only if the chef has been continuously employed in a medium skilled job on a Skilled Worker visa since before ${cut}, or in a few listed cases such as a child born in the country.</p>
<h2>Other kitchen and restaurant codes</h2>
<p>Re-coding the job will not help. The sponsor must use the code that matches the duties, and every neighbouring hospitality code is closed too:</p>
${h.table(['Code', 'Occupation', 'Table', 'New applicants'], KITCHEN.map((x) => [x.code, x.title, x.table, status(x)]), 'Hospitality occupation codes, Appendix Skilled Occupations and the two shortage lists as in force on 8 October 2026.', ['l', 'l', 'l', 'l'])}
<h2>Routes that do not need a sponsor</h2>
<p>For a chef without a continuing Skilled Worker history, the realistic options are routes that ignore the occupation code. The ${h.a('high-potential-individual-visa', 'High Potential Individual visa')} gives ${K.P.hpi.years} years of open work to a graduate of a listed university, degree in any subject. The Youth Mobility Scheme gives up to two years to nationals of participating countries aged 18 to 30 (18 to 35 for some), for a fee of ${K.gbp(K.FEE.youthMobility())}. A Commonwealth citizen with a grandparent born in the UK can use the ${h.a('uk-ancestry-visa', 'UK Ancestry visa')}. A partner of a British citizen or settled person can apply for a ${h.a('spouse-visa-uk', 'partner visa')}, and a partner of a Skilled Worker in a higher skilled job can come as a dependant. All of these allow work in a kitchen at any salary.</p>`,
  faqs: [
    { q: 'Can a restaurant still sponsor a chef from abroad?', a: `No. Since ${cut} code 5434 is a medium skilled occupation, and new applicants can only be sponsored in such codes if they are on the Immigration Salary List or the Temporary Shortage List. Chefs are on neither, so no certificate of sponsorship for a new chef visa can succeed, whatever the salary offered.` },
    { q: 'I am a chef on a Skilled Worker visa granted in 2024. Can I change restaurants?', a: `Yes, if your permission was granted before ${cut} and has been continuous since. The new restaurant needs a sponsor licence and must pay at least ${K.gbp(since2025)} for a 37.5-hour week, or ${K.gbp(since2024)} if your first Skilled Worker permission started before 4 April 2024.` },
    { q: 'Can a Graduate visa holder switch to a chef job?', a: 'Not on code 5434, because the switch would be a first Skilled Worker application in a medium skilled code that is on no shortage list. A Graduate visa itself allows any work, including as a chef, until it expires, but it cannot be extended and that time does not lead to a chef visa.' },
    { q: 'Could chefs be added back to a shortage list?', a: `Only by a Statement of Changes to the Immigration Rules. The current Temporary Shortage List runs until ${K.SOC.tslUntil} and does not include 5434. This page follows the rules in force and will change if a later Statement adds the code; until then any such report is speculation.` },
  ],
  related: ['skilled-worker-visa', 'immigration-salary-list', 'temporary-shortage-list', 'high-potential-individual-visa', 'uk-ancestry-visa'],
  sources: ['appendix_aso', 'appendix_sw', 'appendix_isl', 'sw_visa'],
});
