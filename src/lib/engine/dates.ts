/**
 * Calendar arithmetic on ISO dates ("2026-10-13"), in UTC so that a date never shifts with the
 * visitor's time zone or with summer time. Every date the engine returns is an ISO string.
 */
import HOL from '../../data/bank-holidays.json';

export type ISO = string;
const DAY = 86_400_000;

export const isIso = (s: unknown): s is ISO => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));
export const toMs = (d: ISO) => Date.parse(d + 'T00:00:00Z');
export const fromMs = (ms: number): ISO => new Date(ms).toISOString().slice(0, 10);
export const addDays = (d: ISO, n: number): ISO => fromMs(toMs(d) + n * DAY);
/** Whole days from a to b (b − a). */
export const diffDays = (a: ISO, b: ISO) => Math.round((toMs(b) - toMs(a)) / DAY);

/** Same day n months later; the 31st falls back to the last day of a shorter month (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(d: ISO, n: number): ISO {
  const [y, m, day] = d.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  return fromMs(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), Math.min(day, last)));
}
export const addYears = (d: ISO, n: number) => addMonths(d, Math.round(n * 12));
export const minIso = (...xs: ISO[]) => xs.reduce((a, b) => (a < b ? a : b));
export const maxIso = (...xs: ISO[]) => xs.reduce((a, b) => (a > b ? a : b));

/** Bank holidays of England and Wales (UKVI works to them; Scotland and Northern Ireland differ). */
const HOLIDAYS = new Set<string>((HOL as Record<string, string[]>)['england-and-wales'] ?? []);
export const isWorkingDay = (d: ISO) => { const w = new Date(toMs(d)).getUTCDay(); return w !== 0 && w !== 6 && !HOLIDAYS.has(d); };
/** The n-th working day after d (d itself not counted). */
export function addWorkingDays(d: ISO, n: number): ISO {
  let x = d, k = 0;
  while (k < n) { x = addDays(x, 1); if (isWorkingDay(x)) k++; }
  return x;
}
export const holidayYears = () => [...HOLIDAYS].map((h) => h.slice(0, 4)).filter((y, i, a) => a.indexOf(y) === i);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "13 October 2026" (British order). */
export function longDate(d: ISO): string {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ${MONTHS[m - 1]} ${y}`;
}
export const monthYear = (d: ISO) => { const [y, m] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${y}`; };
