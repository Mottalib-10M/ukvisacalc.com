import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const H = K.P.hpi;
const fee = K.FEE.hpi('outside');
const two = K.visaCost({ route: 'hpi', where: 'outside', months: H.years * 12, partner: false, children: 0 });
const three = K.visaCost({ route: 'hpi', where: 'outside', months: H.phdYears * 12, partner: false, children: 0 });
const pair = K.visaCost({ route: 'hpi', where: 'outside', months: H.years * 12, partner: true, children: 0 });
const S = K.P.skilledWorker;
// Global universities list 2025 (awards from 1 November 2025 to 31 October 2026), read 2026-10-13:
// 80 institutions, 33 of them in the United States (scripts/data-raw/govuk/…global-universities-list-2025.txt).
const LIST = { total: 80, us: 33, countries: 15 };

export default definePage({
  id: 'high-potential-individual-visa',
  group: 'work',
  order: 170,
  nav: 'High Potential Individual visa',
  card: 'Two years without a job offer for graduates of listed universities: eligibility window, yearly cap, costs and what comes next.',
  title: 'High Potential Individual Visa 2026: Universities and Cost',
  description: `High Potential Individual visa: degree from a listed university in the last ${H.qualificationWithinYears} years, ${H.years} years of stay (${H.phdYears} with a PhD), ${K.gbp(fee)} fee, ${K.gbp(H.ecctis)} Ecctis check, no job offer.`,
  h1: 'High Potential Individual visa: eligibility, cap and cost',
  intro: `With a degree from a listed university awarded in the last ${H.qualificationWithinYears} years, you get ${H.years} years to work or look for work, ${H.phdYears} with a doctorate. Budget ${K.gbp(two.total + H.ecctis)} for the two-year visa, Ecctis check and surcharge.`,
  resume: `The High Potential Individual (HPI) visa gives graduates of top-ranked universities outside the UK ${H.years} years of permission, or ${H.phdYears} years for a PhD or other doctorate, without a job offer or a sponsor. The degree must be at bachelor's level or above, awarded in the ${H.qualificationWithinYears} years before you apply, by an institution on the Home Office global universities list for the year of your award; the current list, for awards from 1 November 2025 to 31 October 2026, names ${LIST.total} universities. You pay ${K.gbp(H.ecctis)} to Ecctis to confirm the qualification, the ${K.gbp(fee)} visa fee and the health surcharge for the whole stay, ${K.gbp(two.ihsTotal)} for two years or ${K.gbp(three.ihsTotal)} for three, and hold ${K.gbp(S.maintenance)} of savings unless you have lived here for 12 months. The route is capped each application year, 1 November to 31 October. It cannot be extended, does not lead to settlement and can be used only once, so most holders plan a switch to a work visa before it ends.`,
  tool: { kind: 'cost', props: { initialRoute: 'hpi', initialMonths: 24, title: 'High Potential Individual visa: fee and surcharge' } },
  body: (h) => `
<h2>Checking the universities list for your award year</h2>
<p>Eligibility depends on the list in force when your degree was awarded, not when you apply. The Home Office publishes one list per award year, each running from 1 November to 31 October, and keeps the older ones online so that a 2022 graduate is judged against the 2022 list. The edition covering awards from 1 November 2025 has ${LIST.total} institutions in ${LIST.countries} countries and territories, ${LIST.us} of them in the United States; the rest are in China, Australia, Hong Kong, Germany, France, Sweden, the Netherlands, Switzerland, Canada, Japan, Singapore, South Korea, Belgium and Denmark. Universities in the UK are never on it: a UK graduate looks at the ${h.a('graduate-visa-uk', 'Graduate visa')} instead.</p>
<p>The list is built from global university rankings, so a university can enter or leave from one year to the next. Your award date is the one Ecctis confirms, which may differ from the day of the ceremony. Ecctis checks that the qualification is genuine and at UK bachelor's, master's or doctoral level; it does not check whether the institution is on the list, which is your job before you pay.</p>
<h2>Cost and money to show</h2>
<p>The visa fee is ${K.gbp(fee)} whether you apply from abroad or switch inside the country. The surcharge is paid up front for the full grant: ${K.gbp(two.ihsTotal)} for ${H.years} years at ${K.gbp(K.P.ihs.standard)} a year, ${K.gbp(three.ihsTotal)} for ${H.phdYears}. With the Ecctis fee, a single applicant on the two-year visa pays ${K.gbp(two.total + H.ecctis)} and a doctoral graduate ${K.gbp(three.total + H.ecctis)}. A partner joining you pays the same visa fee and surcharge, so a couple on the two-year visa pays ${K.gbp(pair.total)} to the Home Office. The savings test is ${K.gbp(S.maintenance)} for you, held for 28 consecutive days, plus ${K.gbp(S.dependantFunds.partner)} for a partner and ${K.gbp(S.dependantFunds.firstChild)} for a first child.</p>
<p>English is tested at B2 in reading, writing, speaking and listening, unless you are a national of one of the listed majority English-speaking countries or your degree was taught in English and Ecctis confirms it.</p>
<h2>The yearly limit and the one-time rule</h2>
<p>The number of HPI visas is capped for each application year, from 1 November to 31 October. GOV.UK does not publish the figure in the guidance; if the allocation is used up, the online form tells you before you pay. Apply early in your eligibility window rather than late, since an award approaching the ${H.qualificationWithinYears}-year limit leaves no room to wait for the next year's allocation.</p>
<p>The route can be used once in a lifetime. You are also excluded if you have already held a Graduate visa or a Doctorate Extension Scheme permission. That makes the order of applications matter for someone with both a listed overseas degree and a UK master's.</p>
<h2>After two or three years</h2>
<p>There is no extension and no settlement on this visa, and the time does not count towards the ${h.a('indefinite-leave-to-remain', 'five-year residence requirement')} for indefinite leave to remain. Before it expires, most holders switch from inside the country, usually to a Skilled Worker visa once an employer offers a sponsored job meeting the ${h.a('skilled-worker-visa-salary-threshold', 'salary threshold')}, or to the ${h.a('global-talent-visa', 'Global Talent visa')} if their record supports an endorsement. Meanwhile you can work in almost any job, be self-employed and do voluntary work; professional sport is the exception.</p>`,
  faqs: [
    { q: 'Which universities are on the High Potential Individual list?', a: `The edition for degrees awarded between 1 November 2025 and 31 October 2026 lists ${LIST.total} institutions outside the UK, ${LIST.us} of them in the United States. Earlier editions, back to 2020, stay valid for degrees awarded in those years, so check the list matching your award date on GOV.UK.` },
    { q: 'Can I apply for an HPI visa with a master\'s degree from a listed university?', a: `Yes. A bachelor's, master's or doctorate all qualify if Ecctis confirms the level and the award falls within the last ${H.qualificationWithinYears} years. Only a doctorate changes the length of the visa, from ${H.years} to ${H.phdYears} years; a master's gives the same ${H.years} years as a first degree.` },
    { q: 'Can my partner come with me on an HPI visa?', a: `Yes, a partner and children under 18 can apply as dependants. Each pays the ${K.gbp(fee)} fee and the surcharge for the same period, and you must hold ${K.gbp(S.dependantFunds.partner)} for a partner and ${K.gbp(S.dependantFunds.firstChild)} for a first child on top of your own savings, unless you have been here for 12 months.` },
    { q: 'What happens if the HPI yearly cap is reached?', a: 'Applications stop for the rest of the application year, which ends on 31 October, and the online form says so before you pay. A new allocation opens on 1 November. If your degree is close to the end of its eligibility window, waiting may mean losing eligibility altogether.' },
  ],
  related: ['graduate-visa-uk', 'global-talent-visa', 'skilled-worker-visa', 'graduate-to-skilled-worker', 'uk-visa-cost-calculator'],
  sources: ['hpi_visa', 'hpi_list', 'fees_table', 'ihs'],
});
