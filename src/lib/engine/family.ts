/**
 * Partner (spouse) visa financial requirement: Appendix FM E-ECP.3.1 / E-LTRP.3.1 (and E-LTRP.3.7
 * for partners first granted before 11 April 2024), savings formula of Appendix FM:
 *   savings needed = £16,000 + 2.5 × (income required − income counted)   (1 × at settlement).
 * Figures: params-2026.json > family.
 */
import P from '../../data/params-2026.json';

const F = P.family;
export type Stage = 'entry' | 'extension' | 'settlement';
export interface SpouseInput {
  /** Partner's gross annual employment or self-employment income (and the applicant's, when in the UK and allowed). */
  employment: number;
  /** Other income the rules accept: pension, property rental, dividends… (gross, annual). */
  other: number;
  /** Cash savings of the couple, held for 6 months. */
  savings: number;
  /** First granted as a partner (or fiancé) before 11 April 2024, extending with the same partner. */
  legacy: boolean;
  /** Children who are not British, Irish or settled (legacy rule only). */
  children: number;
  stage: Stage;
  /** Partner receives a listed disability or carer's benefit: adequate maintenance test instead. */
  exempt?: boolean;
}
export interface SpouseResult {
  required: number;
  income: number;
  incomeGap: number;
  multiplier: number;
  savingsNeeded: number;
  savingsOnlyNeeded: number;
  passesOnIncome: boolean;
  passesWithSavings: boolean;
  passes: boolean;
  savingsCountAsIncome: number;
  exempt: boolean;
}

export function requiredIncome(legacy: boolean, children: number): number {
  if (!legacy) return F.minimumIncome;
  const L = F.legacy, c = Math.max(0, Math.floor(children));
  return Math.min(L.cap, L.base + (c > 0 ? L.firstChild + (c - 1) * L.otherChild : 0));
}

export function spouseTest(inp: SpouseInput): SpouseResult {
  const required = requiredIncome(inp.legacy, inp.children);
  const income = Math.max(0, inp.employment) + Math.max(0, inp.other);
  const multiplier = inp.stage === 'settlement' ? F.savingsMultiplierIlr : F.savingsMultiplier;
  const incomeGap = Math.max(0, required - income);
  const savingsNeeded = incomeGap > 0 ? F.savingsBase + multiplier * incomeGap : 0;
  const savingsOnlyNeeded = F.savingsBase + multiplier * required;
  const passesOnIncome = income >= required;
  const passesWithSavings = !passesOnIncome && inp.savings >= savingsNeeded;
  const savingsCountAsIncome = Math.max(0, (inp.savings - F.savingsBase) / multiplier);
  const exempt = !!inp.exempt;
  return { required, income, incomeGap, multiplier, savingsNeeded, savingsOnlyNeeded, passesOnIncome, passesWithSavings, passes: exempt || passesOnIncome || passesWithSavings, savingsCountAsIncome, exempt };
}
