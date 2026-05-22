# Crypto Ebook Template

A React + Vite learning app for crypto education with:

- a polished home page and course library
- lesson rendering from MDX files
- multilingual course content
- interactive quizzes
- Supabase authentication
- forgot password and password reset flow
- profile management with avatar upload
- saved theme preferences
- quiz progress saving

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Supabase
- MDX via Vite

## Getting Started

1. Install dependencies:

```bash
yarn
```

2. Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: the app currently reads `VITE_SUPABASE_ANON_KEY` in [src/lib/supabase.js](/D:/projects/TypeScript/crypto-ebook-template/src/lib/supabase.js:1). If your local env still uses `VITE_SUPABASE_PUBLISHABLE_KEY`, rename it to match the code.

3. Start the development server:

```bash
yarn dev
```

4. Open the local Vite URL shown in the terminal.

## Available Scripts

```bash
yarn dev
yarn build
yarn preview
yarn lint
```

## App Structure

- [src/pages/Home.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/pages/Home.jsx:1): landing page and course library
- [src/pages/Course.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/pages/Course.jsx:1): lesson reader, chapter navigation, quiz flow
- [src/pages/Login.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/pages/Login.jsx:1): sign in and registration UI
- [src/pages/ResetPassword.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/pages/ResetPassword.jsx:1): password recovery and password update UI
- [src/pages/Profile.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/pages/Profile.jsx:1): profile editing, avatar upload, and theme settings
- [src/context/AuthContext.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/context/AuthContext.jsx:1): auth state and Supabase auth helpers
- [src/context/ThemeContext.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/context/ThemeContext.jsx:1): global theme state and persistence
- [src/utils/profile.js](/D:/projects/TypeScript/crypto-ebook-template/src/utils/profile.js:1): profile fetch, update, and avatar upload helpers
- [src/utils/progress.js](/D:/projects/TypeScript/crypto-ebook-template/src/utils/progress.js:1): saves quiz completion to Supabase
- `supabase/migrations/...`: profile table, avatar storage, and theme schema changes
- `src/content/courses/...`: course manifests, MDX lessons, and quiz content

## Supabase Notes

This project uses Supabase for:

- email/password sign in
- account registration
- password reset emails
- password updates from recovery links
- auth session tracking
- profile storage in a `profiles` table
- avatar uploads in an `avatars` storage bucket
- saved theme preferences
- storing course progress in a `progress` table

If you use password recovery, make sure your Supabase Auth redirect URLs include your app's reset page.

Example local redirect:

```text
http://localhost:5173/reset-password
```

If you deploy under a base path such as GitHub Pages, also allow the full hosted reset URL.

Example hosted redirect:

```text
https://YOUR_USERNAME.github.io/crypto-ebook-template/reset-password
```

The app generates password reset links that point to `/reset-password`.

Expected `profiles` columns:

- `id`
- `email`
- `username`
- `full_name`
- `bio`
- `avatar_path`
- `avatar_url`
- `theme`

Expected `progress` columns:

- `user_id`
- `course_id`
- `chapter_id`
- `completed`
- `score`

For reliable upserts, a unique constraint on `user_id`, `course_id`, and `chapter_id` is recommended.

Expected storage setup:

- bucket name: `avatars`
- public read access for avatar images
- authenticated users can upload/update/delete files inside their own `<user-id>/...` folder

## Routes

- `/` home page
- `/login` authentication page
- `/reset-password` password recovery page
- `/profile` profile management page
- `/course/:id` individual course experience

## Deployment

The project includes a `homepage` field in [package.json](/D:/projects/TypeScript/crypto-ebook-template/package.json:1), which suggests GitHub Pages deployment is intended. If you deploy there, make sure:

- the `homepage` value is updated to your real repository URL
- your Supabase env vars are configured in the deployment environment
- the hosted app can access your course content and Supabase project

## Authoring Lessons

Lessons now use `.mdx` files under `src/content/courses/<course-id>/lessons/<lang>/`.

That means you can mix normal Markdown with reusable React components such as:

- `<Callout title="..." tone="info|success|warning|danger">...</Callout>`
- `<StatGrid>` with nested `<StatCard label="..." value="...">...</StatCard>`
- `<Glossary>` with nested `<GlossaryItem term="...">...</GlossaryItem>`
- `<ExternalImage src="..." alt="..." caption="..."/>`
- `<YouTubeEmbed url="https://youtu.be/..." title="..." caption="..."/>`

Example:

```mdx
# Wallet Safety

<Callout title="Important" tone="warning">
  Never share your recovery phrase.
</Callout>

<ExternalImage
  src="https://i.imgur.com/example.png"
  alt="Example wallet screen"
  caption="A simple wallet interface example."
/>

<YouTubeEmbed
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Wallet basics walkthrough"
  caption="A short explainer video embedded from YouTube."
/>
```

The shared MDX component mapping lives in [src/components/lesson/LessonComponents.jsx](/D:/projects/TypeScript/crypto-ebook-template/src/components/lesson/LessonComponents.jsx:1).

## Notes

- `.env` is already ignored in [.gitignore](/D:/projects/TypeScript/crypto-ebook-template/.gitignore:1)
- if linting fails in a restricted environment, it may be due to sandbox permission limits rather than ESLint itself
