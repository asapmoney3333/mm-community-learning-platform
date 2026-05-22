import { supabase } from "../lib/supabase"

export async function saveProgress({
  userId,
  courseId,
  chapterId,
  score
}) {
  const { error } = await supabase
    .from("progress")
    .upsert({
      user_id: userId,
      course_id: courseId,
      chapter_id: chapterId,
      completed: true,
      score
    }, {
      onConflict: "user_id,course_id,chapter_id"
    })

  if (error) {
    throw error
  }
}
