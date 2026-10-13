import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'UK visa calculators', method: 'How we calculate', about: 'About', widget: 'Embed the cost calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'work', label: 'Work visas' },
  { id: 'family', label: 'Spouse and family' },
  { id: 'settlement', label: 'ILR and citizenship' },
  { id: 'study', label: 'Study and graduate' },
  { id: 'costs', label: 'Fees and times' },
  { id: 'employers', label: 'Sponsors and employers' },
];
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang).slice(0, 12) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
const TOP = ['skilled-worker-visa', 'spouse-visa-uk', 'indefinite-leave-to-remain', 'british-citizenship-application', 'uk-visa-fees', 'immigration-health-surcharge', 'global-talent-visa', 'register-of-licensed-sponsors'];
export const popularLinks = (lang: Locale): NavLink[] => TOP.filter((id) => pageById(id)).map((id) => link(id, lang));
