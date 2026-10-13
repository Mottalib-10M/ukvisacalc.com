/**
 * Every calculation of the site, checked against the worked examples GOV.UK prints and against
 * cases computed by hand from the rules (params-2026.json, fees.json, soc.json).
 */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import SOC from '../src/data/soc.json';
import FEES from '../src/data/fees.json';
import { FEE, ihs, visaCost, feeLine, LINES } from '../src/lib/engine/fees';
import { checkSkilledWorker, occupation, payOptions, discountedRate } from '../src/lib/engine/skilled';
import { settlementDate, citizenshipDate, tripDays, absentBetween } from '../src/lib/engine/settlement';
import { spouseTest, requiredIncome } from '../src/lib/engine/family';
import { decisionDate, skillsCharge, sponsorCost, studentFunds } from '../src/lib/engine/misc';
import { addMonths, addWorkingDays, diffDays, longDate } from '../src/lib/engine/dates';

describe('fee table of 8 October 2026', () => {
  it('is the current table', () => { expect(FEES.current).toBe('2026-10-08'); expect(FEES.versions.length).toBeGreaterThanOrEqual(12); });
  it('every lookup resolves to exactly one line', () => {
    for (const [k, f] of Object.entries(FEE)) {
      const args: Record<string, unknown[]> = { skilledWorker: ['outside', 3], healthCare: ['outside', 3], student: ['outside'], globalTalentVisaAfterEndorsement: ['outside'], globalTalentDependant: ['outside'], hpi: ['outside'], scaleUp: ['outside'], innovator: ['outside'] };
      const v = (f as (...a: unknown[]) => number)(...(args[k] ?? []));
      expect(v, k).toBeGreaterThan(0);
    }
  });
  it('matches the figures printed on GOV.UK pages', () => {
    expect(FEE.skilledWorker('outside', 3)).toBe(819);
    expect(FEE.skilledWorker('outside', 5)).toBe(1618);
    expect(FEE.skilledWorker('inside', 3)).toBe(943);
    expect(FEE.skilledWorker('inside', 5)).toBe(1865);
    expect(FEE.skilledWorker('outside', 3, true)).toBe(628);
    expect(FEE.skilledWorker('inside', 5, true)).toBe(1235);
    expect(FEE.healthCare('outside', 3)).toBe(324);
    expect(FEE.healthCare('inside', 5)).toBe(628);
    expect(FEE.familyOutside()).toBe(2064);
    expect(FEE.leaveToRemainOther()).toBe(1407);
    expect(FEE.ilr()).toBe(3226);
    expect(FEE.naturalisation() + FEE.ceremony()).toBe(1839);
    expect(FEE.student('outside')).toBe(558);
    expect(FEE.graduate()).toBe(937);
    expect(FEE.hpi('outside')).toBe(880);
    expect(FEE.globalTalentEndorsement() + FEE.globalTalentVisaAfterEndorsement('outside')).toBe(P.globalTalent.total);
    expect(FEE.globalTalentTotal()).toBe(766);
    expect(FEE.ancestry()).toBe(726);
    expect(FEE.visitor6m()).toBe(135);
    expect(FEE.licenceSmall()).toBe(611);
    expect(FEE.licenceLarge()).toBe(1682);
    expect(FEE.cosWorker()).toBe(525);
    expect(FEE.lifeInUk()).toBe(P.settlement.lifeInUkTest);
    expect(FEE.eta()).toBe(20);
  });
  it('keeps the history of a line across label changes', () => {
    const l = feeLine(2, [/^Skilled Worker/, /three years or less/], [/Health/, /Salary List/]);
    expect(l.amounts['2024-04-10']).toBe(719);
    expect(l.amounts['2025-04-09']).toBe(769);
    expect(l.amounts['2026-04-08']).toBe(819);
    expect(LINES.length).toBeGreaterThan(150);
  });
});

