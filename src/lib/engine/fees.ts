/**
 * Application fees (Home Office fee table of 8 October 2026, fees.json) and the immigration health
 * surcharge (params-2026.json > ihs). A fee is looked up by section number and a label pattern in
 * the official table, never typed here: if the Home Office renames a line, the lookup throws and the
 * tests fail, instead of a stale figure staying on the site.
 */
import FEES from '../../data/fees.json';
import P from '../../data/params-2026.json';

export interface FeeLine { key: string; section: string; label: string; current: number | null; amounts: Record<string, number> }
export const LINES = FEES.lines as FeeLine[];
export const FEE_DATE: string = FEES.current;
export const FEE_VERSIONS = FEES.versions as Array<{ date: string; title: string; url: string }>;

/** The single current line of section `sec` whose label matches every pattern (and none of `not`). */
export function feeLine(sec: number, has: RegExp[], not: RegExp[] = []): FeeLine {
  const xs = LINES.filter((l) => l.current != null && l.section.startsWith(`${sec}.`) && has.every((r) => r.test(l.label)) && !not.some((r) => r.test(l.label)));
  if (xs.length !== 1) throw new Error(`fee lookup section ${sec} ${has.join(' ')}: ${xs.length} lines`);
  return xs[0];
}
export const fee = (sec: number, has: RegExp[], not: RegExp[] = []) => feeLine(sec, has, not).current as number;

export type Where = 'outside' | 'inside';
const SW = /^Skilled Worker/i, LE3 = /three years or less/i, GT3 = /over three years/i, ISL = /Immigration Salary List/i, HC = /Health and Care/i;
const sec = (w: Where, out: number, inn: number) => (w === 'outside' ? out : inn);

/** Main applicant fee by route; dependants pay the same unless stated. */
export const FEE = {
  skilledWorker: (w: Where, years: number, isl = false) => fee(sec(w, 2, 7), [SW, years > 3 ? GT3 : LE3, ...(isl ? [ISL] : [])], [HC, ...(isl ? [] : [ISL])]),
  healthCare: (w: Where, years: number) => fee(sec(w, 2, 7), [SW, HC, years > 3 ? GT3 : LE3], [ISL]),
  student: (w: Where) => fee(sec(w, 3, 8), [/^Student - main applicant/i]),
  graduate: () => fee(7, [/^Graduate Route/i]),
  globalTalentTotal: () => fee(2, [/^Global Talent - main applicant - where Approval Letter is not required/i]),
  globalTalentEndorsement: () => fee(2, [/^Approval letter from a competent body.*Global Talent/i]),
  globalTalentVisaAfterEndorsement: (w: Where) => fee(sec(w, 2, 7), [/^Global Talent\s+- main applicant - where Approval Letter is required/i]),
  globalTalentDependant: (w: Where) => fee(sec(w, 2, 7), [/^Global Talent - dependants only/i]),
  hpi: (w: Where) => fee(sec(w, 2, 7), [/^High Potential Individual/i]),
  scaleUp: (w: Where) => fee(sec(w, 2, 7), [/^Scale-up - main applicant/i]),
  innovator: (w: Where) => fee(sec(w, 2, 7), [/^Innovator Founder - main applicant/i]),
  familyOutside: () => fee(1, [/^Route to Settlement$/i]),
  leaveToRemainOther: () => fee(9, [/^Leave to remain - Other/i]),
  ilr: () => fee(9, [/^Indefinite leave to remain - main applicant/i]),
  naturalisation: () => fee(10, [/^Naturalisation \(British citizenship\)/i]),
  ceremony: () => fee(10, [/^The arrangement of a citizenship ceremony/i]),
  registrationChild: () => fee(10, [/^Nationality registration as a British citizen - child/i]),
  registrationAdult: () => fee(10, [/^Nationality registration as a British citizen - adult/i]),
  lifeInUk: () => fee(9, [/^Life in the UK test/i]),
  visitor6m: () => fee(1, [/^Visit visa – short up to 6 months/i]),
  visitor2y: () => fee(1, [/^Visit visa – long up to 2 years/i]),
  visitor5y: () => fee(1, [/^Visit visa – long up to 5 years/i]),
  visitor10y: () => fee(1, [/^Visit visa – long up to 10 years/i]),
  visitorExtension: () => fee(9, [/^Visitor extension/i]),
  eta: () => fee(1, [/^electronic travel authorisation/i]),
  ancestry: () => fee(1, [/^Other visa$/i]),
  youthMobility: () => fee(2, [/^Temporary Work – Seasonal Worker.*Youth Mobility/i]),
  priorityOutside: () => fee(4, [/^Priority Visa service - Non-Settlement/i]),
  prioritySettlementOutside: () => fee(4, [/^Priority Visa service - Settlement/i]),
  superPriorityOutside: () => fee(4, [/^Super Priority Visa Service/i]),
  priorityInside: () => fee(5, [/^Expedited processing - Priority service/i]),
  superPriorityInside: () => fee(5, [/^Super Priority service/i]),
  licenceSmall: () => fee(11, [/^Worker sponsor licence \(small sponsor\)/i]),
  licenceLarge: () => fee(11, [/^Worker sponsor licence \(large sponsor\s*\)$/i]),
  licencePriority: () => fee(11, [/^Priority service for expedited processing of sponsor licence/i]),
  cosWorker: () => fee(11, [/^Certificate of Sponsorship.*Skilled Worker/i]),
  cosTemporary: () => fee(11, [/^Certificate of Sponsorship.*Temporary Worker/i]),
  cas: () => fee(11, [/^Confirmation of Acceptance for Study/i]),
  smsPriority: () => fee(11, [/^The expedited processing of a sponsorship management request/i]),
  actionPlan: () => fee(11, [/^Sponsor action plan/i]),
  adminReview: () => fee(9, [/^Administrative Review/i]),
};

