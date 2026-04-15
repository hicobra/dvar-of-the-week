import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { DvarTorah, Language } from "./types";
import { toUrlSlug } from "./parshiot";

const CONTENT_DIR = path.join(process.cwd(), "content", "divrei-torah");

// Cache only in production so new/edited markdown files show up immediately
// during `next dev`. Production builds read content once at build time anyway.
let cache: DvarTorah[] | null = null;
const USE_CACHE = process.env.NODE_ENV === "production";

// Filename pattern: {year}-{slug}.{lang}.md
// e.g. "5786-bereishit.en.md", "5786-tazria-metzora.he.md"
const FILENAME_RE = /^(\d+)-(.+)\.(en|he)\.md$/;

async function renderMarkdown(md: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(md);
  return String(file);
}

function toPlainText(md: string): string {
  return md
    .replace(/^##?\s+.*$/gm, "")
    .replace(/^>.*$/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function loadAllDivreiTorah(): Promise<DvarTorah[]> {
  if (USE_CACHE && cache) return cache;

  if (!fs.existsSync(CONTENT_DIR)) {
    if (USE_CACHE) cache = [];
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => FILENAME_RE.test(f));

  const entries: DvarTorah[] = [];
  for (const filename of files) {
    const match = filename.match(FILENAME_RE);
    if (!match) continue;
    const language = match[3] as Language;

    const fullPath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);

    const bodyHtml = await renderMarkdown(content);
    const bodyText = toPlainText(content);

    const parshaSlugs: string[] = Array.isArray(data.parshaSlugs) ? data.parshaSlugs : [];

    entries.push({
      parshaSlugs,
      parshaEnglish: String(data.parshaEnglish ?? ""),
      parshaHebrew: String(data.parshaHebrew ?? ""),
      year: Number(data.year ?? 0),
      status: data.status === "published" ? "published" : "draft",
      language,
      title: String(data.title ?? ""),
      dateRange: String(data.dateRange ?? ""),
      author: String(data.author ?? ""),
      bodyHtml,
      bodyText,
      filename,
      urlSlug: toUrlSlug(parshaSlugs),
    });
  }

  if (USE_CACHE) cache = entries;
  return entries;
}

export async function getPublishedDivreiTorah(
  language?: Language
): Promise<DvarTorah[]> {
  const all = await loadAllDivreiTorah();
  return all.filter(
    (d) => d.status === "published" && (!language || d.language === language)
  );
}

/**
 * Find the newest published Dvar Torah matching the given parsha slugs
 * in the requested language. If not found in that language, falls back
 * to the other language so the reader always sees something.
 */
export async function findDvarTorahForSlugs(
  slugs: string[],
  language: Language
): Promise<{ dvar: DvarTorah | null; fellBackLanguage: boolean }> {
  if (slugs.length === 0) return { dvar: null, fellBackLanguage: false };
  const published = await getPublishedDivreiTorah();
  const set = new Set(slugs);

  const matches = published.filter(
    (d) =>
      d.parshaSlugs.length === slugs.length &&
      d.parshaSlugs.every((s) => set.has(s))
  );

  // Prefer requested language
  const preferred = matches
    .filter((d) => d.language === language)
    .sort((a, b) => b.year - a.year);
  if (preferred.length > 0) return { dvar: preferred[0], fellBackLanguage: false };

  // Fall back to the other language
  const fallback = matches.sort((a, b) => b.year - a.year);
  if (fallback.length > 0) return { dvar: fallback[0], fellBackLanguage: true };

  return { dvar: null, fellBackLanguage: false };
}

/**
 * Get all published Divrei Torah for a given URL slug in the requested
 * language. Sorted newest year first. If none exist in that language,
 * returns the entries in the other language (so the reader sees
 * something), marked by the second tuple element.
 */
export async function getDivreiTorahByUrlSlug(
  urlSlug: string,
  language: Language
): Promise<{ entries: DvarTorah[]; fellBackLanguage: boolean }> {
  const published = await getPublishedDivreiTorah();
  const all = published.filter((d) => d.urlSlug === urlSlug);
  const preferred = all
    .filter((d) => d.language === language)
    .sort((a, b) => b.year - a.year);
  if (preferred.length > 0) return { entries: preferred, fellBackLanguage: false };
  const fallback = all.sort((a, b) => b.year - a.year);
  return { entries: fallback, fellBackLanguage: fallback.length > 0 };
}

/**
 * Languages available for a given URL slug (for toggle visibility).
 */
export async function getAvailableLanguages(urlSlug: string): Promise<Language[]> {
  const published = await getPublishedDivreiTorah();
  const langs = new Set<Language>();
  for (const d of published) {
    if (d.urlSlug === urlSlug) langs.add(d.language);
  }
  return Array.from(langs);
}

/**
 * Fallback: the most-recently-published Dvar Torah in the requested
 * language. Used when this week's Parsha has no entry yet.
 */
export async function getMostRecentDvarTorah(
  language: Language
): Promise<DvarTorah | null> {
  const published = await getPublishedDivreiTorah(language);
  if (published.length === 0) {
    // Fall back to any language
    const any = await getPublishedDivreiTorah();
    if (any.length === 0) return null;
    const sorted = [...any].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.urlSlug.localeCompare(b.urlSlug);
    });
    return sorted[0];
  }
  const sorted = [...published].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.urlSlug.localeCompare(b.urlSlug);
  });
  return sorted[0];
}

/** Which URL slugs have at least one published entry (any language)? */
export async function getPublishedUrlSlugs(): Promise<Set<string>> {
  const published = await getPublishedDivreiTorah();
  return new Set(published.map((d) => d.urlSlug));
}
