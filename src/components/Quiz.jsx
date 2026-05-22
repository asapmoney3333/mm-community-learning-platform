import { useEffect, useMemo, useState } from "react"

export default function Quiz({ questions, onComplete }) {
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const answeredCount = Object.keys(selectedAnswers).length
  const totalQuestions = questions.length
  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return total + Number(selectedAnswers[index] === question.answer)
    }, 0)
  }, [questions, selectedAnswers])

  useEffect(() => {
    if (!questions.length || answeredCount !== totalQuestions || !onComplete) {
      return
    }

    onComplete({
      score,
      totalQuestions,
    })
  }, [answeredCount, onComplete, questions.length, score, totalQuestions])

  function answer(questionIndex, choiceIndex) {
    setSelectedAnswers((current) => {
      if (current[questionIndex] !== undefined) {
        return current
      }

      return {
        ...current,
        [questionIndex]: choiceIndex,
      }
    })
  }

  function resetQuiz() {
    setSelectedAnswers({})
  }

  if (!questions.length) {
    return (
      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-bold text-white">Quiz</h3>
        <p className="mt-2 text-sm text-slate-400">
          No quiz has been added for this lesson yet.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-6 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.95))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Knowledge Check
          </p>
          <h3 className="text-2xl font-bold text-white">
            Test what you just learned
          </h3>
          <p className="text-sm text-slate-400">
            Pick one answer per question and watch your progress update live.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          Score <span className="font-bold text-white">{score}</span> /{" "}
          {totalQuestions}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          <span>Quiz progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {questions.map((question, questionIndex) => {
          const selectedChoice = selectedAnswers[questionIndex]
          const isAnswered = selectedChoice !== undefined

          return (
            <article
              key={questionIndex}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                      Question {questionIndex + 1}
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {question.question}
                    </p>
                  </div>

                  {isAnswered ? (
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedChoice === question.answer
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-rose-400/15 text-rose-300"
                      }`}
                    >
                      {selectedChoice === question.answer ? "Correct" : "Try reviewing"}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {question.choices.map((choice, choiceIndex) => {
                    const isCorrect = question.answer === choiceIndex
                    const isSelected = selectedChoice === choiceIndex

                    let buttonClass =
                      "border-white/10 bg-slate-950/40 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"

                    if (isAnswered && isCorrect) {
                      buttonClass =
                        "border-emerald-300/50 bg-emerald-400/15 text-emerald-100"
                    } else if (isAnswered && isSelected && !isCorrect) {
                      buttonClass =
                        "border-rose-300/50 bg-rose-400/15 text-rose-100"
                    }

                    return (
                      <button
                        key={choiceIndex}
                        onClick={() => answer(questionIndex, choiceIndex)}
                        disabled={isAnswered}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${buttonClass} ${
                          isAnswered ? "cursor-default" : ""
                        }`}
                      >
                        <span>{choice}</span>
                        <span className="text-xs uppercase tracking-[0.2em]">
                          {String.fromCharCode(65 + choiceIndex)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">
            {answeredCount === totalQuestions
              ? "Quiz complete"
              : `${totalQuestions - answeredCount} question(s) left`}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            {answeredCount === totalQuestions
              ? "Reset and take the quiz again whenever you want another pass."
              : "Finish every question to see your final score."}
          </div>
        </div>

        <button
          onClick={resetQuiz}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Reset quiz
        </button>
      </div>
    </section>
  )
}
