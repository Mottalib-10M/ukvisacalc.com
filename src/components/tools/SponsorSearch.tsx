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
interface Props { routes: string[]; ratings: string[]; date: string; organisations: number; shards: string[]; initialQuery?: string; initialTown?: string; initialRoute?: string; title?: string; id?: string }
const strip = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const shardOf = (q: string) => { const a = strip(q).replace(/^(?:the\s+|\W+)+/, ''); const c = a.charAt(0); return /[a-z]/.test(c) ? c : '0'; };

export default function SponsorSearch({ routes, ratings, date, organisations, shards, initialQuery = 'nhs', initialTown = '', initialRoute = '', title = 'Licensed sponsor search', id = 'spn' }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [town, setTown] = useState(initialTown);
  const [route, setRoute] = useState(initialRoute);
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [everywhere, setEverywhere] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { const u = readParams(window.location.search); setQ(str(u, 'q', initialQuery)); setTown(str(u, 'town', initialTown)); setRoute(str(u, 'route', initialRoute)); if (u.get('q')) setEverywhere(true); }, [initialQuery, initialTown, initialRoute]);
  const ql = strip(q).trim(), tl = strip(town).trim();
  // First the part of the register that holds names starting like the query; once the visitor types,
  // the other parts follow, so that "nhs" also finds "Barts Health NHS Trust".
  useEffect(() => {
    if (ql.length < 2) return;
    const want = everywhere ? shards : [shardOf(q)];
    const missing = want.filter((c) => !data[c]);
    if (!missing.length) return;
    let live = true;
    Promise.all(missing.map((c) => fetch(`/data/sponsors/${c}.json`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((d: Row[]) => [c, d] as const)))
      .then((xs) => { if (live) { setData((o) => ({ ...o, ...Object.fromEntries(xs) })); setErr(''); } })
      .catch(() => live && setErr('The register could not be loaded. Try again.'));
    return () => { live = false; };
  }, [ql, everywhere]);
  useEffect(() => { updateURL({ q: q || undefined, town: town || undefined, route: route || undefined }); }, [q, town, route]);
  const loaded = Object.keys(data).length;
  const complete = shards.every((c) => data[c]);
  const ready = ql.length >= 2 && !!data[shardOf(q)];
  const hits = useMemo(() => {
    if (!ready) return [];
    const ri = route === '' ? -1 : routes.indexOf(route);
    return Object.values(data).flat().filter((r) => strip(r[0]).includes(ql) && (!tl || strip(r[1]).includes(tl) || strip(r[2]).includes(tl)) && (ri < 0 || r[3].includes(ri))).sort((x, y) => (strip(x[0]).startsWith(ql) ? 0 : 1) - (strip(y[0]).startsWith(ql) ? 0 : 1) || x[0].localeCompare(y[0]));
  }, [data, ql, tl, route, ready]);
  const shown = hits.slice(0, 60);
  const word = ql.length < 2 ? 'Type at least two letters of the employer’s name.' : !ready ? 'Loading the register…' : `${int(hits.length)} ${hits.length === 1 ? 'organisation' : 'organisations'} found${complete ? '' : ` (names starting with “${q.trim()}” first, ${loaded} of ${shards.length} parts searched)`}`;
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
        {ready && complete && hits.length === 0 && <p className="mt-2 text-sm text-navy-700">No licensed sponsor with that name. Check the spelling, try the legal name (often ending in “Ltd” or “Limited”), or remove the town.</p>}
      </>}>
      <TextField id={`${id}-q`} label="Employer name" value={q} onChange={(v) => { setQ(v); setEverywhere(true); }} placeholder="e.g. Deloitte, NHS, Tesco" className="sm:col-span-2" />
      <TextField id={`${id}-t`} label="Town or county (optional)" value={town} onChange={setTown} placeholder="e.g. Manchester" />
      <SelectField id={`${id}-r`} label="Visa route" value={route} onChange={setRoute} options={[{ value: '', label: 'Any route' }, ...routes.map((r) => ({ value: r, label: r }))]} />
    </Shell>
  );
}
