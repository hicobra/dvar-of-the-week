import parshiotData from "@/content/parshiot.json";
import type { Parsha, CombinedParsha } from "./types";

export const parshiot: Parsha[] = parshiotData.parshiot;
export const combinedParshiot: CombinedParsha[] = parshiotData.combinedParshiot as CombinedParsha[];

export function getParshaBySlug(slug: string): Parsha | undefined {
  return parshiot.find((p) => p.slug === slug);
}

export function getCombinedBySlug(slug: string): CombinedParsha | undefined {
  return combinedParshiot.find((c) => c.slug === slug);
}

/**
 * Given an array of one or two slugs (from hebcal or anywhere), return the
 * canonical URL slug: "noach" for singles, "tazria-metzora" for combined.
 */
export function toUrlSlug(slugs: string[]): string {
  if (slugs.length === 1) return slugs[0];
  // For combined, check if we have a canonical combined entry
  const match = combinedParshiot.find(
    (c) =>
      c.slugs.length === slugs.length &&
      c.slugs.every((s) => slugs.includes(s))
  );
  if (match) return match.slug;
  return slugs.join("-");
}

/**
 * Resolve a URL slug back to one or two parsha slugs.
 */
export function fromUrlSlug(urlSlug: string): string[] {
  // Check if it's a single parsha
  const single = getParshaBySlug(urlSlug);
  if (single) return [single.slug];
  // Check if it's a canonical combined
  const combined = getCombinedBySlug(urlSlug);
  if (combined) return [...combined.slugs];
  // Not found
  return [];
}

export function getDisplayName(slugs: string[]): { english: string; hebrew: string } {
  if (slugs.length === 1) {
    const p = getParshaBySlug(slugs[0]);
    return p ? { english: p.english, hebrew: p.hebrew } : { english: slugs[0], hebrew: "" };
  }
  const combined = combinedParshiot.find(
    (c) => c.slugs.length === slugs.length && c.slugs.every((s) => slugs.includes(s))
  );
  if (combined) return { english: combined.english, hebrew: combined.hebrew };
  // Fallback: join parts
  const parts = slugs.map(getParshaBySlug).filter(Boolean) as Parsha[];
  return {
    english: parts.map((p) => p.english).join("-"),
    hebrew: parts.map((p) => p.hebrew).join("־"),
  };
}
