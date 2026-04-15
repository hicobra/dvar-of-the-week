import Link from "next/link";
import DvarTorahView from "@/components/DvarTorah";
import {
  getCurrentWeek,
  getShabbatTimes,
  formatShabbatLine,
} from "@/lib/calendar";
import {
  findDvarTorahForSlugs,
  getMostRecentDvarTorah,
  getAvailableLanguages,
} from "@/lib/content";
import { getDisplayName } from "@/lib/parshiot";
import type { Language } from "@/lib/types";

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const language: Language = lang === "he" ? "he" : "en";

  const currentWeek = getCurrentWeek();
  const shabbatTimes = currentWeek ? getShabbatTimes(currentWeek.shabbatDate) : null;

  const currentResult = currentWeek
    ? await findDvarTorahForSlugs(currentWeek.slugs, language)
    : { dvar: null, fellBackLanguage: false };

  const currentDvar = currentResult.dvar;
  const currentFellBack = currentResult.fellBackLanguage;

  const fallback = currentDvar ? null : await getMostRecentDvarTorah(language);
  const dvar = currentDvar ?? fallback;

  const availableLanguages = dvar ? await getAvailableLanguages(dvar.urlSlug) : [];

  const currentDisplay = currentWeek ? getDisplayName(currentWeek.slugs) : null;

  const isHebrew = language === "he";

  // Compose the Shabbat times line shown in the fallback banner
  const fallbackShabbatLine = formatShabbatLine(shabbatTimes, language);

  return (
    <div className="mx-auto pb-16">
      {/* Brief intro strip */}
      <section className="border-b border-ink/10 bg-parchment-50">
        <div
          className="mx-auto max-w-reader px-6 py-10 text-center md:py-12"
          lang={isHebrew ? "he" : "en"}
          dir={isHebrew ? "rtl" : "ltr"}
        >
          <p
            className={`leading-relaxed text-ink-muted text-base md:text-lg ${
              isHebrew ? "font-hebrew" : "font-serif"
            }`}
          >
            {isHebrew
              ? "דבר תורה קצר על פרשת השבוע — נכתב כדי להיאמר בשולחן השבת בכשלוש עד חמש דקות."
              : "A short Dvar Torah on the weekly Parsha — written to be told over at the Shabbat table in three to five minutes."}
          </p>
        </div>
      </section>

      {/* Fallback banner (only if this week's isn't ready yet) */}
      {!currentDvar && dvar && currentDisplay && (
        <section className="mx-auto max-w-reader px-6 pt-10">
          <div
            className="rounded-sm border border-accent/30 bg-parchment-200/40 px-5 py-4 text-center"
            lang={isHebrew ? "he" : "en"}
            dir={isHebrew ? "rtl" : "ltr"}
          >
            <p
              className={`uppercase tracking-wide-caps text-accent-deep ${
                isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
              }`}
            >
              {isHebrew
                ? `השבוע · פרשת ${currentDisplay.hebrew}`
                : `This week · Parshat ${currentDisplay.english}`}
            </p>
            {fallbackShabbatLine && (
              <p
                className={`mt-1 text-ink-muted ${
                  isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
                }`}
              >
                {fallbackShabbatLine}
              </p>
            )}
            <p
              className={`mt-2 text-sm text-ink-muted ${
                isHebrew ? "font-hebrew text-base" : "font-serif"
              }`}
            >
              {isHebrew
                ? "הדבר תורה לשבוע הזה עדיין בדרך. בינתיים, הנה האחרון שפורסם."
                : "This week's Dvar Torah is coming soon. In the meantime, here's the most recent one."}
            </p>
          </div>
        </section>
      )}

      {/* The Dvar Torah itself */}
      {dvar ? (
        <DvarTorahView
          dvarTorah={dvar}
          hero={Boolean(currentDvar)}
          shabbatTimes={currentDvar ? shabbatTimes : null}
          availableLanguages={availableLanguages}
          pathname="/"
          fellBackLanguage={currentFellBack}
        />
      ) : (
        <div className="mx-auto max-w-reader px-6 py-24 text-center">
          <p className="font-serif text-lg text-ink-muted">
            The first Dvar Torah is on its way.
          </p>
        </div>
      )}

      {/* Archive link */}
      <div className="mx-auto mt-16 max-w-reader px-6 text-center">
        <Link
          href="/archive"
          className={`inline-block uppercase tracking-wide-caps text-accent-deep hover:text-accent transition-colors ${
            isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
          }`}
        >
          {isHebrew ? "לכל הפרשיות ←" : "Browse all Parshiot →"}
        </Link>
      </div>
    </div>
  );
}
