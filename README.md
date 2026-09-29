# Ahmad Abu Hasan — Portfolio

Bilingual (English / العربية), dark-only portfolio built with **Next.js 16**, **Keystatic**, **next-intl** and **Tailwind CSS 4**. All content is edited in Keystatic; no code changes are needed to add projects or apps.

## Run it locally

```bash
npm install
npm run dev
```

- Site: <http://localhost:3000> (redirects to `/en` or `/ar`)
- CMS: <http://localhost:3000/keystatic>

In development, Keystatic writes straight to the files in `content/`. Refresh the site to see changes.

## Editing content (Keystatic)

| In Keystatic | What it controls |
|---|---|
| **Profile** | Name, headline, highlighted words, bio, photo, CV, email, socials, education, strengths |
| **Skills** | Skill groups. Known technology names get a logo automatically |
| **Experience** | Roles. Leave *End date* empty for your current role |
| **Projects** | Case studies. The section and nav link appear once the first project exists |
| **Apps** | Shipped apps with store links and screenshots. Same auto-show rule |
| **Site settings** | SEO text, social share images, contact copy, section on/off switches |

Every text field has an **English** and an **Arabic** value side by side. Images ask for alt text in both languages.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with Keystatic |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run lint:rtl` | Fails if code uses left/right styles instead of start/end (keeps Arabic RTL correct) |
| `npm run typecheck` | TypeScript |

## Deploying (Vercel + Keystatic GitHub mode)

1. Push this repository to GitHub. Keep it **private** if you store your phone number in Keystatic (the *Show phone* toggle only controls whether it is displayed).
2. **One-time GitHub App setup (local):** create `.env.local` with `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo`, run `npm run dev`, open <http://localhost:3000/keystatic> and follow Keystatic's prompt to create the GitHub App. It writes the `KEYSTATIC_*` values into `.env`. Then delete `.env.local` so local editing goes back to writing files directly.
3. Import the repo in [Vercel](https://vercel.com/new) and add these environment variables:
   - `NEXT_PUBLIC_SITE_URL`: your domain, e.g. `https://ahmadabuhasan.dev`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`: `owner/repo`
   - the four `KEYSTATIC_*` / `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` values from `.env` (see `.env.example`)
4. In the GitHub App settings, add `https://your-domain/api/keystatic/github/oauth/callback` as a callback URL.
5. Edit at `https://your-domain/keystatic`: sign in with GitHub, and every save becomes a commit that Vercel redeploys in about a minute.

Without GitHub mode configured, `/keystatic` returns 404 in production, because local mode has no login.

## Project layout

```
content/            everything Keystatic edits (YAML + Markdoc)
messages/           UI strings (en.json, ar.json)
keystatic.config.ts content model
src/app/[locale]/   pages (home, projects, apps, 404)
src/app/keystatic/  CMS admin
src/components/     layout, sections, work (cards/pages), ui, motion
src/lib/            data layer (content.ts), dates, metadata, fonts
src/styles/         design tokens ("Ink & Volt")
```

See [PLAN.md](PLAN.md) for the full design system and decisions.
