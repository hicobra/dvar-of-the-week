import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DvarTorahView from "@/components/DvarTorah";
import Flourish from "@/components/Flourish";
import { fromUrlSlug, getDisplayName, parshiot, combinedParshiot } from "@/lib/parshiot";
import { getDivreiTorahByUrlSlug, getAvailableLanguages } from "@/lib/content";
import type { Language } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const singles = parshiot.map((p) => ({ slug: p.slug }));
  const combined = combinedParshiot.map((c) => ({ slug: c.slug }));
  return [...singles, ...combined];
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language: Language = lang === "he" ? "he" : "en";

  const slugs = fromUrlSlug(slug);
  if (slugs.length === 0) return { title: "Not Found" };

  const display = getDisplayName(slugs);
  const { entries } = await getDivreiTorahByUrlSlug(slug, language);
  const latest = entries[0];

  const title = language === "he"
    ? `פרשת ${display.hebrew}`
    : `Parshat ${display.english}`;
  const description = latest
    ? (language === "he"
        ? `${latest.title} — דבר תורה קצר על פרשת ${display.hebrew}.`
        : `${latest.title} — a short Dvar Torah on Parshat ${display.english}.`)
    : (language === "he"
        ? `דברי תורה על פרשת ${display.hebrew}.`
        : `Divrei Torah on Parshat ${display.english}.`);

  return {
    title,
    description,
    openGraph: {
      title: `${title} · Dvar of the Week`,
      description,
      type: "article",
    },
  };
}

export default async function ParshaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language: Language = lang === "he" ? "he" : "en";

  const slugs = fromUrlSlug(slug);
  if (slugs.length === 0) notFound();

  const display = getDisplayName(slugs);
  const { entries, fellBackLanguage } = await getDivreiTorahByUrlSlug(slug, language);
  const availableLanguages = await getAvailableLanguages(slug);
  const [latest, ...older] = entries;

  const pathname = `/parsha/${slug}`;
  const isHebrew = language === "he";

  if (!latest) {
    return (
      <div
        className="mx-auto max-w-reader px-6 pb-16 pt-10 md:pt-16"
        lang={isHebrew ? "he" : "en"}
        dir={isHebrew ? "rtl" : "ltr"}
      >
        <header className="text-center">
          <p
            className="font-hebrew text-2xl text-ink-soft"
            lang="he"
            dir="rtl"
          >
            {display.hebrew}
          </p>
          <h1
            className={`mt-2 text-3xl leading-tight text-ink md:text-4xl ${
              isHebrew ? "font-hebrew" : "font-serif"
            }`}
          >
            {isHebrew ? `פרשת ${display.hebrew}` : `Parshat ${display.english}`}
          </h1>
          <div className="mt-4 flex justify-center">
            <Flourish />
          </div>
          <p
            className={`mx-auto mt-8 text-lg text-ink-muted ${
              isHebrew ? "font-hebrew" : "font-serif"
            }`}
          >
            {isHebrew
              ? "דבר תורה על הפרשה הזאת יתפרסם בקרוב."
              : "A Dvar Torah for this Parsha is coming soon."}
          </p>
          <Link
            href="/archive"
            className={`mt-10 inline-block uppercase tracking-wide-caps text-accent-deep hover:text-accent transition-colors ${
              isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
            }`}
          >
            {isHebrew ? "→ חזרה לארכיון" : "← Back to Archive"}
          </Link>
        </header>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <DvarTorahView
        dvarTorah={latest}
        availableLanguages={availableLanguages}
        pathname={pathname}
        fellBackLanguage={fellBackLanguage}
      />

      {older.length > 0 && (
        <section
          className="mx-auto mt-20 max-w-reader px-6"
          lang={isHebrew ? "he" : "en"}
          dir={isHebrew ? "rtl" : "ltr"}
        >
          <div className="border-t border-ink/10 pt-10">
            <h3
              className={`uppercase tracking-wide-caps text-ink-muted ${
                isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
              }`}
            >
              {isHebrew
                ? `שנים קודמות על פרשת ${display.hebrew}`
                : `Earlier years on Parshat ${display.english}`}
            </h3>
            <ul className="mt-5 space-y-3">
              {older.map((d) => (
                <li key={d.filename}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-ink/5 pb-3">
                    <span
                      className={`text-base text-ink-soft ${
                        isHebrew ? "font-hebrew" : "font-serif"
                      }`}
                    >
                      {d.title}
                    </span>
                    <span className="font-sans text-xs text-ink-faint">
                      {d.year}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-reader px-6 text-center">
        <Link
          href="/archive"
          className={`inline-block uppercase tracking-wide-caps text-accent-deep hover:text-accent transition-colors ${
            isHebrew ? "font-hebrew text-sm" : "font-sans text-xs"
          }`}
        >
          {isHebrew ? "→ חזרה לארכיון" : "← Back to Archive"}
        </Link>
      </div>
    </div>
  );
}
