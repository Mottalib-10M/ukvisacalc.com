/** Registry: every file of `src/content/pages/` is loaded here. */
import type { PageDef } from './page-types';
const base = (f: string) => f.split('/').pop()!.replace(/\.ts$/, '');
const pmods = import.meta.glob<{ default: PageDef }>(['../content/pages/*.ts', '!../content/pages/_*.ts'], { eager: true });
export const PAGES: PageDef[] = Object.entries(pmods).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  return m.default;
}).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
export const slugOf = (p: PageDef) => p.slug ?? p.id;
