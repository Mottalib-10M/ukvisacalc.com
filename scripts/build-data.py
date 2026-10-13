#!/usr/bin/env python3
"""Rebuild the official data files of the site from GOV.UK (Open Government Licence v3.0).

Usage: python3 scripts/build-data.py [--refresh] [--only sponsors]

Reads, with a cache in scripts/.cache-raw/ (ignored by git):
  1. the Home Office fee tables (ODS), every version listed on
     https://www.gov.uk/government/publications/visa-regulations-revised-table
     -> src/data/fees.json (current table + history of each line);
  2. Appendix Skilled Occupations and Appendix Immigration Salary List (GOV.UK content API)
     + the Temporary Shortage List of Appendix Skilled Worker (SW 6.1A)
     -> src/data/soc.json;
  3. the register of licensed sponsors (daily CSV)
     -> public/data/sponsors/<letter>.json (search shards) + src/data/sponsors-meta.json;
  4. UK bank holidays (https://www.gov.uk/bank-holidays.json) -> src/data/bank-holidays.json.

Nothing here is typed by hand: thresholds, rules and sources that are not tables live in
src/data/params-2026.json, read on GOV.UK and dated (CONTRIBUTING-PAGES.md).
The sponsor register changes every working day: the GitHub Actions workflow
(.github/workflows/rebuild.yml) runs `--only sponsors` then rebuilds the site each morning.
"""
import csv, html, io, json, os, re, sys, time, unicodedata, urllib.request, zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'scripts', '.cache-raw')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
REFRESH = '--refresh' in sys.argv
ONLY = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
os.makedirs(CACHE, exist_ok=True)


def get(url, name, max_age=None):
    """Download once into the cache (or again with --refresh / when older than max_age seconds)."""
    p = os.path.join(CACHE, name)
    if os.path.exists(p) and not REFRESH and (max_age is None or time.time() - os.path.getmtime(p) < max_age):
        return open(p, 'rb').read()
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    data = urllib.request.urlopen(req, timeout=120).read()
    open(p, 'wb').write(data)
    return data


def api(path, name, max_age=None):
    return json.loads(get('https://www.gov.uk/api/content' + path, name, max_age))


def write(rel, obj, indent=None):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent, separators=None if indent else (',', ':'))
    print('  wrote', rel, os.path.getsize(p), 'bytes')


# ───────────────────────────── 1. Fee tables ─────────────────────────────
NS = {'table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0', 'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0', 'office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0'}
T, X, O = ('{%s}' % NS[k] for k in ('table', 'text', 'office'))


def ods_rows(data):
    root = ET.fromstring(zipfile.ZipFile(io.BytesIO(data)).read('content.xml'))
    rows = []
    for t in root.iter(T + 'table'):
        for row in t.iter(T + 'table-row'):
            cells = []
            for c in row:
                if c.tag not in (T + 'table-cell', T + 'covered-table-cell'):
                    continue
                rep = int(c.get(T + 'number-columns-repeated', '1'))
                txt = ' '.join(''.join(p.itertext()) for p in c.iter(X + 'p')).strip()
                cells += [txt or (c.get(O + 'value') or '')] * min(rep, 12)
            while cells and not cells[-1]:
                cells.pop()
            if cells:
                rows.append(cells)
    return rows


def money(s):
    m = re.search(r'£\s*([\d,]+(?:\.\d+)?)', s or '')
    return round(float(m.group(1).replace(',', '')), 2) if m else None


def norm(label):
    s = unicodedata.normalize('NFKD', label).lower()
    s = re.sub(r'\[footnotes?[^\]]*\]', '', s)
    s = s.replace('sponor', 'sponsor').replace('–', '-').replace('—', '-')
    # Since October 2024 the labels add "or approval to sponsor under Sponsor a Worker has been given":
    # the same fee line, so the history must not split there.
    s = re.sub(r',?\s*or approval (to sponsor )?under sponsor a worker( has been given)?( for international sportsperson route)?', '', s)
    s = s.replace('for international sportsperson route', '')
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


