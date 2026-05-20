import { useMemo, useState } from "react"
import { Link, Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

export default function ResetPassword() {
  const { user, isAuthReady, updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState({
    type: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasRecoveryToken = useMemo(() => {
    return window.location.hash.includes("access_token")
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "Your new password must be at least 6 characters long.",
      })
      return
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Your password confirmation does not match.",
      })
      return
    }

    setIsSubmitting(true)
    setStatus({
      type: "",
      message: "",
    })

    const { error } = await updatePassword(password)

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
      message: "Password updated successfully. You can continue with your account now.",
    })
    setIsSubmitting(false)
    setPassword("")
    setConfirmPassword("")
  }

  if (isAuthReady && user && !hasRecoveryToken) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_460px]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(74,222,128,0.18),_transparent_30%),linear-gradient(135deg,_rgba(7,10,21,0.96),_rgba(12,18,34,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="relative space-y-6">
            <Link
              to="/login"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              {"<-"} Back to login
            </Link>

            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                Account recovery
              </p>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Choose a fresh password and get back to learning.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Open this page from the email link Supabase sends you, then set
                a new password for your account.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-cyan-300">Secure</div>
                <div className="mt-1 text-sm text-slate-400">
                  Recovery links open a temporary authenticated session.
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-emerald-300">Fast</div>
                <div className="mt-1 text-sm text-slate-400">
                  Update the password once, then sign in normally again.
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-sky-300">Ready</div>
                <div className="mt-1 text-sm text-slate-400">
                  Your saved progress and profile stay connected to the account.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              New password
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Reset your password
            </h2>
          </div>

          {!hasRecoveryToken && !user ? (
            <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300">
              This page works best when opened from the password reset email.
              Request a new recovery link from the login page if this session has expired.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your new password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                required
              />
            </label>

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
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
