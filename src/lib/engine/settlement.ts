/**
 * Settlement (indefinite leave to remain) and naturalisation dates.
 *
 * Rules applied (params-2026.json > settlement, citizenship; sources: Appendix Continuous Residence,
 * Home Office continuous residence guidance v10.0, GOV.UK ILR and citizenship pages):
 *  - qualifying period of 3, 5 or 10 years counted from the start date the visitor gives;
 *  - you may apply up to 28 days before the period ends (CR 1.1: the period may be counted back
 *    from any date up to 28 days after the application);
 *  - absences: whole days only (the day you leave and the day you return are not counted); no more
 *    than 180 days in any rolling 12-month window; long residence keeps the old limits (548 days in
 *    total, 184 days at a time) for absences that began before 11 April 2024;
 *  - a breach restarts the qualifying period on the day after the return from the trip that broke it
 *    (a simplification: the Home Office can accept "compelling" reasons, which the tool cannot judge);
 *  - citizenship: 5 years (3 if married to a British citizen) with at most 450 days (270) outside in
 *    the period, 90 in the last 12 months, present in the UK exactly 5 (3) years before the
 *    application, and ILR held for 12 months unless married to a British citizen.
 */
import P from '../../data/params-2026.json';
import { addDays, addMonths, addYears, diffDays, isIso, maxIso, type ISO } from './dates';

export interface Trip { out: ISO; back: ISO }
export type SettleRoute = 'skilled-worker' | 'global-talent-3' | 'global-talent-5' | 'family' | 'ancestry' | 'long-residence';

export const ROUTE_YEARS: Record<SettleRoute, number> = {
  'skilled-worker': P.settlement.skilledWorkerYears,
  'global-talent-3': P.settlement.globalTalentFastYears,
  'global-talent-5': P.settlement.globalTalentYears,
  family: P.settlement.familyYears,
  ancestry: P.settlement.ancestryYears,
  'long-residence': P.settlement.longResidenceYears,
};

/** Whole days outside the UK on one trip: the departure and return days are not counted. */
export const tripDays = (t: Trip) => Math.max(0, diffDays(t.out, t.back) - 1);

/** Valid trips only (both dates, back on or after out), sorted by departure. */
export function cleanTrips(trips: Trip[]): Trip[] {
  return trips.filter((t) => isIso(t.out) && isIso(t.back) && t.back >= t.out).sort((a, b) => (a.out < b.out ? -1 : 1));
}

/** Days absent (whole days) that fall inside [from, to). */
export function absentBetween(trips: Trip[], from: ISO, to: ISO): number {
  let n = 0;
  for (const t of trips) {
    const a = maxIso(addDays(t.out, 1), from); // first whole day away
    const lastAway = addDays(t.back, -1);
    const b = lastAway < addDays(to, -1) ? lastAway : addDays(to, -1);
    if (b >= a) n += diffDays(a, b) + 1;
  }
  return n;
}

/** Largest number of absent days in any 12-month window [d, d + 12 months) inside [from, to]. */
export function worstWindow(trips: Trip[], from: ISO, to: ISO): { days: number; start: ISO; end: ISO } {
  let best = { days: 0, start: from, end: addMonths(from, 12) };
  // The worst window always starts on a first whole day of absence (or at the period start).
  const starts = [from, ...trips.map((t) => addDays(t.out, 1)).filter((d) => d >= from && d <= to)];
  for (const s of starts) {
    const e = addMonths(s, 12);
    const days = absentBetween(trips, s, e < addDays(to, 1) ? e : addDays(to, 1));
    if (days > best.days) best = { days, start: s, end: e };
  }
  return best;
}

export interface SettlementResult {
  route: SettleRoute;
  years: number;
  start: ISO;
  /** Start after any breach of continuous residence (equal to `start` when nothing broke). */
  effectiveStart: ISO;
  qualifyingEnd: ISO;
  earliestApply: ISO;
  worst: { days: number; start: ISO; end: ISO };
  totalAbsent: number;
  breaches: Array<{ trip: Trip; reason: string; restart: ISO }>;
  /** Days still allowed in the 12 months ending on `today` (null if `today` is outside the period). */
  allowanceToday: number | null;
}

/**
 * Checks one qualifying period day by day; returns the first breach, if any. A breach happens on the
 * first day of absence that takes a rolling 12-month window over 180 days (window ending that day,
 * starting the day after the same date a year earlier), or, for long residence, the first day over
 * the old 184-day / 548-day limits.
 */
