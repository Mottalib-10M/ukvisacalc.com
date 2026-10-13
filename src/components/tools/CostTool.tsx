/**
 * Total cost of a UK visa for a family: application fee per person + immigration health surcharge
 * per person (reduced rate for children and students) + optional priority service.
 * Engine: lib/engine/fees.ts (fee table of 8 October 2026). URL: ?r=&w=&m=&p=&c=&isl=&pr=
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import Shell, { Row } from './Shell';
import { visaCost, DEFAULT_MONTHS, FEE_DATE, type CostRoute, type Where } from '../../lib/engine/fees';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp, longDate } from './fmt';

const ROUTES: Array<{ value: CostRoute; label: string }> = [
  { value: 'skilled-worker', label: 'Skilled Worker' }, { value: 'health-and-care', label: 'Health and Care Worker' },
  { value: 'partner', label: 'Spouse or partner (family visa)' }, { value: 'fiance', label: 'Fiancé(e) visa' },
  { value: 'student', label: 'Student' }, { value: 'graduate', label: 'Graduate' }, { value: 'global-talent', label: 'Global Talent' },
  { value: 'hpi', label: 'High Potential Individual' }, { value: 'ancestry', label: 'UK Ancestry' }, { value: 'visitor', label: 'Standard Visitor' },
  { value: 'ilr', label: 'Indefinite leave to remain' }, { value: 'citizenship', label: 'British citizenship' },
];
const FIXED: Partial<Record<CostRoute, number[]>> = { partner: [33, 30], fiance: [6], graduate: [24, 18, 36], hpi: [24, 36], visitor: [6, 24, 60, 120], ilr: [0], citizenship: [0] };
interface Props { initialRoute?: CostRoute; initialWhere?: Where; initialMonths?: number; initialPartner?: boolean; initialChildren?: number; title?: string; id?: string }

export default function CostTool({ initialRoute = 'skilled-worker', initialWhere = 'outside', initialMonths, initialPartner = false, initialChildren = 0, title = 'UK visa cost calculator', id = 'cost' }: Props) {
  const [route, setRoute] = useState<CostRoute>(initialRoute);
  const [where, setWhere] = useState<Where>(initialWhere);
  const [months, setMonths] = useState(initialMonths ?? DEFAULT_MONTHS[initialRoute]);
  const [partner, setPartner] = useState(initialPartner ? 'yes' : 'no');
  const [children, setChildren] = useState(initialChildren);
  const [isl, setIsl] = useState('no');
  const [prio, setPrio] = useState<'none' | 'priority' | 'super'>('none');
  useEffect(() => {
    const u = readParams(window.location.search);
    const r = str(u, 'r', initialRoute) as CostRoute;
    setRoute(r); setWhere(str(u, 'w', initialWhere) as Where); setMonths(num(u, 'm', initialMonths ?? DEFAULT_MONTHS[r]));
    setPartner(str(u, 'p', initialPartner ? 'yes' : 'no')); setChildren(num(u, 'c', initialChildren)); setIsl(str(u, 'isl', 'no')); setPrio(str(u, 'pr', 'none') as 'none');
  }, [initialRoute, initialWhere, initialMonths, initialPartner, initialChildren]);
  const r = useMemo(() => visaCost({ route, where, months, partner: partner === 'yes', children, isl: isl === 'yes', priority: prio }), [route, where, months, partner, children, isl, prio]);
  useEffect(() => { updateURL({ r: route, w: where, m: months, p: partner === 'yes' ? 'yes' : undefined, c: children || undefined, isl: isl === 'yes' ? 'yes' : undefined, pr: prio === 'none' ? undefined : prio }); }, [route, where, months, partner, children, isl, prio]);
  const fixed = FIXED[route];
  const changeRoute = (v: string) => { const x = v as CostRoute; setRoute(x); setMonths(FIXED[x]?.[0] ?? DEFAULT_MONTHS[x]); if (x === 'graduate') setWhere('inside'); if (x === 'fiance') setWhere('outside'); };
  const monthLabel = (m: number) => (m === 0 ? 'not applicable' : m % 12 === 0 ? `${m / 12} year${m === 12 ? '' : 's'}` : m < 12 ? `${m} months` : `${Math.floor(m / 12)} years ${m % 12} months`);
  return (
    <Shell id={id} title={title} summary={`Total: ${gbp(r.total)} for ${r.people} ${r.people === 1 ? 'person' : 'people'}`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Total to pay when you apply</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{gbp(r.total)}</p>
        <p className="mt-1 text-xs text-navy-700">{r.feeLabel} · Home Office fees of {longDate(FEE_DATE)}</p>
        <table className="mt-3 w-full text-sm"><thead><tr className="text-left text-xs text-navy-600"><th className="py-1 font-medium">Person</th><th className="py-1 text-right font-medium">Fee</th><th className="py-1 text-right font-medium">Surcharge</th></tr></thead>
          <tbody className="divide-y divide-navy-200">{r.lines.map((l) => <tr key={l.who}><td className="py-1.5 text-navy-700">{l.who}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{gbp(l.fee)}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{gbp(l.ihs)}</td></tr>)}</tbody></table>
        <table className="mt-2 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <Row label="Application fees" value={gbp(r.fees)} />
          <Row label={`Health surcharge (${monthLabel(r.months)})`} value={gbp(r.ihsTotal)} />
          {r.priority > 0 && <Row label="Faster decision" value={gbp(r.priority)} />}
          <Row label="Total" value={gbp(r.total)} strong />
        </tbody></table>
        {r.notes.map((n) => <p key={n} className="mt-2 text-xs text-navy-700">{n}</p>)}
      </>}>
      <SelectField id={`${id}-r`} label="Visa" value={route} onChange={changeRoute} options={ROUTES} />
      <Toggle id={`${id}-w`} label="Applying from" value={where} onChange={(v) => setWhere(v as Where)} options={[{ value: 'outside', label: 'Outside UK' }, { value: 'inside', label: 'Inside UK' }]} />
      {fixed ? <SelectField id={`${id}-m`} label="Length of the visa" value={String(months)} onChange={(v) => setMonths(Number(v))} options={fixed.map((m) => ({ value: String(m), label: monthLabel(m) }))} />
        : <NumberField id={`${id}-m`} label="Length of the visa" value={months} onChange={setMonths} unit="months" max={60} />}
      <Toggle id={`${id}-p`} label="Partner applying too" value={partner} onChange={setPartner} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      <NumberField id={`${id}-c`} label="Children under 18" value={children} onChange={setChildren} max={8} />
      {route === 'skilled-worker' ? <Toggle id={`${id}-isl`} label="Job on the Immigration Salary List" value={isl} onChange={setIsl} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
        : <SelectField id={`${id}-pr`} label="Faster decision" value={prio} onChange={(v) => setPrio(v as 'none')} options={[{ value: 'none', label: 'Standard service' }, { value: 'priority', label: 'Priority' }, { value: 'super', label: 'Super priority' }]} />}
    </Shell>
  );
}
