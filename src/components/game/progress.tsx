import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { factKey, masteryOf } from "@/lib/game/facts";
import { sfxStart, unlockAudio } from "@/lib/game/audio";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";

const AXIS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function ProgressScreen() {
  const save = useGame((s) => s.save);
  const goHome = useGame((s) => s.goHome);
  const start = useGame((s) => s.start);
  const setConfig = useGame((s) => s.setConfig);

  const accuracy =
    save.totals.answered > 0
      ? Math.round((save.totals.correct / save.totals.answered) * 100)
      : 0;

  let mastered = 0;
  let weak = 0;
  let seen = 0;
  for (const a of AXIS) {
    for (const b of AXIS) {
      if (a > b) continue;
      const stat = save.facts[factKey("mul", a, b)];
      const m = masteryOf(stat);
      if (m !== "none") seen += 1;
      if (m === "mastered") mastered += 1;
      if (m === "weak") weak += 1;
    }
  }

  function drillTable(n: number) {
    setConfig({ operation: "mul", table: n, mode: "practice", difficulty: "medium" });
    unlockAudio();
    sfxStart(save.muted);
    start({ operation: "mul", table: n, mode: "practice", difficulty: "medium" });
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Back" onClick={goHome}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">Memory</p>
          <h1 className="font-display text-2xl font-medium tracking-tight">Progress</h1>
        </div>
      </header>

      <dl className="grid grid-cols-3 gap-2">
        <Tile label="Answered" value={String(save.totals.answered)} />
        <Tile label="Accuracy" value={save.totals.answered ? `${accuracy}%` : "—"} />
        <Tile label="Mastered" value={String(mastered)} />
      </dl>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-medium">Times tables</h2>
            <p className="text-sm text-muted">
              Color shows how well each product sticks. Tap a row to drill that table.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0.5 text-center">
            <caption className="sr-only">Multiplication mastery grid from 1 to 12</caption>
            <thead>
              <tr>
                <th className="w-7 text-[10px] font-medium text-subtle">×</th>
                {AXIS.map((n) => (
                  <th key={n} className="text-[10px] font-medium text-subtle tabular-nums">
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AXIS.map((row) => (
                <tr key={row}>
                  <th className="p-0">
                    <button
                      type="button"
                      onClick={() => drillTable(row)}
                      className="flex size-7 items-center justify-center rounded-[var(--radius-xs)] text-[10px] font-medium text-muted tabular-nums hover:bg-elevated hover:text-fg"
                      aria-label={`Drill the ${row} times table`}
                    >
                      {row}
                    </button>
                  </th>
                  {AXIS.map((col) => {
                    const stat = save.facts[factKey("mul", row, col)];
                    const m = masteryOf(stat);
                    const acc =
                      stat && stat.attempts > 0
                        ? Math.round((stat.correct / stat.attempts) * 100)
                        : null;
                    return (
                      <td key={col} className="p-0">
                        <span
                          title={
                            acc === null
                              ? `${row} × ${col} — not seen`
                              : `${row} × ${col} — ${acc}% of ${stat?.attempts}`
                          }
                          className={cn(
                            "block aspect-square min-h-6 rounded-[3px]",
                            m === "none" && "bg-elevated",
                            m === "weak" && "bg-danger/80",
                            m === "learning" && "bg-accent/45",
                            m === "mastered" && "bg-success",
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <Legend swatch="bg-elevated" label="Unseen" />
          <Legend swatch="bg-danger/80" label="Weak" />
          <Legend swatch="bg-accent/45" label="Learning" />
          <Legend swatch="bg-success" label="Mastered" />
        </ul>
        {weak > 0 && (
          <p className="mt-3 text-sm text-muted">
            {weak} product{weak === 1 ? "" : "s"} need more work. {seen} seen so far.
          </p>
        )}
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-elevated px-3 py-3 shadow-[var(--shadow-border)]">
      <dt className="text-[11px] tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="font-display mt-1 text-xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn("size-2.5 rounded-[2px]", swatch)} />
      {label}
    </li>
  );
}
