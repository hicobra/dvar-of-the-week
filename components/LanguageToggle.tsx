import Link from "next/link";
import type { Language } from "@/lib/types";

interface LanguageToggleProps {
  currentLang: Language;
  /** Base pathname, e.g. "/parsha/bereishit" or "/" */
  pathname: string;
  /** If the requested language wasn't available, we show a tiny note. */
  fellBackLanguage?: boolean;
}

export default function LanguageToggle({
  currentLang,
  pathname,
  fellBackLanguage = false,
}: LanguageToggleProps) {
  const enHref = pathname === "/" ? "/" : pathname;
  const heHref = `${pathname}${pathname.includes("?") ? "&" : "?"}lang=he`;

  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <div
        className="inline-flex items-center rounded-full border border-ink/15 bg-parchment-50 p-0.5 text-xs"
        role="group"
        aria-label="Language"
      >
        <Link
          href={enHref}
          aria-current={currentLang === "en" ? "page" : undefined}
          className={`rounded-full px-4 py-1.5 font-sans uppercase tracking-wide-caps transition-colors ${
            currentLang === "en"
              ? "bg-ink text-parchment"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          English
        </Link>
        <Link
          href={heHref}
          aria-current={currentLang === "he" ? "page" : undefined}
          lang="he"
          className={`rounded-full px-4 py-1.5 font-hebrew text-sm transition-colors ${
            currentLang === "he"
              ? "bg-ink text-parchment"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          עברית
        </Link>
      </div>
      {fellBackLanguage && (
        <p className="font-sans text-[11px] text-ink-faint">
          {currentLang === "he"
            ? "הגרסה העברית עדיין לא מוכנה, מוצגת הגרסה האנגלית"
            : "English version not yet ready — showing the available language"}
        </p>
      )}
    </div>
  );
}
