import { HebrewCalendar, HDate, flags } from "@hebcal/core";
import { toUrlSlug } from "./parshiot";
import type { CurrentWeek } from "./types";

/**
 * Normalize a hebcal English parsha name (e.g. "Bereshit", "Vayera",
 * "Beha'alotcha") to our internal slug ("bereishit", "vayeira",
 * "behaalotcha"). Hebcal's transliteration differs slightly from the
 * common Anglo-Jewish spellings we use, so we override where needed.
 */
function hebcalNameToSlug(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/['`’‘]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const overrides: Record<string, string> = {
    "bereshit": "bereishit",
    "vayera": "vayeira",
    "chayei-sara": "chayei-sarah",
    "shmini": "shemini",
    "achrei-mot": "acharei-mot",
    "nasso": "naso",
    "beha-alotcha": "behaalotcha",
    "sh-lach": "shelach",
    "re-eh": "reeh",
    "vayeilech": "vayelech",
    "ha-azinu": "haazinu",
    "vezot-haberakha": "vezot-haberachah",
  };

  return overrides[normalized] ?? normalized;
}

/**
 * Determine this week's parsha — specifically, the parsha being read on the
 * upcoming Shabbat (or today, if today is Shabbat). Uses the Israel cycle
 * (canonical location: Kochav Yaakov). Handles combined parshiot by
 * returning two slugs.
 */
export function getCurrentWeek(now: Date = new Date()): CurrentWeek | null {
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const daysUntilShabbat = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;

  const shabbat = new Date(now);
  shabbat.setDate(shabbat.getDate() + daysUntilShabbat);
  shabbat.setHours(12, 0, 0, 0);

  const events = HebrewCalendar.calendar({
    start: shabbat,
    end: shabbat,
    sedrot: true,
    il: true, // Israel cycle
    noHolidays: true,
  });

  for (const ev of events) {
    const f = ev.getFlags();
    if (f & flags.PARSHA_HASHAVUA) {
      // ParshaEvent has a .parsha property with an array of names
      const parshaArray = (ev as unknown as { parsha?: string[] }).parsha;
      if (parshaArray && parshaArray.length > 0) {
        const slugs = parshaArray.map(hebcalNameToSlug);
        return {
          slugs,
          urlSlug: toUrlSlug(slugs),
          isCombined: slugs.length > 1,
          shabbatDate: shabbat,
        };
      }
    }
  }

  return null;
}

/** Current Hebrew year (approximate, based on today). */
export function getCurrentHebrewYear(now: Date = new Date()): number {
  return new HDate(now).getFullYear();
}
