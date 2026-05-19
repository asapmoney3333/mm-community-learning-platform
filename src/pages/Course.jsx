import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"

import { useLang } from "../context/LangContext"
import LangSwitcher from "../components/LangSwitcher"
import Quiz from "../components/Quiz"
import { loadLesson, loadManifest, loadQuiz } from "../utils/loader"

export default function Course() {
  const { id } = useParams()
  const { lang } = useLang()

  const [manifest, setManifest] = useState(null)
  const [lesson, setLesson] = useState("")
  const [quiz, setQuiz] = useState([])
  const [chapterIndex, setChapterIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    async function loadCourse() {
      setIsLoading(true)
      setError("")

      try {
        const nextManifest = await loadManifest(id)

        if (!isActive) return

        setManifest(nextManifest)

        const safeIndex = Math.min(chapterIndex, nextManifest.chapters.length - 1)
        await loadChapter(nextManifest, Math.max(safeIndex, 0), isActive)
      } catch {
        if (!isActive) return
        setError("We couldn't load this course right now.")
        setIsLoading(false)
      }
    }

    loadCourse()

    return () => {
      isActive = false
    }
  }, [id, lang])

  async function loadChapter(nextManifest, nextIndex, isActive = true) {
    const chapter = nextManifest.chapters[nextIndex]

    try {
      const [lessonText, quizData] = await Promise.all([
        loadLesson(id, lang, chapter.lesson),
        loadQuiz(id, lang, chapter.quiz),
      ])

      if (!isActive) return

      setLesson(lessonText)
      setQuiz(quizData)
      setChapterIndex(nextIndex)
      setIsLoading(false)
    } catch {
      if (!isActive) return
      setError("We couldn't load this lesson content.")
      setIsLoading(false)
    }
  }

  async function goToChapter(nextIndex) {
    if (!manifest || nextIndex === chapterIndex) return

    setIsLoading(true)
    setError("")
    await loadChapter(manifest, nextIndex)
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-6">
        <div className="w-full rounded-[1.75rem] border border-rose-300/20 bg-rose-400/10 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Course unavailable
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white">{error}</h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to library
          </Link>
        </div>
      </div>
    )
  }

  if (!manifest) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
          Loading course...
        </div>
      </div>
    )
  }

  const chapters = manifest.chapters
  const chapter = chapters[chapterIndex]
  const progress = chapters.length
    ? Math.round(((chapterIndex + 1) / chapters.length) * 100)
    : 0

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {"<-"} Back to library
            </Link>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                {manifest.id}
              </p>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {manifest.title[lang]}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Move through lessons at your own pace, switch language anytime,
                and keep your place with a clear course progress tracker.
              </p>
            </div>
          </div>

          <LangSwitcher />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              <span>Course progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-300">
              Lesson {chapterIndex + 1} of {chapters.length}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Current lesson
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-white">
              {chapter.title[lang]}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Navigate with the chapter list or the previous and next controls
              below.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="mb-4 px-2">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Lessons
            </div>
            <h3 className="mt-2 text-lg font-bold text-white">
              Course roadmap
            </h3>
          </div>

          <div className="grid gap-3">
            {chapters.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToChapter(index)}
                className={`rounded-[1.25rem] border p-4 text-left transition ${
                  index === chapterIndex
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Lesson {index + 1}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index <= chapterIndex ? "bg-emerald-300" : "bg-white/20"
                    }`}
                  />
                </div>
                <div className="mt-2 font-semibold text-white">
                  {item.title[lang]}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="space-y-6">
          <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Lesson {chapterIndex + 1}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {chapter.title[lang]}
                </h2>
              </div>

              {isLoading ? (
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  Loading lesson...
                </div>
              ) : null}
            </div>

            <div className="lesson-content mt-6">
              <ReactMarkdown>{lesson}</ReactMarkdown>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => goToChapter(chapterIndex - 1)}
                disabled={chapterIndex === 0 || isLoading}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous lesson
              </button>

              <div className="text-sm text-slate-400">
                Chapter {chapterIndex + 1} / {chapters.length}
              </div>

              <button
                onClick={() => goToChapter(chapterIndex + 1)}
                disabled={chapterIndex === chapters.length - 1 || isLoading}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next lesson
              </button>
            </div>
          </article>

          <Quiz key={`${id}-${lang}-${chapter.id}`} questions={quiz} />
        </main>
      </div>
    </div>
  )
}
