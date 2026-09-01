import { Button } from "@/components/ui/button";
import { sfxStart, unlockAudio } from "@/lib/game/audio";
import { bestKey } from "@/lib/game/facts";
import { useGame } from "@/lib/game/store";

const MODE_LABEL = {
  sprint: "Sprint",
  streak: "Streak",
  practice: "Practice",
};

const OP_LABEL = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
  mix: "Mixed",
};

export function ResultsScreen() {
  const result = useGame((s) => s.result);
  const save = useGame((s) => s.save);
  const start = useGame((s) => s.start);
  const goHome = useGame((s) => s.goHome);
  const goProgress = useGame((s) => s.goProgress);

  if (!result) return null;

  const drill = result;
  const total = drill.correct + drill.missed;
  const acc = total > 0 ? Math.round((drill.correct / total) * 100) : 0;
  const key = bestKey(drill.config);
  const isSprint = drill.config.mode === "sprint";
  const best = isSprint ? (save.best.sprint[key] ?? 0) : (save.best.streak[key] ?? 0);
  const headline = isSprint ? drill.score : drill.correct;
  const headlineLabel = isSprint ? "Score" : "Correct";
  const isBest = isSprint ? drill.score >= best && drill.score > 0 : drill.correct >= best && drill.correct > 0;

  function again() {
    unlockAudio();
    sfxStart(useGame.getState().save.muted);
    start(drill.config);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-5 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="anim-rise">
        <p className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
          {MODE_LABEL[drill.config.mode]} · {OP_LABEL[drill.config.operation]}
          {drill.config.table ? ` · ${drill.config.table}s` : ""}
        </p>
        <h1 className="font-display mt-3 text-5xl leading-none font-medium tracking-tight tabular-nums">
          {headline}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {headlineLabel}
          {isBest ? " · personal best" : ""}
        </p>
      </header>

      <dl className="anim-rise grid grid-cols-3 gap-3" style={{ animationDelay: "60ms" }}>
        <Tile label="Correct" value={String(drill.correct)} />
        <Tile label="Missed" value={String(drill.missed)} />
        <Tile label="Accuracy" value={`${acc}%`} />
        <Tile label="Best combo" value={String(drill.comboBest)} />
        <Tile
          label="Best ever"
          value={best ? String(best) : "—"}
        />
        <Tile
          label="Answered"
          value={String(total)}
        />
      </dl>

      {drill.weak.length > 0 && (
        <section className="anim-rise" style={{ animationDelay: "100ms" }}>
          <h2 className="text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
            Review these
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {drill.weak.map((w) => (
              <li
                key={w.key}
                className="flex items-baseline justify-between rounded-[var(--radius-md)] bg-elevated px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <span className="font-display text-lg">{w.prompt}</span>
                <span className="font-display text-lg text-accent tabular-nums">= {w.answer}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="anim-rise flex flex-col gap-2" style={{ animationDelay: "140ms" }}>
        <Button size="xl" className="w-full font-semibold" onClick={again}>
          Drill again
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={goProgress}>
          See progress
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={goHome}>
          Change drill
        </Button>
      </div>
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
