import { makeRouter, type RouteDef } from './routes-core';
import { PAGES, slugOf } from '../lib/pages';
/** English only (United Kingdom). The /en/ prefix is kept from the trame so that the checkers and the
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
/** Pages of the plan (CONTRIBUTING-PAGES.md): routable before their file exists, so that texts
 *  written in parallel can link to them; check-liens.py catches any that stays missing. */
export const PLANNED: string[] = ["skilled-worker-visa", "skilled-worker-visa-salary-threshold", "skilled-worker-going-rates", "soc-code-checker", "skilled-worker-visa-requirements", "skilled-worker-visa-cost", "skilled-worker-visa-processing-time", "new-entrant-salary", "phd-salary-discount", "immigration-salary-list", "temporary-shortage-list", "health-and-care-worker-visa", "care-worker-visa", "global-talent-visa", "high-potential-individual-visa", "uk-ancestry-visa", "skilled-worker-dependants", "software-developer-visa-uk", "nurse-visa-uk", "doctor-visa-uk", "chef-visa-uk", "engineer-visa-uk", "teacher-visa-uk", "accountant-visa-uk", "data-analyst-visa-uk", "electrician-visa-uk", "pharmacist-visa-uk", "social-worker-visa-uk", "spouse-visa-uk", "spouse-visa-financial-requirement", "spouse-visa-uk-cost", "spouse-visa-extension", "fiance-visa-uk", "family-visa-uk", "spouse-visa-processing-time", "indefinite-leave-to-remain", "ilr-absence-calculator", "ilr-requirements", "ilr-fee", "long-residence-ilr", "ilr-processing-time", "earned-settlement", "ilr-after-spouse-visa", "british-citizenship-application", "british-citizenship-cost", "british-citizenship-requirements", "citizenship-spouse-of-british-citizen", "student-visa-uk", "student-visa-uk-cost", "student-visa-uk-requirements", "graduate-visa-uk", "graduate-to-skilled-worker", "uk-visa-fees", "uk-visa-cost-calculator", "home-office-fees", "immigration-health-surcharge", "uk-visa-processing-times", "standard-visitor-visa-uk", "register-of-licensed-sponsors", "sponsor-licence", "immigration-skills-charge", "visa-sponsors-by-city"];
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...[...new Set([...PAGES.map((p) => p.id), ...PLANNED])].map((id) => { const p = PAGES.find((x) => x.id === id); return R(id, p ? slugOf(p) : id); }),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