function firstBreach(route: SettleRoute, trips: Trip[], start: ISO, end: ISO): { trip: Trip; reason: string } | null {
  const max = P.settlement.maxAbsenceDays;
  const L = P.settlement.longResidenceLegacy;
  const n = diffDays(start, end);
  if (n <= 0) return null;
  const awayIdx = new Int32Array(n).fill(-1); // index of the trip covering each day, -1 when in the UK
  trips.forEach((t, k) => {
    const a = Math.max(0, diffDays(start, addDays(t.out, 1)));
    const b = Math.min(n - 1, diffDays(start, addDays(t.back, -1)));
    for (let i = a; i <= b; i++) awayIdx[i] = k;
  });
  const legacy = (k: number) => route === 'long-residence' && trips[k].out < L.cutoff;
  const prefix = new Int32Array(n + 1); // rolling-rule days only
  let legacyTotal = 0, run = 0, prevK = -1;
  for (let i = 0; i < n; i++) {
    const k = awayIdx[i];
    const rolling = k >= 0 && !legacy(k);
    prefix[i + 1] = prefix[i] + (rolling ? 1 : 0);
    if (k >= 0 && legacy(k)) {
      run = k === prevK ? run + 1 : 1;
      legacyTotal++;
      if (run > L.singleDays) return { trip: trips[k], reason: `more than ${L.singleDays} days in one absence that began before 11 April 2024` };
      if (legacyTotal > L.totalDays) return { trip: trips[k], reason: `more than ${L.totalDays} days in total for absences that began before 11 April 2024` };
    }
    prevK = k;
    if (rolling) {
      const day = addDays(start, i);
      const from = Math.max(0, diffDays(start, addMonths(day, -12)) + 1);
      if (prefix[i + 1] - prefix[from] > max) return { trip: trips[k], reason: `more than ${max} days outside the UK in a 12-month period` };
    }
  }
  return null;
}

export function settlementDate(route: SettleRoute, start: ISO, tripsIn: Trip[], today?: ISO): SettlementResult {
  const years = ROUTE_YEARS[route];
  const trips = cleanTrips(tripsIn);
  let s = start;
  const breaches: SettlementResult['breaches'] = [];
  for (let i = 0; i < 20; i++) {
    const end = addYears(s, years);
    const b = firstBreach(route, trips, s, end);
    if (!b) break;
    const restart = addDays(b.trip.back, 0);
    breaches.push({ ...b, restart });
    s = restart;
  }
  const end = addYears(s, years);
  const worst = worstWindow(trips, s, end);
  const allowanceToday = today && today >= s && today <= end ? Math.max(0, P.settlement.maxAbsenceDays - absentBetween(trips, maxIso(addMonths(today, -12), s), addDays(today, 1))) : null;
  return {
    route, years, start, effectiveStart: s, qualifyingEnd: end,
    earliestApply: addDays(end, -P.settlement.applyEarlyDays),
    worst, totalAbsent: absentBetween(trips, s, end), breaches, allowanceToday,
  };
}

export interface CitizenshipResult {
  spouse: boolean;
  years: number;
  earliest: ISO | null;
  /** The constraint that set the date. */
  reason: string;
  ilrPlus12: ISO | null;
  checks: { absentPeriod: number; maxPeriod: number; absent12m: number; max12m: number; presentAtStart: boolean } | null;
}

/** Whether the visitor was outside the UK (a whole day away) on date d. */
const awayOn = (trips: Trip[], d: ISO) => trips.some((t) => d > t.out && d < t.back);

/**
 * Earliest naturalisation application date on or after `from` (and after ILR + 12 months unless
 * married to a British citizen), scanning day by day for up to 6 years.
 */
export function citizenshipDate(ukStart: ISO, ilrDate: ISO, tripsIn: Trip[], spouse: boolean): CitizenshipResult {
  const C = P.citizenship;
  const trips = cleanTrips(tripsIn);
  const years = spouse ? C.spouseResidenceYears : C.residenceYears;
  const maxPeriod = spouse ? C.spouseMaxAbsence3y : C.maxAbsence5y;
  const max12 = spouse ? C.spouseMaxAbsence12m : C.maxAbsence12m;
  const ilrPlus12 = spouse ? null : addMonths(ilrDate, C.ilrHeldMonths);
  const first = maxIso(spouse ? ilrDate : ilrPlus12!, addYears(ukStart, years));
  for (let i = 0; i < 366 * 6; i++) {
    const a = addDays(first, i);
    const ps = addYears(a, -years);
    const absentPeriod = absentBetween(trips, ps, a);
    const absent12m = absentBetween(trips, addMonths(a, -12), a);
    // GOV.UK example: received 20 June 2022, back in the UK on 25 June 2017 → wait until 24 June 2022.
    // The period therefore opens the day after the same date five years earlier.
    const open = addDays(ps, 1);
    const presentAtStart = !awayOn(trips, open) && open > ukStart;
    if (absentPeriod <= maxPeriod && absent12m <= max12 && presentAtStart) {
      const reason = i === 0 ? (first === ilrPlus12 ? `12 months after indefinite leave` : first === ilrDate ? 'the day you hold indefinite leave' : `${years} years after you started living in the UK`) : 'your absences push the date back';
      return { spouse, years, earliest: a, reason, ilrPlus12, checks: { absentPeriod, maxPeriod, absent12m, max12m: max12, presentAtStart } };
    }
  }
  return { spouse, years, earliest: null, reason: 'absences too long within the next six years', ilrPlus12, checks: null };
}
