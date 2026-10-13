import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.SPONSORS;
const towns = M.topTowns as Array<{ town: string; orgs: number; skilled: number; b: number }>;
const lon = towns.find((t) => t.town === 'London')!;
const top10 = towns.slice(0, 10).reduce((a, t) => a + t.orgs, 0);
const scot = ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'].map((n) => towns.find((t) => t.town === n)).filter(Boolean) as typeof towns;
const wal = towns.find((t) => t.town === 'Cardiff');
const bel = towns.find((t) => t.town === 'Belfast');

export default definePage({
  id: 'visa-sponsors-by-city',
  group: 'employers',
  order: 40,
  nav: 'Visa sponsors by city',
  card: 'How many licensed sponsors each UK town has, from the register of the day, and a search by town.',
  title: 'Visa Sponsors by City 2026: Licensed Employers per UK Town',
  description: `Visa sponsors by city: how many employers hold a sponsor licence in London and 39 other UK towns, counted from the Home Office register, with a search by town.`,
  h1: 'Visa sponsors by city: where the licensed employers are',
  intro: `London holds ${K.pct(lon.orgs / M.organisations)} of the ${K.int(M.organisations)} licensed sponsors; the ten largest towns together, ${K.pct(top10 / M.organisations)}. Search an employer in your town below.`,
  resume: `The Home Office register of licensed sponsors gives a town for every organisation, which makes it possible to see where sponsoring employers are. In the file of ${K.date(M.date)}, ${K.int(lon.orgs)} of the ${K.int(M.organisations)} organisations are registered in London, far ahead of ${towns[1].town} (${K.int(towns[1].orgs)}), ${towns[2].town} (${K.int(towns[2].orgs)}) and ${towns[3].town} (${K.int(towns[3].orgs)}). The ten towns with the most sponsors account for ${K.pct(top10 / M.organisations)} of the register, and the forty listed below for most of it. Two cautions apply. The town is the one the employer gave for its licence, often the head office, so a chain with branches across the country counts once, where its head office is. And a sponsor is an employer allowed to sponsor, not one that is hiring: the register says nothing about vacancies. The search above takes a name and a town and returns the licensed organisations that match, with their routes and rating.`,
  tool: { kind: 'sponsor', props: { initialQuery: 'care', initialTown: 'Manchester', title: 'Search sponsors in a town' } },
  body: (h) => `
<h2>The forty towns with the most licensed sponsors</h2>
${h.table(['Town', 'Licensed organisations', 'Of which Skilled Worker', 'Share of the register', 'B-rated'], towns.map((t) => [t.town, K.int(t.orgs), K.int(t.skilled), K.pct(t.orgs / M.organisations, 1), K.int(t.b)]), `Register of Worker and Temporary Worker licensed sponsors, file of ${K.date(M.date)}; organisations counted once per name and town.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>What the figures say, and what they do not</h2>
<p>The concentration in London reflects head offices as much as jobs: an organisation with a London head office and branches elsewhere appears once, under London, however many of its sponsored staff work in other towns. Outer London postal towns such as ${['Ilford', 'Harrow', 'Wembley', 'Croydon', 'Southall', 'Hounslow'].filter((n) => towns.some((t) => t.town === n)).join(', ')} appear separately because the register uses the postal town the sponsor wrote, not the borough.</p>
<p>Scotland's largest centres (${scot.map((t) => `${t.town} ${K.int(t.orgs)}`).join(', ')})${wal ? `, Cardiff in Wales (${K.int(wal.orgs)})` : ''}${bel ? ` and Belfast in Northern Ireland (${K.int(bel.orgs)})` : ''} matter for one reason beyond numbers: the Immigration Salary List and the national pay scales differ by nation, so the same job can have a different threshold in Glasgow and in Leeds. The ${h.a('immigration-salary-list', 'Immigration Salary List page')} shows which entries apply only in Scotland.</p>
<p>The B-rated column counts organisations with at least one B-rated licence: they cannot assign new certificates of sponsorship until they complete an action plan, which matters if you are about to accept an offer from one of them. The rating is shown for each result of the search.</p>
<h2>How the towns are counted</h2>
<p>Each organisation is counted once for each name and town it is registered under, whatever the number of routes it holds; ${K.int(M.rows)} lines of the register give ${K.int(M.organisations)} organisations this way. The town field is copied as the sponsor wrote it, with capital letters and spaces tidied, and nothing else is changed: ${towns.some((t) => t.town === 'Essex') ? 'that is why "Essex", a county, shows up in the list, written in the town field by some sponsors, and why' : 'that is why'} a few London suburbs stand on their own. The table is rebuilt from the new file every working day, so the counts and the order of the towns can move slightly from one day to the next.</p>
<p>Before relying on any listing, compare the sponsor licence number printed on your certificate of sponsorship with the employer's details, and check its rating on the day you accept: a downgrade appears in the next day's file.</p>
<h2>Searching by town</h2>
<p>The search matches the town and the county fields of the register, so "Manchester" also finds sponsors whose town is a suburb but whose county is Greater Manchester, when the employer filled in that field. Spelling follows what each sponsor typed, which is why the search ignores capitals and accents. To find a particular employer, start with its name; to explore a sector, try a word that names it ("care", "dental", "engineering", "restaurant") with a town. The full register, without a town, is on the ${h.a('register-of-licensed-sponsors', 'register search page')}.</p>`,
  faqs: [
    { q: 'Which UK city has the most visa sponsors?', a: `London, by a wide margin: ${K.int(lon.orgs)} licensed organisations in the register of ${K.date(M.date)}, against ${K.int(towns[1].orgs)} in ${towns[1].town} and ${K.int(towns[2].orgs)} in ${towns[2].town}. Part of the gap comes from head offices: national employers usually hold their licence under their London address.` },
    { q: 'Can a sponsor in one city employ me in another?', a: 'Yes. The licence belongs to the organisation, not to an address, and the certificate of sponsorship states where you will work. What must be right is the job: the occupation code, the salary and, for the Immigration Salary List and pay scales, the nation where the work is done.' },
    { q: 'Does the register show which sponsors are hiring?', a: 'No. It lists organisations allowed to sponsor, with their town, routes and rating, and nothing about vacancies or the jobs they sponsor. Job boards and the employers’ own sites carry the vacancies; the register is useful to check that an employer offering you a sponsored job is really licensed.' },
  ],
  related: ['register-of-licensed-sponsors', 'sponsor-licence', 'immigration-salary-list', 'skilled-worker-visa', 'care-worker-visa'],
  sources: ['sponsor_register', 'sponsor_guide', 'appendix_isl'],
});
