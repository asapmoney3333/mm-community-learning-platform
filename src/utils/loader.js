const baseUrl = import.meta.env.BASE_URL

export async function loadManifest(courseId) {
  return fetch(`${baseUrl}courses/${courseId}/manifest.json`)
    .then(r => r.json())
}

export async function loadLesson(courseId, lang, file) {
  return fetch(`${baseUrl}courses/${courseId}/lessons/${lang}/${file}`)
    .then(r => r.text())
}

export async function loadQuiz(courseId, lang, file) {
  return fetch(`${baseUrl}courses/${courseId}/quizzes/${lang}/${file}`)
    .then(r => r.json())
}