/**
 * Immigration health surcharge for one person (GOV.UK, "how much you have to pay"):
 *  - 6 months or less: nothing from outside the UK, half a year from inside;
 *  - otherwise whole years, plus half a year if the part year is 6 months or less, a full year if more.
 */
export function ihs(months: number, where: Where, reduced: boolean): number {
  const rate = reduced ? P.ihs.reduced : P.ihs.standard;
  const m = Math.max(0, Math.ceil(months));
  if (m === 0) return 0;
  if (m <= P.ihs.shortOutsideFreeMonths) return where === 'outside' ? 0 : rate / 2;
  const years = Math.floor(m / 12), rest = m % 12;
  return years * rate + (rest === 0 ? 0 : rest <= 6 ? rate / 2 : rate);
}

export type CostRoute = 'skilled-worker' | 'health-and-care' | 'student' | 'graduate' | 'global-talent' | 'hpi' | 'partner' | 'fiance' | 'ancestry' | 'visitor' | 'ilr' | 'citizenship';

export interface CostInput {
  route: CostRoute;
  where: Where;
  months: number;
  partner: boolean;
  children: number;
  /** Children under 18 pay the reduced surcharge (they are applicants under 18 at the date of application). */
  isl?: boolean;
  priority?: 'none' | 'priority' | 'super';
  /** Global Talent: endorsement route (fee split £561 + £205) or prize route (£766 at once). */
  endorsed?: boolean;
}
export interface CostLine { who: string; fee: number; ihs: number; total: number }
export interface CostResult { lines: CostLine[]; fees: number; ihsTotal: number; priority: number; total: number; months: number; notes: string[]; people: number; feeEach: number; feeLabel: string }

const NO_IHS: CostRoute[] = ['health-and-care', 'visitor', 'ilr', 'citizenship'];
export const DEFAULT_MONTHS: Record<CostRoute, number> = { 'skilled-worker': 36, 'health-and-care': 36, student: 16, graduate: 24, 'global-talent': 60, hpi: 24, partner: 33, fiance: 6, ancestry: 60, visitor: 6, ilr: 0, citizenship: 0 };

