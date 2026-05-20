import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"

import { supabase } from "../lib/supabase"
import { fetchProfile, saveProfile } from "../utils/profile"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [profile, setProfile] = useState(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsAuthReady(true)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null)
        setIsAuthReady(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setIsProfileLoading(false)
      return
    }

    let isActive = true

    async function loadProfile() {
      setIsProfileLoading(true)

      try {
        const nextProfile = await fetchProfile(user.id)

        if (!isActive) return
        setProfile(nextProfile)
      } catch {
        if (!isActive) return
        setProfile(null)
      } finally {
        if (isActive) {
          setIsProfileLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [user])

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({
      email,
      password
    })
  }

  async function signUp(email, password) {
    return supabase.auth.signUp({
      email,
      password
    })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  async function requestPasswordReset(email) {
    const redirectTo = new URL(
      `${import.meta.env.BASE_URL}reset-password`,
      window.location.origin
    ).toString()

    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
  }

  async function updatePassword(password) {
    return supabase.auth.updateUser({
      password,
    })
  }

  async function refreshProfile() {
    if (!user) return null

    const nextProfile = await fetchProfile(user.id)
    setProfile(nextProfile)
    return nextProfile
  }

  async function updateProfile(updates) {
    if (!user) {
      throw new Error("You need to be signed in to update your profile.")
    }

    const nextProfile = await saveProfile(user.id, updates)
    setProfile(nextProfile)
    return nextProfile
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        profile,
        isProfileLoading,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        updatePassword,
        refreshProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
