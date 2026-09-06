import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CloudUpload, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveCloudProgress, submitRun } from "@/lib/game/cloud";
import { sfxStart, unlockAudio } from "@/lib/game/audio";
import { bestKey } from "@/lib/game/facts";
import { useGame } from "@/lib/game/store";
import { useI18n } from "@/lib/i18n";

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
  const { locale, t } = useI18n();
  const result = useGame((s) => s.result);
  const save = useGame((s) => s.save);
  const start = useGame((s) => s.start);
  const goHome = useGame((s) => s.goHome);
  const goProgress = useGame((s) => s.goProgress);
  const runTicketId = useGame((s) => s.runTicketId);
  const { user, isPending } = useCurrentUserState();
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const autoSavedResultRef = useRef<typeof result | null>(null);

  // Auto-backup full progress once per finished drill for a signed-in smith —
  // no manual "Save" click needed. Keyed on the `result` object itself so it
  // fires exactly once per session, not on every re-render.
  useEffect(() => {
    if (!isPending && user && result && autoSavedResultRef.current !== result) {
      autoSavedResultRef.current = result;
      void saveCloudProgress({ data: useGame.getState().save }).catch(() => {});
    }
  }, [isPending, user, result]);

  if (!result) return null;

  const drill = result;
  const total = drill.correct + drill.missed;
  const acc = total > 0 ? Math.round((drill.correct / total) * 100) : 0;
  const key = bestKey(drill.config);
  const isSprint = drill.config.mode === "sprint";
  const best = isSprint ? (save.best.sprint[key] ?? 0) : (save.best.streak[key] ?? 0);
  const headline = isSprint ? drill.score : drill.correct;
  const headlineLabel = isSprint ? t("Score") : t("Correct");
  const isBest = isSprint
    ? drill.score >= best && drill.score > 0
    : drill.correct >= best && drill.correct > 0;

  function again() {
    unlockAudio();
    sfxStart(useGame.getState().save.muted);
    start(drill.config);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
      <header className="anim-rise forge-card relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
          {MODE_LABEL[drill.config.mode]} ·{" "}
          {drill.config.subject === "algebra" ? "Algebra" : OP_LABEL[drill.config.operation]}
          {drill.config.table ? ` · ${drill.config.table}s` : ""}
        </p>
        <h1 className="font-display mt-3 text-6xl leading-none font-black tracking-tight text-accent tabular-nums">
          {headline}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isBest
            ? t("New personal best — the forge is hot!")
            : `${headlineLabel} — keep the gears moving.`}
        </p>
        {save.daily.currentStreak > 0 && (
          <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-extrabold text-accent-dark">
            <Flame className="size-4 fill-current" />
            {locale === "id" ? `${save.daily.currentStreak} hari beruntun` : `${save.daily.currentStreak}-day daily streak`}
          </p>
        )}
      </header>

      <dl className="anim-rise grid grid-cols-3 gap-3" style={{ animationDelay: "60ms" }}>
        <Tile label={t("Correct")} value={String(drill.correct)} />
        <Tile label={t("Missed")} value={String(drill.missed)} />
        <Tile label={t("Accuracy")} value={`${acc}%`} />
        <Tile label={t("Best combo")} value={String(drill.comboBest)} />
        <Tile label={t("Best ever")} value={best ? String(best) : "—"} />
        <Tile label={t("Answered")} value={String(total)} />
      </dl>

      {drill.weak.length > 0 && (
        <section className="anim-rise" style={{ animationDelay: "100ms" }}>
          <h2 className="text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
            {t("Review these")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {drill.weak.map((w) => (
              <li
                key={w.key}
                className="flex items-baseline justify-between rounded-[var(--radius-lg)] bg-elevated px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <span className="font-display text-lg">{w.prompt}</span>
                <span className="font-display text-lg text-accent tabular-nums">= {w.answer}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="anim-rise flex flex-col gap-2" style={{ animationDelay: "140ms" }}>
        {!isPending && user && runTicketId && submitStatus !== "submitted" && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={submitStatus === "submitting"}
            onClick={() => {
              setSubmitStatus("submitting");
              void submitRun({
                data: {
                  displayName: save.profile.name,
                  ticketId: runTicketId,
                  subject: drill.config.subject,
                  mode: drill.config.mode,
                  score: drill.score,
                  accuracy: acc,
                  durationMs: Math.max(1000, drill.elapsedMs),
                },
              })
                .then(() => setSubmitStatus("submitted"))
                .catch(() => setSubmitStatus("failed"));
            }}
          >
            <CloudUpload className="size-4" />
            {submitStatus === "submitting" ? t("Submitting…") : t("Submit verified score")}
          </Button>
        )}
        {!isPending && !user && (
          <Link
            to="/login"
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-accent-soft px-4 text-sm font-extrabold text-accent-dark"
          >
            {t("Sign in to join the leaderboard")}
          </Link>
        )}
        {submitStatus === "submitted" && (
          <p role="status" className="text-center text-sm font-extrabold text-success">
            {t("Score added to this week's league.")}
          </p>
        )}
        {submitStatus === "failed" && (
          <p role="alert" className="text-center text-sm font-bold text-danger">
            {t("Score could not be submitted.")}
          </p>
        )}
        <Button size="xl" className="w-full font-semibold" onClick={again}>
          {t("Drill again")}
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={goProgress}>
          {t("See progress")}
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={goHome}>
          {t("Change drill")}
        </Button>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="forge-card rounded-[var(--radius-lg)] px-3 py-3">
      <dt className="text-[11px] tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="font-display mt-1 text-xl font-black tabular-nums">{value}</dd>
    </div>
  );
}
