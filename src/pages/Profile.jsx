import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { uploadAvatar } from "../utils/profile"

export default function Profile() {
  const {
    user,
    profile,
    isAuthReady,
    isProfileLoading,
    updateProfile,
  } = useAuth()
  const { theme, themes, setTheme } = useTheme()

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    bio: "",
    theme,
  })
  const [status, setStatus] = useState({
    type: "",
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!profile) {
      return
    }

    setForm({
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      theme: profile?.theme || "midnight",
    })
  }, [profile])

  if (isAuthReady && !user) {
    return <Navigate to="/login" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatus({
      type: "",
      message: "",
    })

    try {
      await updateProfile({
        username: form.username || null,
        full_name: form.full_name || null,
        bio: form.bio || null,
        theme: form.theme,
      })

      setTheme(form.theme)
      setStatus({
        type: "success",
        message: "Profile updated successfully.",
      })
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "We couldn't update your profile.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]

    if (!file || !user) {
      return
    }

    setIsUploading(true)
    setStatus({
      type: "",
      message: "",
    })

    try {
      const avatarData = await uploadAvatar(user.id, file)
      await updateProfile(avatarData)
      setStatus({
        type: "success",
        message: "Avatar uploaded successfully.",
      })
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "We couldn't upload your avatar.",
      })
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  if (!isAuthReady || isProfileLoading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
          Loading your profile...
        </div>
      </div>
    )
  }

  const avatarUrl = profile?.avatar_url

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(74,222,128,0.16),_transparent_30%),linear-gradient(135deg,_rgba(7,10,21,0.96),_rgba(12,18,34,0.92))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              {"<-"} Back to library
            </Link>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Profile management
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Personalize your learning space
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Update your public profile, upload an avatar, and choose a
                theme that follows your account.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur sm:min-w-80">
            <div className="text-slate-400">Signed in as</div>
            <div className="mt-1 text-lg font-semibold text-white">
              {user?.email}
            </div>
            <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              Theme: {themes[form.theme]?.label || themes[theme].label}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col items-center text-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.full_name || user?.email || "Profile avatar"}
                className="h-32 w-32 rounded-[1.75rem] border border-white/10 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/5 text-4xl font-bold text-cyan-200">
                {(profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="mt-5 text-xl font-bold text-white">
              {profile?.full_name || "Set your display name"}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              @{profile?.username || "username"}
            </div>

            <label className="mt-6 w-full cursor-pointer rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/15">
              {isUploading ? "Uploading avatar..." : "Upload avatar"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleAvatarChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              PNG, JPG, WEBP, or GIF up to 5 MB. Files are stored in Supabase
              Storage.
            </p>
          </div>
        </aside>

        <main className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-8"
          >
            <div className="border-b border-white/10 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Account details
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Edit your profile
              </h2>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Username
                </span>
                <input
                  value={form.username}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                  placeholder="crypto_builder"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Full name
                </span>
                <input
                  value={form.full_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      full_name: event.target.value,
                    }))
                  }
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Tell people what you're learning or building."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-cyan-300/5"
                />
              </label>

              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-200">
                  Theme
                </span>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(themes).map(([value, option]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          theme: value,
                        }))
                        setTheme(value)
                      }}
                      className={`rounded-[1.25rem] border p-4 text-left transition ${
                        form.theme === value
                          ? "border-cyan-300/40 bg-cyan-300/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">
                        {option.label}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {value === "midnight"
                          ? "Deep contrast with the original academy look."
                          : value === "ocean"
                            ? "Cool blue gradients with a brighter atmosphere."
                            : "Green-tinted depth with a calm study feel."}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {status.message ? (
              <div
                className={`mt-6 rounded-[1.25rem] border px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
                    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">
                Your selected theme is saved to your profile.
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
