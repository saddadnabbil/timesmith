import { useEffect, useRef, useState } from "react";
import {
  Divide,
  Flame,
  LayoutGrid,
  Minus,
  Plus,
  Shuffle,
  Sigma,
  Timer,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProfileCard } from "@/components/game/profile-card";
import { TimesmithMark } from "@/components/timesmith-mark";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { localDateKey } from "@/lib/game/save";
import { sfxStart, unlockAudio } from "@/lib/game/audio";
import { useGame } from "@/lib/game/store";
import type { Difficulty, Mode, OperationFilter } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { useI18n, type Message } from "@/lib/i18n";

const OPS: Array<{ id: OperationFilter; label: Message; hint: Message; icon: typeof Plus }> = [
  { id: "mul", label: "Multiply", hint: "Times tables", icon: X },
  { id: "add", label: "Add", hint: "Sums", icon: Plus },
  { id: "sub", label: "Subtract", hint: "Differences", icon: Minus },
  { id: "div", label: "Divide", hint: "Exact quotients", icon: Divide },
  { id: "mix", label: "Mix", hint: "All four", icon: Shuffle },
];

const MODES: Array<{ id: Mode; label: Message; hint: Message; icon: typeof Timer }> = [
  { id: "sprint", label: "Sprint", hint: "60 seconds", icon: Timer },
  { id: "streak", label: "Streak", hint: "3 misses and out", icon: Flame },
  { id: "practice", label: "Practice", hint: "20 problems", icon: LayoutGrid },
];

