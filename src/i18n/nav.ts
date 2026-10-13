import { route, type Locale } from './routes';
import { PAGES, pageById, PUBLISHED, stationId, stateId, STATE_PAGES } from '../lib/pages';
import { STATE_INFO } from '../lib/stations';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Tide charts', method: 'How the tides are computed', about: 'About', widget: 'Embed a tide chart', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'tides', label: 'Reading the tide' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'planning', label: 'Beach and boat' },
];
export const COASTS: Array<{ id: 'east' | 'gulf' | 'west' | 'pacific'; label: string }> = [
  { id: 'east', label: 'East Coast' }, { id: 'gulf', label: 'Gulf Coast' }, { id: 'west', label: 'West Coast' }, { id: 'pacific', label: 'Alaska and Hawaii' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const p = pageById(id); if (p) return p.nav;
  if (id.startsWith('state:')) return `${STATE_INFO[id.slice(6)].name} tides`;
  if (id.startsWith('st:')) { const s = PUBLISHED.find((x) => stationId(x.key) === id); if (s) return `${s.place} tides`; }
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
const statesOf = (c: string, lang: Locale) => STATE_PAGES.filter((s) => STATE_INFO[s.state].coast === c).map((s) => ({ href: route(stateId(s.state), lang), label: STATE_INFO[s.state].name }));
export function navCategories(lang: Locale): NavCategory[] {
  return [
    { label: 'Tides by state', links: COASTS.flatMap((c) => statesOf(c.id, lang)) },
    ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  ];
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...COASTS.map((c) => ({ label: c.label, links: statesOf(c.id, lang) })).filter((c) => c.links.length),
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** The most searched places, in the footer row; every station page is two clicks from anywhere through its state page (RECETTE §18.2). */
const TOP = ['california/san-diego', 'south-carolina/myrtle-beach', 'texas/galveston', 'massachusetts/chatham', 'maryland/ocean-city', 'north-carolina/nags-head', 'florida/tampa', 'florida/clearwater-beach', 'new-jersey/cape-may', 'washington/seattle', 'hawaii/honolulu', 'maine/bar-harbor'];
export const popularLinks = (lang: Locale): NavLink[] => TOP.filter((k) => PUBLISHED.some((s) => s.key === k)).map((k) => ({ href: route(stationId(k), lang), label: PUBLISHED.find((s) => s.key === k)!.place }));
