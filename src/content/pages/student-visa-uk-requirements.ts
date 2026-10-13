import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.student;
const lon = K.studentFunds(true, 9, 0, 0, '2026-10-13'), lonNew = K.studentFunds(true, 9, 0, 0, S.maintenanceFrom.date);

export default definePage({
  id: 'student-visa-uk-requirements',
  group: 'study',
  order: 30,
  nav: 'Student visa requirements',
  card: 'CAS, course level, English, money, timing: the checklist of the Student route.',
  title: 'Student Visa Requirements UK 2026: CAS, English and Money',
  description: `Student visa requirements 2026: a CAS from a licensed sponsor, an eligible course, English, money held for 28 days and the timing rules, with a calculator.`,
  h1: 'Student visa requirements: the full checklist',
  intro: `Five things decide a Student visa: a CAS, an eligible course, your English, the money held for 28 days and the timing of the application. Check the money first.`,
  resume: `To get a Student visa you must be 16 or over, hold an unconditional offer from a licensed student sponsor confirmed by a Confirmation of Acceptance for Studies (CAS), study an eligible course, prove your English, and show the money for your fees and living costs, with your parents' consent if you are 16 or 17. Eligible courses are full-time degrees and postgraduate courses (RQF 6 to 8), full-time courses below degree level (RQF 3 to 5) with at least 15 hours a week of organised daytime study, part-time courses above degree level, and English courses at level B2 or higher. The money is the first-year tuition still unpaid plus up to nine months of living costs, which for London means ${K.gbp(lon.living)} today and ${K.gbp(lonNew.living)} for applications from ${K.date(S.maintenanceFrom.date)}, held for 28 days. Timing matters too: apply within six months of the CAS, no earlier than six months before the course from abroad, three months from the UK.`,
  tool: { kind: 'student', props: { title: 'Check the money requirement' } },
  body: (h) => `
<h2>CAS and course</h2>
<p>The Confirmation of Acceptance for Studies is a reference number the university or college gives once it has made an unconditional offer; without it you cannot apply, and it stays valid for six months. It shows the course, its dates and level, the fees and what you have already paid. Check it carefully: a wrong fee figure changes the money you must show, and the course dates set the length of the visa. Some sensitive science and technology subjects at master's level or above also need an Academic Technology Approval Scheme (ATAS) certificate, which the university will tell you about.</p>
<h2>English</h2>
<p>The level is B2 for study at degree level or above and B1 below it. For a degree-level course with a higher education provider, the university can assess your English itself, by its own test if it wishes, as long as it is equivalent to B2. Otherwise the usual proofs are a UK school qualification begun before 18 (GCSE, A level, Scottish National 4 or 5, Higher), a UK degree, a degree taught in English abroad confirmed by Ecctis, or a Secure English Language Test (SELT) with an approved provider. Nationals of majority English-speaking countries, from Australia and Canada to Jamaica, Malta and the United States, do not need to prove it, nor students who proved the required level in an earlier visa application.</p>
<h2>Money, and who is exempt from showing it</h2>
<p>The money must be in an account you can use for at least 28 consecutive days, the last of them no more than 31 days before the application. GOV.UK gives the example of an application on 1 January, which needs funds held for the 28 days ending on 1 December at the earliest. A student who has lived in the UK with a visa for 12 months or more is exempt, and so is a student union sabbatical officer. Nationals of the countries on the "differential evidence" list do not send bank evidence with the form, but must hold the money and can be asked for it before the decision. Loans and official sponsorships are proved with a letter instead of statements.</p>
<h2>Timing and conditions</h2>
<p>From abroad, apply from six months before the course; from inside the UK, from three months before, and before your current visa expires, with the new course starting within 28 days of its end. You may arrive up to one week before a course of six months or less, or one month before a longer one. While studying you cannot claim public funds or work as a professional sportsperson; the hours you may work depend on the course and are on your visa. Decisions take about ${K.P.processing.outside.student} weeks from abroad. The ${h.a('student-visa-uk-cost', 'cost page')} prices the application and the ${h.a('student-visa-uk', 'Student visa page')} covers family and the Graduate route.</p>`,
  faqs: [
    { q: 'Do I need an English test for a UK student visa?', a: 'Not always. For degree-level study a higher education provider can assess your English itself, at a level equivalent to B2, and nationals of the listed majority English-speaking countries are exempt. Otherwise you prove it with a UK school qualification, a UK degree, an English-taught degree confirmed by Ecctis, or a Secure English Language Test.' },
    { q: 'What documents does a student under 18 need?', a: 'Written consent from both parents or legal guardians, or from one parent with sole responsibility, covering the visa application, the living and care arrangements in the UK and the travel, plus a birth certificate or another government document naming the parents. Those aged 16 or 17 may also look at the Child Student route instead.' },
    { q: 'What happens if my CAS details are wrong?', a: 'Ask the university to correct the CAS before you apply. A wrong fee, a wrong amount already paid or the wrong course dates can make the money test fail or give you the wrong length of visa, and the caseworker decides on what the CAS says. Once you have applied, corrections are much harder.' },
  ],
  related: ['student-visa-uk', 'student-visa-uk-cost', 'graduate-visa-uk', 'immigration-health-surcharge', 'uk-visa-processing-times'],
  sources: ['student_visa', 'appendix_student', 'english', 'hc_584'],
});
