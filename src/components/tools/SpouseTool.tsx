/**
 * Spouse / partner visa minimum income: £29,000 (or the pre-11 April 2024 rule for extensions),
 * income counted, then the savings that fill the gap (£16,000 + 2.5 × shortfall, 1 × at ILR).
 * Engine: lib/engine/family.ts. URL: ?e=&o=&s=&l=&k=&st=
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import Shell, { Row, Verdict } from './Shell';
import { spouseTest, type Stage } from '../../lib/engine/family';
import { visaCost } from '../../lib/engine/fees';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp } from './fmt';

interface Props { initialEmployment?: number; initialStage?: Stage; title?: string; id?: string; costHref?: string }
export default function SpouseTool({ initialEmployment = 26000, initialStage = 'entry', title = 'Spouse visa income check', id = 'sp', costHref }: Props) {
  const [emp, setEmp] = useState(initialEmployment);
  const [other, setOther] = useState(0);
  const [savings, setSavings] = useState(0);
  const [legacy, setLegacy] = useState('no');
  const [kids, setKids] = useState(0);
  const [stage, setStage] = useState<Stage>(initialStage);
  const [exempt, setExempt] = useState('no');
  useEffect(() => {
    const u = readParams(window.location.search);
    setEmp(num(u, 'e', initialEmployment)); setOther(num(u, 'o', 0)); setSavings(num(u, 's', 0)); setLegacy(str(u, 'l', 'no')); setKids(num(u, 'k', 0)); setStage(str(u, 'st', initialStage) as Stage); setExempt(str(u, 'x', 'no'));
  }, [initialEmployment, initialStage]);
  const r = useMemo(() => spouseTest({ employment: emp, other, savings, legacy: legacy === 'yes' && stage !== 'entry', children: kids, stage, exempt: exempt === 'yes' }), [emp, other, savings, legacy, kids, stage, exempt]);
  useEffect(() => { updateURL({ e: emp, o: other || undefined, s: savings || undefined, l: legacy === 'yes' ? 'yes' : undefined, k: kids || undefined, st: stage === 'entry' ? undefined : stage, x: exempt === 'yes' ? 'yes' : undefined }); }, [emp, other, savings, legacy, kids, stage, exempt]);
  const cost = visaCost({ route: 'partner', where: stage === 'entry' ? 'outside' : 'inside', months: stage === 'entry' ? 33 : 30, partner: false, children: 0 });
  const verdict = r.exempt ? 'Your partner gets a listed disability or carer’s benefit: the £29,000 test does not apply; you must show adequate maintenance instead.'
    : r.passesOnIncome ? `Income of ${gbp(r.income)} meets the ${gbp(r.required)} requirement.`
      : r.passesWithSavings ? `Income is ${gbp(r.incomeGap)} short, but your savings of ${gbp(savings)} cover it (needed: ${gbp(r.savingsNeeded)}).`
        : `Short by ${gbp(r.incomeGap)} a year. Savings needed to fill the gap: ${gbp(r.savingsNeeded)}.`;
  return (
    <Shell id={id} title={title} summary={r.passes ? `Requirement met (${gbp(r.required)})` : `Short by ${gbp(r.incomeGap)} a year`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Minimum income for your application</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{gbp(r.required)}</p>
        <div className="mt-3"><Verdict ok={r.passes}>{verdict}</Verdict></div>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <Row label="Income counted" value={gbp(r.income)} />
          <Row label="Shortfall" value={gbp(r.incomeGap)} />
          <Row label={`Savings to cover it (£16,000 + ${r.multiplier} × shortfall)`} value={r.incomeGap > 0 ? gbp(r.savingsNeeded) : 'not needed'} />
          <Row label="Savings alone, with no income" value={gbp(r.savingsOnlyNeeded)} />
          <Row label="Your savings count as income of" value={gbp(r.savingsCountAsIncome)} />
          <Row label={`Fee + surcharge, ${stage === 'entry' ? 'first visa (33 months)' : 'extension (30 months)'}`} value={gbp(cost.total)} />
        </tbody></table>
        <p className="mt-2 text-xs text-navy-700">Cash savings must have been held for 6 months. Income from employment is gross, before tax and National Insurance.</p>
        {costHref && <p className="mt-2 text-sm"><a className="font-medium text-accent-700 underline" href={costHref}>Cost with children</a></p>}
      </>}>
      <NumberField id={`${id}-e`} label="Salary or self-employed income" value={emp} onChange={setEmp} unit="£/yr" max={1_000_000} help="Your partner’s UK income (and yours if you already work in the UK)." />
      <NumberField id={`${id}-o`} label="Other income (pension, rent, dividends)" value={other} onChange={setOther} unit="£/yr" max={1_000_000} />
      <NumberField id={`${id}-s`} label="Cash savings of the couple" value={savings} onChange={setSavings} unit="£" max={5_000_000} />
      <SelectField id={`${id}-st`} label="Application" value={stage} onChange={(v) => setStage(v as Stage)} options={[{ value: 'entry', label: 'First visa from abroad' }, { value: 'extension', label: 'Extension in the UK' }, { value: 'settlement', label: 'Settlement (ILR)' }]} />
      <Toggle id={`${id}-l`} label="First granted before 11 April 2024" value={legacy} onChange={setLegacy} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      {legacy === 'yes' && stage !== 'entry' ? <NumberField id={`${id}-k`} label="Children who are not British or settled" value={kids} onChange={setKids} max={10} />
        : <Toggle id={`${id}-x`} label="Partner gets PIP, DLA or Carer’s Allowance" value={exempt} onChange={setExempt} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />}
    </Shell>
  );
}
