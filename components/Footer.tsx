import Flourish from "./Flourish";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 py-10">
      <div className="mx-auto max-w-wide px-6 md:px-8">
        <div className="flex justify-center pb-6">
          <Flourish />
        </div>
        <p className="text-center font-sans text-xs uppercase tracking-wide-caps text-ink-faint">
          Dvar of the Week &middot; Shalom
        </p>
      </div>
    </footer>
  );
}
