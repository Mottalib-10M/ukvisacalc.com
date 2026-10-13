import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const F = K.FEE;
const L = K.isl();
const NATIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
const where = (n: string[]) => (NATIONS.every((x) => n.includes(x)) ? 'All four nations' : K.listOf(n));
const shortTitle = (t: string) => t.split(/ [-–] /)[0];
const removal = [...new Set(L.map((o) => o.isl!.until))];
const mainUntil = removal.map((d) => [d, L.filter((o) => o.isl!.until === d).length] as const).sort((a, b) => b[1] - a[1])[0][0];
const ukWide = L.filter((o) => NATIONS.every((x) => o.isl!.nations.includes(x))).length;
const run = (code: string) => K.checkSkilledWorker({ code, salary: 0, hours: 37.5, situation: 'standard', nation: 'England' });
const carp = K.occ('5316'), bio = K.occ('2112'), carpR = run('5316'), bioR = run('2112');
const medium = L.filter((o) => o.table === 'Table 1a').length;

export default definePage({
  id: 'immigration-salary-list',
  group: 'work',
  order: 100,
  nav: 'Immigration Salary List',
  card: `The ${L.length} entries, the ${K.gbp(S.isl.floor)} floor at the full going rate, the lower fee and the removal dates.`,
  title: `Immigration Salary List 2026: ${L.length} Jobs, Floor and Lower Fee`,
  description: `Immigration Salary List for the Skilled Worker visa: all ${L.length} entries with their conditions and nations, the ${K.gbp(S.isl.floor)} floor, full going rate and lower visa fee.`,
  h1: 'Immigration Salary List: jobs, salary rules and fees',
  intro: `A job on the Immigration Salary List needs ${K.gbp(S.isl.floor)} instead of ${K.gbp(S.general)}, but still the full going rate, and pays a lower fee of ${K.gbp(F.skilledWorker('outside', 3, true))} for up to three years.`,
  resume: `The Immigration Salary List, in its own appendix of the Immigration Rules, names jobs that can be sponsored on easier terms. It gives no discount on the going rate: a listed job must still pay 100% of the going rate for its code, but the general floor drops from ${K.gbp(S.general)} to ${K.gbp(S.isl.floor)} (option D of Appendix Skilled Worker). It also opens medium skilled codes from Table 1a that would otherwise be closed to new applicants, and it lowers the visa fee for you and your family to ${K.gbp(F.skilledWorker('outside', 3, true))} for up to three years or ${K.gbp(F.skilledWorker('outside', 5, true))} for longer, inside or outside the UK. The list has ${L.length} entries. Some cover every job in a code, others only named job types, and ${L.length - ukWide} apply only in part of the UK. Most entries must be used on a certificate issued before ${mainUntil}. A carpenter (code ${carp.code}) qualifies on ${K.gbp(carpR.required)}.`,
  tool: { kind: 'sw', props: { initialCode: '5316', initialSalary: 34000, title: 'Check a listed job against its salary rule' } },
  body: (h) => `
<h2>What a listed job changes, and what it does not</h2>
<p>Being on the list does three things. It lowers the salary floor, it can make a medium skilled code eligible, and it cuts the fee. It does not lower the going rate. The going rate is applied in full, pro-rated to your hours, exactly as for a job off the list.</p>
<p>Two examples show the effect. A biological scientist (code ${bio.code}, Table 1, listed for all jobs) has a going rate of ${K.gbp(bio.goingRate!)}. Off the list the threshold would be ${K.gbp(S.general)}; on it, the threshold is the going rate alone, ${K.gbp(bioR.required)}. A carpenter or joiner (code ${carp.code}, Table 1a) could not be sponsored at all as a new applicant without the list; on it, the threshold is ${K.gbp(carpR.required)}.</p>
<p>The fee saving is real. A single applicant from abroad pays ${K.gbp(F.skilledWorker('outside', 3, true))} instead of ${K.gbp(F.skilledWorker('outside', 3))} for up to three years, and the reduced fee applies to each partner or child applying as a dependant. The immigration health surcharge is unchanged. The ${h.a('skilled-worker-visa-cost', 'Skilled Worker cost page')} sets the two side by side.</p>
<h2>Read the conditions on each entry</h2>
<p>An entry is more than a code. Many cover only named job types, such as archaeologists within social and humanities scientists, or demand three years of experience gained lawfully. Each entry also says in which nations of the UK it applies, so a boat builder listed in Scotland only gets no help for a job in England. The job must be based in a nation where it is listed. Rule SW 6.2(c) adds that claiming list points under a code that is not the most appropriate one is a ground for refusal.</p>
${h.table(['Code', 'Occupation', 'Jobs covered', 'Where', 'Certificate before'],
    L.map((o) => [o.code, shortTitle(o.title), o.isl!.criteria, where(o.isl!.nations), o.isl!.until]),
    `Appendix Immigration Salary List (updated ${K.date(K.SOC.islUpdated)}). An occupation is only included where the certificate of sponsorship was issued before the removal date.`, ['l', 'l', 'l', 'l', 'l'])}
<p>Care worker codes ${K.listOf(S.careWorkerCodes)} remain listed, but rule SW 6.1B closes them to applications from abroad, and in England the sponsor must be registered with the Care Quality Commission; the ${h.a('care-worker-visa', 'care worker page')} explains what remains open.</p>
<h2>Families, removal dates and changing jobs</h2>
<p>${medium} of the ${L.length} entries are medium skilled codes from Table 1a. A worker sponsored in one of those through the list cannot bring a partner or children under the current rules, because dependants need a job in Table 1, 2 or 3, unless the worker was already sponsored in a medium skilled job before ${K.date(S.mediumSkilledCutoff)} or a child was born in the UK. Listed jobs in Table 1, such as biological scientists, keep the normal family rights.</p>
<p>The removal dates in the list are ${K.listOf(removal.map((d) => d))}. If your job leaves the list while you stay in it with the same sponsor, you do not need to apply again, and rule SW 11.2 lets you extend in that same job with that same sponsor on the list terms. Moving from a listed job to one that is not listed needs a fresh application, judged on the standard rules. The source is ${h.src('appendix_isl', 'Appendix Immigration Salary List')}; temporary shortage jobs are on the ${h.a('temporary-shortage-list', 'Temporary Shortage List page')}.</p>`,
  faqs: [
    { q: 'Does the Immigration Salary List reduce the going rate?', a: `No. A job on the list must still pay the full going rate for its occupation code, pro-rated to the hours. What changes is the general floor, which falls from ${K.gbp(S.general)} to ${K.gbp(S.isl.floor)}, plus a lower visa fee and access to some medium skilled codes. The lower floor only helps where the going rate itself sits below ${K.gbp(S.general)}.` },
    { q: 'Does the list apply if my job is in a different part of the UK?', a: 'Only where the entry covers the nation in which the job is based. Most entries apply in England, Scotland, Wales and Northern Ireland, but some are listed in Scotland alone, for example fishing boat masters and boat and ship builders. A Scottish-only entry gives no lower threshold or fee for a job located in England.' },
    { q: 'What happens to my visa if my job comes off the list?', a: 'Nothing immediately: GOV.UK says you do not need to apply again if you stay in the same job when it leaves the list. Rule SW 11.2 also lets you extend on the list terms, provided your last permission was in that listed job and you continue in it for the same sponsor. A move to a different employer is assessed under the rules then in force.' },
    { q: 'Can I bring my family on an Immigration Salary List job?', a: `It depends on the table. If the listed code is in Table 1, such as biological scientists or graphic designers, your partner and children can apply as usual. If it is a medium skilled code from Table 1a, such as bricklayers or carpenters, new dependants are not allowed unless you were sponsored in a medium skilled job before ${K.date(S.mediumSkilledCutoff)} or the child was born in the UK.` },
  ],
  related: ['temporary-shortage-list', 'skilled-worker-visa-salary-threshold', 'skilled-worker-visa-cost', 'skilled-worker-dependants', 'care-worker-visa', 'soc-code-checker'],
  sources: ['appendix_isl', 'appendix_sw', 'sw_paid_less', 'sw_costs'],
});
