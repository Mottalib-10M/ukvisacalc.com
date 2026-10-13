/** Display helpers for the tools: pounds without pence unless the amount has pence (£517.50). */
import { formatMoney, formatNumber } from '../../lib/format';
export const gbp = (x: number) => formatMoney(x, Math.round(x * 100) % 100 === 0 ? 0 : 2);
export const int = (x: number) => formatNumber(Math.round(x), 0);
export { longDate } from '../../lib/engine/dates';
