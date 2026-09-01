import {
  Divide,
  Flame,
  LayoutGrid,
  Minus,
  Plus,
  Shuffle,
  Timer,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bestKey } from "@/lib/game/facts";
import { sfxStart, unlockAudio } from "@/lib/game/audio";
import { useGame } from "@/lib/game/store";
import type { Difficulty, Mode, OperationFilter } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const OPS: Array<{ id: OperationFilter; label: string; hint: string; icon: typeof Plus }> = [
  { id: "mul", label: "Multiply", hint: "Times tables", icon: X },
  { id: "add", label: "Add", hint: "Sums", icon: Plus },
  { id: "sub", label: "Subtract", hint: "Differences", icon: Minus },
  { id: "div", label: "Divide", hint: "Exact quotients", icon: Divide },
  { id: "mix", label: "Mix", hint: "All four", icon: Shuffle },
];

const MODES: Array<{ id: Mode; label: string; hint: string; icon: typeof Timer }> = [
  { id: "sprint", label: "Sprint", hint: "60 seconds", icon: Timer },
  { id: "streak", label: "Streak", hint: "3 misses and out", icon: Flame },
  { id: "practice", label: "Practice", hint: "20 problems", icon: LayoutGrid },
];

const DIFFS: Array<{ id: Difficulty; label: string; hint: string }> = [
  { id: "easy", label: "Easy", hint: "0–10" },
  { id: "medium", label: "Medium", hint: "to 12" },
  { id: "hard", label: "Hard", hint: "bigger numbers" },
];

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function HomeScreen() {
  const config = useGame((s) => s.config);
  const save = useGame((s) => s.save);
  const setConfig = useGame((s) => s.setConfig);
  const setMuted = useGame((s) => s.setMuted);
  const start = useGame((s) => s.start);
  const goProgress = useGame((s) => s.goProgress);

  const key = bestKey(config);
  const bestSprint = save.best.sprint[key] ?? 0;
  const bestStreak = save.best.streak[key] ?? 0;
  const accuracy =
    save.totals.answered > 0
      ? Math.round((save.totals.correct / save.totals.answered) * 100)
      : null;

  const showTables = config.operation === "mul" || config.operation === "div";

  function begin(override?: Parameters<typeof start>[0]) {
    unlockAudio();
    sfxStart(useGame.getState().save.muted);
    start(override);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-14">
      <header className="anim-rise flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
            Math facts
          </p>
          <h1 className="font-display mt-2 text-[2.6rem] leading-[0.95] font-medium tracking-tight">
            Timesmith
          </h1>
          <p className="mt-3 max-w-[28ch] text-sm text-muted">
            Drill the facts until they are automatic. Type the answer — speed follows accuracy.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={save.muted ? "Unmute" : "Mute"}
          onClick={() => {
            unlockAudio();
            setMuted(!save.muted);
          }}
        >
          {save.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </Button>
      </header>

      <section className="anim-rise" style={{ animationDelay: "60ms" }}>
        <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
          Operation
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
                  "flex min-h-16 flex-col items-start gap-1 rounded-[var(--radius-lg)] px-3.5 py-3 text-left transition-[background-color,box-shadow,color] duration-150",
                  op.id === "mix" && "max-sm:col-span-2",
                  on
                    ? "bg-fg text-bg"
                    : "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
                )}
              >
                <Icon className="size-4 opacity-70" strokeWidth={1.75} />
                <span className="text-sm font-medium">{op.label}</span>
                <span className={cn("text-xs", on ? "text-bg/60" : "text-muted")}>{op.hint}</span>
              </button>
            );
          })}
        </div>
      </section>

      {showTables && (
        <section className="anim-rise" style={{ animationDelay: "90ms" }}>
          <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
            Table focus
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Chip
              label="All"
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
          Mode
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
                  "flex min-h-[4.5rem] flex-col items-start gap-1 rounded-[var(--radius-lg)] px-3 py-3 text-left transition-[background-color,box-shadow,color] duration-150",
                  on
                    ? "bg-fg text-bg"
                    : "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
                )}
              >
                <Icon className="size-4 opacity-70" strokeWidth={1.75} />
                <span className="text-sm font-medium">{mode.label}</span>
                <span className={cn("text-[11px] leading-snug", on ? "text-bg/60" : "text-muted")}>
                  {mode.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="anim-rise" style={{ animationDelay: "150ms" }}>
        <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
          Range
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
                  on ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                <span className="text-sm font-medium">{d.label}</span>
                <span className={cn("text-[11px]", on ? "text-bg/55" : "text-subtle")}>
                  {d.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="anim-rise flex flex-col gap-3" style={{ animationDelay: "180ms" }}>
        <Button size="xl" className="w-full font-semibold" onClick={() => begin()}>
          Start drill
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => begin({ operation: "mix", mode: "practice", difficulty: "easy", table: null })}
        >
          Quick warm-up
        </Button>
      </div>

      <dl className="grid grid-cols-3 gap-2 border-t border-border pt-5">
        <Stat label="Answered" value={save.totals.answered ? String(save.totals.answered) : "—"} />
        <Stat label="Accuracy" value={accuracy !== null ? `${accuracy}%` : "—"} />
        <Stat
          label={config.mode === "streak" ? "Best streak" : "Best sprint"}
          value={
            config.mode === "streak"
              ? bestStreak
                ? String(bestStreak)
                : "—"
              : bestSprint
                ? String(bestSprint)
                : "—"
          }
        />
      </dl>

      <Button variant="ghost" className="self-center" onClick={goProgress}>
        View progress
      </Button>
    </div>
  );
}

function Chip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
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
