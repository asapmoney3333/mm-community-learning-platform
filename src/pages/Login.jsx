import { useState } from "react"
import { Link, Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { user, isAuthReady, signIn, signUp, requestPasswordReset } = useAuth()

  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState({
    type: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function switchMode(nextMode) {
    setMode(nextMode)
    setStatus({
      type: "",
      message: "",
    })

    if (nextMode === "forgot") {
      setPassword("")
    }
  }

  if (isAuthReady && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setStatus({
      type: "",
      message: "",
    })

    if (mode === "forgot") {
      const { error } = await requestPasswordReset(email)

      if (error) {
        setStatus({
          type: "error",
          message: error.message,
        })
        setIsSubmitting(false)
        return
      }

      setStatus({
        type: "success",
        message: "Password reset link sent. Check your inbox and open the recovery email.",
      })
      setIsSubmitting(false)
      return
    }

    const action = mode === "signin" ? signIn : signUp
    const { error } = await action(email, password)

    if (error) {
      setStatus({
        type: "error",
        message: error.message,
      })
      setIsSubmitting(false)
      return
    }

    setStatus({
      type: "success",
      message:
        mode === "signin"
          ? "Welcome back. Your learning progress is ready to sync."
          : "Account created. Check your email if confirmation is required.",
    })
    setIsSubmitting(false)
  }

  if (!isAuthReady) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
          Connecting to your account...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_460px]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(74,222,128,0.18),_transparent_30%),linear-gradient(135deg,_rgba(7,10,21,0.96),_rgba(12,18,34,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="relative space-y-6">
            <Link
              to="/"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              {"<-"} Back to library
            </Link>

            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                Sync your learning
              </p>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Keep course progress, quiz results, and momentum in one place.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Sign in with Supabase to save completed lessons and continue
                from any device without losing your place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-cyan-300">Sync</div>
                <div className="mt-1 text-sm text-slate-400">
                  Save completed quizzes to your account.
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-emerald-300">Resume</div>
                <div className="mt-1 text-sm text-slate-400">
                  Pick back up across lessons and devices.
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-sky-300">Focus</div>
                <div className="mt-1 text-sm text-slate-400">
                  Stay inside the same clean learning flow.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Account access
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
            </div>

            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "signin"
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "signup"
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "forgot"
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Reset
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                required
              />
            </label>

            {mode !== "forgot" ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                  required
                />
              </label>
            ) : null}

            {status.message ? (
              <div
                className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
                    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
            </button>
          </form>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            {mode === "signin"
              ? "Use the same email you want tied to your saved course progress."
              : mode === "signup"
                ? "If email confirmation is enabled in Supabase, you may need to verify before signing in."
                : "Enter your email and we'll send you to the secure password recovery flow."}
          </p>

          {mode === "signin" ? (
            <div className="mt-4 text-sm text-slate-400">
              Forgot your password?{" "}
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="font-semibold text-cyan-200 transition hover:text-cyan-100"
              >
                Reset it here
              </button>
              .
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