describe('immigration health surcharge', () => {
  it('follows the GOV.UK examples', () => {
    expect(ihs(24, 'outside', true)).toBe(1552); // student, 2-year visa
    expect(ihs(36, 'outside', false)).toBe(3105); // 3-year visa
    expect(ihs(30, 'outside', false)).toBe(2587.5); // family 2y6m adult
    expect(ihs(33, 'outside', false)).toBe(3105); // family 2y9m adult
    expect(ihs(33, 'outside', true)).toBe(2328); // family 2y9m child
    expect(ihs(60, 'outside', false)).toBe(5175);
    expect(ihs(60, 'outside', true)).toBe(3880);
    expect(ihs(36, 'inside', false)).toBe(3105); // graduate PhD 3 years
  });
  it('applies the part-year rules', () => {
    expect(ihs(6, 'outside', false)).toBe(0);
    expect(ihs(6, 'inside', false)).toBe(517.5);
    expect(ihs(6, 'inside', true)).toBe(388);
    expect(ihs(7, 'outside', false)).toBe(1035);
    expect(ihs(18, 'outside', false)).toBe(1552.5);
    expect(ihs(19, 'outside', false)).toBe(2070);
  });
});

describe('total visa cost', () => {
  it('reproduces the Skilled Worker example on GOV.UK (2 years from Argentina: £2,889)', () => {
    const r = visaCost({ route: 'skilled-worker', where: 'outside', months: 24, partner: false, children: 0 });
    expect(r.total).toBe(2889);
  });
  it('adds a family of four on a 5-year Skilled Worker visa', () => {
    const r = visaCost({ route: 'skilled-worker', where: 'outside', months: 60, partner: true, children: 2 });
    expect(r.fees).toBe(4 * 1618);
    expect(r.ihsTotal).toBe(2 * 5175 + 2 * 3880);
    expect(r.total).toBe(6472 + 18110);
  });
  it('charges no surcharge on Health and Care, ILR and citizenship', () => {
    expect(visaCost({ route: 'health-and-care', where: 'outside', months: 60, partner: true, children: 1 }).ihsTotal).toBe(0);
    expect(visaCost({ route: 'ilr', where: 'inside', months: 0, partner: true, children: 0 }).total).toBe(2 * 3226);
    expect(visaCost({ route: 'citizenship', where: 'inside', months: 0, partner: false, children: 0 }).total).toBe(1839);
  });
  it('prices a spouse visa from outside the UK', () => {
    const r = visaCost({ route: 'partner', where: 'outside', months: 33, partner: false, children: 0 });
    expect(r.total).toBe(2064 + 3105);
  });
  it('adds priority fees', () => {
    expect(visaCost({ route: 'skilled-worker', where: 'inside', months: 36, partner: false, children: 0, priority: 'super' }).priority).toBe(1000);
  });
});

