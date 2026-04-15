export type ParshaStatus = "draft" | "published";
export type Language = "en" | "he";

export interface Parsha {
  slug: string;
  english: string;
  hebrew: string;
  book: string;
}

export interface CombinedParsha {
  slugs: [string, string];
  slug: string;
  english: string;
  hebrew: string;
}

/**
 * A single language variant of a Dvar Torah. Each markdown file produces
 * one DvarTorah object. Bilingual entries are represented by two objects
 * (one "en", one "he") sharing the same urlSlug and year.
 */
export interface DvarTorah {
  // Shared across languages
  parshaSlugs: string[];
  parshaEnglish: string;
  parshaHebrew: string;
  year: number;
  status: ParshaStatus;
  // Language-specific
  language: Language;
  title: string;
  dateRange: string;
  author: string;
  bodyHtml: string;
  bodyText: string;
  // Derived
  filename: string;
  /** Combined slug used for URLs: "noach" or "tazria-metzora" */
  urlSlug: string;
}

export interface CurrentWeek {
  slugs: string[];
  urlSlug: string;
  isCombined: boolean;
  shabbatDate: Date;
}
