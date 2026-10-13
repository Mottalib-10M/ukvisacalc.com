/**
 * Skilled Worker salary test (Appendix Skilled Worker, table following SW 4.4, SW 14.3 to 14.3B,
 * SW 6.1 to 6.1B; going rates from Appendix Skilled Occupations, lists from Appendix Immigration
 * Salary List and SW 6.1A). Every figure comes from params-2026.json or soc.json.
 */
import P from '../../data/params-2026.json';
import SOC from '../../data/soc.json';

export type Nation = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
export type Situation = 'standard' | 'new-entrant' | 'phd-stem' | 'phd-other' | 'postdoc';
export interface PayRate { label: string; rate: number }
export interface Occupation {
  code: string; title: string; examples: string[]; table: string; tier: 'higher' | 'medium' | 'ineligible';
  goingRate?: number; goingRateTransitional?: number; phd?: boolean;
  r90?: number | null; r80?: number | null; r70?: number | null; t90?: number | null; t80?: number | null; t70?: number | null; restriction?: string;
  payScale?: boolean; scale?: 'table4' | 'table5' | 'as2211'; rates?: Record<string, PayRate[]>; scaleHours?: number; scaleSource?: string;
  isl?: { criteria: string; all: boolean; nations: string[]; until: string };
  tsl?: { jobs: string[] };
}
export const OCCUPATIONS = SOC.occupations as unknown as Occupation[];
export const occupation = (code: string) => OCCUPATIONS.find((o) => o.code === code);
export const BANDS = SOC.bands as unknown as Array<Record<string, string | number>>;
export const TEACHERS = SOC.teachers as unknown as Array<Record<string, string | number | null>>;
const S = P.skilledWorker;

/** Pay-scale options (Table 3 occupations) for one nation: NHS bands, teacher roles or listed rates. */
export function payOptions(o: Occupation, nation: Nation, london: 'England (excluding London / Fringe)' | 'London Fringe' | 'Outer London' | 'Inner London' = 'England (excluding London / Fringe)'): PayRate[] {
  if (!o.payScale) return [];
  if (o.scale === 'table4') return BANDS.map((b) => ({ label: String(b.band), rate: Number(b[nation]) })).filter((r) => r.rate > 0);
  if (o.scale === 'table5') {
    const col = nation === 'England' ? london : nation;
    return TEACHERS.map((t) => ({ label: String(t.role), rate: Number(t[col] ?? 0) })).filter((r) => r.rate > 0);
  }
  const src = o.scale === 'as2211' ? occupation('2211')! : o;
  return src.rates?.[nation] ?? src.rates?.UK ?? src.rates?.[Object.keys(src.rates ?? {})[0]] ?? [];
}

export interface SwInput {
  code: string;
  salary: number;
  hours: number;
  situation: Situation;
  nation: Nation;
  /** First Skilled Worker permission before 4 April 2024 and continuous since (options F to J). */
  transitional?: boolean;
  /** Already in a "medium skilled" job on a Skilled Worker visa since before 22 July 2025. */
  mediumBefore2025?: boolean;
  /** Applying from inside the UK (switch or extension), needed for care worker codes. */
  inside?: boolean;
  /** Chosen pay-scale rate for health and education codes (annual, full time). */
  payRate?: number;
  /** The job meets the further criteria of its ISL entry (when the entry is not "all jobs"). */
  islCriteria?: boolean;
}

export interface SwResult {
  occupation: Occupation | undefined;
  eligibleCode: boolean;
  route: 'general' | 'isl' | 'tsl' | 'health-education' | 'transitional-medium' | 'none';
  codeNote: string;
  goingRateFullTime: number | null;
  goingRateProRata: number | null;
  goingRateHourly: number | null;
  countedSalary: number;
  hourlyPay: number;
  floor: number;
  share: number;
  required: number;
  gap: number;
  passes: boolean;
  option: string;
  islApplies: boolean;
  /** Required salary under the other situations, for comparison. */
  alternatives: Array<{ situation: Situation | 'isl'; label: string; required: number; available: boolean }>;
  warnings: string[];
}

const LABEL: Record<Situation, string> = {
  standard: 'Standard rate',
  'new-entrant': 'New entrant (under 26, recent student or graduate, in training)',
  'phd-stem': 'PhD in a STEM subject relevant to the job',
  'phd-other': 'PhD in another subject relevant to the job',
  postdoc: 'Postdoctoral position in science or higher education',
};
export const SITUATION_LABELS = LABEL;

const round = (x: number) => Math.round(x * 100) / 100;

