/**
 * Decision date from the UKVI service standards (updated 9 September 2026): weeks counted from the
 * identity check or biometrics appointment; ILR and citizenship in months. Engine: misc.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import DateField from '../ui/DateField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import Shell, { Row, Verdict } from './Shell';
import { decisionDate, TIME_LABELS, type TimeRoute } from '../../lib/engine/misc';
import { isIso } from '../../lib/engine/dates';
import { readParams, str, updateURL } from '../../lib/url-state';
import { longDate } from './fmt';

interface Props { initialRoute?: TimeRoute; initialWhere?: 'outside' | 'inside'; title?: string; id?: string }
const day = typeof __BUILD_DAY__ === 'string' ? __BUILD_DAY__ : '2026-10-13';
export default function TimeTool({ initialRoute = 'skilled-worker', initialWhere = 'outside', title = 'Visa decision date calculator', id = 'tm' }: Props) {
  const [route, setRoute] = useState<TimeRoute>(initialRoute);
  const [where, setWhere] = useState(initialWhere);
  const [from, setFrom] = useState(day);
  useEffect(() => { const u = readParams(window.location.search); setRoute(str(u, 'r', initialRoute) as TimeRoute); setWhere(str(u, 'w', initialWhere) as 'outside'); setFrom(str(u, 'd', new Date().toISOString().slice(0, 10))); }, [initialRoute, initialWhere]);
  const r = useMemo(() => decisionDate(route, route === 'ilr' || route === 'citizenship' || route === 'graduate' ? 'inside' : where, isIso(from) ? from : day), [route, where, from]);
  useEffect(() => { updateURL({ r: route, w: where, d: from }); }, [route, where, from]);
  return (
    <Shell id={id} title={title} summary={r.expected ? `Decision expected by ${longDate(r.expected)}` : r.standard}
      result={<>
        <p className="text-sm font-medium text-navy-700">Decision expected by</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{r.expected ? longDate(r.expected) : '–'}</p>
        <div className="mt-3"><Verdict ok={r.available ? true : null}>{r.available ? `UKVI service standard: ${r.standard}.` : `No standard: ${r.standard}.`}</Verdict></div>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          {r.priority && <Row label="With priority (5 working days)" value={longDate(r.priority)} />}
          {r.superPriority && <Row label={route === 'ilr' ? 'With super priority (2 working days)' : 'With super priority (next working day)'} value={longDate(r.superPriority)} />}
          {r.chaseFrom && <Row label="Contact UKVI if no news after" value={longDate(r.chaseFrom)} />}
        </tbody></table>
        <p className="mt-2 text-xs text-navy-700">Counted from the day you prove your identity (app or appointment), not the day you pay. Working days skip weekends and bank holidays in England and Wales. Abroad, faster services depend on the visa centre: their timing is given when you book.</p>
      </>}>
      <SelectField id={`${id}-r`} label="Application" value={route} onChange={(v) => setRoute(v as TimeRoute)} options={Object.entries(TIME_LABELS).map(([value, label]) => ({ value, label }))} />
      <Toggle id={`${id}-w`} label="Applying from" value={where} onChange={(v) => setWhere(v as 'outside')} options={[{ value: 'outside', label: 'Outside UK' }, { value: 'inside', label: 'Inside UK' }]} />
      <DateField id={`${id}-d`} label="Identity check or biometrics on" value={from} onChange={setFrom} />
    </Shell>
  );
}
