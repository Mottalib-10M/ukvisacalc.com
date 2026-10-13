/**
 * ILR and citizenship dates with a list of trips abroad: qualifying date, earliest application
 * (28 days early), rolling 180-day check, days left in the last 12 months, then the earliest
 * naturalisation date (450 / 90 days, or 270 / 90 for the spouse of a British citizen).
 * Engine: lib/engine/settlement.ts. Default dates are the build day (hydration rule), then today.
 */
import { useEffect, useMemo, useState } from 'react';
import DateField from '../ui/DateField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import Shell, { Row, Verdict } from './Shell';
import { settlementDate, citizenshipDate, tripDays, ROUTE_YEARS, type SettleRoute, type Trip } from '../../lib/engine/settlement';
import { addMonths, addYears, isIso } from '../../lib/engine/dates';
import { readParams, str, updateURL } from '../../lib/url-state';
import { int, longDate } from './fmt';

type Mode = 'ilr' | 'absence' | 'citizenship';
interface Props { mode?: Mode; initialRoute?: SettleRoute; title?: string; id?: string }
const ROUTES: Array<{ value: SettleRoute; label: string }> = [
  { value: 'skilled-worker', label: 'Skilled Worker or Health and Care (5 years)' },
  { value: 'family', label: 'Spouse or partner visa (5 years)' },
  { value: 'global-talent-3', label: 'Global Talent, 3-year route' },
  { value: 'global-talent-5', label: 'Global Talent, 5-year route' },
  { value: 'ancestry', label: 'UK Ancestry (5 years)' },
  { value: 'long-residence', label: 'Long residence (10 years, any visas)' },
];
const day = typeof __BUILD_DAY__ === 'string' ? __BUILD_DAY__ : '2026-10-13';
const enc = (ts: Trip[]) => ts.filter((t) => isIso(t.out) && isIso(t.back)).map((t) => `${t.out}_${t.back}`).join('.');
const dec = (s: string): Trip[] => s.split('.').map((x) => x.split('_')).filter((p) => p.length === 2 && isIso(p[0]) && isIso(p[1])).map(([out, back]) => ({ out, back }));