describe('Skilled Worker salary test', () => {
  it('uses £41,700 or the going rate, whichever is higher (GOV.UK example: £42,000 against a £45,000 rate fails)', () => {
    const r = checkSkilledWorker({ code: '1111', salary: 88100, hours: 37.5, situation: 'standard', nation: 'England' });
    expect(r.required).toBe(88100); expect(r.passes).toBe(true);
    const low = checkSkilledWorker({ code: '2136', salary: 41000, hours: 37.5, situation: 'standard', nation: 'England' });
    expect(low.required).toBe(P.skilledWorker.general); expect(low.passes).toBe(false); expect(low.gap).toBe(-700);
  });
  it('uses the discounted rates printed in Appendix Skilled Occupations', () => {
    const o = occupation('1111')!;
    expect(checkSkilledWorker({ code: '1111', salary: 61600, hours: 37.5, situation: 'new-entrant', nation: 'England' }).required).toBe(o.r70);
    expect(checkSkilledWorker({ code: '1111', salary: 0, hours: 37.5, situation: 'phd-stem', nation: 'England' }).required).toBe(o.r80);
    expect(checkSkilledWorker({ code: '1111', salary: 0, hours: 37.5, situation: 'phd-other', nation: 'England' }).required).toBe(o.r90);
  });
  it('never goes below the floors', () => {
    const r = checkSkilledWorker({ code: '2136', salary: 0, hours: 37.5, situation: 'new-entrant', nation: 'England' });
    expect(r.required).toBe(P.skilledWorker.newEntrant.floor);
    const p = checkSkilledWorker({ code: '2136', salary: 0, hours: 37.5, situation: 'phd-other', nation: 'England' });
    expect(p.required).toBe(P.skilledWorker.phdOther.floor);
  });
  it('pro-rates the going rate to the hours, not the floor', () => {
    const r = checkSkilledWorker({ code: '1111', salary: 0, hours: 30, situation: 'standard', nation: 'England' });
    expect(r.required).toBe(70480); // 88,100 × 30 / 37.5
    const f = checkSkilledWorker({ code: '2136', salary: 0, hours: 20, situation: 'standard', nation: 'England' });
    expect(f.required).toBe(41700);
    const n = checkSkilledWorker({ code: '2136', salary: 0, hours: 45, situation: 'new-entrant', nation: 'England' });
    expect(n.required).toBeCloseTo(41200 * 0.7 * 45 / 37.5 > 33400 ? 41200 * 0.7 * 45 / 37.5 : 33400, 2);
  });
  it('counts only 48 hours (SW 14.3 example: 60 h at £15 = £37,440)', () => {
    const r = checkSkilledWorker({ code: '1111', salary: 15 * 60 * 52, hours: 60, situation: 'standard', nation: 'England' });
    expect(r.countedSalary).toBe(37440);
  });
  it('refuses Table 6 and medium skilled codes off the lists', () => {
    expect(checkSkilledWorker({ code: '1112', salary: 90000, hours: 37.5, situation: 'standard', nation: 'England' }).eligibleCode).toBe(false);
    expect(checkSkilledWorker({ code: '5434', salary: 90000, hours: 37.5, situation: 'standard', nation: 'England' }).eligibleCode).toBe(false);
  });
  it('accepts a medium skilled code on the Temporary Shortage List at the general threshold', () => {
    const r = checkSkilledWorker({ code: '5241', salary: 42000, hours: 37.5, situation: 'standard', nation: 'England' });
    expect(r.route).toBe('tsl'); expect(r.required).toBe(41700); expect(r.passes).toBe(true);
  });
  it('applies the Immigration Salary List floor (option D)', () => {
    const isl = SOC.occupations.find((o: { isl?: { all: boolean; nations: string[] }; tier: string }) => o.isl?.all && o.isl.nations.includes('England') && o.tier === 'medium') as { code: string; goingRate: number };
    const r = checkSkilledWorker({ code: isl.code, salary: 0, hours: 37.5, situation: 'standard', nation: 'England' });
    expect(r.route).toBe('isl'); expect(r.option).toBe('D'); expect(r.required).toBe(Math.max(33400, isl.goingRate));
  });
  it('closes care worker codes to applications from outside the UK', () => {
    expect(checkSkilledWorker({ code: '6135', salary: 40000, hours: 37.5, situation: 'standard', nation: 'England' }).eligibleCode).toBe(false);
    expect(checkSkilledWorker({ code: '6135', salary: 40000, hours: 37.5, situation: 'standard', nation: 'England', inside: true }).eligibleCode).toBe(true);
  });
  it('uses the national pay scale for health and education codes', () => {
    const o = occupation('2237')!;
    const opts = payOptions(o, 'England');
    const b5 = opts.find((x) => x.label === 'Band 5')!;
    const r = checkSkilledWorker({ code: '2237', salary: 31000, hours: 37.5, situation: 'standard', nation: 'England', payRate: b5.rate });
    expect(r.required).toBe(Math.max(25000, b5.rate)); expect(r.option).toBe('K');
    expect(payOptions(occupation('2212')!, 'Scotland').length).toBeGreaterThan(3);
    expect(payOptions(occupation('2313')!, 'England', 'Inner London').find((x) => x.label === 'Qualified teachers')!.rate).toBeGreaterThan(30000);
  });
  it('uses options F to J for Health and Care ASHE jobs at an NHS or regulated care employer', () => {
    const r = checkSkilledWorker({ code: '6135', salary: 0, hours: 37.5, situation: 'standard', nation: 'England', inside: true, healthEmployer: true });
    expect(r.option).toBe('I'); expect(r.required).toBe(25000);
    expect(checkSkilledWorker({ code: '6135', salary: 0, hours: 37.5, situation: 'standard', nation: 'England', inside: true }).required).toBe(33400);
  });
  it('keeps the transitional rates for workers sponsored before 4 April 2024', () => {
    const r = checkSkilledWorker({ code: '1111', salary: 60000, hours: 37.5, situation: 'standard', nation: 'England', transitional: true });
    expect(r.required).toBe(60000); expect(r.option).toBe('F');
  });
  it('reads every Table 1 occupation with a going rate', () => {
    const t1 = SOC.occupations.filter((o: { table: string }) => o.table === 'Table 1');
    expect(t1.length).toBe(91);
    for (const o of t1 as Array<{ code: string; goingRate: number }>) expect(o.goingRate, o.code).toBeGreaterThan(20000);
    expect(discountedRate(occupation('2136')!, 0.7, 33400, false)).toBeCloseTo(28840, 0);
  });
});

