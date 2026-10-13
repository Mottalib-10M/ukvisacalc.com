import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const T = K.TEACHERS as Array<Record<string, string | number | null>>;
const COLS = ['England (excluding London / Fringe)', 'London Fringe', 'Outer London', 'Inner London', 'Scotland', 'Wales', 'Northern Ireland'];
const r = (role: string, col: string) => Number(T.find((t) => t.role === role)?.[col] ?? 0);
const qEng = r('Qualified teachers', COLS[0]), qIn = r('Qualified teachers', COLS[3]), qSco = r('Qualified teachers', 'Scotland');
const unq = r('Unqualified teachers / Probationers', COLS[0]);
const CODES = ['2313', '2314', '2315', '2316', '2321', '2312'].map((c) => K.occ(c));
const fam = K.visaCost({ route: 'skilled-worker', where: 'outside', months: 36, partner: true, children: 2 });

export default definePage({
  id: 'teacher-visa-uk',
  group: 'work',
  order: 280,
  nav: 'Teacher visa',
  card: 'Teaching codes use the national pay scales: qualified, unqualified, London areas and each nation.',
  title: 'Teacher Visa 2026: Pay Scale Thresholds by Nation and Area',
  description: `Teacher visa: school teachers are sponsored on national pay scales, ${K.gbp(qEng)} for a qualified teacher in England, ${K.gbp(qIn)} in Inner London, ${K.gbp(qSco)} in Scotland.`,
  h1: 'Teacher visa: the pay scale you must be paid on',
  intro: `A qualified secondary or primary teacher needs at least ${K.gbp(qEng)} in most of England, ${K.gbp(qIn)} in Inner London, never less than ${K.gbp(S.healthEducation.floor)}.`,
  resume: `School teachers are sponsored on the Skilled Worker route under education codes such as 2313 (secondary) and 2314 (primary), which sit in Table 3 of Appendix Skilled Occupations. For these jobs the going rate is not one figure but the national pay scale for the role and the place: Table 5 of the appendix gives ${K.gbp(qEng)} for a qualified teacher in England outside London and its fringe, ${K.gbp(r('Qualified teachers', COLS[2]))} in Outer London, ${K.gbp(qIn)} in Inner London, ${K.gbp(qSco)} in Scotland and ${K.gbp(r('Qualified teachers', 'Wales'))} in Wales. The salary must reach the rate of the role and also the floor of ${K.gbp(S.healthEducation.floor)}, which is why an unqualified teacher in England, on a scale of ${K.gbp(unq)}, still needs the floor. The general threshold of ${K.gbp(S.general)} does not apply to these listed education jobs. Teachers apply for the standard Skilled Worker visa, not the cheaper Health and Care visa, so the family pays the full fee and surcharge.`,
  tool: { kind: 'sw', props: { initialCode: '2313', initialSalary: 36000, title: 'Teacher salary check: choose the role and area' } },
  body: (h) => `
<h2>The rates of Table 5</h2>
${h.table(['Role', ...COLS.map((c) => c.replace(' (excluding London / Fringe)', ', rest'))], T.map((t) => [String(t.role), ...COLS.map((c) => (t[c] ? K.gbp(Number(t[c])) : '–'))]), 'Going rates for listed education occupations by administration and role, Appendix Skilled Occupations Table 5 (annual, full time).', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>A dash means the role does not exist in that pay system: chartered and principal teachers are Scottish grades, leading practitioners an English and Welsh one. The checker above takes the role, the nation and, for England, the London area; for a part-time post it pro-rates the rate to the hours on the certificate, while the ${K.gbp(S.healthEducation.floor)} floor stays whole.</p>
<h2>Which teaching codes use the scales</h2>
${h.table(['Code', 'Table', 'Going rate'], CODES.map((o) => [`${o.code} ${o.title}`, o.table, o.scale === 'table5' ? 'Table 5 (teachers’ scales)' : o.rates ? 'national scales listed in the code' : '–']), 'Appendix Skilled Occupations, Table 3.', ['l', 'l', 'l'])}
<p>Nursery, special needs and head teachers follow the same Table 5. Further education lecturers (2312) have their own rates per nation, written into the code, from the unqualified lecturer rate of the English colleges' scales to the management grades. University lecturers are not here: higher education teaching professionals (2311) are a Table 1 code with an ordinary going rate, and eligible for the postdoctoral and PhD discounts.</p>
<h2>Worked examples</h2>
<p>A qualified secondary teacher offered ${K.gbp(35000)} for a full-time post in Manchester meets the rest-of-England rate of ${K.gbp(qEng)}. The same offer in an Inner London school falls ${K.gbp(qIn - 35000)} short of ${K.gbp(qIn)}. A Scottish post starts higher again, at ${K.gbp(qSco)} for a qualified teacher, because Scotland's scale is the one used there. A primary teacher on a 0.6 contract (22.5 hours) in the rest of England must be paid at least ${K.gbp(K.checkSkilledWorker({ code: '2314', salary: 0, hours: 22.5, situation: 'standard', nation: 'England', payRate: qEng }).required)}: the pro-rated scale is lower than that, so the floor applies.</p>
<h2>What the school has to do</h2>
<p>The school or trust needs a sponsor licence, and the certificate states the role, which decides the row of the table: a post offered as a qualified teacher must be paid at least the qualified rate of its area, whatever the person's previous salary abroad. Teachers from outside the UK who apply from abroad also need a criminal record certificate from each country they lived in, as GOV.UK lists education among the jobs that require it. English can be proved by a degree taught in English or a test at level ${S.englishLevel}.</p>
<p>Costs are those of the standard route: ${K.gbp(K.FEE.skilledWorker('outside', 3))} for up to three years from abroad and ${K.gbp(K.P.ihs.standard)} a year of surcharge per person, so ${K.gbp(fam.total)} for a teacher with a partner and two children on a three-year visa. The school pays the certificate (${K.gbp(K.FEE.cosWorker())}) and the immigration skills charge. The ${h.a('skilled-worker-dependants', 'dependants page')} and the ${h.a('uk-visa-cost-calculator', 'cost calculator')} detail the family side.</p>`,
  faqs: [
    { q: 'Do teachers qualify for the Health and Care Worker visa?', a: `No. That visa is for doctors, nurses, health professionals and adult social care. Teachers are sponsored on the standard Skilled Worker visa: ${K.gbp(K.FEE.skilledWorker('outside', 3))} for up to three years from abroad, plus the health surcharge for each family member. The education codes do share one advantage with health: the ${K.gbp(S.healthEducation.floor)} floor instead of ${K.gbp(S.general)}.` },
    { q: 'Can an unqualified teacher get a Skilled Worker visa?', a: `Yes, if the school sponsors the job in a teaching code and pays at least the unqualified rate of Table 5 for the area and the ${K.gbp(S.healthEducation.floor)} floor. In most of England the unqualified scale is ${K.gbp(unq)}, so the floor decides; in Inner London and Scotland the scale itself is higher.` },
    { q: 'Which London area applies to my school?', a: 'The area of the school sets the column: Inner London, Outer London, the London Fringe or the rest of England, as defined by the teachers’ pay arrangements in England. The school knows which one it is in and pays its staff on that scale; ask it to confirm the area on your offer.' },
  ],
  related: ['skilled-worker-visa', 'skilled-worker-visa-salary-threshold', 'skilled-worker-dependants', 'soc-code-checker', 'sponsor-licence'],
  sources: ['appendix_aso', 'appendix_sw', 'sw_visa', 'fees_table'],
});
