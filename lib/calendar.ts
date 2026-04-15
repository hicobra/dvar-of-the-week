import { HebrewCalendar, HDate, Location, flags } from "@hebcal/core";
import { toUrlSlug } from "./parshiot";
import type { CurrentWeek, Language, ShabbatTimes } from "./types";

// Canonical project location: Kochav Yaakov, Israel.
// Coordinates: ~31.83° N, 35.27° E. Timezone: Asia/Jerusalem.
// Candle-lighting minhag: 40 minutes before sunset (standard Israeli
// yishuv practice). Havdalah: 42 minutes after sunset (tzeit hakochavim).
const KOCHAV_YAAKOV = new Location(
  31.8306,
  35.2678,
  true,
  "Asia/Jerusalem",
  "Kochav Yaakov",
  "IL"
);
const CANDLE_LIGHTING_MINS = 40;
const HAVDALAH_MINS = 42;

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

/**
 * Compute candle-lighting and havdalah times for the given Shabbat date,
 * using the canonical project location (Kochav Yaakov, Israel).
 */
export function getShabbatTimes(shabbatDate: Date): ShabbatTimes {
  // Candle lighting happens on Friday evening, havdalah on Saturday night.
  const friday = new Date(shabbatDate);
  friday.setDate(friday.getDate() - 1);

  const events = HebrewCalendar.calendar({
    start: friday,
    end: shabbatDate,
    candlelighting: true,
    location: KOCHAV_YAAKOV,
    il: true,
    noHolidays: true,
    sedrot: false,
    candleLightingMins: CANDLE_LIGHTING_MINS,
    havdalahMins: HAVDALAH_MINS,
  });

  let candleLighting: Date | null = null;
  let havdalah: Date | null = null;

  for (const ev of events) {
    const desc = ev.getDesc();
    const time = (ev as unknown as { eventTime?: Date }).eventTime;
    if (!time) continue;
    if (desc === "Candle lighting") candleLighting = time;
    else if (desc === "Havdalah") havdalah = time;
  }

  return { shabbatDate, candleLighting, havdalah };
}

/** Format a Shabbat date as "April 17" (EN) or "17 באפריל" (HE). */
export function formatShabbatDate(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language === "he" ? "he-IL" : "en-US", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(date);
}

/** Format a time as "6:47 PM" (EN) or "18:47" (HE), in Jerusalem timezone. */
export function formatShabbatTime(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language === "he" ? "he-IL" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: language === "en",
    timeZone: "Asia/Jerusalem",
  }).format(date);
}