MONTHS = {m: i for i, m in enumerate(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'], 1)}


def header_date(h):
    """'Fee from 08 October 2026' / 'Fee from 01 July 24' / 'Fee from 31 Jan 24' -> 2026-10-08."""
    m = re.search(r'(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})', h)
    d, mon, y = int(m.group(1)), MONTHS[m.group(2)[:3].lower()], int(m.group(3))
    return f'{2000 + y if y < 100 else y:04d}-{mon:02d}-{d:02d}'


def build_fees():
    pub = api('/government/publications/visa-regulations-revised-table', 'fees-publication.json', 86400)
    atts = [a for a in pub['details']['attachments'] if a.get('url', '').startswith('https') and a['url'].endswith('.ods')]
    versions, lines = [], {}
    for a in atts:
        rows = ods_rows(get(a['url'], 'fees-' + a['url'].rsplit('/', 1)[-1]))
        head = rows[0]
        date = header_date(head[2])
        versions.append({'date': date, 'title': a['title'], 'url': a['url']})
        section, notes = '', {}
        for r in rows[1:]:
            lab = r[0].strip()
            if re.match(r'^\d+\.\s', lab) and len(r) == 1:
                section = lab
                continue
            if lab.lower().startswith('footnote'):
                notes[lab.split(':')[0].strip()] = lab.split(':', 1)[1].strip()
                continue
            fee = money(r[2]) if len(r) > 2 else None
            if fee is None:
                continue
            key = norm(section.split('.', 1)[1] if '.' in section else section) + '|' + norm(lab)
            ln = lines.setdefault(key, {'section': section, 'label': lab, 'amounts': {}})
            if date >= max(ln['amounts'], default=''):
                ln['section'], ln['label'] = section, re.sub(r'\s+', ' ', lab).strip()
            ln['amounts'][date] = fee
        if date == max(v['date'] for v in versions):
            current_notes = notes
    versions.sort(key=lambda v: v['date'])
    cur = versions[-1]['date']
    out = []
    for key, ln in lines.items():
        out.append({'key': key, 'section': ln['section'], 'label': ln['label'], 'current': ln['amounts'].get(cur), 'amounts': dict(sorted(ln['amounts'].items()))})
    out.sort(key=lambda x: (x['current'] is None, int(x['section'].split('.')[0]) if x['section'][:1].isdigit() else 99))
    write('src/data/fees.json', {'source': 'https://www.gov.uk/government/publications/visa-regulations-revised-table', 'licence': 'Open Government Licence v3.0', 'retrieved': time.strftime('%Y-%m-%d'), 'current': cur, 'versions': versions, 'notes': current_notes, 'lines': out}, indent=0)


# ───────────────────────────── 2. Occupations ─────────────────────────────
class Tables(HTMLParser):
    def __init__(s):
        super().__init__(); s.tables = []; s.cur = None; s.cell = None; s.row = None; s.last = ''; s.inh = False; s.h = ''

    def handle_starttag(s, t, a):
        if t in ('h2', 'h3'): s.inh, s.h = True, ''
        if t == 'table': s.cur = {'title': s.last, 'rows': []}
        if t == 'tr' and s.cur is not None: s.row = []
        if t in ('td', 'th') and s.row is not None: s.cell = ''
        if t in ('br', 'li', 'p') and s.cell is not None: s.cell += '\n'

    def handle_endtag(s, t):
        if t in ('h2', 'h3'): s.inh, s.last = False, s.h.strip()
        if t in ('td', 'th') and s.cell is not None: s.row.append(s.cell.strip()); s.cell = None
        if t == 'tr' and s.row is not None: s.cur['rows'].append(s.row); s.row = None
        if t == 'table' and s.cur: s.tables.append(s.cur); s.cur = None

    def handle_data(s, d):
        if s.inh: s.h += d
        if s.cell is not None: s.cell += d


def tables_of(path, name):
    d = api(path, name, 86400)
    b = d['details']['body']
    b = b if isinstance(b, str) else b[0]['content']
    p = Tables(); p.feed(b)
    return d, p.tables, b


def clean(s):
    return re.sub(r'[ \t]+', ' ', html.unescape(s)).strip()


def split_code(cell):
    m = re.match(r'^\s*/?\s*(\d{4})\s+(.*)', cell.replace('\n', ' '), re.S)
    return (m.group(1), clean(m.group(2))) if m else (None, clean(cell))


def examples(cell):
    return [clean(x).lstrip('•').strip() for x in re.split(r'\n|•', cell) if clean(x).lstrip('•').strip()]


def build_soc():
    meta, tabs, _ = tables_of('/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations', 'aso.json')
    by_title = {t['title'].split(':')[0].strip(): t for t in tabs}
    occ = {}

    def rec(code, title):
        o = occ.setdefault(code, {'code': code, 'title': title, 'examples': [], 'table': None})
        return o

    # Table 1 (higher skilled, going rates on the median) and Table 1a (medium skilled)
    for tab, tier in (('Table 1', 'higher'), ('Table 1a', 'medium')):
        for r in by_title[tab]['rows'][1:]:
            code, title = split_code(r[0])
            if not code: continue
            o = rec(code, title)
            o['table'], o['tier'] = tab, tier
            if ' – ' in title: o['title'], o['restriction'] = title.split(' – ', 1)[0].strip(), clean(title.split(' – ', 1)[1])
            o['examples'] = examples(r[1])
            # The table prints each discounted rate (rounded by the Home Office): use them as printed.
            o['goingRate'] = money(r[2]); o['r90'] = money(r[3]); o['r80'] = money(r[4]); o['r70'] = money(r[5])
            o['phd'] = r[6].strip().lower().startswith('yes')
    # Table 2 / 2aa : going rates (25th percentile) for transitional applicants (options F to J)
    for tab in ('Table 2', 'Table 2aa', 'Table 2a'):
        for r in by_title[tab]['rows'][1:]:
            code, title = split_code(r[0])
            if code and code in occ:
                o = occ[code]
                o['goingRateTransitional'] = money(r[3])
                if tab == 'Table 2a': o['t70'] = money(r[4])
                else: o['t90'], o['t80'], o['t70'] = money(r[4]), money(r[5]), money(r[6])
    # Table 3 / 3a : health and education, national pay scales
    for tab, tier in (('Table 3', 'higher'), ('Table 3a', 'medium')):
        for r in by_title[tab]['rows'][1:]:
            code, title = split_code(r[0])
            if not code: continue
            nation = None
            m = re.search(r'\((England|Scotland|Wales|Northern Ireland)\)\s*$', title)
            if m: nation, title = m.group(1), title[:m.start()].strip()
            o = rec(code, title)
            o['table'], o['tier'] = tab, tier
            o['examples'] = examples(r[2])
            o['payScale'] = True
            txt = r[3]
            ref = 'table4' if 'Table 4' in txt else 'table5' if 'Table 5' in txt else ('as2211' if 'As SOC 2020 occupation code 2211' in txt else None)
            rates = [{'label': clean(a).strip(' :'), 'rate': money(b)} for a, b in re.findall(r'•?\s*([A-Za-z][^\n£•]{3,140}?)[:\s]+(£[\d,]+(?:\.\d+)?)', txt)]
            if not rates and money(txt): rates = [{'label': 'Going rate', 'rate': money(txt)}]
            hours = re.search(r'based on a (\d+)-hour', txt)
            if ref: o['scale'] = ref
            if rates:
                o.setdefault('rates', {})[nation or 'UK'] = rates
            if hours: o['scaleHours'] = int(hours.group(1))
            o['scaleSource'] = clean(r[4])
    # Table 4 (Agenda for Change bands) and Table 5 (teachers)
    bands = [{'band': clean(r[0]), 'England': money(r[1]), 'Scotland': money(r[2]), 'Wales': money(r[3]), 'Northern Ireland': money(r[4])} for r in by_title['Table 4']['rows'][1:]]
    h5 = [clean(x) for x in by_title['Table 5']['rows'][0]]
    teachers = [{'role': clean(r[0]), **{h5[i]: money(r[i]) for i in range(1, len(r))}} for r in by_title['Table 5']['rows'][1:]]
    # Table 6 : not eligible
    for r in by_title['Table 6']['rows'][1:]:
        code, title = split_code(r[0])
        if not code: continue
        o = rec(code, title)
        o['table'], o['tier'] = 'Table 6', 'ineligible'
        o['examples'] = examples(r[1])
    # Immigration Salary List
    isl_meta, isl_tabs, _ = tables_of('/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list', 'isl.json')
    for r in isl_tabs[0]['rows'][2:]:
        code, rest = split_code(r[0])
        if not code or code not in occ: continue
        crit = clean(r[0].split('–', 1)[1]) if '–' in r[0] else ''
        occ[code]['isl'] = {'criteria': re.sub(r'\s*/\s*/\s*', ' ', crit).strip(), 'all': crit.lower().startswith('all jobs'),
                            'nations': [n for n, v in zip(['England', 'Scotland', 'Wales', 'Northern Ireland'], r[1:5]) if v.strip().lower() == 'yes'],
                            'until': clean(r[5])}
    # Temporary Shortage List : plain list inside Appendix Skilled Worker (SW 6.1A)
    sw = api('/guidance/immigration-rules/immigration-rules-appendix-skilled-worker', 'sw.json', 86400)
    body = sw['details']['body']; body = body if isinstance(body, str) else body[0]['content']
    txt = html.unescape(re.sub(r'<[^>]+>', '\n', body))
    i = body.find('Temporary Shortage List</'); seg = body[i:body.find('SW 6.1B', i)]
    ul = seg[seg.find('<ul>'):]
    for m in re.finditer(r'<li>\s*(\d{4})\s+([^<]*?)\s*(?:(<ul>.*?</ul>)\s*)?</li>', ul, re.S):
        code = m.group(1)
        if code not in occ: continue
        jobs = [html.unescape(re.sub(r'\s+', ' ', j)).strip() for j in re.findall(r'<li>([^<]+)</li>', m.group(3) or '')]
        occ[code]['tsl'] = {'jobs': jobs}
    m = re.search(r'before (\d{1,2} \w+ \d{4})\.\s*Temporary Shortage List', txt.replace('\n', ' '))
    tsl_until = m.group(1) if m else None
    lst = sorted(occ.values(), key=lambda o: o['code'])
    write('src/data/soc.json', {
        'source': 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations',
        'islSource': 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list',
        'swSource': 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker',
        'licence': 'Open Government Licence v3.0', 'retrieved': time.strftime('%Y-%m-%d'),
        'asoUpdated': meta['public_updated_at'][:10], 'islUpdated': isl_meta['public_updated_at'][:10], 'swUpdated': sw['public_updated_at'][:10],
        'tslUntil': tsl_until, 'bands': bands, 'teachers': teachers, 'occupations': lst}, indent=0)


# ───────────────────────────── 3. Sponsor register ─────────────────────────────
ROUTE_CODES = {}


def town_key(t):
    t = re.sub(r'\s+', ' ', (t or '').strip().strip(',').strip())
    return t.title() if t.isupper() or t.islower() else t


def build_sponsors():
    pub = api('/government/publications/register-of-licensed-sponsors-workers', 'sponsors-publication.json', 3600)
    att = next(a for a in pub['details']['attachments'] if a.get('url', '').endswith('.csv'))
    raw = get(att['url'], 'sponsors-' + att['url'].rsplit('/', 1)[-1]).decode('utf-8-sig', 'replace')
    m = re.search(r'(\d{4}-\d{2}-\d{2})\.csv$', att['url'])
    date = m.group(1) if m else pub['public_updated_at'][:10]
    rows = list(csv.DictReader(io.StringIO(raw)))
    routes, ratings, orgs = [], [], {}
    for r in rows:
        name = re.sub(r'\s+', ' ', r['Organisation Name']).strip()
        town = town_key(r['Town/City']); county = re.sub(r'\s+', ' ', r['County'] or '').strip()
        rt = re.sub(r'\s+', ' ', r['Route']).strip(); tr = re.sub(r'\s+', ' ', r['Type & Rating']).strip()
        if rt not in routes: routes.append(rt)
        if tr not in ratings: ratings.append(tr)
        k = (name.lower(), town.lower())
        o = orgs.setdefault(k, {'n': name, 't': town, 'c': county, 'r': set(), 'g': set()})
        o['r'].add(routes.index(rt)); o['g'].add(ratings.index(tr))
    shards = {}
    for o in orgs.values():
        a = unicodedata.normalize('NFKD', o['n']).lower()
        a = re.sub(r'^(?:the\s+|\W+)+', '', a)  # same rule as shardOf() in SponsorSearch.tsx
        c = a[:1] if a[:1].isalpha() else '0'
        shards.setdefault(c, []).append([o['n'], o['t'], o['c'], sorted(o['r']), sorted(o['g'])])
    outdir = os.path.join(ROOT, 'public', 'data', 'sponsors')
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir): os.remove(os.path.join(outdir, f))
    for c, lst in shards.items():
        lst.sort(key=lambda x: x[0].lower())
        with open(os.path.join(outdir, f'{c}.json'), 'w', encoding='utf-8') as f:
            json.dump(lst, f, ensure_ascii=False, separators=(',', ':'))
    # Statistics for the pages (by route, rating and town)
    by_route = {rt: 0 for rt in routes}; by_rating = {tr: 0 for tr in ratings}; towns = {}
    for r in rows:
        by_route[re.sub(r'\s+', ' ', r['Route']).strip()] += 1
        by_rating[re.sub(r'\s+', ' ', r['Type & Rating']).strip()] += 1
    for o in orgs.values():
        t = towns.setdefault(o['t'], {'town': o['t'], 'orgs': 0, 'skilled': 0, 'b': 0})
        t['orgs'] += 1
        if routes.index('Skilled Worker') in o['r']: t['skilled'] += 1
        if any('B rating' in ratings[g] for g in o['g']): t['b'] += 1
    top = sorted(towns.values(), key=lambda t: -t['orgs'])[:40]
    write('src/data/sponsors-meta.json', {
        'source': 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers', 'file': att['url'],
        'licence': 'Open Government Licence v3.0', 'date': date, 'rows': len(rows), 'organisations': len(orgs),
        'routes': routes, 'ratings': ratings, 'byRoute': by_route, 'byRating': by_rating,
        'skilledWorkerOrgs': sum(1 for o in orgs.values() if routes.index('Skilled Worker') in o['r']),
        'bRatedOrgs': sum(1 for o in orgs.values() if any('B rating' in ratings[g] for g in o['g'])),
        'shards': sorted(shards), 'topTowns': top}, indent=0)


# ───────────────────────────── 4. Bank holidays ─────────────────────────────
def build_holidays():
    d = json.loads(get('https://www.gov.uk/bank-holidays.json', 'bank-holidays.json', 7 * 86400))
    write('src/data/bank-holidays.json', {k: sorted(e['date'] for e in v['events'] if e['date'] >= '2024-01-01') for k, v in d.items()}, indent=0)


if __name__ == '__main__':
    steps = {'fees': build_fees, 'soc': build_soc, 'sponsors': build_sponsors, 'holidays': build_holidays}
    for name, fn in steps.items():
        if ONLY and name != ONLY: continue
        print(name); fn()
