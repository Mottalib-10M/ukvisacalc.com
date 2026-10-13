import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const o = K.occ('2121');
const ENG = K.OCCUPATIONS.filter((x) => /^212\d$/.test(x.code) && x.table === 'Table 1');
const sorted = [...ENG].sort((a, b) => b.goingRate! - a.goingRate!);
const top = sorted[0], low = sorted[sorted.length - 1];
const qc = K.occ('2481');
const tech = ['3113', '3114'].map((c) => K.occ(c));
const civil = (salary: number, situation: 'standard' | 'new-entrant' | 'phd-stem') =>
  K.checkSkilledWorker({ code: '2121', salary, hours: S.goingRateHours, situation, nation: 'England' });
const offer = 46000;
const asStd = civil(offer, 'standard'), asNew = civil(offer, 'new-entrant'), asPhd = civil(offer, 'phd-stem');

export default definePage({
  id: 'engineer-visa-uk',
  group: 'work',
  order: 240,
  nav: 'Engineer visa',
  card: `All ${ENG.length} professional engineering codes, from civil to aerospace: going rates, the chartered-status discount and technician codes.`,
  title: 'Engineer Visa 2026: Going Rates for Every Engineering Code',
  description: `Engineer Skilled Worker visa: the ${ENG.length} engineering codes 2121 to 2129 are in Table 1, with going rates from ${K.gbp(low.goingRate!)} to ${K.gbp(top.goingRate!)}. Civil engineers: ${K.gbp(o.goingRate!)}.`,
  h1: 'Engineer visa: going rates by engineering code',
  intro: `Every professional engineering code from 2121 to 2129 is open to new Skilled Worker applicants. Going rates run from ${K.gbp(low.goingRate!)} to ${K.gbp(top.goingRate!)}; a civil engineer (2121) needs ${K.gbp(o.goingRate!)} full time.`,
  resume: `Professional engineers are spread over ${ENG.length} SOC 2020 codes, 2121 to 2129, and all of them sit in Table 1 of Appendix Skilled Occupations: they are higher skilled, open to recruitment from abroad, and eligible for PhD points. Each has its own going rate for a 37.5-hour week, and in every case it is at or above the general threshold of ${K.gbp(S.general)}, so the going rate of the code is the figure to beat. It ranges from ${K.gbp(low.goingRate!)} for ${low.title.toLowerCase()} (${low.code}) to ${K.gbp(top.goingRate!)} for ${top.title.toLowerCase()} (${top.code}); civil engineers (2121), the checker's starting point, need ${K.gbp(o.goingRate!)}. An engineer working towards chartered status or full registration counts as a new entrant and may be paid 70 % of the rate, ${K.gbp(o.r70!)} for a civil engineer, for up to ${S.newEntrant.maxStayYears} years in total. None of the 212x codes is on the Immigration Salary List. Engineering technicians are a different, medium skilled family, open only through the Temporary Shortage List until ${K.SOC.tslUntil}.`,
  tool: { kind: 'sw', props: { initialCode: '2121', initialSalary: offer, title: 'Engineering job: salary check by code' } },
  body: (h) => `
<h2>The engineering codes and their rates</h2>
<p>The code is set by the branch of engineering the job belongs to, not by the employer's sector: a structural engineer at a rail contractor is still 2121. All ${ENG.length} codes are higher skilled, with the same rules; only the rates differ.</p>
${h.table(['Code', 'Occupation', 'Going rate', 'STEM PhD (80 %)', 'New entrant (70 %)'], ENG.map((x) => [x.code, x.title, K.gbp(x.goingRate!), K.gbp(x.r80!), K.gbp(x.r70!)]), `Engineering codes in Table 1 of Appendix Skilled Occupations, full-time rates for ${S.goingRateHours} hours, as in force on 8 October 2026.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The example titles show where the lines fall. Code 2121 takes ${K.listOf(o.examples.slice(0, 5).map((e) => e.toLowerCase()))}. Electrical engineering (2123) includes railway signalling and power systems engineers, while broadcast and telecoms engineers are electronics (2124). Code 2125 holds chemical and control and instrumentation engineers; 2127 is engineering project managers and project engineers; and 2129 gathers the rest, from acoustic, energy and nuclear engineers to robotics and materials engineers. Quality control and planning engineers have their own Table 1 code, ${qc.code}, with a going rate of ${K.gbp(qc.goingRate!)}.</p>
<h2>A civil engineer offered ${K.gbp(offer)}</h2>
<p>Take a civil engineering job at ${K.gbp(offer)} for 37.5 hours. On the standard rate it fails by ${K.gbp(-asStd.gap)}, because 2121 needs ${K.gbp(asStd.required)}. The same offer passes in two situations. As a new entrant, a status that includes anyone working towards chartered status or full registration with the professional body for the sponsored job, the threshold falls to ${K.gbp(asNew.required)}. With a relevant STEM doctorate, checked through Ecctis if it was awarded abroad, it is ${K.gbp(asPhd.required)}. The employer has to be able to confirm that the doctorate is relevant to the job, or that the training towards registration is for the job it sponsors.</p>
<p>The new entrant rate is time-limited. Your total stay on it cannot exceed ${S.newEntrant.maxStayYears} years, after which the salary must reach the full going rate to extend. GOV.UK sets that limit for the new entrant and postdoctoral rates only.</p>
<h2>Technicians are a separate case</h2>
<p>Many engineering employers also recruit technicians, and those codes work differently. ${K.listOf(tech.map((t) => `${t.code} (${t.title.toLowerCase()})`))} are medium skilled Table 1a codes. New applicants can be sponsored in them only because they are on the Temporary Shortage List, with a certificate of sponsorship issued before ${K.SOC.tslUntil}; on that list, dependants cannot come unless the worker was already in a medium skilled job before ${K.date(S.mediumSkilledCutoff)}. A job described as "engineer" but whose duties match a technician code has to be coded as a technician, as SW 6.2 lets the caseworker check.</p>
<h2>Fees and the employer's side</h2>
<p>From abroad the visa costs ${K.gbp(K.FEE.skilledWorker('outside', 3))} for up to three years or ${K.gbp(K.FEE.skilledWorker('outside', 5))} for longer, plus the health surcharge of ${K.gbp(K.P.ihs.standard)} a year per person. The sponsor pays ${K.gbp(K.FEE.cosWorker())} per certificate and the immigration skills charge; unlike some research codes, the engineering codes are not exempt from that charge. Search the ${h.a('register-of-licensed-sponsors', 'register of licensed sponsors')} to see whether a company holds a licence.</p>`,
  faqs: [
    { q: 'Which engineering code has the highest going rate?', a: `${top.title} (${top.code}), at ${K.gbp(top.goingRate!)} for a 37.5-hour week. The lowest of the professional engineering codes is ${low.title.toLowerCase()} (${low.code}), at ${K.gbp(low.goingRate!)}. Every code from 2121 to 2129 is above the ${K.gbp(S.general)} general threshold, so the code's own rate is always the one to meet.` },
    { q: 'Does working towards chartered engineer status lower the salary threshold?', a: `Yes. An applicant working towards full registration or chartered status with the relevant professional body for the sponsored job counts as a new entrant, so the threshold is 70 % of the going rate with a floor of ${K.gbp(S.newEntrant.floor)}. For a civil engineer that is ${K.gbp(o.r70!)}, for a total stay of up to ${S.newEntrant.maxStayYears} years on that rate.` },
    { q: 'Can an engineering technician still get a Skilled Worker visa?', a: `Only while the code is on the Temporary Shortage List. Engineering technicians (3113) and building and civil engineering technicians (3114) are medium skilled codes listed there, and the certificate of sponsorship must be issued before ${K.SOC.tslUntil}. Family members cannot join a new applicant sponsored on that list.` },
    { q: 'Is a software engineer in the engineering codes?', a: 'No. Software engineering belongs to the IT group of codes: 2134 covers programmers and software developers, and 2139 lists DevOps engineers among its titles, each with its own going rate. The 212x codes are for civil, mechanical, electrical, electronics, process, aerospace and other physical engineering disciplines.' },
  ],
  related: ['skilled-worker-visa', 'software-developer-visa-uk', 'temporary-shortage-list', 'soc-code-checker', 'immigration-skills-charge'],
  sources: ['appendix_aso', 'appendix_sw', 'sw_paid_less', 'sponsor_guide', 'fees_table'],
});
