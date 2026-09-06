import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimesmithMark } from "@/components/timesmith-mark";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-bg px-5 py-6 text-fg sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Timesmith home">
            <TimesmithMark className="size-10" />
            <span className="font-display text-lg font-black">Timesmith</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-extrabold text-muted hover:bg-accent-soft hover:text-accent-dark"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
          </div>
        </header>

        <article className="forge-card mt-8 rounded-[var(--radius-xl)] p-6 sm:p-10">
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-accent-soft text-accent-dark">
            <ShieldCheck className="size-5" />
          </span>
          <p className="mt-5 text-xs font-extrabold tracking-[0.14em] text-accent-dark uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-2 text-3xl font-black text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-muted sm:text-base">
            {intro}
          </p>
          <p className="mt-4 text-xs font-bold text-subtle">Effective September 5, 2026</p>
          <div className="mt-8 space-y-8 border-t border-border pt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-black [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:font-semibold [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-relaxed [&_ul]:font-semibold [&_ul]:text-muted">
            {children}
          </div>
        </article>

        <nav
          aria-label="Legal pages"
          className="mt-6 flex justify-center gap-5 text-xs font-bold text-muted"
        >
          <Link to="/privacy" className="hover:text-accent-dark">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-accent-dark">
            Terms of Use
          </Link>
        </nav>
      </div>
    </main>
  );
}
