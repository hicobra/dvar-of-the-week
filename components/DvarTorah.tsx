import Flourish from "./Flourish";
import LanguageToggle from "./LanguageToggle";
import { formatShabbatLine } from "@/lib/calendar";
import type { DvarTorah, Language, ShabbatTimes } from "@/lib/types";

interface DvarTorahProps {
  dvarTorah: DvarTorah;
  /** When true, renders as the primary hero on the homepage. */
  hero?: boolean;
  /** Shabbat timing for this week. Shown only when hero=true. */
  shabbatTimes?: ShabbatTimes | null;
  /** Available languages for this Dvar Torah (drives toggle visibility). */
  availableLanguages: Language[];
  /** Pathname for the language toggle links. */
  pathname: string;
  /** True if we fell back to a different language than requested. */
  fellBackLanguage?: boolean;
}

export default function DvarTorahView({
  dvarTorah,
  hero = false,
  shabbatTimes = null,
  availableLanguages,
  pathname,
  fellBackLanguage = false,
}: DvarTorahProps) {
  const isHebrew = dvarTorah.language === "he";
  const showToggle = availableLanguages.length > 1;
  const showShabbatTimes = hero && shabbatTimes !== null;

  // Build the compact Shabbat info line (when shown)
  const shabbatLine = formatShabbatLine(shabbatTimes, dvarTorah.language);

  return (
    <article
      className={`mx-auto max-w-reader px-6 md:px-0 ${isHebrew ? "dvar-hebrew" : ""}`}
      lang={isHebrew ? "he" : "en"}
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <header className="pb-8 pt-10 text-center md:pt-16">
        {hero && (
          <p className="mb-6 font-sans text-xs uppercase tracking-wide-caps text-accent-deep">
            {isHebrew ? "השבוע" : "This Week"}
          </p>
        )}

        {showToggle && (
          <LanguageToggle
            currentLang={dvarTorah.language}
            pathname={pathname}
            fellBackLanguage={fellBackLanguage}
          />
        )}

        <h2
          className={`text-3xl leading-tight text-ink md:text-4xl ${
            isHebrew ? "font-hebrew" : "font-serif"
          }`}
        >
          {dvarTorah.title}
        </h2>
        <div className="mt-4 flex flex-col items-center gap-1">
          {!isHebrew && (
            <p
              className="font-hebrew text-xl text-ink-soft"
              lang="he"
              dir="rtl"
            >
              {dvarTorah.parshaHebrew}
            </p>
          )}
          <p
            className={`uppercase tracking-wide-caps text-ink-muted ${
              isHebrew ? "font-hebrew text-base" : "font-sans text-sm"
            }`}
          >
            {isHebrew ? `פרשת ${dvarTorah.parshaHebrew}` : `Parshat ${dvarTorah.parshaEnglish}`}
          </p>
        </div>
        <div className="mt-3 flex justify-center">
          <Flourish />
        </div>

        {showShabbatTimes && shabbatLine ? (
          <div className="mt-3 space-y-1">
            <p
              className={`text-ink-muted ${
                isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
              }`}
            >
              {shabbatLine}
            </p>
            <p
              className={`text-ink-faint ${
                isHebrew ? "font-hebrew text-xs" : "font-sans text-xs"
              }`}
            >
              {dvarTorah.author}
            </p>
          </div>
        ) : (
          <p
            className={`mt-3 text-xs text-ink-faint ${
              isHebrew ? "font-hebrew text-sm" : "font-sans"
            }`}
          >
            {dvarTorah.dateRange} &middot; {dvarTorah.author}
          </p>
        )}
      </header>

      <div
        className={`dvar-content text-[17px] leading-[1.7] text-ink-soft md:text-[18px] ${
          isHebrew ? "font-hebrew text-[18px] md:text-[19px]" : "font-serif"
        }`}
        dangerouslySetInnerHTML={{ __html: dvarTorah.bodyHtml }}
      />
    </article>
  );
}
