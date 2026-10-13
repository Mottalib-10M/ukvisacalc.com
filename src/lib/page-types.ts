/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md): `src/content/pages/<id>.ts` (PageDef).
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("skilled-worker-visa", "method"…). An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Journal table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** A second simulator inside the body: `${h.tool({ kind: 'cost', props: {…} })}`. */
  tool: (t: ToolSpec) => string;
}

export type Group = 'work' | 'family' | 'settlement' | 'study' | 'costs' | 'employers';
export type ToolKind = 'sw' | 'cost' | 'ilr' | 'absence' | 'citizenship' | 'spouse' | 'sponsor' | 'time' | 'history' | 'student' | 'licence';
export interface ToolSpec { kind: ToolKind; props?: Record<string, unknown> }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** URL segment, lowercase and dashes, no year. Defaults to the id. */
  slug?: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first (RECETTE §11). */
  title: string;
  /** 150 to 160 characters. */
  description: string;
  h1: string;
  /** One or two lines under the H1: the direct answer, a figure if possible (RECETTE §5). */
  intro: string;
  /** ONE paragraph of 120 words or more: the citable answer (RECETTE §21), folded to its first sentences. */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** The simulator shown in the first screen (every page has one, RECETTE §5 and §9.3). */
  tool: ToolSpec;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;
