const manifests = import.meta.glob("../content/courses/*/manifest.json", {
  eager: true,
  import: "default",
})

const quizzes = import.meta.glob("../content/courses/*/quizzes/*/*.json", {
  eager: true,
  import: "default",
})

const lessons = import.meta.glob("../content/courses/*/lessons/*/*.mdx")

function buildRegistry(collection, matcher) {
  return Object.entries(collection).reduce((registry, [path, value]) => {
    const match = path.match(matcher)

    if (!match) {
      return registry
    }

    const [, courseId, lang, file] = match
    registry[`${courseId}:${lang}:${file}`] = value
    return registry
  }, {})
}

const manifestRegistry = Object.entries(manifests).reduce((registry, [path, value]) => {
  const match = path.match(/\.\.\/content\/courses\/([^/]+)\/manifest\.json$/)

  if (!match) {
    return registry
  }

  const [, courseId] = match
  registry[courseId] = value
  return registry
}, {})

const quizRegistry = buildRegistry(
  quizzes,
  /\.\.\/content\/courses\/([^/]+)\/quizzes\/([^/]+)\/([^/]+)\.json$/,
)

const lessonRegistry = buildRegistry(
  lessons,
  /\.\.\/content\/courses\/([^/]+)\/lessons\/([^/]+)\/([^/]+)\.mdx$/,
)

export async function loadManifest(courseId) {
  const manifest = manifestRegistry[courseId]

  if (!manifest) {
    throw new Error(`Missing manifest for course "${courseId}"`)
  }

  return manifest
}

export async function loadLesson(courseId, lang, file) {
  const normalizedFile = file.replace(/\.md$/, ".mdx")
  const importer = lessonRegistry[`${courseId}:${lang}:${normalizedFile.replace(/\.mdx$/, "")}`]

  if (!importer) {
    throw new Error(
      `Missing lesson "${normalizedFile}" for course "${courseId}" in "${lang}"`,
    )
  }

  const module = await importer()
  return module.default
}

export async function loadQuiz(courseId, lang, file) {
  const normalizedFile = file.replace(/\.json$/, "")
  const quiz = quizRegistry[`${courseId}:${lang}:${normalizedFile}`]

  if (!quiz) {
    throw new Error(`Missing quiz "${file}" for course "${courseId}" in "${lang}"`)
  }

  return quiz
}
