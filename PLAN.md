# Ahmad Abu Hasan — Portfolio Plan

> Status: **phases 1–7 built and verified; phase 8 (deploy) pending** · Last updated: 2026-09-30
> Stack: **Next.js 16 (App Router) + TypeScript + Tailwind 4 + Keystatic + next-intl**
> Direction: **bold, professional, dark-only, bilingual (English + Arabic RTL)**
>
> See **§11 Build notes** for what changed from this plan during the build, and why.

---

## 1. Goals

1. Present Ahmad as a **Senior Full-Stack Engineer** (web, mobile, AI agents) to recruiters and clients in the Gulf and internationally.
2. Every piece of content is editable from **Keystatic** (`/keystatic`) with no code changes, including projects and apps added later.
3. Full **English + Arabic** parity. Arabic should be designed for RTL from the start, not machine-mirrored.
4. Fast and accessible: Lighthouse ≥ 95 in all categories, WCAG 2.1 AA, in both locales.

---

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js (latest, App Router) + TypeScript | Static generation for all public pages |
| CMS | Keystatic (`@keystatic/core`, `@keystatic/next`, `@markdoc/markdoc`) | Local mode in dev, GitHub mode in prod |
| i18n | `next-intl` | `/en/...` and `/ar/...` routes, UI strings in `messages/{en,ar}.json` |
| Styling | Tailwind CSS, **logical properties only** (`ms-`, `pe-`, `start-`, `text-start`) | RTL-safe by default |
| Motion | CSS keyframes + a tiny IntersectionObserver (`Reveal`) and scroll handler (`Timeline`) | Transform/opacity only. The `motion` library was dropped during the build (§11) |
| Icons | `lucide-react` (UI), Simple Icons SVGs (tech logos) | |
| Fonts | `next/font/google`, loaded per locale | See §5.3 |
| Hosting | Vercel | Rebuilds automatically on every Keystatic commit |

**Dark mode only:** there's no theme toggle and no `next-themes`. Set `color-scheme: dark` on `<html>` so native controls and scrollbars render dark.

---

## 3. Information architecture

### Routes

```
/                    → redirects to /en (or /ar based on Accept-Language)
/[locale]            → Home (one-page scroll)
/[locale]/projects   → all projects        (hidden until ≥1 project exists)
/[locale]/projects/[slug]
/[locale]/apps       → all apps            (hidden until ≥1 app exists)
/[locale]/apps/[slug]
/keystatic           → CMS admin (outside locale routing)
/api/keystatic/*     → CMS API   (outside locale routing)
```

### Home page section order

Sections are numbered in the bold style, e.g. `01 — Work`:

1. **Hero:** name, role, value proposition, primary CTA, stats
2. **Featured Projects** *(auto-hidden while empty)*
3. **Apps** *(auto-hidden while empty)*
4. **Experience:** timeline
5. **Skills:** grouped chips
6. **About:** bio, education, portrait
7. **Contact:** big CTA and links

> Projects and apps come later. **Empty sections and their nav links hide automatically**, so the site can launch now with Experience, Skills and About, then grow without code changes.

### Navigation

