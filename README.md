# Dvar of the Week

A short, thoughtful Dvar Torah on the weekly Parsha — designed to be told over at the Shabbat table in three to five minutes.

## What this is

A file-based, statically-generated website. Content lives as Markdown files in `content/divrei-torah/`. The site automatically determines the current week's Parsha (Israel cycle, including double Parshiot) and features it on the homepage.

## Stack

- **Next.js 15** (App Router, static generation)
- **Tailwind CSS** for styling
- **Markdown + frontmatter** for content (parsed with `gray-matter` + `remark`)
- **@hebcal/core** for the Hebrew calendar
- **EB Garamond / Inter / Frank Ruhl Libre** for typography
- Deploys to **Vercel**

## Running the site locally

From the project root (`shalom-website/`):

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Changes to any file hot-reload in the browser. Markdown files in `content/` work the same way — save the file and the site updates.

## Project structure

```
shalom-website/
├── app/
│   ├── layout.tsx              Root layout (fonts, header, footer)
│   ├── page.tsx                Homepage — this week's Dvar Torah
│   ├── about/page.tsx          About page
│   ├── archive/page.tsx        Full Torah cycle, all 54 Parshiot
│   ├── parsha/[slug]/page.tsx  Single / combined Parsha pages
│   └── globals.css             Base + content styles
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Flourish.tsx            Ornamental divider
│   └── DvarTorah.tsx           Renders a single Dvar Torah
├── content/
│   ├── parshiot.json           Canonical list of 54 Parshiot + combined
│   └── divrei-torah/           One Markdown file per Dvar Torah
│       ├── 5786-bereishit.md
│       ├── 5786-noach.md
│       └── 5786-lech-lecha.md
├── lib/
│   ├── calendar.ts             Hebrew calendar (current parsha)
│   ├── content.ts              Markdown loading & parsing
│   ├── parshiot.ts             Canonical parsha helpers
│   └── types.ts                TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── postcss.config.mjs
```

## Adding a Dvar Torah

Every Dvar Torah has two files — one English, one Hebrew — following the pattern `{year}-{slug}.{lang}.md`:

- `5786-vayeira.en.md` + `5786-vayeira.he.md` — a single Parsha
- `5786-tazria-metzora.en.md` + `5786-tazria-metzora.he.md` — a combined Parsha

Either language can exist alone (the toggle hides when only one is present and the reader sees whichever exists).

**English frontmatter:**

```yaml
---
parshaSlugs:
  - vayeira                    # one slug for single, two for combined
parshaEnglish: Vayeira         # shared display metadata
parshaHebrew: וַיֵּרָא          # shared display metadata (nikud when available)
title: The Title               # Dvar Torah title in English
year: 5786                     # Hebrew year
dateRange: "Shabbat, November 7, 2026"
author: Shalom
status: draft                  # draft or published
---
```

**Hebrew frontmatter** (same shared fields, title/dateRange/author localized):

```yaml
---
parshaSlugs:
  - vayeira
parshaEnglish: Vayeira
parshaHebrew: וַיֵּרָא
title: "כותרת"
year: 5786
dateRange: "שבת, 7 בנובמבר 2026"
author: "שלום"
status: draft
---
```

Body follows in Markdown. Use a blockquote for the pasuk.

**English pasuk:**
```markdown
> **Hebrew text** · *Transliteration* · "English translation" (Source reference)
```

**Hebrew pasuk:**
```markdown
> **טקסט בעברית** (בראשית א׳, א׳)
```

End with a `## Takeaway` (English) or `## לקחת איתנו` (Hebrew) heading and a short practical line.

A file with `status: draft` stays in the repo but does not appear on the site. Flip to `status: published` to go live. Status is set per-file so you can publish English before Hebrew is ready (or vice versa).

## Architectural invariant

Adding content for a new Hebrew year (e.g. 5787) requires **only** dropping new Markdown files into `content/divrei-torah/`. No code changes, no config updates.

## Content style

See the companion **Content Style Guide** for voice, length, and structure rules. Core test: *could I comfortably say this over at the Shabbat table out loud in 3–5 minutes without losing my guests?*

## Location

Canonical location: Kochav Yaakov, Israel. The site follows the Israel Parsha cycle.
