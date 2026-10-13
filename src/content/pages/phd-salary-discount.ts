import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.skilledWorker;
const T1 = K.OCCUPATIONS.filter((o) => o.table === 'Table 1');
const yes = T1.filter((o) => o.phd), no = T1.filter((o) => !o.phd);
const req = (code: string, situation: 'standard' | 'phd-stem' | 'phd-other') => K.checkSkilledWorker({ code, salary: 0, hours: 37.5, situation, nation: 'England', islCriteria: false }).required;
const sample = ['2161', '2124', '1131', '2433', '2111'].map((c) => ({ o: K.occ(c), std: req(c, 'standard'), other: req(c, 'phd-other'), stem: req(c, 'phd-stem') }));
const rd = sample[0];
const chem = sample[4];

export default definePage({
  id: 'phd-salary-discount',
  group: 'work',
  order: 90,
  nav: 'PhD salary discount',
  card: `${K.pct(S.phdStem.share)} of the going rate for a relevant STEM PhD, ${K.pct(S.phdOther.share)} for other doctorates, and the codes that allow it.`,
  title: `PhD Salary Discount, Skilled Worker: ${K.pct(S.phdStem.share)} and ${K.pct(S.phdOther.share)} Rates`,
  description: `PhD salary discount on the Skilled Worker visa: ${K.pct(S.phdStem.share)} of the going rate for a relevant STEM doctorate, ${K.pct(S.phdOther.share)} for others, floors, Ecctis and the ${no.length} excluded codes.`,
  h1: 'PhD salary discount for Skilled Worker jobs',
  intro: `A doctorate relevant to the job lowers the threshold to ${K.pct(S.phdStem.share)} of the going rate in STEM (floor ${K.gbp(S.phdStem.floor)}) or ${K.pct(S.phdOther.share)} in other subjects (floor ${K.gbp(S.phdOther.floor)}).`,
  resume: `A PhD can lower the salary a Skilled Worker job must pay, provided three conditions line up. The occupation code must be marked "eligible for PhD points" in Appendix Skilled Occupations; ${yes.length} of the ${T1.length} higher skilled codes are. You must hold a UK PhD or other academic doctorate, or an overseas one that Ecctis confirms meets the UK PhD standard. And your sponsor must give a credible explanation of how the doctorate is relevant to the job. With a doctorate in any subject, option B asks for ${K.pct(S.phdOther.share)} of the going rate and at least ${K.gbp(S.phdOther.floor)}. If the sponsor also explains credibly that the subject is science, technology, engineering or mathematics, option C asks for ${K.pct(S.phdStem.share)} and at least ${K.gbp(S.phdStem.floor)}. The ${K.gbp(S.general)} general floor drops out in both cases. For a research and development manager (code ${rd.o.code}) the threshold falls from ${K.gbp(rd.std)} to ${K.gbp(rd.other)} with any doctorate and ${K.gbp(rd.stem)} with a STEM one. The checker above applies the discount to your code.`,
  tool: { kind: 'sw', props: { initialCode: '2161', initialSalary: 44000, initialSituation: 'phd-stem', title: 'PhD threshold for your code and salary' } },
  body: (h) => `
<h2>What the doctorate has to be</h2>
<p>Rules SW 9.2 and SW 10.3 set the qualification test. A UK PhD or other academic doctoral qualification counts as it stands. A doctorate awarded abroad counts only if the qualification and language assessments provider, Ecctis, confirms that it meets the recognised standard of a UK PhD, and you then give your unique Ecctis reference number in the application.</p>
<p>Relevance is the sponsor's job to explain, and the explanation must be credible. A doctorate in polymer chemistry supports a materials R&amp;D role; the same doctorate would be hard to explain as relevant to a marketing director post, even though that code is eligible for PhD points. For option C the sponsor must also explain that the subject is in STEM. Once points for a qualification have been correctly awarded in an earlier Skilled Worker grant, you need not send the evidence again, but the sponsor still has to restate the relevance.</p>
<p>Research at PhD level in a sensitive subject may also need an ATAS certificate, which the sponsor flags on the certificate of sponsorship. That is a separate requirement from the discount.</p>
<h2>How much lower the threshold goes</h2>
${h.table(['Code and occupation', 'Standard', `Any relevant PhD (${K.pct(S.phdOther.share)})`, `STEM PhD (${K.pct(S.phdStem.share)})`],
    sample.map((r) => [`${r.o.code} ${r.o.title}`, K.gbp(r.std), K.gbp(r.other), K.gbp(r.stem)]),
    `Full-time thresholds for a first application, computed from Table 1 of Appendix Skilled Occupations by this site's engine.`, ['l', 'r', 'r', 'r'])}
<p>The floors shape the result for mid-range codes. A chemical scientist (code ${chem.o.code}) whose doctorate the sponsor cannot present as STEM still needs ${K.gbp(chem.other)}, because ${K.pct(S.phdOther.share)} of the going rate is below the ${K.gbp(S.phdOther.floor)} floor; with a doctorate in chemistry the threshold is ${K.gbp(chem.stem)}. Points come from one option only, so a PhD discount cannot be stacked with the new entrant rate. Where both apply, the ${h.a('new-entrant-salary', 'new entrant rate')} of ${K.pct(S.newEntrant.share)} is often lower still, though it limits your stay to ${S.newEntrant.maxStayYears} years and the PhD options do not.</p>
<h2>Codes that do not take PhD points</h2>
<p>Most Table 1 codes are eligible. The ${no.length} that are not are: ${K.listOf(no.map((o) => `${o.title.toLowerCase()} (${o.code})`))}. Choosing a different code to gain PhD points is one of the four grounds for refusal in rule SW 6.2. The full yes or no for every code is in the ${h.a('skilled-worker-going-rates', 'going rates table')}.</p>
<p>Postdoctoral researchers have a further option. A postdoctoral position in codes ${K.listOf(S.postdoc.codes)} can be paid ${K.pct(S.postdoc.share)} of the going rate with a ${K.gbp(S.postdoc.floor)} floor, under the same ${S.newEntrant.maxStayYears}-year limit as new entrants. Research leaders who would rather not depend on a sponsor or a salary at all can look at the ${h.a('global-talent-visa', 'Global Talent visa')}. The official summary is on ${h.src('sw_paid_less', 'GOV.UK: when you can be paid less')}.</p>`,
  faqs: [
    { q: 'Do I need Ecctis for a PhD from outside the UK?', a: 'Yes, if you want the PhD salary discount. Rule SW 9.2 accepts an overseas doctorate only where the qualification and language assessments provider confirms that it meets the recognised standard of a UK PhD, and the application asks for your unique Ecctis reference number. A UK PhD needs no such check; you provide the certificate instead.' },
    { q: 'Who decides whether my PhD is relevant to the job?', a: 'Your sponsor has to give a credible explanation of the link between the doctorate and the role, and for the STEM rate a credible explanation that the subject is in science, technology, engineering or mathematics. The caseworker assesses that explanation. A relevant subject but a code that is not eligible for PhD points still gives no discount.' },
    { q: 'Can I combine the PhD discount with the new entrant rate?', a: `No. Salary points are awarded from one option in the table of Appendix Skilled Worker. You or your sponsor choose the option that fits: the PhD rates (${K.pct(S.phdOther.share)} or ${K.pct(S.phdStem.share)}) have no time limit, while the new entrant rate of ${K.pct(S.newEntrant.share)} is capped at ${S.newEntrant.maxStayYears} years of combined permission.` },
    { q: 'Does the PhD discount still apply when I settle?', a: 'No. Appendix Skilled Occupations states that only the going rate column applies to Skilled Worker settlement applications, so the 90% and 80% columns used on entry do not carry over. Before applying for indefinite leave, check that your salary has reached the full going rate for your code and the settlement threshold.' },
  ],
  related: ['skilled-worker-going-rates', 'new-entrant-salary', 'skilled-worker-visa-salary-threshold', 'global-talent-visa', 'soc-code-checker', 'skilled-worker-visa'],
  sources: ['sw_paid_less', 'appendix_sw', 'appendix_aso'],
});
