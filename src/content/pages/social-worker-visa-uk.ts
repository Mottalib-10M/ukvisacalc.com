import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const sw = K.occ('2461');
const N = ['England', 'Scotland', 'Wales', 'Northern Ireland'] as const;
const band = (b: string, n: (typeof N)[number]) => K.payOptions(sw, n).find((x) => x.label === b)!.rate;
const care = ['6135', '6136', '1232'].map((c) => K.occ(c));
const fam = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: true, children: 1 });
const famHc = K.visaCost({ route: 'health-and-care', where: 'outside', months: 36, partner: true, children: 1 });

export default definePage({
  id: 'social-worker-visa-uk',
  group: 'work',
  order: 300,
  nav: 'Social worker visa',
  card: 'Code 2461 is paid on NHS bands even in councils; how it differs from care work, and which visa applies.',
  title: 'Social Worker Visa 2026: SOC 2461, Band Rates and Which Visa',
  description: `Social worker visa: SOC 2461 is a higher skilled health and education code whose going rate is the NHS Agenda for Change band, ${K.gbp(band('Band 6', 'England'))} at Band 6 in England.`,
  h1: 'Social worker visa: the band rate and the right visa',
  intro: `Social workers (SOC 2461) are open to recruitment from abroad. The threshold is the Agenda for Change band of the post, ${K.gbp(band('Band 6', 'England'))} at Band 6 in England, with a ${K.gbp(S.healthEducation.floor)} floor.`,
  resume: `Social workers keep a door that care workers lost. Their code, 2461, is listed in Table 3 of Appendix Skilled Occupations with the health and education jobs, which means two things: it is higher skilled and open to new applicants from abroad, and its going rate is not a single figure but the NHS Agenda for Change band the post corresponds to, whether the employer is a hospital, a council or a charity. At Band 6 that is ${K.gbp(band('Band 6', 'England'))} in England, ${K.gbp(band('Band 6', 'Scotland'))} in Scotland, ${K.gbp(band('Band 6', 'Wales'))} in Wales and ${K.gbp(band('Band 6', 'Northern Ireland'))} in Northern Ireland; at Band 7, ${K.gbp(band('Band 7', 'England'))} in England. The floor is ${K.gbp(S.healthEducation.floor)}, not the general ${K.gbp(S.general)}. Care workers and senior care workers (6135 and 6136), by contrast, can no longer be recruited from abroad. Whether a social worker uses the cheaper Health and Care Worker visa depends on the job and employer; otherwise the standard Skilled Worker visa applies.`,
  tool: { kind: 'sw', props: { initialCode: '2461', initialSalary: 39000, title: 'Social worker salary check: choose the band' } },
  body: (h) => `
<h2>Band rates by nation</h2>
${h.table(['Band', ...N], ['Band 5', 'Band 6', 'Band 7', 'Band 8a'].map((b) => [b, ...N.map((n) => K.gbp(band(b, n)))]), 'Going rates of Appendix Skilled Occupations Table 4, full time, used for code 2461.', ['l', 'r', 'r', 'r', 'r'])}
<p>An employer outside the NHS may use its own pay scale; the post must still be matched to an Agenda for Change band, and the salary must reach that band's rate for the hours worked. For a qualified social worker post in an English council graded at the equivalent of Band 6, an offer of ${K.gbp(38000)} clears ${K.gbp(band('Band 6', 'England'))}; graded at Band 7, it falls ${K.gbp(band('Band 7', 'England') - 38000)} short. The checker above does the comparison once you choose the band and the nation.</p>
<h2>Part-time posts and the floor</h2>
<p>Social work posts are often offered part time. The band rate is then pro-rated to the hours on the certificate, while the ${K.gbp(S.healthEducation.floor)} floor stays fixed: at 22.5 hours a week in England, Band 5 and Band 6 posts both fall to the floor, ${K.gbp(K.checkSkilledWorker({ code: '2461', salary: 0, hours: 22.5, situation: 'standard', nation: 'England', payRate: band('Band 6', 'England') }).required)}, while a Band 7 post of 30 hours needs ${K.gbp(K.checkSkilledWorker({ code: '2461', salary: 0, hours: 30, situation: 'standard', nation: 'England', payRate: band('Band 7', 'England') }).required)}. Only guaranteed basic pay counts, so a car allowance or out-of-hours duty payments do not help to reach it.</p>
<h2>Social work, care work and care management</h2>
${h.table(['Code', 'Table', 'From abroad'], care.map((o) => [`${o.code} ${o.title}`, o.table, ['6135', '6136'].includes(o.code) ? 'closed since 22 July 2025' : o.isl ? `Immigration Salary List, until ${o.isl.until}` : 'existing workers only']).concat([[`${sw.code} ${sw.title}`, sw.table, 'open, band rate']]), 'Appendix Skilled Occupations, Appendix Immigration Salary List and SW 6.1B.', ['l', 'l', 'l'])}
<p>The examples listed under 2461 (${K.listOf(sw.examples.slice(0, 4).map((e) => e.toLowerCase()))}) describe qualified practitioners. Support work in a care home or at home belongs to 6135 or 6136, which can only be sponsored for people already in the UK switching after three months with the sponsor, until 22 July 2028. Residential and domiciliary care managers (1232) are on the Immigration Salary List until ${K.occ('1232').isl?.until ?? 'the date listed'}. An employer cannot code a care job as social work to get around the closure: the caseworker can refuse a less appropriate code.</p>
<h2>Which visa, and what it costs</h2>
<p>The Health and Care Worker visa is for qualified health and adult social care professionals working for the NHS, an NHS supplier or in adult social care. For a social worker and a family of three on a three-year visa from abroad, the gap is large: ${K.gbp(famHc.total)} on the Health and Care Worker visa against ${K.gbp(fam.total)} on the standard Skilled Worker visa, mostly because the first carries no health surcharge. Ask the employer which of the two the role allows before you pay. English at level ${S.englishLevel} and, for applications from abroad, criminal record certificates from the countries you lived in are required, as for other social services jobs. The ${h.a('health-and-care-worker-visa', 'Health and Care Worker page')} and the ${h.a('care-worker-visa', 'care worker page')} cover the neighbouring cases.</p>`,
  faqs: [
    { q: 'Is social work on the UK shortage list?', a: `Not on the Immigration Salary List, and it does not need to be: social workers (2461) are a Table 3 code, open to new applicants from abroad at the band rate of the post, with a ${K.gbp(S.healthEducation.floor)} floor. The closure of overseas recruitment in July 2025 concerned care workers and senior care workers, codes 6135 and 6136.` },
    { q: 'Can a council sponsor a social worker from abroad?', a: 'Yes, if it holds a sponsor licence, assigns a certificate of sponsorship in code 2461 and pays at least the rate of the Agenda for Change band the post is equivalent to, in the nation where the job is. The council also pays the certificate fee and the immigration skills charge for the length sponsored.' },
    { q: 'Do social workers need a criminal record certificate for the visa?', a: 'Yes, when applying from outside the UK: GOV.UK lists social services jobs, social workers included, among those that need a criminal record certificate from every country you have lived in, for 12 months or more since 18 if you are under 28, or in the last 10 years if you are 28 or over.' },
  ],
  related: ['care-worker-visa', 'health-and-care-worker-visa', 'nurse-visa-uk', 'skilled-worker-visa', 'sponsor-licence'],
  sources: ['appendix_aso', 'hcw_visa', 'sw_visa', 'appendix_sw'],
});
