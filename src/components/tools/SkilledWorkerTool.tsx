/**
 * Skilled Worker eligibility: occupation code × salary × hours × situation → threshold, gap, verdict,
 * plus the application fee and surcharge for the main applicant. Engine: lib/engine/skilled.ts.
 * First render = build defaults; the URL (?soc=&sal=&h=&sit=&n=&t=&in=&pay=) is read after mounting.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';
import Toggle from '../ui/Toggle';
import Shell, { Row, Verdict } from './Shell';
import { checkSkilledWorker, OCCUPATIONS, payOptions, SITUATION_LABELS, type Nation, type Situation } from '../../lib/engine/skilled';
import { FEE, ihs } from '../../lib/engine/fees';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp } from './fmt';

interface Props { initialCode?: string; initialSalary?: number; initialSituation?: Situation; title?: string; costHref?: string; ratesHref?: string; id?: string }
const NATIONS: Nation[] = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
const LONDON = ['England (excluding London / Fringe)', 'London Fringe', 'Outer London', 'Inner London'] as const;
const short = (t: string) => (t.length > 70 ? t.slice(0, 68) + '…' : t);

export default function SkilledWorkerTool({ initialCode = '2136', initialSalary = 45000, initialSituation = 'standard', title = 'Skilled Worker salary check', costHref, ratesHref, id = 'sw' }: Props) {
  const [code, setCode] = useState(initialCode);
  const [q, setQ] = useState('');
  const [salary, setSalary] = useState(initialSalary);
  const [hours, setHours] = useState(37.5);
  const [sit, setSit] = useState<Situation>(initialSituation);
  const [nation, setNation] = useState<Nation>('England');
  const [area, setArea] = useState<(typeof LONDON)[number]>(LONDON[0]);
  const [trans, setTrans] = useState('no');
  const [where, setWhere] = useState('outside');
  const [pay, setPay] = useState(0);

  useEffect(() => {
    const u = readParams(window.location.search);
    setCode(str(u, 'soc', initialCode)); setSalary(num(u, 'sal', initialSalary)); setHours(num(u, 'h', 37.5));
    setSit((str(u, 'sit', initialSituation) as Situation)); setNation((str(u, 'n', 'England') as Nation)); setTrans(str(u, 't', 'no')); setWhere(str(u, 'in', 'outside')); setPay(num(u, 'pay', 0));
  }, [initialCode, initialSalary, initialSituation]);

  const occ = OCCUPATIONS.find((o) => o.code === code);
  const scale = occ ? payOptions(occ, nation, area) : [];
  const payRate = scale.length ? (scale[Math.min(pay, scale.length - 1)]?.rate ?? scale[0].rate) : undefined;
  const r = useMemo(() => checkSkilledWorker({ code, salary, hours, situation: sit, nation, transitional: trans === 'yes', mediumBefore2025: trans !== 'no', inside: where === 'inside', payRate }), [code, salary, hours, sit, nation, trans, where, payRate]);
  useEffect(() => { updateURL({ soc: code, sal: salary, h: hours === 37.5 ? undefined : hours, sit: sit === 'standard' ? undefined : sit, n: nation === 'England' ? undefined : nation, t: trans === 'no' ? undefined : trans, in: where === 'inside' ? 'inside' : undefined, pay: pay || undefined }); }, [code, salary, hours, sit, nation, trans, where, pay]);

  const ql = q.trim().toLowerCase();
  const list = OCCUPATIONS.filter((o) => !ql || o.code.startsWith(ql) || o.title.toLowerCase().includes(ql) || o.examples.some((e) => e.toLowerCase().includes(ql)));
  const options = (list.some((o) => o.code === code) ? list : [...(occ ? [occ] : []), ...list]).slice(0, 400).map((o) => ({ value: o.code, label: `${o.code} ${short(o.title)}${o.tier === 'ineligible' ? ' (not eligible)' : ''}` }));
  const isl = r.islApplies;
  const healthFee = occ && (occ.table === 'Table 3' || occ.table === 'Table 3a' || ['6135', '6136'].includes(occ.code));
  const fee3 = FEE.skilledWorker(where as 'outside' | 'inside', 3, isl);
  const summary = r.eligibleCode ? (r.passes ? `Meets the threshold: ${gbp(r.required)}` : `Short by ${gbp(-r.gap)} (needs ${gbp(r.required)})`) : 'Occupation code not eligible';

  return (
    <Shell id={id} title={title} summary={summary}
      result={<>
        <p className="text-sm font-medium text-navy-700">Minimum salary for this job</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{r.eligibleCode && r.goingRateFullTime != null ? gbp(r.required) : '–'}</p>
        <div className="mt-3"><Verdict ok={r.eligibleCode && r.goingRateFullTime != null ? r.passes : r.eligibleCode ? null : false}>
          {!r.eligibleCode ? 'This occupation code cannot be sponsored for a new Skilled Worker visa.' : r.goingRateFullTime == null ? 'Choose the pay band of the job.' : r.passes ? `Your salary of ${gbp(r.countedSalary)} meets it, with ${gbp(r.gap)} to spare.` : `Your salary is ${gbp(-r.gap)} below the threshold.`}
        </Verdict></div>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          {r.eligibleCode && <Row label={`Points option ${r.option}`} value={`${r.floor ? gbp(r.floor) + ' floor' : ''}${r.share < 1 ? ` · ${Math.round(r.share * 100)}% of the rate` : ''}`} />}
          {r.goingRateFullTime != null && <Row label="Going rate (full time)" value={gbp(r.goingRateFullTime)} />}
          {r.goingRateProRata != null && hours !== 37.5 && <Row label={`Going rate for ${hours} h a week`} value={gbp(r.goingRateProRata)} />}
          {r.goingRateHourly != null && <Row label="Going rate per hour" value={gbp(r.goingRateHourly)} />}
          <Row label="Your pay per hour" value={gbp(r.hourlyPay)} />
          <Row label={`Visa fee, up to 3 years (${where} the UK)`} value={gbp(fee3)} />
          <Row label="Health surcharge, 3 years" value={healthFee ? 'none if Health and Care visa' : gbp(ihs(36, where as 'outside', false))} />
        </tbody></table>
        <p className="mt-3 text-xs text-navy-700">{r.codeNote}</p>
        {r.warnings.map((w) => <p key={w} className="mt-1 text-xs text-amber-800">{w}</p>)}
        {r.alternatives.length > 1 && <details className="mt-3 text-sm"><summary className="cursor-pointer font-medium text-accent-700">Threshold in each situation</summary>
          <table className="mt-2 w-full text-xs"><tbody className="divide-y divide-navy-200">{r.alternatives.map((a) => <Row key={a.situation} label={a.label} value={gbp(a.required)} />)}</tbody></table></details>}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">{costHref && <a className="font-medium text-accent-700 underline" href={costHref}>Full cost with family</a>}{ratesHref && <a className="font-medium text-accent-700 underline" href={ratesHref}>All going rates</a>}</p>
      </>}>
      <TextField id={`${id}-q`} label="Find your job" value={q} onChange={setQ} placeholder="nurse, 2136, chef, engineer…" />
      <SelectField id={`${id}-soc`} label="Occupation code (SOC 2020)" value={code} onChange={(v) => { setCode(v); setPay(0); }} options={options} />
      <NumberField id={`${id}-sal`} label="Gross salary per year" value={salary} onChange={setSalary} unit="£" max={1_000_000} />
      <NumberField id={`${id}-h`} label="Hours per week" value={hours} onChange={setHours} unit="h" max={80} decimals={1} />
      <SelectField id={`${id}-sit`} label="Your situation" value={sit} onChange={(v) => setSit(v as Situation)} options={Object.entries(SITUATION_LABELS).map(([value, label]) => ({ value, label }))} />
      <SelectField id={`${id}-n`} label="Where the job is" value={nation} onChange={(v) => setNation(v as Nation)} options={NATIONS.map((n) => ({ value: n, label: n }))} />
      {occ?.scale === 'table5' && nation === 'England' && <SelectField id={`${id}-area`} label="Pay area" value={area} onChange={(v) => setArea(v as (typeof LONDON)[number])} options={LONDON.map((a) => ({ value: a, label: a }))} />}
      {scale.length > 0 && <SelectField id={`${id}-pay`} label="Pay band or role" value={String(Math.min(pay, scale.length - 1))} onChange={(v) => setPay(Number(v))} options={scale.map((s, i) => ({ value: String(i), label: `${s.label}: ${gbp(s.rate)}` }))} />}
      <Toggle id={`${id}-in`} label="Applying from" value={where} onChange={setWhere} options={[{ value: 'outside', label: 'Outside UK' }, { value: 'inside', label: 'Inside UK' }]} />
      <SelectField id={`${id}-t`} label="Already a Skilled Worker?" value={trans} onChange={setTrans} options={[{ value: 'no', label: 'No, first Skilled Worker visa' }, { value: '2025', label: 'Yes, in this job since before 22 July 2025' }, { value: 'yes', label: 'Yes, continuously since before 4 April 2024' }]} />
    </Shell>
  );
}
