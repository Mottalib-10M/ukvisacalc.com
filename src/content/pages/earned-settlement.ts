import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
/**
 * Figures CONFIRMED in "A Fairer Pathway to Settlement: government response to the consultation"
 * (CP 1707, added to GOV.UK on 2 November 2026, accessible version 12 November 2026, read 22 November 2026), Table 1
 * and chapters 1 to 8. Policy, not law: no Immigration Rules laid and no commencement date given.
 * The November 2025 consultation (CP 1448) opened 20 November 2025 and closed 13 February 2026.
 */
const CP = {
  read: '2026-11-22', published: '2026-11-02', opened: '2025-11-20', closed: '2026-02-13', responses: 204667,
  baselineYears: 10, floor: 12571, household: 25142, higherRate: 50271, additionalRate: 125141,
  breachYears: 20, careWorkerDate: '2027-02-01',
};
// Someone who started a Skilled Worker visa on 2 September 2024, no long trips.
const now = K.settlementDate('skilled-worker', '2024-09-02', [{ out: '2025-07-19', back: '2025-08-10' }]);
const baseline = K.addYears(now.start, CP.baselineYears);

export default definePage({
  id: 'earned-settlement',
  group: 'settlement',
  order: 70,
  nav: 'Earned settlement (confirmed, no date)',
  card: 'The government response of November 2026 (CP 1707): a 10-year baseline, 5 and 3-year routes, 20 years after breaches, no start date.',
  title: 'Earned Settlement UK: the Confirmed 10-Year Path to ILR',
  description: `Earned settlement UK: the Home Office response (CP 1707) confirms a ${CP.baselineYears}-year ILR baseline, 5 or 3 years for some, ${CP.breachYears} after breaches. No start date set yet.`,
  h1: 'Earned settlement in the UK: what the government confirmed, and what still applies',
  intro: `The Home Office has answered its consultation: the usual wait for settlement will rise from ${S.skilledWorkerYears} to ${CP.baselineYears} years, with 5 and 3-year routes for some. No Immigration Rules and no start date have been published, so today's ${S.skilledWorkerYears}-year rules still apply.`,
  resume: `Earned settlement is the reform that makes indefinite leave to remain depend on character, contribution, integration and residence rather than on time alone. The Home Office consulted on it from ${K.date(CP.opened)} to ${K.date(CP.closed)} (CP 1448) and published its response, "A Fairer Pathway to Settlement" (CP 1707), on ${K.date(CP.published)}, after ${K.int(CP.responses)} responses. The response confirms a starting point of ${CP.baselineYears} years for most people, a 5-year pathway for those earning at least ${K.gbp(CP.higherRate)} in three of the last five years, eligible health and education workers and British connections, a 3-year pathway at ${K.gbp(CP.additionalRate)}, and ${CP.breachYears} years after immigration breaches or recent use of public funds. Everyone must have B2 English, the Life in the UK test, no government debt and no criminal record. It does not give a commencement date: the government says guidance will be published before implementation, and the rules have not been laid. Until they are, the calculator below applies the rules in force.`,
  tool: { kind: 'ilr', props: { initialRoute: 'skilled-worker', title: 'Your ILR date under the rules in force today' } },
  body: (h) => `
<h2>Earned settlement in the UK: the status on ${K.date(CP.read)}</h2>
<p>The government response (${h.src('earned_settlement_response', 'CP 1707')}) sets out the "final approach" to settlement. It is a policy decision, not law. The response says that "before implementation, the government will publish further guidance", that the qualifying immigration breaches "will be set out in the Immigration Rules", and that a full Impact Assessment "will be prepared to accompany the implementation". It names no date on which the new periods start. The only dated measure is for care workers: from ${K.date(CP.careWorkerDate)}, a care worker whose sponsor loses its licence will have up to 120 days to secure a job offer and a further 60 days to resolve their status.</p>
<h2>The confirmed pathways</h2>
${h.table(['Pathway', 'Who it is for', 'What you need'], [
    ['3 years', 'Exceptional economic contribution', `Earnings of ${K.gbp(CP.additionalRate)} in 3 of the 4 years before applying, or qualifying through the Highest Talent Group`],
    ['5 years', 'Higher earners, public service, British connection', `Earnings of ${K.gbp(CP.higherRate)} in 3 of the last 5 years; or 5 years in an eligible health or education occupation; or partner, parent or child of a British citizen, or UK Ancestry`],
    [`${CP.baselineYears} years`, 'The default for anyone following the rules', `Earnings of ${K.gbp(CP.floor)} in 5 of the previous 7 years`],
    [`${CP.breachYears} years`, 'Immigration breaches or public funds', `For anyone who committed a qualifying breach as an adult, or used specified public funds in the 5 years before applying`],
  ], 'Table 1 of "A Fairer Pathway to Settlement: government response" (CP 1707, November 2026). The mandatory requirements apply on every pathway.', ['l', 'l', 'l'])}
<p>The earnings thresholds follow the income tax bands: ${K.gbp(CP.floor)} for the minimum contribution, ${K.gbp(CP.higherRate)} for the higher rate and ${K.gbp(CP.additionalRate)} for the additional rate. Couples can combine their earnings to reach a household threshold of ${K.gbp(CP.household)}, twice the individual one. Children, people aged 65 and over and those who cannot meet the requirement because of a physical or mental condition are exempt from the minimum income requirement. The eligible public service jobs are health and education roles on national pay scales, such as doctors, nurses and teachers, listed in Annex C of the response.</p>
<h2>Requirements nobody can offset</h2>
<p>Higher earnings or public service cannot make up for the minimum standards. Every applicant must show good character and suitability, have no outstanding government debt (NHS charges, unpaid tax or National Insurance, Home Office litigation costs), have English at B2, have passed the Life in the UK test and show sustained contribution. The criminality rule is much stricter than today: "any adult applicant with a criminal record in the UK will be refused settlement", including cautions, discharges and fines. Overseas convictions also count where the conduct would be an offence in the UK.</p>
<h2>What changed from the consultation</h2>
<ul>
<li><strong>No reduction for C1 English</strong>: B2 is the standard, and C1 gives no shorter path.</li>
<li><strong>No reduction for volunteering</strong>: the government "will not use volunteering to reduce settlement periods".</li>
<li><strong>Breaches</strong>: the consultation offered 5 to 20 extra years; the response fixes a ${CP.breachYears}-year pathway for specified breaches committed as an adult, such as overstaying, breaching a visa condition or using deception. Illegal entry will ordinarily add 10 years, except where Article 31 of the Refugee Convention protects the person.</li>
<li><strong>Public funds</strong>: instead of 5 or 10 extra years, an applicant who used specified public funds in the 5 years before applying must either spend 5 continuous years on a qualifying route without them or complete ${CP.breachYears} years.</li>
<li><strong>Workers below RQF 6</strong>: the proposed 15-year path is dropped; they default to ${CP.baselineYears} years.</li>
<li><strong>Long residence closes</strong>: the ${h.a('long-residence-ilr', 'long residence route')} goes, and time on Visit, Student, Graduate, Temporary Worker, Youth Mobility and other temporary routes will no longer count towards settlement.</li>
<li><strong>Families</strong>: a partner who arrives with the main applicant settles at the same time; one who joins later completes the same period. Children under 18 settle with their parents, and 18 to 24-year-olds who keep child-dependant status settle with the family without an earnings test. From 25, a person must qualify in their own right.</li>
</ul>
<h2>People already in the UK</h2>
<p>The response is explicit that there is no general protection for people already here: applications are "ordinarily considered under the Immigration Rules in force at the date of settlement decision", and the transitional arrangements "do not create a wider exemption for everyone already living in the UK". The cohorts that are protected, all with the cut-off of the May 2025 Immigration White Paper, are:</p>
<ul>
<li>care workers who entered or switched into the route before May 2025: they keep 5 years if they meet the £25,000 salary, sponsorship and employment requirements, and those who do not can apply for a further 5-year Health and Care visa;</li>
<li>health and education workers below RQF 6 on a national pay scale who came before May 2025: they keep a 5-year route;</li>
<li>the pre-April 2024 Skilled Worker cohort: they can extend on their current salary terms until 2035 instead of 2030.</li>
</ul>
<p>BN(O) holders keep settlement after 5 years, the Afghan schemes immediate settlement and the Armed Forces 4 years, but these groups must also meet the new criminality rule and the B2 English standard unless an exemption applies.</p>
<h2>What applies today</h2>
<p>On ${K.date(K.P.retrieved_at)} the Immigration Rules still set the periods shown on the ${h.a('indefinite-leave-to-remain', 'ILR page')}: ${S.skilledWorkerYears} years for Skilled Worker, family and UK Ancestry, ${S.longResidenceYears} for long residence. The Statements of Changes up to HC 584, in force on ${K.date(K.P.valid_from)}, did not change those periods. One change from the same white paper is already law: HC 1691 raises the English level for settlement to B2 for applications from ${K.date(S.englishB2SettlementFrom)}.</p>
<p>The difference is large for someone starting out. A Skilled Worker who arrived on ${K.date(now.start)} can apply under today's rules from ${K.date(now.earliestApply)}. If the ${CP.baselineYears}-year pathway applied to them, they would reach it on ${K.date(baseline)}, or keep a 5-year date by earning ${K.gbp(CP.higherRate)} in three of the five years before applying. Which rule applies depends on when the new rules come into force, so plan on the current rules and keep payslips, P60s and tax records for every year.</p>
<p>Sources: the ${h.src('earned_settlement_response', 'government response (CP 1707)')}, read on ${K.date(CP.read)}, and the ${h.src('earned_settlement', 'consultation page')}.</p>`,
  faqs: [
    { q: 'Has the 10-year settlement rule come into force?', a: `No. The government response of November 2026 (CP 1707) confirms a ${CP.baselineYears}-year starting point, but it gives no start date and no Immigration Rules had been laid by ${K.date(CP.read)}. The rules as amended up to HC 584 still give ${S.skilledWorkerYears} years for Skilled Worker, family and UK Ancestry and ${S.longResidenceYears} for long residence.` },
    { q: 'Will earned settlement apply to people already on a visa?', a: `For most, yes once it starts: the response says applications are ordinarily decided under the rules in force on the date of decision and gives no general exemption. Only defined cohorts who arrived before the May 2025 White Paper keep 5 years, mainly care workers and health or education staff below RQF 6 on national pay scales.` },
    { q: 'How can a high earner settle sooner under earned settlement?', a: `By earning at least ${K.gbp(CP.higherRate)} in three of the five years before applying, which gives the 5-year pathway, or ${K.gbp(CP.additionalRate)} in three of the four years before applying, which gives 3 years. The mandatory requirements still apply: B2 English, Life in the UK test, no government debt and no criminal record.` },
    { q: 'Will long residence disappear under earned settlement?', a: `Yes, the response says the Long Residence route will close and time on temporary routes such as Student or Graduate will no longer count. Until the new rules start, it remains in force with its ${S.longResidenceYears}-year qualifying period and the ${S.maxAbsenceDays}-day rolling absence rule, so someone close to ten years can still apply under the current appendix.` },
  ],
  related: ['indefinite-leave-to-remain', 'long-residence-ilr', 'ilr-requirements', 'uk-visa-changes-2027', 'british-citizenship-application', 'skilled-worker-visa'],
  sources: ['earned_settlement_response', 'earned_settlement', 'hc_1691', 'hc_584', 'ilr'],
});
