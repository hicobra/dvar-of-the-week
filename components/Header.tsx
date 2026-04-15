import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-parchment/80 backdrop-blur supports-[backdrop-filter]:bg-parchment/60">
      <div className="mx-auto flex max-w-wide items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-lg text-ink hover:text-accent-deep transition-colors"
        >
          <span className="tracking-wide">Dvar of the Week</span>
        </Link>
        <nav className="flex items-center gap-6 font-sans text-sm text-ink-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            This Week
          </Link>
          <Link href="/archive" className="hover:text-ink transition-colors">
            Archive
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
