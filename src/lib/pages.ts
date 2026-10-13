/** Registry: every file of `src/content/pages/`, `src/content/states/` and `src/content/stations/` is loaded here. */
import type { PageDef, StateDef, StationDef } from './page-types';
import { STATIONS, STATE_INFO } from './stations';

const base = (f: string) => f.split('/').pop()!.replace(/\.ts$/, '');
const pmods = import.meta.glob<{ default: PageDef }>(['../content/pages/*.ts', '!../content/pages/_*.ts'], { eager: true });
export const PAGES: PageDef[] = Object.entries(pmods).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  return m.default;
}).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);

const smods = import.meta.glob<{ default: StateDef }>(['../content/states/*.ts', '!../content/states/_*.ts'], { eager: true });
export const STATE_PAGES: StateDef[] = Object.entries(smods).map(([f, m]) => {
  if (m.default.state !== base(f)) throw new Error(`${f}: state "${m.default.state}" differs from the file name`);
  if (!STATE_INFO[m.default.state]) throw new Error(`${f}: unknown state`);
  return m.default;
}).sort((a, b) => a.state.localeCompare(b.state));
export const statePage = (state: string) => STATE_PAGES.find((s) => s.state === state);

const tmods = import.meta.glob<{ default: StationDef }>(['../content/stations/*/*.ts', '!../content/stations/*/_*.ts'], { eager: true });
export const STATION_TEXTS: Record<string, StationDef> = Object.fromEntries(Object.entries(tmods).map(([f, m]) => {
  const key = f.split('/').slice(-2).join('/').replace(/\.ts$/, '');
  if (m.default.key !== key) throw new Error(`${f}: key "${m.default.key}" differs from the path`);
  if (!STATIONS.some((s) => s.key === key)) throw new Error(`${f}: unknown station`);
  return [key, m.default];
}));
/** Station pages published: those with a hand-written text. */
export const PUBLISHED = STATIONS.filter((s) => STATION_TEXTS[s.key]);
export const stationId = (key: string) => `st:${key}`;
export const stateId = (state: string) => `state:${state}`;
