/**
 * Search the Home Office register of licensed sponsors (daily CSV, rebuilt each morning by
 * scripts/build-data.py). The register is split by first letter in /data/sponsors/<x>.json; the
 * browser loads only the letter it needs. First render: no results (hydration), then the query.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';
import Shell from './Shell';
import { readParams, str, updateURL } from '../../lib/url-state';
import { int, longDate } from './fmt';

type Row = [string, string, string, number[], number[]];
interface Props { routes: string[]; ratings: string[]; date: string; organisations: number; initialQuery?: string; initialTown?: string; initialRoute?: string; title?: string; id?: string }
const strip = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const shardOf = (q: string) => { const a = strip(q).replace(/^(the\s+|\W+)/, ''); const c = a.charAt(0); return /[a-z]/.test(c) ? c : '0'; };

export default function SponsorSearch({ routes, ratings, date, organisations, initialQuery = 'nhs', initialTown = '', initialRoute = '', title = 'Licensed sponsor search', id = 'spn' }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [town, setTown] = useState(initialTown);
  const [route, setRoute] = useState(initialRoute);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [shard, setShard] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { const u = readParams(window.location.search); setQ(str(u, 'q', initialQuery)); setTown(str(u, 'town', initialTown)); setRoute(str(u, 'route', initialRoute)); }, [initialQuery, initialTown, initialRoute]);
  useEffect(() => {
    if (strip(q).trim().length < 2) return;
    const c = shardOf(q);
    if (c === shard) return;
    let live = true;
    fetch(`/data/sponsors/${c}.json`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((d: Row[]) => { if (live) { setRows(d); setShard(c); setErr(''); } }).catch(() => live && setErr('The register could not be loaded. Try again.'));
    return () => { live = false; };
  }, [q, shard]);
  useEffect(() => { updateURL({ q: q || undefined, town: town || undefined, route: route || undefined }); }, [q, town, route]);
  const ql = strip(q).trim(), tl = strip(town).trim();
  const hits = useMemo(() => {
    if (!rows || ql.length < 2 || shardOf(q) !== shard) return [];
    const ri = route === '' ? -1 : routes.indexOf(route);
    return rows.filter((r) => strip(r[0]).includes(ql) && (!tl || strip(r[1]).includes(tl) || strip(r[2]).includes(tl)) && (ri < 0 || r[3].includes(ri)));
  }, [rows, ql, tl, route, shard]);
  const shown = hits.slice(0, 60);
  const word = ql.length < 2 ? 'Type at least two letters of the employer’s name.' : !rows || shardOf(q) !== shard ? 'Loading the register…' : `${int(hits.length)} ${hits.length === 1 ? 'organisation' : 'organisations'} found`;
  return (
    <Shell id={id} title={title} summary={word}
      foot={`Register of licensed sponsors published by the Home Office on ${longDate(date)} (${int(organisations)} organisations), Open Government Licence v3.0. Searched in your browser. Not affiliated with the Home Office.`}
      result={<>
        <p className="text-sm font-medium text-navy-700">Result</p>
        <p className="tabular-nums mt-1 text-2xl font-bold text-navy-900">{word}</p>
        {err && <p className="mt-2 text-sm text-red-800">{err}</p>}
        {shown.length > 0 && <ul className="mt-3 max-h-80 divide-y divide-navy-200 overflow-y-auto text-sm">
          {shown.map((r) => <li key={r[0] + r[1]} className="py-2"><p className="font-semibold text-navy-900">{r[0]}</p><p className="text-navy-700">{[r[1], r[2]].filter(Boolean).join(', ')} · {r[4].map((g) => ratings[g]).join('; ')}</p><p className="text-xs text-navy-600">{r[3].map((x) => routes[x]).join(', ')}</p></li>)}
        </ul>}
        {hits.length > shown.length && <p className="mt-2 text-xs text-navy-700">First {shown.length} shown: add a town or more letters to narrow the list.</p>}
        {ql.length >= 2 && rows && shardOf(q) === shard && hits.length === 0 && <p className="mt-2 text-sm text-navy-700">No licensed sponsor with that name. Check the spelling, try the legal name (often ending in “Ltd” or “Limited”), or remove the town.</p>}
      </>}>
      <TextField id={`${id}-q`} label="Employer name" value={q} onChange={setQ} placeholder="e.g. Deloitte, NHS, Tesco" className="sm:col-span-2" />
      <TextField id={`${id}-t`} label="Town or county (optional)" value={town} onChange={setTown} placeholder="e.g. Manchester" />
      <SelectField id={`${id}-r`} label="Visa route" value={route} onChange={setRoute} options={[{ value: '', label: 'Any route' }, ...routes.map((r) => ({ value: r, label: r }))]} />
    </Shell>
  );
}
