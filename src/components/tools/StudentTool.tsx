/**
 * Student visa money: course fees still to pay + living costs for up to 9 months (London or not),
 * for the student and each dependant, with the 30 November 2026 uplift; plus fee and surcharge.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import DateField from '../ui/DateField';
import Toggle from '../ui/Toggle';
import Shell, { Row } from './Shell';
import { studentFunds } from '../../lib/engine/misc';
import { visaCost } from '../../lib/engine/fees';
import { isIso } from '../../lib/engine/dates';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp, longDate } from './fmt';

const day = typeof __BUILD_DAY__ === 'string' ? __BUILD_DAY__ : '2026-10-13';
export default function StudentTool({ title = 'Student visa money calculator', id = 'st' }: { title?: string; id?: string }) {
  const [london, setLondon] = useState('no');
  const [course, setCourse] = useState(12);
  const [fees, setFees] = useState(15000);
  const [deps, setDeps] = useState(0);
  const [visa, setVisa] = useState(16);
  const [date, setDate] = useState(day);
  useEffect(() => { const u = readParams(window.location.search); setLondon(str(u, 'l', 'no')); setCourse(num(u, 'c', 12)); setFees(num(u, 'f', 15000)); setDeps(num(u, 'k', 0)); setVisa(num(u, 'v', 16)); setDate(str(u, 'd', new Date().toISOString().slice(0, 10))); }, []);
  const r = useMemo(() => studentFunds(london === 'yes', course, fees, deps, isIso(date) ? date : day), [london, course, fees, deps, date]);
  const c = useMemo(() => visaCost({ route: 'student', where: 'outside', months: visa, partner: deps > 0, children: Math.max(0, deps - 1) }), [visa, deps]);
  useEffect(() => { updateURL({ l: london === 'yes' ? 'yes' : undefined, c: course, f: fees, k: deps || undefined, v: visa, d: date }); }, [london, course, fees, deps, visa, date]);
  return (
    <Shell id={id} title={title} summary={`Money to show: ${gbp(r.total)}`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Money to show in your account</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{gbp(r.total)}</p>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <Row label="Course fees still to pay (first year)" value={gbp(r.fees)} />
          <Row label={`Living costs: ${r.months} × ${gbp(r.monthly)}`} value={gbp(r.living)} />
          {deps > 0 && <Row label={`Dependants (${deps})`} value={gbp(r.dependants)} />}
          <Row label={`Visa fees (${c.people} ${c.people === 1 ? 'person' : 'people'})`} value={gbp(c.fees)} />
          <Row label={`Health surcharge, ${visa} months`} value={gbp(c.ihsTotal)} />
          <Row label="Paid to the Home Office" value={gbp(c.fees + c.ihsTotal)} strong />
        </tbody></table>
        <p className="mt-2 text-xs text-navy-700">{r.newRates ? `Rates from 30 November 2026 (HC 584).` : `Rates until 29 November 2026; from 30 November 2026 they rise (HC 584).`} The money must be held for 28 days in a row, ending within 31 days of the application. Applied on {longDate(isIso(date) ? date : day)}.</p>
      </>}>
      <Toggle id={`${id}-l`} label="Course in London" value={london} onChange={setLondon} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      <NumberField id={`${id}-c`} label="Course length" value={course} onChange={setCourse} unit="months" max={72} />
      <NumberField id={`${id}-f`} label="Course fees still to pay" value={fees} onChange={setFees} unit="£" max={200000} />
      <NumberField id={`${id}-k`} label="Dependants coming with you" value={deps} onChange={setDeps} max={6} />
      <NumberField id={`${id}-v`} label="Length of the visa" value={visa} onChange={setVisa} unit="months" max={72} />
      <DateField id={`${id}-d`} label="Date you apply" value={date} onChange={setDate} />
    </Shell>
  );
}