function islFor(o: Occupation, nation: Nation, criteria: boolean): boolean {
  if (!o.isl) return false;
  if (!o.isl.nations.includes(nation)) return false;
  return o.isl.all || criteria;
}

/** Floor and share of the going rate for one situation, under the current or transitional table. */
function rule(sit: Situation | 'isl', transitional: boolean): { floor: number; share: number; option: string } {
  const T = S.transitional;
  switch (sit) {
    case 'phd-other': return transitional ? { floor: T.phdOther, share: S.phdOther.share, option: 'G' } : { floor: S.phdOther.floor, share: S.phdOther.share, option: 'B' };
    case 'phd-stem': return transitional ? { floor: T.phdStem, share: S.phdStem.share, option: 'H' } : { floor: S.phdStem.floor, share: S.phdStem.share, option: 'C' };
    case 'isl': return transitional ? { floor: T.isl, share: 1, option: 'I' } : { floor: S.isl.floor, share: S.isl.share, option: 'D' };
    case 'new-entrant':
    case 'postdoc': return transitional ? { floor: T.newEntrant, share: S.newEntrant.share, option: 'J' } : { floor: S.newEntrant.floor, share: S.newEntrant.share, option: 'E' };
    default: return transitional ? { floor: T.general, share: 1, option: 'F' } : { floor: S.general, share: 1, option: 'A' };
  }
}

/**
 * Full-time amount of the discounted going rate. Appendix Skilled Occupations prints each discounted
 * rate (rounded by the Home Office, and already raised to the floor when the floor is higher): the
 * printed figure is used when it is above the floor, otherwise share × going rate, so that a
 * pro-rata for longer hours never multiplies the floor itself.
 */
export function discountedRate(o: Occupation, share: number, floor: number, transitional: boolean): number | null {
  const gr = transitional && o.goingRateTransitional ? o.goingRateTransitional : o.goingRate;
  if (gr == null) return null;
  if (share >= 1) return gr;
  const key = (transitional ? 't' : 'r') + Math.round(share * 100) as 'r90' | 'r80' | 'r70' | 't90' | 't80' | 't70';
  const printed = o[key];
  return printed != null && printed > floor ? printed : gr * share;
}

