import type { Locale } from './routes';
const en = {
  updatedOn: 'Predictions updated', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Published by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions about these tides', relatedCalculators: 'Read next', sourcesTitle: 'Where the figures come from', writtenBy: 'Published by',
  asOf: 'Tide predictions', lastUpdated: 'downloaded from the National Ocean Service on', footerValidated: 'Highs and lows: NOAA CO-OPS predictions · sun and moon: Astronomy Engine',
  footerBrowser: 'Curves, planners and solunar times computed in your browser · no account, no location sent · free',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with NOAA or any government agency. Predicted astronomical tides only: wind, storms and river flow change the real water level. Tide times are for guidance only and not for navigation: they are no substitute for official nautical charts and Notices to Mariners.',
  footerPopular: 'Most-viewed tide charts',
  notFound: 'This address does not lead to a tide chart. The 92 station pages below give today’s high and low tides, the next seven days and the solunar periods, from Bar Harbor to Honolulu.',
  readMore: 'Read the full answer',
  estimate: 'Predictions, not measurements: the times and heights are NOAA’s astronomical tide for the station named on the page. An onshore wind, a storm surge or a river in flood can raise the water well above them, and an offshore wind can hold it down. Never use this page to navigate.',
};
export function t(_lang: Locale) { return en; }
