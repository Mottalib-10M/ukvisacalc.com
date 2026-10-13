import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.SPONSORS;
const share = (n: number) => K.pct(n / M.rows, 1);
const routesRows = Object.entries(M.byRoute).sort((a, b) => b[1] - a[1]).map(([r, n]) => [r.trim(), K.int(n), share(n)]);
const ratingRows = Object.entries(M.byRating).sort((a, b) => b[1] - a[1]).map(([r, n]) => [r, K.int(n)]);

export default definePage({
  id: 'register-of-licensed-sponsors',
  group: 'employers',
  order: 10,
  nav: 'Register of licensed sponsors',
  card: 'Search the Home Office list of employers licensed to sponsor workers, copied every working day.',
  title: 'Register of Licensed Sponsors 2026: Search Every UK Employer',
  description: `Register of licensed sponsors, copied every working day: search the UK employers allowed to sponsor Skilled Worker and other visas by name, town and route.`,
  h1: 'Register of licensed sponsors: search the list of the day',
  intro: `${K.int(M.organisations)} organisations held a worker or temporary worker licence on ${K.date(M.date)}, ${K.int(M.skilledWorkerOrgs)} of them for the Skilled Worker route.`,
  resume: `The register of licensed sponsors is the list, published by the Home Office every working day, of the organisations allowed to sponsor people on work routes: only an employer on it can issue the certificate of sponsorship a Skilled Worker needs. The file of ${K.date(M.date)} has ${K.int(M.rows)} lines for ${K.int(M.organisations)} organisations, because an employer appears once for each route it may use. ${K.int(M.skilledWorkerOrgs)} organisations can sponsor Skilled Workers; others hold licences for Senior or Specialist Workers, ministers of religion, creative workers, charity workers or sportspeople. Almost all are A-rated; ${K.int(M.bRatedOrgs)} carry a B rating, which stops them assigning new certificates until they complete an action plan. The search above reads that same file in your browser: type the name, add a town or a route, and it shows each matching employer with its town, rating and routes. Being on the list does not mean an employer has a job for you, only that it is allowed to sponsor one.`,
  tool: { kind: 'sponsor', props: { initialQuery: 'nhs', title: 'Search the register of licensed sponsors' } },
  body: (h) => `
<h2>What the register contains, route by route</h2>
${h.table(['Route', 'Lines in the register', 'Share'], routesRows, `Register of Worker and Temporary Worker licensed sponsors, file of ${K.date(M.date)}; one line per organisation and route.`, ['l', 'r', 'r'])}
<p>Each line gives the organisation's name as licensed, its town and, for some, a county, the type and rating of the licence, and the route. There is no address, no sector and no occupation code: the register says who may sponsor, not for which jobs. An organisation that sponsors on several routes appears on several lines, which is why the search groups them under one name and town.</p>
<h2>Ratings: A, B and the rest</h2>
${h.table(['Type and rating', 'Lines'], ratingRows, 'Licence types and ratings as written in the register.', ['l', 'r'])}
<p>A licence that is granted starts with an A rating, which allows the sponsor to assign certificates of sponsorship. When a sponsor stops meeting its duties, UKVI can downgrade it to B: it then cannot issue new certificates, except to workers it already employs who extend their stay, until it completes an action plan, which costs ${K.gbp(K.FEE.actionPlan())} and must be paid within 10 working days of the downgrade. A sponsor can have only two B ratings during the life of its licence; failing the second action plan means losing the licence, and a revoked sponsor must wait at least 12 months before applying again. Applicants under the UK Expansion Worker route may also see a provisional rating, which allows a single certificate for the person setting up the UK branch.</p>
<h2>Using the search well</h2>
<p>Search by the legal name rather than the brand: many employers are licensed as a company ("… Limited", "… LLP", "… NHS Foundation Trust") or through a group entity. Short words help: "Siemens" finds every licensed Siemens company, while the full name of one subsidiary may not. The town in the register is the one the sponsor gave, often its head office, so a branch in another city can be licensed under the head office's town. If an employer is missing, it may hold its licence under a parent company's name, or it may not be licensed yet: it can apply, which usually takes about ${K.P.sponsor.decisionWeeks} weeks, as the ${h.a('sponsor-licence', 'sponsor licence page')} explains.</p>
<p>The copy on this site is the Home Office CSV of ${K.date(M.date)}, reused under the Open Government Licence and refreshed each working day. For a decision that depends on it, such as accepting a job, check the employer's licence number on your certificate of sponsorship and the ${h.src('sponsor_register', 'official register')}.</p>`,
  faqs: [
    { q: 'How often is the register of licensed sponsors updated?', a: 'The Home Office publishes a new file every working day, usually in the morning, with sponsors added, removed, downgraded or upgraded since the day before. This site copies it each working day and prints the date of the file it is searching under the tool.' },
    { q: 'Does a company on the register have to sponsor me?', a: 'No. A licence only allows the employer to sponsor; it decides whether a job is open to sponsored applicants, chooses whom to sponsor, and must still pay at least the going rate and meet every other rule for that particular job.' },
    { q: 'What does it mean if my employer is not on the register?', a: 'It cannot assign you a certificate of sponsorship. It may hold its licence under another legal name, so search for the parent company or a shorter form of the name. If it has no licence, it can apply for one; until it is granted, it cannot sponsor you.' },
  ],
  related: ['sponsor-licence', 'visa-sponsors-by-city', 'immigration-skills-charge', 'skilled-worker-visa', 'skilled-worker-visa-requirements'],
  sources: ['sponsor_register', 'sponsor_guide', 'ogl', 'appendix_sw'],
});
