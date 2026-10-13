/**
 * Writing kit: every figure a page writes comes from here (station registry, prediction files,
 * params), never typed by hand (RECETTE §17.4 point 7). Server side only.
 */
import { listOf } from './fmt';
import { ft, ft1, int } from '../components/tide/fmt';
import { fullDate, monthName, clock, shortDate, localDate } from './engine/time';
import { STATIONS, STATE_INFO, STATE_LIST, station, stationsIn, DATA_META, lite } from './stations';
import P from '../data/params-2026.json';
import VAL from '../data/validation.json';

const typeWords = { semidiurnal: 'two highs and two lows of similar size each day', mixed: 'two highs and two lows of unequal size each day', diurnal: 'often a single high and a single low a day' } as const;

export const KIT = {
  P, VAL, DATA: DATA_META,
  ft, ft1, int, listOf, date: fullDate, month: monthName, clock, shortDate, localDate,
  stations: STATIONS, states: STATE_LIST, stateInfo: STATE_INFO,
  st: station, inState: stationsIn, lite,
  stateName: (s: string) => STATE_INFO[s].name,
  /** "two highs and two lows of unequal size each day" */
  typeWords: (key: string) => typeWords[station(key).stats.tideType],
  /** Station by place name inside a state, e.g. K.find('florida', 'key-west'). */
  find: (state: string, slug: string) => station(`${state}/${slug}`),
  /** Largest and smallest average range among a set of stations. */
  extremesOf: (keys: string[]) => { const xs = keys.map(station).sort((a, b) => b.stats.meanRange - a.stats.meanRange); return { max: xs[0], min: xs[xs.length - 1] }; },
  /** Date and time of a station extreme: "December 24, 2026 at 7:42 AM". */
  when: (key: string, t: number) => { const s = station(key); return `${fullDate(localDate(t, s.tz))} at ${clock(t, s.tz)}`; },
};
export type Kit = typeof KIT;
