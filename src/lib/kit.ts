/**
 * Writing kit: every figure a page writes comes from here (params, fee table, occupation table,
 * sponsor register), never typed by hand (RECETTE §17.4 point 7). Server side only.
 */
import P from '../data/params-2026.json';
import SOC from '../data/soc.json';
import SPONSORS from '../data/sponsors-meta.json';
import FEES from '../data/fees.json';
import { FEE, ihs, visaCost, feeLine, HISTORY_SERIES, feeHistory, FEE_DATE } from './engine/fees';
import { checkSkilledWorker, occupation, payOptions, OCCUPATIONS, BANDS, TEACHERS } from './engine/skilled';
import { requiredIncome, spouseTest } from './engine/family';
import { settlementDate, citizenshipDate } from './engine/settlement';
import { decisionDate, skillsCharge, sponsorCost, studentFunds } from './engine/misc';
import { longDate, monthYear, addDays, addMonths, addYears } from './engine/dates';
import { formatMoney, formatNumber, formatPercent } from './format';

/** £41,700 · £517.50 (pence only when there are some). */
const gbp = (x: number) => formatMoney(x, Math.round(x * 100) % 100 === 0 ? 0 : 2);
const int = (x: number) => formatNumber(Math.round(x), 0);
const pct = (x: number, d = 0) => formatPercent(x, d);
/** "a, b and c" */
const listOf = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
/** Occupation by code, failing loudly on an unknown code. */
const occ = (code: string) => { const o = occupation(code); if (!o) throw new Error(`Unknown SOC code ${code}`); return o; };

export const KIT = {
  P, SOC, SPONSORS, FEES, FEE, FEE_DATE, ihs, visaCost, feeLine, HISTORY_SERIES, feeHistory,
  checkSkilledWorker, occ, payOptions, OCCUPATIONS, BANDS, TEACHERS,
  requiredIncome, spouseTest, settlementDate, citizenshipDate, decisionDate, skillsCharge, sponsorCost, studentFunds,
  date: longDate, monthYear, addDays, addMonths, addYears, gbp, int, pct, listOf,
  /** Number of occupations by table of Appendix Skilled Occupations. */
  count: (table: string) => OCCUPATIONS.filter((o) => o.table === table).length,
  isl: () => OCCUPATIONS.filter((o) => o.isl),
  tsl: () => OCCUPATIONS.filter((o) => o.tsl),
};
export type Kit = typeof KIT;
