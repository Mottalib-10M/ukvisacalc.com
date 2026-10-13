import { makeRouter, type RouteDef } from './routes-core';
import { PAGES, STATE_PAGES, stationId, stateId } from '../lib/pages';
import { STATIONS, STATE_INFO } from '../lib/stations';
/** English only (United States). The /en/ prefix is kept from the trame so that the checkers and the
 *  root redirect behave as on every other site built from it. */
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, slug: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${slug}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/' } },
  R('method', 'method'),
  R('about', 'about'),
  R('widget', 'widget', true),
  R('contact', 'contact', true),
  R('editorial', 'editorial-policy', true),
  R('privacy', 'privacy', true),
  R('terms', 'legal-notice', true),
  R('cookies', 'cookies', true),
];
/** Guides and tools of the plan (CONTRIBUTING-PAGES.md): routable before their file exists, so that
 *  texts written in parallel can link to them; check-liens.py catches any that stays missing. */
export const PLANNED = ['tides-near-me', 'beach-walk-planner', 'boat-ramp-tide-planner', 'solunar-tables', 'cape-cod', 'outer-banks', 'how-to-read-a-tide-chart', 'high-tide-and-low-tide', 'tide-table', 'fishing-tides', 'best-fishing-times', 'king-tides', 'spring-and-neap-tides', 'negative-low-tides', 'tide-range'];
/** Guides and tools at /en/<slug>/, states at /en/<state>/, stations at /en/<state>/<place>/. */
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...[...new Set([...PAGES.map((p) => p.id), ...PLANNED])].map((id) => R(id, PAGES.find((p) => p.id === id)?.slug ?? id)),
  ...[...new Set([...STATE_PAGES.map((s) => s.state), ...Object.keys(STATE_INFO)])].map((s) => R(stateId(s), s)),
  ...STATIONS.map((s) => R(stationId(s.key), s.key)),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
