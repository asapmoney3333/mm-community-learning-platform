const toneStyles = {
  info: "border-cyan-300/30 bg-cyan-300/10 text-cyan-50",
  success: "border-emerald-300/30 bg-emerald-300/10 text-emerald-50",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-50",
  danger: "border-rose-300/30 bg-rose-300/10 text-rose-50",
}

export default function Callout({
  title,
  tone = "info",
  children,
}) {
  return (
    <aside
      className={`my-6 rounded-[1.5rem] border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] ${toneStyles[tone] || toneStyles.info}`}
    >
      {title ? (
        <div className="text-xs font-semibold uppercase tracking-[0.24em]">
          {title}
        </div>
      ) : null}
      <div className="mt-2 text-sm leading-7 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
