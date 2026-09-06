import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Cloud, Medal, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getLeaderboard } from "@/lib/game/cloud";
import type { Mode, Subject } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Entry = Awaited<ReturnType<typeof getLeaderboard>>[number];

const PREVIEW_ENTRIES: Entry[] = [
  { rank: 1, displayName: "Maya Chen", score: 12_480, accuracy: 98, subject: "arithmetic", mode: "sprint" },
  { rank: 2, displayName: "Rafi Smith", score: 11_920, accuracy: 96, subject: "arithmetic", mode: "sprint" },
  { rank: 3, displayName: "Sora Kim", score: 10_860, accuracy: 94, subject: "arithmetic", mode: "sprint" },
];

export function LeaderboardScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [subject, setSubject] = useState<Subject>("arithmetic");
  const [mode, setMode] = useState<Mode>("sprint");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user, isPending } = useCurrentUserState();
  const showPreview = import.meta.env.DEV && !loading && !error && entries.length === 0;
  const visibleEntries = showPreview ? PREVIEW_ENTRIES : entries;

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(false);
    getLeaderboard({ data: { subject, mode } })
      .then((rows) => live && setEntries(rows))
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [subject, mode]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 pt-6 pb-8 sm:px-8">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label={t("Back")} onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <p className="text-xs font-extrabold tracking-[0.14em] text-accent-dark uppercase">
            {t("Weekly league")}
          </p>
          <h1 className="font-display text-2xl font-black">{t("Leaderboard")}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Trophy className="size-7 text-warning" />
        </div>
      </header>

      <section className="forge-card rounded-[var(--radius-xl)] p-4">
        <div className="grid grid-cols-2 gap-2">
          {(["arithmetic", "algebra"] as const).map((item) => (
            <Filter key={item} active={subject === item} onClick={() => setSubject(item)}>
              {item === "arithmetic" ? t("Arithmetic") : t("Algebra")}
            </Filter>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["sprint", "streak", "practice"] as const).map((item) => (
            <Filter key={item} active={mode === item} onClick={() => setMode(item)}>
              {item === "sprint" ? t("Sprint") : item === "streak" ? t("Streak") : t("Practice")}
            </Filter>
          ))}
        </div>
      </section>

      <section className="forge-card overflow-hidden rounded-[var(--radius-xl)]">
        {loading ? (
          <div aria-label={t("Loading leaderboard")}>
            <div className="h-9 border-b border-border bg-accent-soft" />
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="grid min-h-18 grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"
              >
                <span className="h-5 w-3 animate-pulse rounded-full bg-warning/25" />
                <span className="space-y-2">
                  <span className="block h-4 w-28 animate-pulse rounded-full bg-border" />
                  <span className="block h-3 w-18 animate-pulse rounded-full bg-border" />
                </span>
                <span className="h-5 w-14 animate-pulse rounded-full bg-border" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-bold">{t("Leaderboard unavailable.")}</p>
            <p className="mt-1 text-sm text-muted">{t("Your local practice still works.")}</p>
          </div>
        ) : visibleEntries.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
            <Medal className="mx-auto size-10 text-warning" />
            <h2 className="font-display mt-3 text-xl font-black">{t("The podium is open")}</h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              {t("Be the first verified smith this week.")}
            </p>
          </div>
        ) : (
          <ol className="divide-y divide-border">
            {showPreview && (
              <li className="bg-accent-soft px-5 py-2 text-center text-xs font-extrabold text-accent-dark">
                Preview standings · live scores appear here after verified runs
              </li>
            )}
            {visibleEntries.map((entry) => (
              <li
                key={`${entry.rank}-${entry.displayName}`}
                className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-5 py-4"
              >
                <span
                  className={cn(
                    "font-display text-lg font-black tabular-nums",
                    entry.rank <= 3 ? "text-warning" : "text-muted",
                  )}
                >
                  {entry.rank}
                </span>
                <div>
                  <p className="font-extrabold">{entry.displayName}</p>
                  <p className="text-xs font-semibold text-muted">{entry.accuracy}% {t("Accuracy").toLowerCase()}</p>
                </div>
                <span className="font-display text-xl font-black text-accent-dark tabular-nums">
                  {entry.score}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {!isPending && !user && (
        <div className="rounded-[var(--radius-lg)] bg-accent-soft p-4 text-sm font-semibold text-accent-dark">
          {t("Guests can view the league.")}{" "}
          <Link to="/login" className="font-extrabold underline underline-offset-4">
            <Cloud className="mr-1 inline size-4" />
            {t("Sign in")}
          </Link>{" "}
          {t("to submit verified scores.")}
        </div>
      )}
    </div>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-extrabold transition-colors",
        active ? "bg-accent text-white" : "bg-bg text-muted hover:bg-accent-soft",
      )}
    >
      {children}
    </button>
  );
}