export default function SettlementTool({ mode = 'ilr', initialRoute = 'skilled-worker', title, id = 'ilr' }: Props) {
  const defStart = addYears(day, -4);
  const [route, setRoute] = useState<SettleRoute>(initialRoute);
  const [start, setStart] = useState(defStart);
  const [today, setToday] = useState(day);
  const [ilrDate, setIlrDate] = useState('');
  const [spouse, setSpouse] = useState('no');
  const [trips, setTrips] = useState<Trip[]>([{ out: addMonths(day, -14), back: addMonths(day, -13) }]);
  useEffect(() => {
    const u = readParams(window.location.search);
    const now = new Date().toISOString().slice(0, 10);
    setToday(now);
    setRoute(str(u, 'r', initialRoute) as SettleRoute);
    if (u.get('s')) setStart(str(u, 's', defStart));
    if (u.get('ilr')) setIlrDate(str(u, 'ilr', ''));
    setSpouse(str(u, 'sp', 'no'));
    if (u.get('t') !== null) setTrips(dec(str(u, 't', '')));
  }, [initialRoute]);
  const res = useMemo(() => settlementDate(route, isIso(start) ? start : defStart, trips, today), [route, start, trips, today]);
  const ilrFor = isIso(ilrDate) ? ilrDate : res.earliestApply;
  const cit = useMemo(() => citizenshipDate(isIso(start) ? start : defStart, ilrFor, trips, spouse === 'yes'), [start, ilrFor, trips, spouse]);
  useEffect(() => { updateURL({ r: route, s: start, ilr: ilrDate || undefined, sp: spouse === 'yes' ? 'yes' : undefined, t: enc(trips) }); }, [route, start, ilrDate, spouse, trips]);
  const setTrip = (i: number, k: keyof Trip, v: string) => setTrips((ts) => ts.map((t, j) => (j === i ? { ...t, [k]: v } : t)));
  const total = trips.reduce((a, t) => a + (isIso(t.out) && isIso(t.back) && t.back >= t.out ? tripDays(t) : 0), 0);
  const years = ROUTE_YEARS[route];
  const head = mode === 'citizenship'
    ? { label: 'Earliest citizenship application', value: cit.earliest ? longDate(cit.earliest) : 'not within six years' }
    : mode === 'absence'
      ? { label: 'Days you can still spend abroad (rolling 12 months)', value: res.allowanceToday != null ? `${int(res.allowanceToday)} days` : '–' }
      : { label: 'Earliest date to apply for ILR', value: longDate(res.earliestApply) };
  const ok = res.breaches.length === 0;
  return (
    <Shell id={id} title={title ?? (mode === 'citizenship' ? 'British citizenship date calculator' : mode === 'absence' ? 'ILR absence calculator (180-day rule)' : 'ILR date calculator')}
      summary={`${head.label}: ${head.value}`}
      result={<>
        <p className="text-sm font-medium text-navy-700">{head.label}</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{head.value}</p>
        <div className="mt-3"><Verdict ok={route === 'family' ? null : ok}>{route === 'family' ? 'The 5-year partner route sets no fixed absence limit: you must have lived together in the UK, and long or frequent absences need a good reason. The 180-day figure below is shown as a guide only.' : ok ? `No 12-month window holds more than 180 days: your ${years}-year period is unbroken.` : `Continuous residence broken (${res.breaches[0].reason}). The ${years} years restart on ${longDate(res.effectiveStart)}.`}</Verdict></div>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <Row label={`${years} years completed`} value={longDate(res.qualifyingEnd)} />
          <Row label="Apply from (28 days early)" value={longDate(res.earliestApply)} />
          <Row label="Worst 12-month window" value={`${int(res.worst.days)} days`} />
          {res.allowanceToday != null && <Row label="Allowance left today" value={`${int(res.allowanceToday)} days`} />}
          <Row label="Days abroad on the trips listed" value={`${int(total)} days`} />
          <Row label={spouse === 'yes' ? 'Citizenship (spouse of a British citizen)' : 'Citizenship, at the earliest'} value={cit.earliest ? longDate(cit.earliest) : '–'} strong={mode !== 'citizenship'} />
        </tbody></table>
        {cit.checks && <p className="mt-2 text-xs text-navy-700">On that date: {int(cit.checks.absentPeriod)} days abroad in {cit.years} years (limit {cit.checks.maxPeriod}), {int(cit.checks.absent12m)} in the last 12 months (limit {cit.checks.max12m}); set by {cit.reason}.</p>}
        <p className="mt-2 text-xs text-navy-700">Whole days only: the day you leave and the day you come back are not counted. {isIso(ilrDate) ? '' : 'Citizenship assumes ILR granted on the first application date; enter the real date when you have it.'}</p>
      </>}>
      <SelectField id={`${id}-r`} label="Route to settlement" value={route} onChange={(v) => setRoute(v as SettleRoute)} options={ROUTES} className="sm:col-span-2" />
      <DateField id={`${id}-s`} label="Qualifying period starts (entry or grant date)" value={start} onChange={setStart} />
      <DateField id={`${id}-ilr`} label="ILR granted on (if known)" value={ilrDate} onChange={setIlrDate} />
      <Toggle id={`${id}-sp`} label="Married to a British citizen" value={spouse} onChange={setSpouse} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} className="sm:col-span-2" />
      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-medium text-navy-700">Trips outside the UK</legend>
        <div className="space-y-2">
          {trips.map((t, i) => (
            <div key={i} className="grid min-w-0 grid-cols-2 items-end gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <DateField id={`${id}-o${i}`} label={`Left on`} value={t.out} onChange={(v) => setTrip(i, 'out', v)} />
              <DateField id={`${id}-b${i}`} label={`Back on`} value={t.back} onChange={(v) => setTrip(i, 'back', v)} />
              <button type="button" onClick={() => setTrips((ts) => ts.filter((_, j) => j !== i))} className="col-span-2 h-12 rounded-lg border border-navy-300 px-3 text-sm text-navy-700 hover:bg-navy-50 sm:col-span-1" aria-label={`Remove trip ${i + 1}`}>Remove</button>
            </div>
          ))}
        </div>
        {trips.length < 40 && <button type="button" onClick={() => setTrips((ts) => [...ts, { out: today, back: today }])} className="mt-2 h-12 rounded-lg border border-accent-600 px-4 text-sm font-medium text-accent-700 hover:bg-accent-50">Add a trip</button>}
      </fieldset>
    </Shell>
  );
}
