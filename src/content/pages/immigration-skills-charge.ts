import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const I = K.P.sponsor.isc;
const lens = [6, 12, 18, 24, 36, 48, 60];
const exempt = K.P.sponsor.iscExemptCodes.map((c) => `${c} ${K.occ(c).title.toLowerCase()}`);

export default definePage({
  id: 'immigration-skills-charge',
  group: 'employers',
  order: 30,
  nav: 'Immigration skills charge',
  card: 'The employer charge per sponsored worker: rates, length rules, exemptions and refunds.',
  title: 'Immigration Skills Charge 2026: Rates, Exemptions, Refunds',
  description: `Immigration skills charge 2026: ${K.gbp(I.small.first12)} or ${K.gbp(I.large.first12)} for the first year per sponsored worker, then per six months. Exempt research codes, refunds and examples.`,
  h1: 'Immigration skills charge: what sponsors pay per worker',
  intro: `${K.gbp(I.large.first12)} for the first 12 months and ${K.gbp(I.large.perHalf)} per further six months for a medium or large employer; ${K.gbp(I.small.first12)} and ${K.gbp(I.small.perHalf)} for small sponsors and charities.`,
  resume: `The immigration skills charge is paid by the employer, not the worker, each time it assigns a certificate of sponsorship for a Skilled Worker or a Senior or Specialist Worker. It is due for a worker applying from outside the UK for six months or more, and for any length when the worker applies from inside the UK. A medium or large sponsor pays ${K.gbp(I.large.first12)} for the first 12 months and ${K.gbp(I.large.perHalf)} for each further six months, so ${K.gbp(K.skillsCharge(60, false))} for the maximum five years; a small or charitable sponsor pays ${K.gbp(I.small.first12)} and ${K.gbp(I.small.perHalf)}, up to ${K.gbp(K.skillsCharge(60, true))}. The whole amount is paid at once, when the certificate is assigned, for the period between its start and end dates. There is no charge for the worker's partner or children, for researchers and higher education teachers in nine listed occupation codes, or for students switching to a work visa. The calculator above adds it to the licence and certificate fees for any number of hires.`,
  tool: { kind: 'licence', props: { title: 'Skills charge, certificate and licence' } },
  body: (h) => `
<h2>The charge by length of certificate</h2>
${h.table(['Certificate length', 'Small or charitable sponsor', 'Medium or large sponsor'], lens.map((m) => [m < 12 ? `${m} months (charged as 12)` : `${m} months`, K.gbp(K.skillsCharge(m, true)), K.gbp(K.skillsCharge(m, false))]), 'Immigration skills charge on GOV.UK; a period of more than 6 months but less than a year is charged as 12 months.', ['l', 'r', 'r'])}
<p>The length is the time between the start and end dates written on the certificate of sponsorship. Beyond the first year the charge goes up by half-year steps, so a certificate of 25 months costs the same as one of 30. If the worker is later given a new certificate in another occupation code that extends the visa, the employer pays the charge again for the extra time only; a new certificate that does not extend the visa costs no further charge.</p>
<h2>Who does not pay it</h2>
<p>No charge is due for sponsored workers in these occupation codes: ${K.listOf(exempt)}. It is not paid for dependants, nor when a worker switches from a visa that allowed study (a Student visa, for instance) to a Skilled Worker or Senior or Specialist Worker visa, including the later extensions of that new visa. Certain EU nationals temporarily transferred by their employer from an EU business for up to 36 months on the Senior or Specialist Worker route are also exempt, as are some workers assigned a certificate before 6 April 2017.</p>
<p>The exemption follows the code on the certificate, not the qualifications of the person, so a scientist sponsored in a management code pays the charge like anyone else. The ${h.a('soc-code-checker', 'occupation code checker')} shows the code of a job title.</p>
<h2>Paying, and when it is refunded</h2>
<p>The charge is paid online when the certificate is assigned. If it is missing or wrong, UKVI contacts the sponsor, which then has 10 working days to pay before the worker's application is refused. The employer must pay it itself: asking the worker for it, or recovering it from wages, can cost the licence. It is refunded in full if the visa is refused or withdrawn, or if the worker never starts the job, and in part if the worker is granted less time, leaves early, moves to another sponsor, or if the large rate was paid after the sponsor had told UKVI it had become small. Refunds normally arrive within 90 days. The full cost of hiring, licence included, is on the ${h.a('sponsor-licence', 'sponsor licence page')}.</p>`,
  faqs: [
    { q: 'Is the immigration skills charge paid every year?', a: 'No. It covers the whole period of the certificate of sponsorship and is paid in one go when the certificate is assigned, up to five years. A sponsor that wants to keep the worker longer pays again when it assigns the certificate for the extension, for the new period only.' },
    { q: 'Do Health and Care Worker visa sponsors pay the charge?', a: 'The Health and Care Worker visa is part of the Skilled Worker route, so the charge applies to certificates assigned for it unless the occupation code is one of the exempt research and higher education codes. The worker’s own visa fee is reduced and the worker pays no health surcharge, but the employer’s charge is not removed.' },
    { q: 'Does the charge apply to a worker already in the UK?', a: 'Yes, for any length of certificate, when the worker applies from inside the UK, for example to change employer or extend. The exception is a worker switching from a visa that allowed study, such as a Student visa, to a Skilled Worker visa: that switch and its extensions are free of the charge.' },
  ],
  related: ['sponsor-licence', 'register-of-licensed-sponsors', 'skilled-worker-visa-cost', 'health-and-care-worker-visa', 'soc-code-checker'],
  sources: ['sponsor_guide', 'fees_table', 'appendix_sw'],
});
