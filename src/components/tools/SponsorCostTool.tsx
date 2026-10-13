/** Employer cost of sponsoring: licence, certificates of sponsorship, immigration skills charge. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import Shell, { Row } from './Shell';
import { sponsorCost } from '../../lib/engine/misc';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { gbp } from './fmt';

export default function SponsorCostTool({ title = 'Sponsor licence cost calculator', id = 'lic' }: { title?: string; id?: string }) {
  const [small, setSmall] = useState('yes');
  const [workers, setWorkers] = useState(1);
  const [months, setMonths] = useState(36);
  const [prio, setPrio] = useState('no');
  const [has, setHas] = useState('no');
  const [exempt, setExempt] = useState('no');
  useEffect(() => { const u = readParams(window.location.search); setSmall(str(u, 's', 'yes')); setWorkers(num(u, 'n', 1)); setMonths(num(u, 'm', 36)); setPrio(str(u, 'p', 'no')); setHas(str(u, 'h', 'no')); setExempt(str(u, 'x', 'no')); }, []);
  const r = useMemo(() => sponsorCost(small === 'yes', workers, months, prio === 'yes', has === 'yes', exempt === 'yes'), [small, workers, months, prio, has, exempt]);
  useEffect(() => { updateURL({ s: small, n: workers, m: months, p: prio === 'yes' ? 'yes' : undefined, h: has === 'yes' ? 'yes' : undefined, x: exempt === 'yes' ? 'yes' : undefined }); }, [small, workers, months, prio, has, exempt]);
  return (
    <Shell id={id} title={title} summary={`Employer cost: ${gbp(r.total)}`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Cost to the employer</p>
        <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{gbp(r.total)}</p>
        <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
          <Row label="Sponsor licence" value={has === 'yes' ? 'already held' : gbp(r.licence)} />
          {r.priority > 0 && <Row label="Licence decision in 10 working days" value={gbp(r.priority)} />}
          <Row label="Certificate of sponsorship, each" value={gbp(r.perWorker.cos)} />
          <Row label={`Immigration skills charge, ${months} months, each`} value={gbp(r.perWorker.isc)} />
          <Row label={`Workers sponsored`} value={String(r.workers)} />
          <Row label="Total" value={gbp(r.total)} strong />
        </tbody></table>
        <p className="mt-2 text-xs text-navy-700">The employer must pay the skills charge and the certificate itself: passing them on to the worker can cost the licence. Worker’s own visa fee and surcharge not included.</p>
      </>}>
      <Toggle id={`${id}-s`} label="Small business or charity" value={small} onChange={setSmall} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
      <Toggle id={`${id}-h`} label="Licence already held" value={has} onChange={setHas} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      <NumberField id={`${id}-n`} label="Workers to sponsor" value={workers} onChange={setWorkers} max={500} />
      <NumberField id={`${id}-m`} label="Length of each certificate" value={months} onChange={setMonths} unit="months" max={60} />
      <Toggle id={`${id}-p`} label="Priority licence decision" value={prio} onChange={setPrio} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      <Toggle id={`${id}-x`} label="PhD-level research code (exempt)" value={exempt} onChange={setExempt} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
    </Shell>
  );
}
