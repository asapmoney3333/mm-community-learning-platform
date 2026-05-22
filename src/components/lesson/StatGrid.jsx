export function StatGrid({ children }) {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-3">
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  children,
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-white">
        {value}
      </div>
      {children ? (
        <div className="mt-2 text-sm leading-6 text-slate-300">
          {children}
        </div>
      ) : null}
    </div>
  )
}
