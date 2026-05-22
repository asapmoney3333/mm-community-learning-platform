export function Glossary({ children }) {
  return (
    <div className="my-8 grid gap-4">
      {children}
    </div>
  )
}

export function GlossaryItem({
  term,
  children,
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
      <div className="text-lg font-bold text-white">
        {term}
      </div>
      <div className="mt-2 text-sm leading-7 text-slate-300">
        {children}
      </div>
    </div>
  )
}