describe('settlement and absences', () => {
  it('counts whole days only', () => {
    expect(tripDays({ out: '2030-07-01', back: '2030-08-10' })).toBe(39);
    expect(tripDays({ out: '2026-01-01', back: '2026-01-02' })).toBe(0);
    expect(absentBetween([{ out: '2026-01-01', back: '2026-01-11' }], '2026-01-05', '2026-02-01')).toBe(6);
  });
  it('gives the 5-year date and the 28-day early window', () => {
    const r = settlementDate('skilled-worker', '2022-03-15', []);
    expect(r.qualifyingEnd).toBe('2027-03-15');
    expect(r.earliestApply).toBe('2027-02-15');
    expect(r.breaches.length).toBe(0);
  });
  it('accepts 180 days in 12 months and breaks at 181', () => {
    const ok = settlementDate('skilled-worker', '2022-01-01', [{ out: '2023-01-01', back: '2023-06-30' }]); // 179 whole days
    expect(tripDays({ out: '2023-01-01', back: '2023-06-30' })).toBe(179);
    expect(ok.breaches.length).toBe(0);
    const okTwo = settlementDate('skilled-worker', '2022-01-01', [{ out: '2023-01-01', back: '2023-04-01' }, { out: '2023-06-01', back: '2023-08-02' }]); // 89 + 61
    expect(okTwo.breaches.length).toBe(0);
    const bad = settlementDate('skilled-worker', '2022-01-01', [{ out: '2023-01-01', back: '2023-04-12' }, { out: '2023-06-01', back: '2023-09-01' }]); // 100 + 91 = 191
    expect(bad.breaches.length).toBe(1);
    expect(bad.effectiveStart).toBe('2023-09-01');
    expect(bad.qualifyingEnd).toBe('2028-09-01');
  });
  it('uses a rolling window, not calendar years', () => {
    // 100 days at the end of 2023 and 100 days at the start of 2024: 200 in one 12-month window
    const r = settlementDate('skilled-worker', '2022-01-01', [{ out: '2023-09-20', back: '2023-12-30' }, { out: '2024-01-01', back: '2024-04-11' }]);
    expect(r.breaches.length).toBe(1);
  });
  it('keeps the 548 / 184-day limits for long residence absences before 11 April 2024', () => {
    const r = settlementDate('long-residence', '2016-01-01', [{ out: '2020-01-01', back: '2020-06-20' }]); // 170 days, before the cut-off
    expect(r.breaches.length).toBe(0);
    const s = settlementDate('long-residence', '2016-01-01', [{ out: '2020-01-01', back: '2020-07-10' }]); // 190 days in one absence
    expect(s.breaches[0].reason).toMatch(/184/);
    expect(settlementDate('long-residence', '2016-01-01', []).qualifyingEnd).toBe('2026-01-01');
  });
  it('sets no day limit on the 5-year partner route (Appendix FM, not Continuous Residence)', () => {
    const r = settlementDate('family', '2022-01-01', [{ out: '2023-01-01', back: '2023-09-01' }]);
    expect(r.breaches.length).toBe(0); expect(r.qualifyingEnd).toBe('2027-01-01');
  });
  it('reports the days left in the last 12 months', () => {
    const r = settlementDate('skilled-worker', '2024-01-01', [{ out: '2026-02-01', back: '2026-03-03' }], '2026-10-13');
    expect(r.allowanceToday).toBe(180 - 29);
  });
});

