import Link from "next/link";
import type { Metadata } from "next";
import Flourish from "@/components/Flourish";
import { parshiot } from "@/lib/parshiot";
import { getPublishedDivreiTorah } from "@/lib/content";
import { getCurrentWeek } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Browse the full Torah cycle — a Dvar Torah for every Parsha of the year.",
};

export const revalidate = 3600;

// Group parshiot by sefer for the archive layout
const BOOKS = [
  "Bereishit",
  "Shemot",
  "Vayikra",
  "Bamidbar",
  "Devarim",
] as const;

const BOOK_HEBREW: Record<string, string> = {
  Bereishit: "בְּרֵאשִׁית",
  Shemot: "שְׁמוֹת",
  Vayikra: "וַיִּקְרָא",
  Bamidbar: "בְּמִדְבַּר",
  Devarim: "דְּבָרִים",
};

export default async function ArchivePage() {
  const published = await getPublishedDivreiTorah();
  const currentWeek = getCurrentWeek();

  // Which single-parsha slugs have at least one published entry?
  const publishedSlugs = new Set<string>();
  for (const d of published) {
    if (d.parshaSlugs.length === 1) {
      publishedSlugs.add(d.parshaSlugs[0]);
    } else {
      // Combined entries count for both constituent parshiot
      for (const s of d.parshaSlugs) publishedSlugs.add(s);
    }
  }

  // Which slug(s) are "this week"?
  const currentSlugs = new Set(currentWeek?.slugs ?? []);

  return (
    <div className="mx-auto max-w-wide px-6 pb-16 pt-10 md:px-8 md:pt-16">
      <header className="text-center">
        <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
          Archive
        </h1>
        <div className="mt-4 flex justify-center">
          <Flourish />
        </div>
        <p className="mx-auto mt-4 max-w-reader font-serif text-base text-ink-muted md:text-lg">
          The full Torah cycle, one Dvar Torah at a time.
        </p>
      </header>

      <div className="mt-14 space-y-16">
        {BOOKS.map((book) => {
          const inBook = parshiot.filter((p) => p.book === book);
          return (
            <section key={book}>
              <div className="mb-6 flex items-baseline justify-between border-b border-ink/10 pb-3">
                <h2 className="font-serif text-xl text-ink md:text-2xl">
                  {book}
                </h2>
                <span
                  className="font-hebrew text-lg text-ink-muted"
                  lang="he"
                  dir="rtl"
                >
                  {BOOK_HEBREW[book]}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                {inBook.map((p) => {
                  const hasEntry = publishedSlugs.has(p.slug);
                  const isCurrent = currentSlugs.has(p.slug);
                  return (
                    <li key={p.slug}>
                      {hasEntry ? (
                        <Link
                          href={`/parsha/${p.slug}`}
                          className={`group flex items-baseline justify-between gap-3 border-b border-ink/5 py-2.5 hover:border-accent/40 transition-colors ${
                            isCurrent ? "bg-parchment-200/40 -mx-3 px-3 rounded-sm" : ""
                          }`}
                        >
                          <span className="flex items-baseline gap-2">
                            <span className="font-serif text-base text-ink group-hover:text-accent-deep transition-colors">
                              {p.english}
                            </span>
                            {isCurrent && (
                              <span className="font-sans text-[10px] uppercase tracking-wide-caps text-accent-deep">
                                This week
                              </span>
                            )}
                          </span>
                          <span
                            className="font-hebrew text-base text-ink-muted"
                            lang="he"
                            dir="rtl"
                          >
                            {p.hebrew}
                          </span>
                        </Link>
                      ) : (
                        <div
                          className={`flex items-baseline justify-between gap-3 border-b border-ink/5 py-2.5 ${
                            isCurrent ? "bg-parchment-200/40 -mx-3 px-3 rounded-sm" : ""
                          }`}
                          aria-disabled="true"
                        >
                          <span className="flex items-baseline gap-2">
                            <span className="font-serif text-base text-ink-faint">
                              {p.english}
                            </span>
                            {isCurrent ? (
                              <span className="font-sans text-[10px] uppercase tracking-wide-caps text-accent-deep">
                                This week
                              </span>
                            ) : (
                              <span className="font-sans text-[10px] uppercase tracking-wide-caps text-ink-faint/80">
                                Coming soon
                              </span>
                            )}
                          </span>
                          <span
                            className="font-hebrew text-base text-ink-faint"
                            lang="he"
                            dir="rtl"
                          >
                            {p.hebrew}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
