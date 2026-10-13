import type { APIRoute } from 'astro';
import { PAGES } from '../lib/pages';
import { route } from '../i18n/routes';
import { SITE_URL, SITE_NAMES } from '../data/site-config';
import { KIT as K } from '../lib/kit';
export const GET: APIRoute = () => new Response([
  `# ${SITE_NAMES.en}`,
  `> UK visa calculators built on GOV.UK sources: Skilled Worker salary threshold by SOC 2020 code, Home Office fees (table of ${K.date(K.FEE_DATE)}) and immigration health surcharge for a family, spouse visa income and savings, ILR and citizenship dates with the 180-day rule, decision dates, and a search of the register of licensed sponsors (${K.date(K.SPONSORS.date)}). Not legal advice, not affiliated with the Home Office.`,
  '', '## Calculators and guides',
  ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
  '', '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
