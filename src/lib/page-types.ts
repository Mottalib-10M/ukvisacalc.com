/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a guide or tool page: `src/content/pages/<id>.ts` (PageDef);
 *  - a state page: `src/content/states/<state>.ts` (StateDef);
 *  - the hand-written part of a station page: `src/content/stations/<state>/<slug>.ts` (StationDef).
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("king-tides", "state:florida", "st:florida/key-west", "method"…). An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Journal table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator: `<!--mini:kind|arg-->`, rendered as an island. */
  mini: (kind: string, arg?: unknown) => string;
}

export type Group = 'tides' | 'fishing' | 'planning';
export type ToolKind = 'picker' | 'planner-beach' | 'planner-boat' | 'solunar' | 'near' | 'compare';

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, 2026 included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, 2026 included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more: the direct answer (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** A tool page carries a full tool; a guide carries a mini-simulator after its answer. */
  tool?: ToolKind;
  /** Stations of a comparison page (tool 'compare'), as "state/slug" keys. */
  stations?: string[];
  mini?: { kind: string; arg?: unknown };
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;

export interface StateDef {
  /** = file name = state slug. */
  state: string;
  /** 50–60 characters, starts with "<State> Tides", 2026 included. */
  title: string;
  /** 150–160 characters, 2026 included. */
  description: string;
  intro: string;
  /** ONE paragraph of 120 words or more, figures from the kit. */
  resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  /** Station shown first in the state tool ("state/slug"). */
  featured: string;
}
export const defineState = (s: StateDef): StateDef => s;

export interface StationDef {
  /** "state/slug" = folder/file name. */
  key: string;
  /** Optional overrides of the generated title (50–60) and description (150–160). */
  title?: string;
  description?: string;
  /** One sentence under the H1, about this place. */
  intro: string;
  /** Hand-written prose for this station only: 2 or 3 `<h2>` sections, 280 to 420 words. */
  body: (h: Helpers) => string;
  /** 1 or 2 hand-written questions about this place (added to the generated ones). */
  faqs?: FAQ[];
  /** Official pages read for this place (park, pier, beach authority), `{ name, url }`. */
  extraSources?: Array<{ name: string; url: string }>;
}
export const defineStation = (s: StationDef): StationDef => s;