const DIFFS: Array<{ id: Difficulty; label: Message; hint: Message }> = [
  { id: "easy", label: "Easy", hint: "0–10" },
  { id: "medium", label: "Medium", hint: "to 12" },
  { id: "hard", label: "Hard", hint: "bigger numbers" },
];

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function HomeScreen({
  view = "home",
  onLeaderboard,
  onBeginPractice,
}: {
  view?: "home" | "practice";
  onLeaderboard?: () => void;
  onBeginPractice?: () => void;
}) {
  const { t } = useI18n();
  const config = useGame((s) => s.config);
  const save = useGame((s) => s.save);
  const { user } = useCurrentUserState();
  const setConfig = useGame((s) => s.setConfig);
  const setMuted = useGame((s) => s.setMuted);
  const start = useGame((s) => s.start);
  const goProgress = useGame((s) => s.goProgress);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileTriggerRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  const accuracy =
    save.totals.answered > 0
      ? Math.round((save.totals.correct / save.totals.answered) * 100)
      : null;
  const practicedToday = save.daily.lastPracticeDate === localDateKey();
  const dailyProgress = Math.min(save.daily.currentStreak, 7) / 7;

  const showTables = config.operation === "mul" || config.operation === "div";

  function begin(override?: Parameters<typeof start>[0]) {
    onBeginPractice?.();
    unlockAudio();
    sfxStart(useGame.getState().save.muted);
    start(override);
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-8 px-5 pt-6 pb-8 sm:px-8 sm:pt-8",
        view === "practice" ? "max-w-2xl" : "max-w-5xl",
      )}
    >
      <header className="anim-rise flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TimesmithMark className="size-11" />
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-accent-dark uppercase">
              <span className="sm:hidden">{view === "home" ? t("Daily forge") : t("Build a drill")}</span>
              <span className="max-sm:hidden">
                {view === "home" ? t("Daily forge") : t("Build a drill")}
              </span>
            </p>
            <h1 className="font-display text-2xl leading-none font-black tracking-tight">
              <span className="sm:hidden">{view === "home" ? "Timesmith" : t("Practice")}</span>
              <span className="max-sm:hidden">{view === "home" ? "Timesmith" : t("Practice")}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={save.muted ? t("Unmute") : t("Mute")}
            onClick={() => {
              unlockAudio();
              setMuted(!save.muted);
            }}
          >
            {save.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
          <button
            ref={profileTriggerRef}
            type="button"
            aria-label={`${t("Open profile")}: ${save.profile.name}`}
            aria-haspopup="dialog"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(true)}
            className="flex size-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-white font-display text-lg font-black text-white transition-transform active:scale-[0.96]"
            style={user?.profileImageUrl ? undefined : { backgroundColor: save.profile.color }}
          >
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="size-full object-cover" />
            ) : (
              save.profile.name.charAt(0).toUpperCase()
            )}
          </button>
        </div>
      </header>

      <section
        className={cn(
          "hero-forge anim-rise forge-card relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] p-6 sm:grid sm:min-h-64 sm:grid-cols-[1.15fr_0.85fr] sm:p-8",
          view === "practice" && "!hidden",
        )}
        style={{ animationDelay: "40ms" }}
      >
        <span aria-hidden="true" className="hero-spark hero-spark-one" />
        <span aria-hidden="true" className="hero-spark hero-spark-two" />
        <span aria-hidden="true" className="hero-spark hero-spark-three" />
        <div className="relative z-10 flex flex-col items-start justify-start sm:justify-center">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold text-accent-dark">
            {t("2 minute warm-up")}
          </span>
          <h2 className="font-display mt-4 max-w-md text-3xl leading-[1.05] font-black sm:text-4xl">
            {t("Forge faster math, one answer at a time.")}
          </h2>
          <p className="mt-3 max-w-[42ch] text-sm font-semibold text-muted sm:text-base">
            {t("Pip has a fresh gear ready. Build accuracy first—speed will follow.")}
          </p>
          <Button
            size="lg"
            className="mt-6 px-7"
            data-tour-target="quick-start"
            onClick={() =>
              begin({
                subject: "arithmetic",
                operation: "mix",
                mode: "practice",
                difficulty: "easy",
                table: null,
              })
            }
          >
            {t("Start quick practice")}
          </Button>
        </div>
        <div className="hero-orbit pointer-events-none relative z-10 mx-auto mt-7 size-56 shrink-0 rounded-full sm:mt-0 sm:size-64">
          <img
            src="/pip-blue.png"
            alt="Pip the blue clockwork apprentice holding a newly forged gear"
            className="pip-float absolute inset-0 h-[calc(100%-12px)] w-full object-contain object-bottom drop-shadow-[0_9px_8px_rgb(38_50_56_/_0.12)]"
          />
        </div>
      </section>

      <div className="grid gap-8">
        <div className={cn("flex flex-col gap-8", view === "home" && "hidden")}>
          <section className="anim-rise" style={{ animationDelay: "70ms" }}>
            <p className="mb-3 text-xs font-extrabold tracking-[0.12em] text-muted uppercase">
              {t("Subject")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <SubjectButton
                label={t("Arithmetic")}
                active={config.subject === "arithmetic"}
                icon={LayoutGrid}
                onClick={() => setConfig({ subject: "arithmetic" })}
              />
              <SubjectButton
                label={t("Algebra")}
                active={config.subject === "algebra"}
                icon={Sigma}
                onClick={() => setConfig({ subject: "algebra", table: null })}
              />
            </div>
          </section>

          {config.subject === "arithmetic" && (
            <section className="anim-rise" style={{ animationDelay: "80ms" }}>
              <p className="mb-3 text-xs font-extrabold tracking-[0.12em] text-muted uppercase">
                {t("Operation")}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {OPS.map((op) => {
                  const Icon = op.icon;
                  const on = config.operation === op.id;
                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() =>
                        setConfig({
                          operation: op.id,
                          table: op.id === "mul" || op.id === "div" ? config.table : null,
                        })
                      }
                      className={cn(
                        "forge-chip flex min-h-20 flex-col items-start gap-1 rounded-[var(--radius-lg)] px-4 py-3 text-left font-bold transition-[transform,background-color,box-shadow,color] duration-150 active:translate-y-[3px]",
                        op.id === "mix" && "max-sm:col-span-2",
                        on
                          ? "bg-accent text-white shadow-[0_3px_0_var(--color-accent-dark)]"
                          : "bg-elevated text-fg hover:bg-accent-soft hover:text-accent-dark",
                      )}
                    >
                      <Icon className="size-4 opacity-70" strokeWidth={1.75} />
                      <span className="text-sm font-medium">{t(op.label)}</span>
                      <span className={cn("text-xs", on ? "text-white/75" : "text-muted")}>
                        {t(op.hint)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {config.subject === "arithmetic" && showTables && (
            <section className="anim-rise" style={{ animationDelay: "90ms" }}>
              <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
                {t("Table focus")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Chip
                  label={t("All")}
                  on={config.table === null}
                  onClick={() => setConfig({ table: null })}
                />
                {TABLES.map((n) => (
                  <Chip
                    key={n}
                    label={String(n)}
                    on={config.table === n}
                    onClick={() => setConfig({ table: n })}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="anim-rise" style={{ animationDelay: "120ms" }}>
            <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
              {t("Mode")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const on = config.mode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setConfig({ mode: mode.id })}
                    className={cn(
                      "forge-chip flex min-h-[4.5rem] flex-col items-start gap-1 rounded-[var(--radius-lg)] px-3 py-3 text-left transition-[transform,background-color,box-shadow,color] duration-150 active:translate-y-[3px]",
                      on
                        ? "bg-accent text-white shadow-[0_3px_0_var(--color-accent-dark)]"
                        : "bg-elevated text-fg hover:bg-accent-soft hover:text-accent-dark",
                    )}
                  >
                    <Icon className="size-4 opacity-70" strokeWidth={1.75} />
                    <span className="text-sm font-medium">{t(mode.label)}</span>
                    <span
                      className={cn(
                        "text-[11px] leading-snug",
                        on ? "text-white/75" : "text-muted",
                      )}
                    >
                      {t(mode.hint)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="anim-rise" style={{ animationDelay: "150ms" }}>
            <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
              {t("Range")}
            </p>
            <div className="flex rounded-[var(--radius-lg)] bg-elevated p-1 shadow-[var(--shadow-border)]">
              {DIFFS.map((d) => {
                const on = config.difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setConfig({ difficulty: d.id })}
                    className={cn(
                      "flex min-h-11 flex-1 flex-col items-center justify-center rounded-[calc(var(--radius-lg)-4px)] px-2 py-1.5 transition-[background-color,color] duration-150",
                      on
                        ? "bg-accent text-white shadow-[0_2px_0_var(--color-accent-dark)]"
                        : "text-muted hover:bg-accent-soft hover:text-accent-dark",
                    )}
                  >
                    <span className="text-sm font-medium">{t(d.label)}</span>
                    <span className={cn("text-[11px]", on ? "text-white/70" : "text-subtle")}>
                      {t(d.hint)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="anim-rise flex flex-col gap-3" style={{ animationDelay: "180ms" }}>
            <Button
              size="xl"
              className="w-full font-semibold"
              data-tour-target="start-drill"
              onClick={() => begin()}
            >
              {t("Start drill")}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() =>
                begin({
                  subject: "arithmetic",
                  operation: "mix",
                  mode: "practice",
                  difficulty: "easy",
                  table: null,
                })
              }
            >
              {t("Quick warm-up")}
            </Button>
          </div>
        </div>

        <aside className={cn("flex flex-col gap-4", view === "practice" && "hidden")}>
          <div className="forge-card rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-warning/20 text-warning">
                <Flame className="size-6 fill-current" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-muted uppercase">{t("Daily streak")}</p>
                <p className="font-display text-2xl font-black tabular-nums">
                  {localeDayCount(save.daily.currentStreak, t("Daily streak"))}
                </p>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-warning transition-[width] duration-300"
                style={{ width: `${dailyProgress * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-muted">
              {practicedToday
                ? t("Practiced today")
                : t("Finish one answer today to light your streak.")}
            </p>
          </div>

          <dl className="forge-card grid grid-cols-3 gap-2 rounded-[var(--radius-xl)] p-4">
            <Stat
              label={t("Answered")}
              value={save.totals.answered ? String(save.totals.answered) : "—"}
            />
            <Stat label={t("Accuracy")} value={accuracy !== null ? `${accuracy}%` : "—"} />
            <Stat
              label={t("Best streak")}
              value={save.daily.bestStreak ? `${save.daily.bestStreak}d` : "—"}
            />
          </dl>

          <Button variant="ghost" className="self-center" onClick={goProgress}>
            {t("View progress")}
          </Button>
          {onLeaderboard && (
            <Button variant="secondary" className="w-full" onClick={onLeaderboard}>
              {t("View leaderboard")}
            </Button>
          )}
        </aside>
      </div>

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-fg/35 pt-16 sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProfileOpen(false);
              profileTriggerRef.current?.focus();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
            className="anim-pop relative w-full bg-bg px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl max-sm:rounded-t-[var(--radius-xl)] sm:max-w-sm sm:rounded-[var(--radius-xl)] sm:p-7"
          >
            <span className="mx-auto mb-5 block h-1.5 w-10 rounded-full bg-border sm:hidden" />
            <h2 id="profile-dialog-title" className="sr-only">
              {t("Open profile")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              aria-label={t("Close profile")}
              onClick={() => {
                setProfileOpen(false);
                profileTriggerRef.current?.focus();
              }}
            >
              <X className="size-5" />
            </Button>
            <ProfileCard />
            <nav
              aria-label={t("Legal")}
              className="mt-6 flex items-center justify-center gap-5 border-t border-border pt-4 text-xs font-bold text-muted"
            >
              <a href="/privacy" className="hover:text-accent-dark">
                {t("Privacy Policy")}
              </a>
              <a href="/terms" className="hover:text-accent-dark">
                {t("Terms")}
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

function localeDayCount(value: number, translatedLabel: string) {
  return translatedLabel === "Rangkaian harian" ? `${value} hari` : `${value} ${value === 1 ? "day" : "days"}`;
}

function SubjectButton({
  label,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: typeof LayoutGrid;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "forge-chip flex min-h-16 items-center gap-3 rounded-[var(--radius-lg)] px-4 text-left font-extrabold transition-[transform,background-color,color] active:translate-y-[3px]",
        active ? "bg-accent text-white" : "bg-elevated text-fg",
      )}
    >
      <Icon className="size-5" /> {label}
    </button>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 min-w-10 rounded-full px-3 text-sm font-medium tabular-nums transition-[background-color,color] duration-150",
        on ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="mt-1 font-display text-xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}