Sticky header with a blurred glass background: `AH` monogram · Work · Apps · Experience · Skills · About · **language switch** · **[Contact]** (outline button with a lime dot, so it never competes with a section's lime CTA).
On mobile, the nav collapses into a full-screen sheet.

---

## 4. Folder structure

```
my-Portfolio/
├─ keystatic.config.ts
├─ messages/
│  ├─ en.json                 # UI strings (nav, buttons, labels)
│  └─ ar.json
├─ content/                   # everything Keystatic edits
│  ├─ profile.yaml
│  ├─ skills.yaml
│  ├─ site-settings.yaml
│  ├─ experience/<slug>.yaml
│  ├─ projects/<slug>/…       # added later via /keystatic
│  └─ apps/<slug>/…           # added later via /keystatic
├─ public/images/{profile,experience,projects,apps,og}/
└─ src/
   ├─ app/
   │  ├─ (site)/[locale]/     # root layout #1: <html lang dir>, fonts, header/footer
   │  │  ├─ layout.tsx
   │  │  ├─ page.tsx
   │  │  ├─ projects/…
   │  │  └─ apps/…
   │  ├─ (admin)/keystatic/   # root layout #2: Keystatic admin UI
   │  └─ api/keystatic/[...params]/route.ts
   ├─ i18n/                   # next-intl routing + request config
   ├─ components/
   │  ├─ ui/                  # Button, Chip, Badge, Card, SectionHeader, Container
   │  ├─ sections/            # Hero, Projects, Apps, Experience, Skills, About, Contact
   │  └─ motion/              # Reveal, Stagger, Spotlight, CountUp
   ├─ lib/
   │  ├─ reader.ts            # Keystatic Reader API helper
   │  └─ localize.ts          # pick {en, ar} field by current locale
   └─ styles/tokens.css       # design tokens (see §5)
```

**Two root layouts via route groups:** the site layout sets `lang` and `dir` per locale, and the Keystatic admin gets its own layout. The next-intl locale matcher **must exclude** `/keystatic` and `/api`.

---

## 5. Design system ("Ink & Volt")

### 5.1 Principles

- **Bold through scale and contrast, not noise:** very large display type, strong hierarchy, and one sharp accent.
- **Accent budget of ≤ 10% of any screen.** Lime is reserved for the primary CTA, the highlighted hero word, the current role, active nav, focus rings and key numbers. Everything else is neutral.
- **One primary action per section.** Secondary actions are ghost or outline buttons.
- **No skill percentages or progress bars.** They're meaningless, and they make a senior engineer look junior.

### 5.2 Color tokens (dark only)

All text pairs below were contrast-checked against WCAG AA.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#0A0E15` | Page background (ink, not pure black, to avoid halation) | — |
| `--surface` | `#10151F` | Cards, header | — |
| `--surface-2` | `#161D2A` | Chips, raised elements, hover | — |
| `--border` | `#232C3D` | Decorative card and section borders | decorative |
| `--border-input` | `#5B6780` | Form inputs and other interactive boundaries | 3.2:1 on surface ✅ |
| `--text` | `#ECF0F6` | Headings, body | 16.9:1 on bg ✅ |
| `--text-muted` | `#A3AEC2` | Secondary text, descriptions | 8.6:1 on bg, 7.6:1 on surface-2 ✅ |
| `--text-subtle` | `#7A869E` | Metadata (dates, locations) | 5.3:1 on bg, 4.6:1 on surface-2 ✅ |
| `--accent` | `#C3F53C` | **Volt lime:** CTA, highlights, focus ring | 15.1:1 on bg ✅ |
| `--accent-hover` | `#D4FF5C` | CTA hover | — |
| `--on-accent` | `#0A0E15` | Text on lime buttons | 15.1:1 ✅ |
| `--accent-2` | `#4FD1E0` | **Cyan:** gradient partner and glow only, never a second CTA color | 10.6:1 on bg ✅ |
| `--danger` | `#F87171` | Form errors (always paired with an icon and text) | 7.0:1 on bg ✅ |

Atmosphere layers:
- An aurora glow in the hero: radial gradients of `--accent` and `--accent-2` at 8–12% opacity, slowly drifting.
- A faint 1px grid pattern (`--border` at 40%) behind the hero, masked to fade out.
- A grain/noise overlay at about 3% opacity across the page to kill gradient banding.

### 5.3 Typography

| Role | English | Arabic |
|---|---|---|
| Display / headings | **Space Grotesk** 600–700 | **Readex Pro** 600–700 |
| Body | **Inter** 400–500 | **Readex Pro** 400–600 |
| Labels / dates / numbers | **JetBrains Mono** 500 | JetBrains Mono (numbers), Readex Pro (words) |

In Arabic, Latin characters (tech names, numbers) use the English families, so "React" or "NestJS" look identical in both languages. Readex Pro is one variable file for every weight: the Arabic page loads **4 font files** and the English page **3**.

Type scale (fluid):

| Style | Size | EN line-height | AR line-height |
|---|---|---|---|
| Display (hero name) | `clamp(3rem, 8vw, 6.5rem)` | 0.95 | 1.25 |
| H2 (section title) | `clamp(2rem, 4.5vw, 3.5rem)` | 1.05 | 1.35 |
| H3 (card title) | `1.5rem` | 1.2 | 1.5 |
| Body | `1.0625rem` (17px) | 1.65 | **1.85** |
| Small / meta | `0.875rem` | 1.5 | 1.7 |
| Mono label | `0.75rem`, uppercase, `tracking-[0.14em]` | — | no uppercase, **no tracking** |

**Arabic typography rules (non-negotiable):**
- **Never apply `letter-spacing`** to Arabic text. It breaks letter joining.
- No `uppercase` transforms. Arabic has no case, so the "label" style becomes weight plus color instead.
- Bump body text 1px for Arabic (18px). Arabic's smaller apparent x-height reads small at the same size.
- Load fonts per locale, subset them, use `display: swap`, and keep it to ≤ 4 font files per page.

### 5.4 Layout

- Container max-width is `1200px`, on a 12-column grid with a `24px` gutter on desktop.
- **Side padding of `16px` on mobile** and `32px` on tablet and up. No horizontal scroll at 360px.
- Section vertical rhythm: `128px` on desktop, `80px` on mobile.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128. No one-off values.
- Radius: `12px` for cards, `999px` for chips and buttons, `22%` for app icons (squircle feel).

### 5.5 Section designs

**Hero**
- Eyebrow (mono label): `● Available for opportunities`. The dot is lime and pulses slowly, and the whole line is controlled by the `openToWork` toggle.
- H1: **Ahmad Abu Hasan**
- Role line with the accent word: "Senior **Full-Stack** Engineer". Only "Full-Stack" is lime.
- Value proposition (muted, max 60ch): "I build fast, reliable web and mobile products, from React interfaces to NestJS APIs and AI agents."
- CTAs: **[View my work →]** (lime, primary) · **[Download CV]** (outline). If no projects exist yet, the primary CTA points to Experience.
- Stats row (mono numbers counting up, computed from the data): `6+ years` · `6 companies` · `Web · Mobile · AI`
- Background: aurora, grid and grain.

**Projects (bento grid):** The first featured project spans 2 columns. Each card has a cover image, title, a one-line summary, up to 4 tech chips (plus a `+N` overflow chip), and arrow links. Cards have a cursor spotlight on hover.

**Apps:** Each card has a squircle app icon, name, one-line summary, text badges for platform and status (`Live`, `Beta`; never color alone), and official store badges. The detail page has a phone-frame screenshot gallery using scroll-snap, with visible prev/next buttons for keyboard and mouse users.

**Experience (timeline):**
- A vertical line on the **inline-start** side, which means it sits on the right in Arabic.
- Each entry shows role (H3), company (link), dates in mono, location, 2–3 highlight bullets and tech chips.
- The **current role** gets a lime pulsing node and a `Current` badge.
- The latest 4 roles show by default, and **"Show earlier roles (2)"** expands the rest (progressive disclosure).
- Durations are computed from the dates, not typed by hand.

**Skills:** Grouped chip clusters (see §7.2), each with a small tech logo. The current stack comes first and in full contrast. The "Earlier experience" group is visually quieter.

**About:** Portrait (with a lime frame offset as a bold detail), bio in rich text, an education card (An-Najah National University · BSc Computer Science · 2015–2019), soft skills as short statements, and location.

**Contact:**
- Huge H2: "Let's build something great." / "لنبنِ شيئاً رائعاً معاً."
- An **email button that copies to the clipboard** and shows a toast ("Email copied" / "تم نسخ البريد"). A `mailto:` fallback is also available.
- LinkedIn and GitHub links. The **phone number is hidden by default** (a privacy toggle in Keystatic).

### 5.6 Motion guidelines

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Everything that enters |
| `--dur-fast` | `150ms` | Hover, press, focus |
| `--dur-base` | `250ms` | Menus, toasts, tabs |
| `--dur-slow` | `600ms` | Section reveals |
| Hero sequence | ≤ `1200ms` total | Load-in only |

**Signature moments:** there are only three, to keep the motion pleasant rather than noisy.
1. **Hero reveal.** The name pulls into focus (blur to sharp with a small rise), the role line slides up from a mask, and the rest fades up with a 70ms stagger. Then the stats count up. The aurora drifts on a 20s CSS loop.
2. **Card spotlight.** A radial glow follows the cursor on project and app cards, and the border brightens. This only runs on `(hover: hover) and (pointer: fine)`.
3. **Timeline draw.** The vertical line fills with lime as you scroll, tied to scroll progress, and the current-role node pulses.

**Micro-interactions:** buttons lift 1px on hover, and arrow icons nudge 4px **in the reading direction**, which flips in RTL. Section content fades in with a 16px rise the first time it enters the viewport, and doesn't replay.

**Rules:**
- Animate **only `transform` and `opacity`**.
- **In Arabic, animate whole words or lines, never individual letters.** Splitting Arabic into letters breaks the joining.
- Horizontal motion flips its sign in RTL (`x: dir === 'rtl' ? -16 : 16`).
- **`prefers-reduced-motion`:** transforms become instant, the aurora and pulse freeze, count-up shows the final number, and only fades stay (≤150ms).
- No scroll-jacking, no custom cursor, no marquees, no parallax on text.

### 5.7 RTL and bilingual rules

- `<html lang="ar" dir="rtl">` and `<html lang="en" dir="ltr">` are set in the locale layout.
- **Tailwind logical properties only** (`ms/me/ps/pe/start/end`). Lint for `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left` and `text-right` in review.
- Directional icons (arrows, chevrons) flip with `rtl:-scale-x-100`. Logos, checkmarks, play and external-link icons **do not** flip.
- Tech names stay in Latin script inside Arabic text (React, NestJS). Emails, URLs, phone numbers and code are wrapped in `<bdi>` or `dir="ltr"` so punctuation doesn't jump.
- Numbers and dates use **Western digits** in both locales (`ar-u-nu-latn`) for consistency with tech names, e.g. "نوفمبر 2025".
- The language switcher shows the *target* language in its own script ("العربية" on EN pages, "English" on AR pages), keeps the current page path, and carries `lang` and `hreflang` attributes.
- SEO: per-locale `<title>` and description, `alternates.languages` (hreflang `en`, `ar`, `x-default`), and both locales in `sitemap.xml`.
- OG images: use a **static image per locale** uploaded in Keystatic. Dynamic `next/og` has limited Arabic shaping support, so don't rely on it for Arabic text.

### 5.8 Accessibility checklist

- A skip link ("Skip to content" / "تخطَّ إلى المحتوى").
- A visible focus ring on everything: `2px` solid `--accent`, `2px` offset.
- Touch targets ≥ 44×44px. The mobile nav sheet traps focus and closes on Esc.
- **Every image field in Keystatic requires alt text in both languages** (enforced by validation).
- Status is never conveyed by color alone: badges carry text labels.
- The gallery has keyboard-operable buttons, and `aria-live` announces the toast.
- axe DevTools is clean in both locales before launch.

---

## 6. Keystatic content model (bilingual)

**Strategy:** use **localized fields in one entry**, not duplicated collections per language. Shared data (dates, links, images, tech) is stored once, and only human text has `{ en, ar }` variants. That keeps the two languages from drifting apart, and the editor sees both side by side.

- A helper `localizedText(label, { multiline? })` returns `fields.object({ en: fields.text(...), ar: fields.text(...) })`, with **both required**.
- Rich-text bodies use two fields, `bodyEn` and `bodyAr` (Markdoc). Confirm the on-disk storage format during scaffold.
- 🌐 below means a localized field.

### Singletons

**`profile`**
| Field | Type |
|---|---|
| name 🌐 | text (EN "Ahmad Abu Hasan" / AR "أحمد أبو حسن") |
| headline 🌐, headlineAccentWord 🌐 | text |
| valueProp 🌐 | text (multiline) |
| location 🌐 | text |
| bio | bodyEn / bodyAr (rich text) |
| portrait + portraitAlt 🌐 | image + text |
| resumeEn, resumeAr | file (PDF) |
| email | text (validated) |
| phone, showPhone | text, checkbox (**default off**) |
| socials | array of { platform (select: LinkedIn, GitHub, X, Dribbble, Other), url } |
| openToWork | checkbox |
| careerStart | date (drives "6+ years") |
| education | array of { school 🌐, degree 🌐, start year, end year } |
| softSkills 🌐 | array of text |

**`skills`**: an array of groups, each { name 🌐, emphasis (select: primary / secondary), items: array of text }. Logos are matched automatically from the name (about 60 known technologies); unknown names get a neutral marker.

**`siteSettings`**: seoTitle 🌐, seoDescription 🌐, ogImageEn, ogImageAr, section toggles (show/hide each home section)

### Collections

**`experience`**: `content/experience/<slug>.yaml`
| Field | Type |
|---|---|
| company | text (slug source) |
| role 🌐 | text |
| employmentType | select (Full-time, Part-time, Contract, Internship) |
| location 🌐 | text |
| startDate, endDate | date, date (optional) |
| (current) | derived: an empty end date means current, so the two can never disagree |
| companyUrl, logo | url, image (shown next to the company name, so it is decorative and needs no alt text) |
| highlights 🌐 | array of text (2–3 impact bullets) |
| tech | array of text |

**`projects`**: `content/projects/<slug>/` *(filled later)*
| Field | Type |
|---|---|
| title 🌐, summary 🌐 | text |
| cover + coverAlt 🌐, gallery (array of image + alt 🌐) | image |
| role 🌐 | text |
| client / company | text (optional) |
| startDate, endDate | date |
| tech | array of text |
| liveUrl, repoUrl | url (optional) |
| featured, order | checkbox, integer |
| body | bodyEn / bodyAr: case study (problem → approach → result) |

**`apps`**: `content/apps/<slug>/` *(filled later)*
| Field | Type |
|---|---|
| name 🌐, summary 🌐 | text |
| icon + iconAlt 🌐 | image |
| platforms | multiselect (iOS, Android, Web, Desktop) |
| status | select (Live, Beta, In development, Archived) |
| appStoreUrl, playStoreUrl, webUrl | url (optional) |
| screenshots | array of { image, alt 🌐 } |
| tech | array of text |
| featured, order | checkbox, integer |
| body | bodyEn / bodyAr |

### Editing workflow

- **Dev:** `npm run dev`, then `localhost:3000/keystatic`. Edits write straight to `/content`.
- **Prod:** `yoursite.com/keystatic`, sign in with GitHub, edit, save. Each save is a commit to `main`, and Vercel rebuilds (about 1 minute).
- Storage mode switches automatically: `local` in development, `github` in production.

---

## 7. Seed content from the LinkedIn PDF

Cleaned from the PDF: typos fixed and tech names normalized. The Arabic drafts are for Ahmad to review.

### 7.1 Profile

- **Name:** Ahmad Abu Hasan / أحمد أبو حسن
- **Headline:** Senior Full-Stack Engineer / مهندس برمجيات Full-Stack أول
- **Location:** Ramallah, Palestine / رام الله، فلسطين *(confirm the wording)*
- **Email:** ahmad.csx@gmail.com
- **LinkedIn:** linkedin.com/in/ahmad-abu-hasan
- **Phone:** +970 59 805 8670 (stored, **hidden by default**)
- **Career start:** 2019-10 (internship). Shows as "6+ years" professionally, counting from 2020-01.

**Bio (EN, draft):**
> Senior Full-Stack Engineer with 6+ years of experience building web and mobile products. I work across the stack: React and React Native on the front end; Node.js, NestJS, Prisma and PostgreSQL on the back end. At TipTip I'm currently building AI agents. I hold a BSc in Computer Science from An-Najah National University, and I care about clean architecture, fast interfaces, and shipping things people actually use.

**Bio (AR, draft):**
> مهندس برمجيات Full-Stack أول بخبرة تزيد عن 6 سنوات في بناء منتجات الويب والموبايل. أعمل على كامل طبقات التطبيق: React وReact Native في الواجهات، وNode.js وNestJS وPrisma وPostgreSQL في الخوادم، وأعمل حالياً في TipTip على بناء وكلاء الذكاء الاصطناعي. حاصل على بكالوريوس علم الحاسوب من جامعة النجاح الوطنية، وأهتم بالبنية النظيفة والواجهات السريعة وبناء منتجات يستخدمها الناس فعلاً.

### 7.2 Skills (grouped)

| Group (EN / AR) | Emphasis | Items |
|---|---|---|
| Frontend / الواجهات الأمامية | primary | React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, MUI, Ant Design, JSS, Mapbox |
| Mobile / تطبيقات الموبايل | primary | React Native, Flutter |
| Backend / الخوادم | primary | Node.js, NestJS, REST APIs, GraphQL, Apollo, Prisma |
| Databases / قواعد البيانات | primary | PostgreSQL, MySQL, SQL |
| AI / الذكاء الاصطناعي | primary | AI agents, Agent building, AI engineering |
| Cloud / الحوسبة السحابية | primary | DigitalOcean, AWS |
| Earlier experience / خبرات سابقة | secondary | C#, ASP.NET MVC, LINQ, jQuery, Bootstrap, Magento, OpenCart, Fabric XM |

Soft skills (shown in About): self-learning, communication.

### 7.3 Experience

| # | Company | Role | Dates | Location | Tech |
|---|---|---|---|---|---|
| 1 | **TipTip** | Senior Full-Stack Engineer | Nov 2025 – Present | Dubai, UAE | React, React Native, Flutter, Node.js, NestJS, Prisma, PostgreSQL, SQL, DigitalOcean, AI agents |
| 2 | **Quant** | Front-End Developer | Feb 2023 – Dec 2025 | — | TypeScript, JavaScript, React, MUI, Ant Design, JSS, Axios, REST APIs, Mapbox, HTML5, CSS3 |
| 3 | **I3Hub** | Front-End Developer | Sep 2021 – Feb 2023 | Ramallah | React, TypeScript, MUI, JSS, GraphQL, Apollo, HTML5, CSS3 |
| 4 | **ITG Software, Inc.** | Front-End Developer | Apr 2021 – Sep 2021 | Nablus | React, JavaScript, Magento, Fabric XM, OpenCart, REST APIs, Bootstrap 4, AWS, MySQL |
| 5 | **ASAL Technologies** | Software Engineer | Jan 2020 – Apr 2021 | Rawabi | C#, ASP.NET MVC, LINQ, jQuery, Bootstrap, HTML, CSS, JavaScript |
| 6 | **Newsoft for ICT** | Front-End Intern | Oct 2019 – Jan 2020 | Ramallah | — |

**Content gaps for Ahmad to fill in (via Keystatic):**
- [x] Impact bullets and company intros for Quant, I3Hub, ITG and ASAL (from the CV, 2026-09-30).
- [ ] **Impact bullets for TipTip** (the CV's current role is AUI, which Ahmad chose not to show).
- [ ] Confirm "DO" = **DigitalOcean** at TipTip.
- [ ] Quant's location (the CV says Riyadh; LinkedIn details were kept).
- [ ] Company logos (optional).
- [x] Portrait photo (400×400; an 800×800+ version would look sharper on high-DPI screens).
- [ ] CV PDF (EN, and AR if available).
- [ ] GitHub URL and any other socials.
- [x] Projects from the CV: Suhail Web Platform, Suhail GPTV, Al-Souq, Healthcare Platforms, E-commerce. Covers, links and case studies still to add.
- [ ] Apps (to be added through `/keystatic`).

> Tip: the same typos exist on the LinkedIn profile itself ("Magnto", "RestfullAPI", "intership", "communication skil"). Fixing them there is worth it too.

---

## 8. Build phases

| # | Phase | Deliverable | Done when | Status |
|---|---|---|---|---|
| 1 | **Scaffold** | Next.js + TS + Tailwind + ESLint, `next-intl`, fonts, `tokens.css`; delete `test.txt` | `/en` and `/ar` render with the correct `dir` | ✅ Done (not committed yet) |
| 2 | **Keystatic** | `keystatic.config.ts` with localized fields, admin at `/keystatic`, local storage | `/keystatic` lists all singletons and collections | ✅ Done |
| 3 | **Seed content** | §7 data entered into `/content` (EN + AR) | Reader returns the data for both locales | ✅ Done |
| 4 | **UI primitives** | Button, Chip, Badge, Card, SectionHeader, Container, LanguageSwitch | Each works in LTR and RTL | ✅ Done |
| 5 | **Sections and pages** | Hero, Experience, Skills, About, Contact; Projects and Apps with auto-hide | Home complete in both locales, mobile to desktop | ✅ Done |
| 6 | **Motion pass** | Reveal, stagger, spotlight, timeline draw, count-up, reduced-motion fallbacks | Smooth at 60fps, calm under reduced motion | ✅ Done |
| 7 | **Quality pass** | SEO and hreflang, sitemap, OG images, axe, Lighthouse | ≥ 95 in all four categories, both locales | ⚠️ Mostly: everything is 100 except mobile performance at 92–93 (§11) |
| 8 | **Deploy** | GitHub repo → Vercel; Keystatic GitHub mode (GitHub App + env vars in Vercel) | Editing on the live `/keystatic` triggers a redeploy | ⏳ Needs Ahmad's GitHub + Vercel accounts (steps in README) |
| 9 | **Grow** | Ahmad adds projects and apps in `/keystatic` | No code changes needed | ⏳ |

---

## 9. Open decisions

- [ ] Domain name (e.g. `ahmadabuhasan.dev`)
- [ ] Default locale for `/`: English, with auto-detect from the browser language
- [ ] Contact: copy-email plus links only (current plan), or add a form (Resend or Formspree) later?

---

## 10. Next prompt

> Commit the project, create a GitHub repo for it, and walk me through phase 8 of `PLAN.md` (Vercel + Keystatic GitHub mode) using the steps in the README.

---

## 11. Build notes (2026-09-30)

### What changed from the plan, and why

| Area | Plan | Built | Why |
|---|---|---|---|
| Animation library | `motion` | CSS keyframes + ~40 lines of IntersectionObserver / scroll code | Same effects, about 40 KB less JavaScript |
| Hero name animation | Rise from a mask | Blur-to-sharp "focus-in" | A fully masked name isn't counted as painted, which delayed Largest Contentful Paint (LCP) |
| Arabic body font | IBM Plex Sans Arabic | Readex Pro (same as headings) | One variable file instead of two weights: 4 font files instead of 6 on Arabic pages |
| Latin text in Arabic | Arabic fonts' Latin glyphs | English fonts (Space Grotesk / Inter) | Tech names look identical in both languages, and fewer downloads |
| i18n on the client | `NextIntlClientProvider` | Server-only `next-intl`; plain links | Every string renders on the server, so the provider and messages weren't needed in the browser |
| `next-intl/plugin` | Plugin | `next-intl/config` alias in `next.config.ts` | The plugin loads `@swc/core`, whose native binary refuses to load on this PC (another Windows account can write to the AppData folder) |
| Skill logos | Picked per skill in Keystatic | Matched automatically from the name | Less to fill in; no wrong pairings |
| Experience "current" | Checkbox | Derived from an empty end date | The two could contradict each other |
| Header Contact button | Primary (lime) | Outline + lime dot | Keeps one lime CTA per screen |
| Section spacing | — | 80px mobile / 128px desktop between sections | Per §5.4 |
| Keystatic live reload | `ReaderRefresh` | Removed | Its endpoint only exists for the Pages Router; refresh the page instead |
| Keystatic storage | Local in dev, GitHub in prod | GitHub whenever `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` is set | Keystatic's GitHub App setup only runs in development |

### Verification results (production build)

| Check | English | Arabic |
|---|---|---|
| Lighthouse desktop (perf / a11y / best practices / SEO) | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Lighthouse mobile (simulated slow 4G) | 93 / 100 / 100 / 100 | 92 / 100 / 100 / 100 |
| axe (WCAG 2.1 AA), desktop + mobile | 0 violations | 0 violations |
| Font files per page | 3 | 4 |
| JavaScript transferred | 148 KB | 148 KB |
| Interaction checks (menu dialog, Esc, focus, language switch, copy email, skip link, 404s, admin hidden in prod) | 22 / 22 pass | |

Mobile performance is 92–93 rather than 95+. On a local server Lighthouse's simulation assumes first paint waits for all JavaScript and fonts (the observed first paint was about 0.3s). Re-check with PageSpeed Insights once deployed.
