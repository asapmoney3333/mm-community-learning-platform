import { supabase } from "../lib/supabase"

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function saveProfile(userId, updates) {
  const payload = {
    id: userId,
    ...updates,
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function uploadAvatar(userId, file) {
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "png"
  const filePath = `${userId}/avatar-${Date.now()}.${fileExtension}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  return {
    avatar_path: filePath,
    avatar_url: data.publicUrl,
  }
}
