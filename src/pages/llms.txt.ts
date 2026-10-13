/** llms.txt (RECETTE §21), generated at build from the registries: always in sync with the site. */
import { PAGES, STATE_PAGES, PUBLISHED, stationId, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { STATE_INFO, DATA_META } from '../lib/stations';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Tide charts for ${PUBLISHED.length} US coastal stations: today's tide curve, high and low tide times, the next 7 days, a daily tide coefficient (day's range as a percentage of the station's average range), sunrise, sunset, moon phase, solunar major and minor periods, and a planner for low-water walks and boat launches. High and low tides are NOAA CO-OPS predictions (public domain), downloaded ${DATA_META.retrieved} for ${DATA_META.begin} to ${DATA_META.end}; curves use NOAA hourly predictions (reference stations) or the reference station's shape (subordinate stations). Heights in feet above MLLW. Not for navigation. Published by Radif Partners, not affiliated with NOAA. Last updated ${LAST_UPDATED}.`,
    '',
    '## Tides by state',
    ...STATE_PAGES.map((s) => `- [${STATE_INFO[s.state].name} tides](${SITE_URL}${route(stateId(s.state), 'en')}): ${s.intro}`),
    '',
    '## Station tide charts',
    ...PUBLISHED.map((s) => `- [${s.place}, ${STATE_INFO[s.state].abbr}](${SITE_URL}${route(stationId(s.key), 'en')}): NOAA ${s.id} ${s.noaaName}, average range ${s.stats.meanRange} ft, ${s.stats.tideType}`),
    '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About',
    `- [How the tides are computed](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
