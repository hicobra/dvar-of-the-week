import type { Metadata } from "next";
import Flourish from "@/components/Flourish";
import LanguageToggle from "@/components/LanguageToggle";
import type { Language } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const language: Language = lang === "he" ? "he" : "en";
  return {
    title: language === "he" ? "אודות" : "About",
    description:
      language === "he"
        ? "אודות דבר השבוע."
        : "About Dvar of the Week.",
  };
}

export default async function AboutPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const language: Language = lang === "he" ? "he" : "en";
  const isHebrew = language === "he";

  return (
    <article
      className={`mx-auto max-w-reader px-6 pb-16 pt-10 md:pt-16 ${
        isHebrew ? "dvar-hebrew" : ""
      }`}
      lang={isHebrew ? "he" : "en"}
      dir={isHebrew ? "rtl" : "ltr"}
    >
      <header className="text-center">
        <LanguageToggle currentLang={language} pathname="/about" />
        <h1
          className={`text-3xl leading-tight text-ink md:text-4xl ${
            isHebrew ? "font-hebrew" : "font-serif"
          }`}
        >
          {isHebrew ? "אודות" : "About"}
        </h1>
        <div className="mt-4 flex justify-center">
          <Flourish />
        </div>
      </header>

      {!isHebrew ? (
        <div className="mt-10 font-serif text-[17px] leading-[1.7] text-ink-soft md:text-[18px] [&>p]:mb-5">
          <p>
            Hi — I'm Shalom. Every week, I write a short Dvar Torah on the
            Parsha, designed to be told over at the Shabbat table in about three
            to five minutes.
          </p>
          <p>
            I started this project because the best Divrei Torah I've ever heard
            were the short ones — the ones that fit in a real conversation, held
            one clear idea, and gave everyone at the table something to think
            about long after the meal was over. I wanted to make a home for that
            kind of Torah: warm, plainspoken, and useful.
          </p>
          <p>
            The goal of <em>Dvar of the Week</em> is simple. Every Parsha, every
            week — a single, thoughtful idea you can bring with you. Nothing
            heavy. Nothing academic. Just something worth saying.
          </p>
        </div>
      ) : (
        <div className="mt-10 font-hebrew text-[18px] leading-[1.7] text-ink-soft md:text-[19px] [&>p]:mb-5">
          <p>
            שלום, אני שלום. כל שבוע אני כותב דבר תורה קצר על פרשת השבוע, שנועד
            להיאמר בשולחן השבת בערך שלוש עד חמש דקות.
          </p>
          <p>
            התחלתי את הפרויקט הזה כי הדברי תורה הכי טובים ששמעתי בחיי היו דווקא
            הקצרים — אלה שנכנסו בתוך שיחה אמיתית, החזיקו רעיון אחד ברור, ונתנו
            לכל מי שישב ליד השולחן משהו לחשוב עליו הרבה אחרי שהארוחה נגמרה.
            רציתי ליצור בית לתורה כזאת: חמה, פשוטה בדיבור, ושימושית.
          </p>
          <p>
            המטרה של <em>דבר השבוע</em> פשוטה. כל פרשה, כל שבוע — רעיון אחד,
            מחושב, שאפשר לקחת איתך. לא כבד. לא אקדמי. רק משהו ששווה לומר.
          </p>
        </div>
      )}
    </article>
  );
}
