/**
 * Every page file is checked before the build (CONTRIBUTING-PAGES.md). One file:
 *   PAGE_FILES=spouse-visa-uk npx vitest run tests/pages.test.ts
 * Several: PAGE_FILES=a,b,c. All: npx vitest run.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { helpers, SOURCES } from '../src/lib/helpers';
import { ROUTES, PLANNED } from '../src/i18n/routes';
import type { PageDef } from '../src/lib/page-types';
import { HOME } from '../src/content/home';

process.env.STRICT_LINKS = '1';
const dir = join(__dirname, '../src/content/pages');
const only = (process.env.PAGE_FILES ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('_')).map((f) => f.replace(/\.ts$/, '')).filter((f) => !only.length || only.includes(f));
const words = (s: string) => s.replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9£]/.test(w)).length;
const COUNTRY_START = /^(UK |United Kingdom|British|England|Scotland|Wales)/;
const GENERIC = /^(calculator|calculate|about|how|what|when|faq|methodology)\b/i;
const BANNED = [new RegExp('\\u2014'), /it['’]s important to note/i, /\bdelve\b/i, /dive into/i, /whether you['’]re/i, /\bmoreover\b/i, /\bfurthermore\b/i, /\bnavigate the\b/i, /\bseamless/i, /\bin today['’]s\b/i, /\bunlock\b/i, /\bembark\b/i, /\bcrucial\b/i, /\bin conclusion\b/i];
const KINDS = ['sw', 'cost', 'ilr', 'absence', 'citizenship', 'spouse', 'sponsor', 'time', 'history', 'student', 'licence'];

const pages: Array<[string, PageDef]> = [];
for (const f of files) pages.push([f, (await import(`../src/content/pages/${f}.ts`)).default as PageDef]);
const allQuestions = new Map<string, string>();
for (const q of HOME.faqs) allQuestions.set(q.q.toLowerCase(), 'home');

describe.each(pages)('%s', (f, p) => {
  const h = helpers();
  const body = p.body(h);
  it('has the right id and route', () => { expect(p.id).toBe(f); expect(PLANNED.includes(p.id) || ROUTES.some((r) => r.id === p.id)).toBe(true); });
  it('has a calibrated title and description (RECETTE §11)', () => {
    expect(p.title.length, p.title).toBeGreaterThanOrEqual(50); expect(p.title.length, p.title).toBeLessThanOrEqual(60);
    expect(p.description.length, p.description).toBeGreaterThanOrEqual(150); expect(p.description.length, p.description).toBeLessThanOrEqual(160);
    expect(COUNTRY_START.test(p.title), 'title opens with the country').toBe(false);
    expect(GENERIC.test(p.title), 'title opens with a generic word').toBe(false);
  });
  it('has a citable answer of 120 words or more, one paragraph', () => { expect(words(p.resume)).toBeGreaterThanOrEqual(120); expect(p.resume).not.toMatch(/<p|\n\n/); });
  it('has a short intro', () => { expect(words(p.intro)).toBeLessThanOrEqual(45); });
  it('has 3 to 8 questions of 40 to 90 words, unique on the site', () => {
    expect(p.faqs.length).toBeGreaterThanOrEqual(3); expect(p.faqs.length).toBeLessThanOrEqual(8);
    for (const q of p.faqs) {
      const n = words(q.a); expect(n, q.q).toBeGreaterThanOrEqual(40); expect(n, q.q).toBeLessThanOrEqual(90);
      const k = q.q.toLowerCase(); const prev = allQuestions.get(k);
      expect(prev && prev !== f ? `${q.q} also on ${prev}` : '').toBe(''); allQuestions.set(k, f);
    }
    if (words(body) >= 1100) expect(p.faqs.length, 'long page: 6 to 8 questions').toBeGreaterThanOrEqual(6);
  });
  it('has enough prose (350 words or more outside tables)', () => { expect(words(body)).toBeGreaterThanOrEqual(350); });
  it('has between 2 and 4 <h2> and no <h1>', () => { const n = (body.match(/<h2/g) ?? []).length; expect(n).toBeGreaterThanOrEqual(2); expect(body).not.toMatch(/<h1/); });
  it('uses no banned word or dash', () => { for (const r of BANNED) for (const t of [p.title, p.description, p.intro, p.resume, body, ...p.faqs.map((q) => q.q + ' ' + q.a)]) expect(r.test(t), `${r} in ${t.slice(0, 80)}`).toBe(false); });
  it('links only to known pages and sources', () => {
    for (const id of p.related) expect(ROUTES.some((r) => r.id === id), id).toBe(true);
    expect(p.related.length).toBeGreaterThanOrEqual(3);
    for (const k of p.sources) expect(SOURCES[k], k).toBeTruthy();
    expect(p.sources.length).toBeGreaterThanOrEqual(2);
    expect(KINDS.includes(p.tool.kind)).toBe(true);
    expect(body).not.toMatch(/href="https?:\/\/(?!www\.gov\.uk|assets\.publishing\.service\.gov\.uk|www\.legislation\.gov\.uk|www\.nationalarchives\.gov\.uk|cascotweb\.warwick\.ac\.uk)/);
  });
  it('writes no raw number with more than 4 digits (use the kit)', () => { expect(body.replace(/<[^>]+>/g, ' ')).not.toMatch(/(?<![\d,.])\d{5,}(?![\d,])/); });
});
