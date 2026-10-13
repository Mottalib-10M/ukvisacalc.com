import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const da = K.occ('3544');
const std = K.checkSkilledWorker({ code: '3544', salary: 0, hours: 37.5, situation: 'standard', nation: 'England' });
const ne = K.checkSkilledWorker({ code: '3544', salary: 0, hours: 37.5, situation: 'new-entrant', nation: 'England' });
const DATA = ['3544', '3133', '2133', '2433', '2134', '4152'].map((c) => K.occ(c));

export default definePage({
  id: 'data-analyst-visa-uk',
  group: 'work',
  order: 260,
  nav: 'Data analyst visa',
  card: 'Code 3544 is on the Temporary Shortage List until 31 December 2026: threshold, deadline and the data codes nearby.',
  title: 'Data Analyst Visa 2026: SOC 3544, Shortage List and Salary',
  description: `Data analyst visa: SOC 3544 is open to new applicants only through the Temporary Shortage List, at ${K.gbp(std.required)}, until the end of 2026. Data codes compared.`,
  h1: 'Data analyst visa: a shortage list job with a deadline',
  intro: `Data analysts (code 3544) can still be sponsored from abroad, at ${K.gbp(std.required)}, but only on a certificate of sponsorship issued before ${K.SOC.tslUntil}, and new applicants cannot bring dependants.`,
  resume: `Data analysts are coded 3544 in the Standard Occupational Classification, and since 22 July 2025 that code sits in Table 1a of Appendix Skilled Occupations, the "medium skilled" list. A medium skilled job is open to new Skilled Worker applicants only while it is on a shortage list, and 3544 is on the Temporary Shortage List of Appendix Skilled Worker, for certificates of sponsorship issued before ${K.SOC.tslUntil}. The salary test is the usual one: the higher of ${K.gbp(S.general)} and the going rate of ${K.gbp(da.goingRate!)}, so ${K.gbp(std.required)} for a full-time post, or ${K.gbp(ne.required)} for a new entrant such as a recent graduate. Two limits come with the list: new applicants in a medium skilled job cannot bring a partner or children, and after the deadline the code closes to newcomers unless the list is extended. Many roles called "data" sit in other codes, some of them higher skilled and permanently open, which is why the code chosen by the employer decides the case.`,
  tool: { kind: 'sw', props: { initialCode: '3544', initialSalary: 42000, title: 'Data analyst salary check' } },
  body: (h) => `
<h2>Data roles, code by code</h2>
${h.table(['Code', 'Table', 'New applicants', 'Going rate'], DATA.map((o) => [`${o.code} ${o.title}`, o.table, o.table === 'Table 1' ? 'open' : o.tsl ? `until ${K.SOC.tslUntil}` : 'not eligible', o.goingRate ? K.gbp(o.goingRate) : '–']), 'Appendix Skilled Occupations and the Temporary Shortage List (SW 6.1A).', ['l', 'l', 'l', 'r'])}
<p>The examples printed under each code show where the line falls. Data architects and data engineers are listed under 2133, IT business analysts, architects and systems designers; "statistical data scientists" under 2433 with actuaries and economists. Both are degree-level codes in Table 1, open without a deadline but with going rates of ${K.gbp(K.occ('2133').goingRate!)} and ${K.gbp(K.occ('2433').goingRate!)}. Data entry clerks (4152) are in Table 6 and cannot be sponsored at all. An employer may not pick 3544 to avoid a higher rate if the job is really a data engineer's: SW 6.2 lets the caseworker refuse a less appropriate code.</p>
<h2>What the Temporary Shortage List changes, and what it does not</h2>
<p>The list makes the code eligible; it does not lower the salary. A data analyst therefore needs the general threshold of ${K.gbp(S.general)}, which here is above the going rate, unless one of the usual discounts applies. A graduate switching from a Student or Graduate visa, or anyone under 26, can be paid the new entrant rate of ${K.gbp(ne.required)} for up to ${S.newEntrant.maxStayYears} years in total. The PhD discounts do not apply: 3544 is not eligible for PhD points.</p>
<p>The deadline concerns the certificate, not the visa. A certificate assigned on or before ${K.SOC.tslUntil} can still be used for an application within its three months of validity, and a worker granted a visa keeps it for its whole length. What is uncertain is the extension: a medium skilled worker already in the job before 22 July 2025 keeps access to it under the transitional rules, but someone recruited through the list after that date should not assume the code will still be open when the visa ends.</p>
<h2>The family question</h2>
<p>GOV.UK states that a partner or child outside the UK can join a worker in a medium skilled job only if the worker has been in such a job on a Skilled Worker visa since before 22 July 2025, or if the child was born in the UK. For a data analyst recruited from abroad now, that rules out bringing a family on the same route. A partner with their own visa (a Skilled Worker job of their own, or Global Talent) is a different matter; the ${h.a('skilled-worker-dependants', 'dependants page')} sets out the rules and the ${h.a('temporary-shortage-list', 'Temporary Shortage List page')} lists every code on it.</p>`,
  faqs: [
    { q: 'Is data analyst on the shortage occupation list?', a: `It is on the Temporary Shortage List, not the Immigration Salary List. That keeps code 3544 open to new Skilled Worker applicants for certificates issued before ${K.SOC.tslUntil}, at the normal threshold of ${K.gbp(std.required)}, without the lower floor or reduced fee that the Immigration Salary List would bring.` },
    { q: 'Can a data scientist be sponsored under 3544?', a: `Only if the job really is a data analyst’s. Statistical data scientists are an example title of code 2433, a higher skilled code open without a deadline and with a going rate of ${K.gbp(K.occ('2433').goingRate!)}. The employer must choose the code that best fits the duties, and a caseworker can refuse a weaker fit chosen to lower the rate.` },
    { q: 'What happens to data analyst visas after December 2026?', a: 'Workers already granted a visa keep it until it ends. Unless the Home Office extends the list, new certificates in code 3544 can no longer be issued to newcomers after the deadline, and extensions for people recruited through the list are not guaranteed. Watch the next Statements of Changes before relying on a renewal.' },
  ],
  related: ['temporary-shortage-list', 'software-developer-visa-uk', 'soc-code-checker', 'new-entrant-salary', 'skilled-worker-dependants'],
  sources: ['appendix_sw', 'appendix_aso', 'sw_visa', 'sw_paid_less'],
});
