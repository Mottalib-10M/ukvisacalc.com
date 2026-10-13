/**
 * Frame shared by every tool: inputs on the left, result on the right (data-resultat, visible in the
 * first screen at 1366 × 768), a one-line summary that sticks to the bottom of a phone screen while
 * the inputs are in view, and the "nothing leaves your browser" line.
 */
import type { ReactNode } from 'react';
interface Props { title: string; children: ReactNode; result: ReactNode; summary?: ReactNode; id: string; foot?: ReactNode }
export default function Shell({ title, children, result, summary, id, foot }: Props) {
  return (
    <section aria-labelledby={`${id}-t`} className="not-prose rounded-xl border border-navy-200 bg-white shadow-sm">
      <h2 id={`${id}-t`} className="border-b border-navy-100 px-4 py-3 text-base font-semibold text-navy-900 sm:px-5">{title}</h2>
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <form className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{children}</form>
        <div data-resultat aria-live="polite" className="rounded-lg bg-navy-50 p-4 sm:p-5">{result}</div>
      </div>
      {summary && <div className="sticky bottom-0 z-10 border-t border-navy-200 bg-white/95 px-4 py-2 text-sm font-semibold text-navy-900 backdrop-blur lg:hidden">{summary}</div>}
      <p className="border-t border-navy-100 px-4 py-2 text-xs text-navy-600 sm:px-5">{foot ?? 'Calculated in your browser: nothing you type is sent anywhere. Not legal advice; not affiliated with the Home Office.'}</p>
    </section>
  );
}
export function Row({ label, value, strong = false }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  return <tr><td className={`py-1.5 pr-3 align-top ${strong ? 'font-semibold text-navy-900' : 'text-navy-700'}`}>{label}</td><td className={`tabular-nums py-1.5 text-right align-top ${strong ? 'font-bold text-navy-900' : 'text-navy-900'}`}>{value}</td></tr>;
}
export function Verdict({ ok, children }: { ok: boolean | null; children: ReactNode }) {
  const c = ok == null ? 'border-navy-300 bg-white text-navy-900' : ok ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-red-700 bg-red-50 text-red-900';
  return <p className={`rounded-md border-l-4 px-3 py-2 text-sm font-semibold ${c}`}>{children}</p>;
}