export function checkSkilledWorker(inp: SwInput): SwResult {
  const o = occupation(inp.code);
  const hours = Math.min(Math.max(inp.hours || 0, 0), 168);
  const salary = Math.max(inp.salary || 0, 0);
  const warnings: string[] = [];
  const base: SwResult = {
    occupation: o, eligibleCode: false, route: 'none', codeNote: '', goingRateFullTime: null, goingRateProRata: null, goingRateHourly: null,
    countedSalary: salary, hourlyPay: hours > 0 ? round(salary / (hours * 52)) : 0, floor: 0, share: 1, required: 0, gap: 0, passes: false, option: '', islApplies: false, alternatives: [], warnings,
  };
  if (!o) { base.codeNote = 'Unknown occupation code.'; return base; }
  // Only the first 48 hours a week count towards the salary thresholds (SW 14.3).
  const counted = hours > S.maxCountedHours ? round(salary * S.maxCountedHours / hours) : salary;
  base.countedSalary = counted;
  if (hours > S.maxCountedHours) warnings.push(`Only the first ${S.maxCountedHours} hours a week count: your salary is assessed as £${Math.round(counted).toLocaleString('en-GB')}.`);
  const transitional = !!inp.transitional;
  const islApplies = islFor(o, inp.nation, inp.islCriteria !== false);
  base.islApplies = islApplies;

  // 1. Is the occupation code eligible?
  if (o.tier === 'ineligible') { base.codeNote = `${o.code} is in Table 6 of Appendix Skilled Occupations: not eligible for the Skilled Worker route.`; return base; }
  if (S.careWorkerCodes.includes(o.code)) {
    if (!inp.inside) { base.codeNote = `Care worker codes ${S.careWorkerCodes.join(' and ')} are closed to applications from outside the UK (SW 6.1B).`; return base; }
    warnings.push(`Care worker codes: only switches inside the UK after 3 months working for the sponsor, before ${'22 July 2028'}, or workers already sponsored in these codes (SW 6.1B).`);
  }
  let route: SwResult['route'] = 'general';
  if (o.table === 'Table 1') route = 'general';
  else if (o.table === 'Table 3') route = 'health-education';
  else if (o.table === 'Table 1a') {
    if (islApplies) route = 'isl';
    else if (o.tsl) route = 'tsl';
    else if (inp.mediumBefore2025 || transitional) route = 'transitional-medium';
    else { base.codeNote = `${o.code} is a "medium skilled" occupation (Table 1a). New applicants qualify only if it is on the Immigration Salary List or the Temporary Shortage List, which it is not${o.isl ? ` in ${inp.nation} for this job` : ''}.`; return base; }
  } else if (o.table === 'Table 3a') {
    if (inp.mediumBefore2025 || transitional) route = 'transitional-medium';
    else { base.codeNote = `${o.code} (Table 3a) is open only to workers already sponsored in it under the rules before 22 July 2025.`; return base; }
  }
  base.eligibleCode = true; base.route = route;
  const islNote = islApplies && route !== 'isl' ? ` Also on the Immigration Salary List in ${inp.nation} until ${o.isl!.until} (lower fee, £${S.isl.floor.toLocaleString('en-GB')} floor).` : '';
  base.codeNote = route === 'isl' ? `On the Immigration Salary List in ${inp.nation} until ${o.isl!.until}.`
    : route === 'tsl' ? `On the Temporary Shortage List: certificate of sponsorship must be issued before ${SOC.tslUntil}.${o.tsl!.jobs.length ? ` Only: ${o.tsl!.jobs.join(', ')}.` : ''}`
    : route === 'health-education' ? 'Health or education occupation: going rate from the national pay scale (Table 3).'
    : route === 'transitional-medium' ? 'Medium skilled occupation, open to you only under the transitional rules (continuous Skilled Worker permission).'
    : 'Higher skilled occupation (Table 1): eligible.';
  base.codeNote += islNote;

  // 2. Going rate, pro-rated to the weekly hours.
  let gr: number | null = null, grHours = S.goingRateHours;
  if (route === 'health-education') {
    gr = inp.payRate ?? null; grHours = o.scaleHours ?? S.goingRateHours;
    if (gr == null) warnings.push('Choose the pay band or role of the job to get the going rate.');
  } else {
    gr = transitional && o.goingRateTransitional ? o.goingRateTransitional : o.goingRate ?? null;
  }
  base.goingRateFullTime = gr;
  const pro = gr != null && hours > 0 ? round(gr * hours / grHours) : gr;
  base.goingRateProRata = pro;
  base.goingRateHourly = gr != null ? round(gr / (grHours * 52)) : null;

  // 3. Threshold for the chosen situation.
  let sit: Situation | 'isl' = inp.situation;
  if (islApplies && sit === 'standard') sit = 'isl';
  const phdOk = !!o.phd || route === 'health-education';
  if ((sit === 'phd-stem' || sit === 'phd-other') && !o.phd) { warnings.push(`${o.code} is not eligible for PhD points: the standard rate applies.`); sit = route === 'isl' ? 'isl' : 'standard'; }
  if (sit === 'postdoc' && !S.postdoc.codes.includes(o.code)) { warnings.push(`The postdoctoral discount only applies to codes ${S.postdoc.codes.join(', ')}.`); sit = route === 'isl' ? 'isl' : 'standard'; }
  let r = rule(sit, transitional);
  if (route === 'health-education') r = { floor: P.skilledWorker.healthEducation.floor, share: 1, option: 'K' };
  base.floor = r.floor; base.share = r.share; base.option = r.option;
  const factor = hours > 0 ? hours / grHours : 1;
  const disc = route === 'health-education' ? gr : discountedRate(o, r.share, r.floor, transitional);
  base.required = Math.max(r.floor, disc != null ? round(disc * factor) : 0);
  base.gap = round(counted - base.required);
  base.passes = gr != null && base.gap >= 0;
  if (sit === 'new-entrant' || sit === 'postdoc') warnings.push(`Your total stay on these discounted rates (including Graduate visa time) is limited to ${S.newEntrant.maxStayYears} years.`);
  if (route === 'tsl') warnings.push(`Temporary Shortage List: the certificate of sponsorship must be issued before ${SOC.tslUntil}; dependants cannot join you on this list unless you were already in a medium skilled job before 22 July 2025.`);

  // 4. Alternatives, for the comparison table.
  const sits: Array<Situation | 'isl'> = route === 'health-education' ? [] : ['standard', ...(islApplies ? ['isl' as const] : []), 'new-entrant', ...(o.phd ? ['phd-stem' as const, 'phd-other' as const] : []), ...(S.postdoc.codes.includes(o.code) ? ['postdoc' as const] : [])];
  base.alternatives = sits.map((x) => {
    const rr = rule(x, transitional);
    const d = discountedRate(o, rr.share, rr.floor, transitional);
    return { situation: x, label: x === 'isl' ? 'Immigration Salary List' : LABEL[x], required: Math.max(rr.floor, d != null ? round(d * factor) : 0), available: x !== 'standard' || !islApplies };
  });
  void phdOk;
  return base;
}