export function visaCost(inp: CostInput): CostResult {
  const notes: string[] = [];
  const years = inp.months / 12;
  let where = inp.where;
  let feeEach = 0, depFee: number | null = null, feeLabel = '';
  switch (inp.route) {
    case 'skilled-worker': feeEach = FEE.skilledWorker(where, years, !!inp.isl); feeLabel = `Skilled Worker${inp.isl ? ', Immigration Salary List job' : ''}, ${years > 3 ? 'over 3 years' : 'up to 3 years'}, ${where} the UK`; break;
    case 'health-and-care': feeEach = FEE.healthCare(where, years); feeLabel = `Health and Care Worker, ${years > 3 ? 'over 3 years' : 'up to 3 years'}`; notes.push('No immigration health surcharge for Health and Care Worker visa holders and their dependants.'); break;
    case 'student': feeEach = FEE.student(where); feeLabel = 'Student'; notes.push('Students and their dependants pay the reduced surcharge.'); break;
    case 'graduate': where = 'inside'; feeEach = FEE.graduate(); feeLabel = 'Graduate (inside the UK only)'; break;
    case 'global-talent': feeEach = inp.endorsed === false ? FEE.globalTalentTotal() : FEE.globalTalentEndorsement() + FEE.globalTalentVisaAfterEndorsement(where); depFee = FEE.globalTalentDependant(where); feeLabel = inp.endorsed === false ? 'Global Talent, prize route' : 'Global Talent, endorsement + visa'; break;
    case 'hpi': feeEach = FEE.hpi(where); feeLabel = 'High Potential Individual'; break;
    case 'partner': feeEach = where === 'outside' ? FEE.familyOutside() : FEE.leaveToRemainOther(); feeLabel = `Partner or spouse, ${where} the UK`; break;
    case 'fiance': where = 'outside'; feeEach = FEE.familyOutside(); feeLabel = 'Fiancé(e) or proposed civil partner (6 months, from outside the UK)'; break;
    case 'ancestry': feeEach = where === 'outside' ? FEE.ancestry() : FEE.leaveToRemainOther(); feeLabel = `UK Ancestry, ${where === 'outside' ? 'first visa' : 'extension'}`; break;
    case 'visitor': feeEach = inp.months <= 6 ? FEE.visitor6m() : inp.months <= 24 ? FEE.visitor2y() : inp.months <= 60 ? FEE.visitor5y() : FEE.visitor10y(); feeLabel = 'Standard Visitor'; break;
    case 'ilr': feeEach = FEE.ilr(); feeLabel = 'Indefinite leave to remain (each person)'; notes.push('No surcharge on a settlement application.'); break;
    case 'citizenship': feeEach = FEE.naturalisation() + FEE.ceremony(); feeLabel = 'Naturalisation + citizenship ceremony'; depFee = FEE.registrationChild(); notes.push('Children register separately; the ceremony fee is added for a child who turns 18 during the application.'); break;
  }
  const reducedAll = inp.route === 'student';
  const noIhs = NO_IHS.includes(inp.route);
  const months = inp.route === 'fiance' ? 6 : inp.months;
  const lines: CostLine[] = [];
  const add = (who: string, f: number, child: boolean) => {
    const s = noIhs ? 0 : ihs(months, where, reducedAll || child);
    lines.push({ who, fee: f, ihs: s, total: f + s });
  };
  add('Main applicant', feeEach, false);
  if (inp.partner) add('Partner', depFee ?? feeEach, false);
  for (let i = 0; i < Math.max(0, Math.min(10, Math.floor(inp.children))); i++) add(`Child ${i + 1}`, depFee ?? feeEach, true);
  const fees = lines.reduce((a, l) => a + l.fee, 0), ihsTotal = lines.reduce((a, l) => a + l.ihs, 0);
  let priority = 0;
  if (inp.priority === 'priority') priority = where === 'outside' ? FEE.priorityOutside() : FEE.priorityInside();
  if (inp.priority === 'super') priority = where === 'outside' ? FEE.superPriorityOutside() : FEE.superPriorityInside();
  if (priority) notes.push('Priority fees are charged per application where the service is offered; check availability when you apply.');
  return { lines, fees, ihsTotal, priority, total: fees + ihsTotal + priority, months, notes, people: lines.length, feeEach, feeLabel };
}

/** History of one fee line across every table since January 2024 (date → £), for the charts. */
export const feeHistory = (l: FeeLine) => Object.entries(l.amounts).sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, amount]) => ({ date, amount }));

/** Fee lines followed over time on the fee history tool (Home Office tables since 31 January 2024). */
export const HISTORY_SERIES: Array<{ id: string; label: string; line: () => FeeLine }> = [
  { id: 'sw-out-3', label: 'Skilled Worker, up to 3 years, outside the UK', line: () => feeLine(2, [SW, LE3], [HC, ISL]) },
  { id: 'sw-out-5', label: 'Skilled Worker, over 3 years, outside the UK', line: () => feeLine(2, [SW, GT3], [HC, ISL]) },
  { id: 'sw-in-3', label: 'Skilled Worker, up to 3 years, inside the UK', line: () => feeLine(7, [SW, LE3], [HC, ISL]) },
  { id: 'hc-3', label: 'Health and Care Worker, up to 3 years', line: () => feeLine(2, [SW, HC, LE3], [ISL]) },
  { id: 'partner-out', label: 'Spouse or partner visa, outside the UK', line: () => feeLine(1, [/^Route to Settlement$/i]) },
  { id: 'partner-in', label: 'Spouse or partner extension, inside the UK', line: () => feeLine(9, [/^Leave to remain - Other/i]) },
  { id: 'ilr', label: 'Indefinite leave to remain', line: () => feeLine(9, [/^Indefinite leave to remain - main applicant/i]) },
  { id: 'citizenship', label: 'Naturalisation as a British citizen', line: () => feeLine(10, [/^Naturalisation \(British citizenship\)/i]) },
  { id: 'student', label: 'Student, outside the UK', line: () => feeLine(3, [/^Student - main applicant/i]) },
  { id: 'graduate', label: 'Graduate', line: () => feeLine(7, [/^Graduate Route/i]) },
  { id: 'visitor', label: 'Standard Visitor, up to 6 months', line: () => feeLine(1, [/^Visit visa – short up to 6 months/i]) },
  { id: 'gt', label: 'Global Talent (prize route)', line: () => feeLine(2, [/^Global Talent - main applicant - where Approval Letter is not required/i]) },
  { id: 'hpi', label: 'High Potential Individual', line: () => feeLine(2, [/^High Potential Individual/i]) },
  { id: 'cos', label: 'Certificate of sponsorship (Skilled Worker)', line: () => feeLine(11, [/^Certificate of Sponsorship.*Skilled Worker/i]) },
  { id: 'licence-large', label: 'Sponsor licence, medium or large employer', line: () => feeLine(11, [/^Worker sponsor licence \(large sponsor\s*\)$/i]) },
];
