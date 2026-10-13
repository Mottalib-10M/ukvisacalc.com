/**
 * Smaller calculators: decision dates (UKVI service standards), sponsor licence and immigration
 * skills charge, Student visa money. Figures: params-2026.json (processing, sponsor, student).
 */
import P from '../../data/params-2026.json';
import { addDays, addMonths, addWorkingDays, isWorkingDay, type ISO } from './dates';
import { FEE } from './fees';

export type TimeRoute = 'skilled-worker' | 'health-and-care' | 'student' | 'visitor' | 'partner' | 'global-talent' | 'hpi' | 'ancestry' | 'graduate' | 'ilr' | 'citizenship';
export const TIME_LABELS: Record<TimeRoute, string> = {
  'skilled-worker': 'Skilled Worker', 'health-and-care': 'Health and Care Worker', student: 'Student', visitor: 'Standard Visitor', partner: 'Partner or spouse',
  'global-talent': 'Global Talent', hpi: 'High Potential Individual', ancestry: 'UK Ancestry', graduate: 'Graduate', ilr: 'Indefinite leave to remain', citizenship: 'British citizenship',
};
export interface TimeResult { available: boolean; standard: string; expected: ISO | null; priority: ISO | null; superPriority: ISO | null; chaseFrom: ISO | null }

/**
 * Expected decision date from the day the identity check or biometrics appointment is done.
 * The standards count UK working weeks (Monday to Friday, UK public holidays included), so a
 * number of weeks is a number of calendar weeks.
 */
export function decisionDate(route: TimeRoute, where: 'outside' | 'inside', from: ISO): TimeResult {
  const T = P.processing;
  if (route === 'ilr' || route === 'citizenship') {
    const m = route === 'ilr' ? T.ilrMonths : T.citizenshipMonths;
    const expected = addMonths(from, m);
    return { available: true, standard: `${m} months`, expected, priority: route === 'ilr' ? addWorkingDays(from, T.priorityWorkingDays) : null, // Super priority: end of the next working day after a weekday appointment, 2 working days after a weekend one.
      superPriority: route === 'ilr' ? addWorkingDays(from, isWorkingDay(from) || ![0, 6].includes(new Date(from + 'T00:00:00Z').getUTCDay()) ? 1 : 2) : null, chaseFrom: addDays(expected, 1) };
  }
  const weeks = (T[where] as Record<string, number | null>)[route] ?? null;
  if (weeks == null) return { available: false, standard: where === 'outside' ? 'apply from inside the UK' : 'no published standard', expected: null, priority: null, superPriority: null, chaseFrom: null };
  const expected = addDays(from, weeks * 7);
  // Priority timings are published for in-UK applications only; abroad they depend on the visa centre.
  const inUk = where === 'inside';
  return { available: true, standard: `${weeks} weeks`, expected, priority: inUk ? addWorkingDays(from, T.priorityWorkingDays) : null, superPriority: inUk ? addWorkingDays(from, T.superPriorityWorkingDays) : null, chaseFrom: addDays(expected, 1) };
}

/** Immigration skills charge for one worker: first 12 months, then each further 6 months (rounded up). */
export function skillsCharge(months: number, small: boolean, exemptCode = false): number {
  if (exemptCode || months <= 0) return 0;
  const r = small ? P.sponsor.isc.small : P.sponsor.isc.large;
  const m = Math.min(Math.max(months, 12), 60);
  return r.first12 + Math.ceil((m - 12) / 6) * r.perHalf;
}
export interface SponsorCost { licence: number; priority: number; perWorker: { cos: number; isc: number }; workers: number; total: number }
export function sponsorCost(small: boolean, workers: number, months: number, priority: boolean, hasLicence: boolean, exemptCode = false): SponsorCost {
  const licence = hasLicence ? 0 : small ? FEE.licenceSmall() : FEE.licenceLarge();
  const pr = priority && !hasLicence ? FEE.licencePriority() : 0;
  const per = { cos: FEE.cosWorker(), isc: skillsCharge(months, small, exemptCode) };
  const n = Math.max(0, Math.floor(workers));
  return { licence, priority: pr, perWorker: per, workers: n, total: licence + pr + n * (per.cos + per.isc) };
}

/** Student visa money to show: course fees outstanding + living costs (up to 9 months) for the student and each dependant. */
export function studentFunds(london: boolean, courseMonths: number, feesOutstanding: number, dependants: number, applyDate: ISO, inUk12m = false) {
  const S = P.student;
  const rates = applyDate >= S.maintenanceFrom.date ? { london: S.maintenanceFrom.london, outside: S.maintenanceFrom.outside } : S.maintenance;
  const months = Math.min(S.maintenance.maxMonths, Math.max(0, Math.ceil(courseMonths)));
  const monthly = london ? rates.london : rates.outside;
  const living = inUk12m ? 0 : monthly * months;
  const dep = inUk12m ? 0 : Math.max(0, Math.floor(dependants)) * (london ? S.dependants.london : S.dependants.outside) * months;
  return { monthly, months, living, dependants: dep, fees: Math.max(0, feesOutstanding), total: living + dep + Math.max(0, feesOutstanding), newRates: applyDate >= S.maintenanceFrom.date };
}
