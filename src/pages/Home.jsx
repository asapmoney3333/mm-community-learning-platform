import { useState } from "react"
import { Link } from "react-router-dom"

const courses = [
  {
    id: "crypto-basics",
    title: "Crypto Basics",
    description:
      "Build a practical foundation in wallets, tokens, blockchain mechanics, and how the crypto ecosystem fits together.",
    level: "Starter Track",
    duration: "4 lessons",
    accent: "from-cyan-400/30 via-sky-500/20 to-emerald-400/30",
  },
]

export default function Home() {
  const [view, setView] = useState("grid")

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(74,222,128,0.2),_transparent_32%),linear-gradient(135deg,_rgba(7,10,21,0.96),_rgba(12,18,34,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Learn crypto with momentum
            </p>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Crypto Academy
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Explore bite-sized lessons, switch languages instantly, and
                train your understanding with polished interactive quizzes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Guided lessons
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Progress tracking
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Multilingual quizzes
              </span>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur sm:min-w-80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Library</span>
              <span className="font-semibold text-white">{courses.length} course</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-black/25 p-4">
                <div className="text-2xl font-bold text-cyan-300">12m</div>
                <div className="mt-1 text-slate-400">Average lesson</div>
              </div>
              <div className="rounded-2xl bg-black/25 p-4">
                <div className="text-2xl font-bold text-emerald-300">3</div>
                <div className="mt-1 text-slate-400">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Course Library</h2>
            <p className="mt-1 text-sm text-slate-400">
              Switch between a visual grid and a compact list view.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 p-1">
            {["grid", "list"].map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  view === mode
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {mode} view
              </button>
            ))}
          </div>
        </div>

        <div
          className={
            view === "grid"
              ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              : "grid gap-4"
          }
        >
          {courses.map((course, index) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_18px_45px_rgba(8,145,178,0.18)] ${
                view === "list" ? "flex flex-col gap-5 md:flex-row md:items-center md:justify-between" : "min-h-72"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${course.accent} opacity-80 transition duration-300 group-hover:opacity-100`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.04))]" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                      {course.level}
                    </span>
                    <span className="text-sm text-slate-200/90">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      {course.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-7 text-slate-100/85">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-100">
                  <span className="rounded-full bg-black/20 px-3 py-2">
                    {course.duration}
                  </span>
                  <span className="rounded-full bg-black/20 px-3 py-2">
                    Interactive quiz
                  </span>
                  <span className="font-semibold text-white transition group-hover:translate-x-1">
                    Open course {"->"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
