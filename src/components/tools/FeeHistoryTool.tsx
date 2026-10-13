/** One Home Office fee across every table since January 2024: amounts, change, chart. */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Shell, { Row } from './Shell';
import { HISTORY_SERIES, feeHistory, FEE_DATE } from '../../lib/engine/fees';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp, longDate } from './fmt';
import { formatPercent } from '../../lib/format';

export default function FeeHistoryTool({ initial = 'sw-out-3', title = 'Home Office fee history', id = 'fh' }: { initial?: string; title?: string; id?: string }) {
  const [sid, setSid] = useState(initial);
  const [people, setPeople] = useState(1);
  useEffect(() => { const u = readParams(window.location.search); setSid(str(u, 'f', initial)); setPeople(num(u, 'n', 1)); }, [initial]);
  useEffect(() => { updateURL({ f: sid, n: people === 1 ? undefined : people }); }, [sid, people]);
  const s = HISTORY_SERIES.find((x) => x.id === sid) ?? HISTORY_SERIES[0];
  const h = useMemo(() => feeHistory(s.line()), [s]);
  const steps = h.filter((p, i) => i === 0 || p.amount !== h[i - 1].amount);
  const first = h[0], last = h[h.length - 1];
  const max = Math.max(...h.map((p) => p.amount));
  const n = Math.max(1, Math.floor(people || 1));
  return (
    <Shell id={id} title={title} summary={`${gbp(last.amount)} now, ${gbp(first.amount)} on ${longDate(first.date)}`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Fee in the table of {longDate(FEE_DATE)}</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{gbp(last.amount * n)}</p>
        <p className="mt-1 text-xs text-navy-700">{n > 1 ? `${n} applicants × ${gbp(last.amount)} · ` : ''}{last.amount === first.amount ? 'unchanged' : `${formatPercent((last.amount - first.amount) / first.amount, 0)} since ${longDate(first.date)}`}</p>
        <svg viewBox={`0 0 ${h.length * 24} 90`} className="mt-3 h-24 w-full" role="img" aria-label={`Fee from ${gbp(first.amount)} to ${gbp(last.amount)}`}>
          {h.map((p, i) => { const bh = Math.max(2, (p.amount / max) * 80); return <rect key={p.date} x={i * 24 + 3} y={88 - bh} width={18} height={bh} rx={2} className="fill-accent-500" />; })}
        </svg>
        <table className="mt-2 w-full text-sm"><tbody className="divide-y divide-navy-200">
          {steps.map((p, i) => <Row key={p.date} label={i === 0 ? `From ${longDate(p.date)}` : `From ${longDate(p.date)}`} value={`${gbp(p.amount * n)}${i > 0 ? ` (+${formatPercent((p.amount - steps[i - 1].amount) / steps[i - 1].amount, 0)})` : ''}`} />)}
        </tbody></table>
      </>}>
      <SelectField id={`${id}-f`} label="Fee" value={sid} onChange={setSid} options={HISTORY_SERIES.map((x) => ({ value: x.id, label: x.label }))} className="sm:col-span-2" />
      <NumberField id={`${id}-n`} label="Number of applicants" value={people} onChange={setPeople} max={10} />
    </Shell>
  );
}
