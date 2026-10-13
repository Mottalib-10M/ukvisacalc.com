interface Props { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; className?: string; placeholder?: string }
export default function TextField({ id, label, value, onChange, help, className = '', placeholder }: Props) {
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" value={value} placeholder={placeholder} autoComplete="off" onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 placeholder:text-navy-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help ? <p id={`${id}-help`} className="mt-1 text-xs text-navy-600">{help}</p> : <span />}
    </div>
  );
}