describe('citizenship', () => {
  it('waits 12 months after ILR when not married to a British citizen', () => {
    const r = citizenshipDate('2020-01-10', '2025-01-10', [], false);
    expect(r.earliest).toBe('2026-01-10');
  });
  it('allows the spouse of a British citizen to apply on ILR after 3 years', () => {
    const r = citizenshipDate('2022-05-01', '2025-06-01', [], true);
    expect(r.earliest).toBe('2025-06-01');
  });
  it('pushes the date back when absences exceed 90 days in the last 12 months', () => {
    const r = citizenshipDate('2019-01-01', '2024-06-01', [{ out: '2025-01-01', back: '2025-05-01' }], false);
    // 119 days away in early 2025: the last 12 months hold more than 90 until early 2026
    expect(r.earliest! > '2025-06-01').toBe(true);
    expect(r.checks!.absent12m).toBeLessThanOrEqual(90);
  });
  it('requires presence in the UK exactly 5 years before (GOV.UK example)', () => {
    // left 10 June 2017, back 25 June 2017: cannot apply on 20 June 2022, can from 24 June 2022
    const r = citizenshipDate('2017-01-01', '2020-01-01', [{ out: '2017-06-10', back: '2017-06-25' }], false);
    expect(r.earliest).toBe('2022-01-01');
    const late = citizenshipDate('2017-01-01', '2021-06-20', [{ out: '2017-06-10', back: '2017-06-25' }], false);
    expect(late.earliest).toBe('2022-06-24');
  });
});

describe('spouse visa income', () => {
  it('requires £29,000 under the current rule', () => {
    expect(requiredIncome(false, 3)).toBe(29000);
    expect(spouseTest({ employment: 29000, other: 0, savings: 0, legacy: false, children: 0, stage: 'entry' }).passes).toBe(true);
  });
  it('keeps £18,600 + £3,800 + £2,400 for partners first granted before 11 April 2024, capped at £29,000', () => {
    expect(requiredIncome(true, 0)).toBe(18600);
    expect(requiredIncome(true, 2)).toBe(24800);
    expect(requiredIncome(true, 5)).toBe(29000);
  });
  it('uses savings above £16,000 divided by 2.5', () => {
    const r = spouseTest({ employment: 25000, other: 0, savings: 26000, legacy: false, children: 0, stage: 'entry' });
    expect(r.savingsNeeded).toBe(26000); expect(r.passes).toBe(true);
    expect(spouseTest({ employment: 0, other: 0, savings: 0, legacy: false, children: 0, stage: 'entry' }).savingsOnlyNeeded).toBe(88500);
    expect(spouseTest({ employment: 0, other: 0, savings: 0, legacy: false, children: 0, stage: 'settlement' }).savingsOnlyNeeded).toBe(45000);
  });
});

describe('dates, processing times, sponsors and students', () => {
  it('handles month ends and working days', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(diffDays('2026-10-13', '2026-11-03')).toBe(21);
    expect(addWorkingDays('2026-12-24', 1)).toBe('2026-12-29'); // Christmas and Boxing Day (substitute 28 Dec)
    expect(longDate('2026-10-08')).toBe('8 October 2026');
  });
  it('gives decision dates from the service standards', () => {
    expect(decisionDate('skilled-worker', 'outside', '2026-10-13').expected).toBe('2026-11-03');
    expect(decisionDate('skilled-worker', 'inside', '2026-10-13').expected).toBe('2026-12-08');
    expect(decisionDate('partner', 'outside', '2026-10-13').expected).toBe('2027-01-05');
    expect(decisionDate('ilr', 'inside', '2026-10-13').expected).toBe('2027-04-13');
    expect(decisionDate('graduate', 'outside', '2026-10-13').available).toBe(false);
  });
  it('computes the immigration skills charge', () => {
    expect(skillsCharge(60, true)).toBe(2400);
    expect(skillsCharge(60, false)).toBe(6600);
    expect(skillsCharge(8, false)).toBe(1320);
    expect(skillsCharge(36, false)).toBe(1320 + 4 * 660);
    expect(skillsCharge(36, false, true)).toBe(0);
    expect(sponsorCost(true, 2, 36, false, false).total).toBe(611 + 2 * (525 + 480 + 4 * 240));
  });
  it('switches the Student maintenance figures on 30 November 2026', () => {
    expect(studentFunds(true, 12, 0, 0, '2026-10-13').living).toBe(1529 * 9);
    expect(studentFunds(false, 12, 0, 0, '2026-12-01').living).toBe(1203 * 9);
    expect(studentFunds(false, 6, 5000, 1, '2026-10-13').total).toBe(1171 * 6 + 680 * 6 + 5000);
  });
});
