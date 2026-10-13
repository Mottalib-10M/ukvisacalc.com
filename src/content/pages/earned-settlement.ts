import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.settlement;
/**
 * Figures PROPOSED in "A Fairer Pathway to Settlement" (CP 1448, Home Office consultation opened
 * 20 November 2025, closed 13 February 2026), Tables 1 to 3. Not law. Read in
 * scripts/data-raw/govuk/government__consultations__earned-settlement__a-fairer-pathway-to-settlement-statement-and-accompanying-consultation-on-earned-settlement-accessible.txt
 * (to move into params-2026.json > settlement.earnedSettlementProposal).
 */
const PROP = {
  opened: '2025-11-20', closed: '2026-02-13',
  baselineYears: 10, earningsFloor: 12570, earningsYears: '3 to 5',
  higherRate: 50270, additionalRate: 125140, lowSkillBaseline: 15,
};
// Someone who started a Skilled Worker visa on 2 September 2024, no long trips.
const now = K.settlementDate('skilled-worker', '2024-09-02', [{ out: '2025-07-19', back: '2025-08-10' }]);
const baseline = K.addYears(now.start, PROP.baselineYears);

export default definePage({
  id: 'earned-settlement',
  group: 'settlement',
  order: 70,
  nav: 'Earned settlement (proposed)',
  card: 'The November 2025 consultation: a proposed 10-year baseline, reductions, additions and what applies today.',
  title: 'Earned Settlement: the Proposed 10-Year ILR Model in Detail',
  description: `Earned settlement: the proposed ${PROP.baselineYears}-year ILR baseline, its earned reductions and penalties, who keeps 5 or 3 years, and the rules that still apply today.`,
  h1: 'Earned settlement: what the Home Office proposed, and what still applies',
  intro: `The government consulted on raising the usual wait for settlement from ${S.skilledWorkerYears} to ${PROP.baselineYears} years, then adjusting it up or down. Nothing in that model is law yet: the rules in force on ${K.date(K.P.retrieved_at)} still give ${S.skilledWorkerYears} years on the main routes.`,
  resume: `"A Fairer Pathway to Settlement" is a Home Office statement and consultation (CP 1448) opened on ${K.date(PROP.opened)} and closed on ${K.date(PROP.closed)}. It proposes that settlement should no longer follow automatically from a fixed period but be "earned" through character, integration, contribution and residence. The proposed baseline qualifying period for most migrants would be ${PROP.baselineYears} years instead of ${S.skilledWorkerYears}, adjusted down for things like higher earnings, C1 English or public service work, and up for things like claiming public funds or overstaying. Mandatory conditions would include B2 English, the Life in the UK test, no debt to the NHS or the tax authorities and earnings above ${K.gbp(PROP.earningsFloor)} for ${PROP.earningsYears} years. Partners of British citizens and BN(O) holders would keep ${S.familyYears} years; Global Talent and Innovator Founder holders could keep ${S.globalTalentFastYears}. These are proposals. On ${K.date(K.P.retrieved_at)} no Statement of Changes up to HC 584 had laid them, and the calculator applies the rules in force.`,
  tool: { kind: 'ilr', props: { initialRoute: 'skilled-worker', title: 'Your ILR date under the rules in force today' } },
  body: (h) => `
<h2>The proposed model in four pillars</h2>
<p>The consultation describes a "time adjustment" model: start from a baseline of ${PROP.baselineYears} years and move it according to who you are and what you have done. It groups the conditions under four pillars. <strong>Character</strong> would be a gate, not a factor to trade: the paper says "you should not be able to settle with a criminal record" and announces a review of criminality thresholds. <strong>Integration</strong> means English and the Life in the UK test. <strong>Contribution</strong> means earnings, public service or volunteering. <strong>Residence</strong> still counts, but the paper says people would "not normally qualify on the basis of residence alone".</p>
<p>Table 1 of the paper lists the proposed minimum for any applicant: meet Part Suitability, have no litigation, NHS, tax or other government debt, show English at B2, pass the Life in the UK test, and have had annual earnings above ${K.gbp(PROP.earningsFloor)} for a minimum of ${PROP.earningsYears} years, the exact length being one of the consultation questions.</p>
<h2>Proposed reductions and additions</h2>
${h.table(['Proposed consideration', 'Proposed adjustment'], [
    ['English at C1', 'minus 1 year'],
    [`Taxable income of ${K.gbp(PROP.additionalRate)} for the 3 years before applying`, 'minus 7 years'],
    [`Taxable income of ${K.gbp(PROP.higherRate)} for the 3 years before applying`, 'minus 5 years'],
    ['5 years in a specified public service occupation (RQF 6 or above)', 'minus 5 years'],
    ['Work in the community, such as volunteering', 'minus 3 to 5 years'],
    ['Partner, parent or child of a British citizen; BN(O) route', 'minus 5 years (not consulted on)'],
    ['3 years as a Global Talent or Innovator Founder holder', 'minus 7 years'],
    ['Public funds for less than 12 months on the route', 'plus 5 years'],
    ['Public funds for more than 12 months', 'plus 10 years'],
    ['Illegal entry, entry as a visitor, or overstaying 6 months or more', 'plus up to 20 years'],
  ], 'Tables 2 and 3 of "A Fairer Pathway to Settlement" (November 2025). Proposals only; all subject to consultation except where marked.', ['l', 'l'])}
<p>Only the largest reduction and the largest addition would apply, and an addition would take precedence over a reduction. The paper gives its own example: a person who received public funds for under 12 months but has C1 English would go up 5 years and down 1, for a total of 14. The income levels match the higher and additional rate income tax thresholds, and the paper says they would not track future tax changes. A separate question asks whether workers sponsored below RQF 6, such as care workers, should start from ${PROP.lowSkillBaseline} years rather than ${PROP.baselineYears}.</p>
<h2>Who would keep a shorter path, and what else would change</h2>
<p>Partners, parents and children of British citizens and BN(O) holders would, under the proposal, still settle after ${S.familyYears} years subject to the mandatory requirements; Global Talent and Innovator Founder holders would generally keep ${S.globalTalentFastYears}. The paper states plainly that routes such as Skilled Worker "will cease" to lead to settlement after ${S.skilledWorkerYears} years and default to ${PROP.baselineYears} unless an earned reduction applies. It also proposes:</p>
<ul>
<li>no separate ${h.a('long-residence-ilr', 'long residence route')}, its role absorbed by the adjustable baseline;</li>
<li>adult dependants of workers assessed on their own attributes, so a partner's period could differ from the main applicant's;</li>
<li>a question on whether settlement could carry a "no recourse to public funds" condition, moving access to benefits to citizenship;</li>
<li>transitional arrangements for people already on a path, on which the consultation sought views without committing to any.</li>
</ul>
<p>Citizenship reform would follow but needs primary legislation to amend the British Nationality Act 1981, the paper says.</p>
<h2>What applies today</h2>
<p>On ${K.date(K.P.retrieved_at)} the Immigration Rules still set the periods shown on the ${h.a('indefinite-leave-to-remain', 'ILR page')}: ${S.skilledWorkerYears} years for Skilled Worker, family and UK Ancestry, ${S.longResidenceYears} for long residence. The Statements of Changes since the consultation, up to HC 584 in force on ${K.date(K.P.valid_from)}, did not change those periods, and the consultation page lists no government response. One change from the same white paper is already law: HC 1691 raises the English level for settlement to B2 for applications from ${K.date(S.englishB2SettlementFrom)}.</p>
<p>The difference is large for someone starting now. A Skilled Worker who arrived on ${K.date(now.start)} can apply under today's rules from ${K.date(now.earliestApply)}. If a ${PROP.baselineYears}-year baseline were adopted without transitional protection and no reduction applied, the same person would reach it on ${K.date(baseline)}. Whether that happens depends on rules not yet written, so plan on the current ones and keep evidence of earnings, tax and any volunteering in case reductions are introduced.</p>
<p>Sources: the ${h.src('earned_settlement', 'consultation page')} and the ${h.ext('https://www.gov.uk/government/consultations/earned-settlement/a-fairer-pathway-to-settlement-statement-and-accompanying-consultation-on-earned-settlement-accessible', 'accessible text of the paper')}.</p>`,
  faqs: [
    { q: 'Has the 10-year settlement rule come into force?', a: `No. On ${K.date(K.P.retrieved_at)} the ${PROP.baselineYears}-year baseline was a proposal from the November 2025 consultation. The Immigration Rules, as amended up to HC 584, still give ${S.skilledWorkerYears} years for Skilled Worker, family and UK Ancestry settlement and ${S.longResidenceYears} for long residence. A change would need new Immigration Rules, laid before Parliament in a Statement of Changes.` },
    { q: 'Would earned settlement apply to people already on a visa?', a: `The paper does not decide this. It notes that without transitional arrangements the new rules would affect everyone not yet settled when they come into force, and asks respondents whether there should be protection for those already on a path. Until the government publishes its response and rules, nobody can say which cohorts would be covered.` },
    { q: 'How could a high earner settle sooner under the proposal?', a: `The paper proposes taking 5 years off the baseline for taxable income above ${K.gbp(PROP.higherRate)}, and 7 years for income above ${K.gbp(PROP.additionalRate)}, in each of the 3 years before applying. From a ${PROP.baselineYears}-year start that would mean 5 or 3 years, provided the mandatory requirements, such as B2 English and a clean record, are met.` },
    { q: 'Would long residence disappear under earned settlement?', a: `That is the proposal: the paper says there would "no longer be a separate long residence route" because an adjustable baseline would take over its purpose. It remains in force today, with its ${S.longResidenceYears}-year qualifying period and the ${S.maxAbsenceDays}-day rolling absence rule for recent trips. Anyone close to ten years can still apply under the current appendix.` },
  ],
  related: ['indefinite-leave-to-remain', 'long-residence-ilr', 'ilr-requirements', 'british-citizenship-application', 'skilled-worker-visa'],
  sources: ['earned_settlement', 'hc_1691', 'hc_584', 'ilr'],
});
