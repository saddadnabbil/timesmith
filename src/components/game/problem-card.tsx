import { cn } from "@/lib/utils";
import type { Feedback } from "@/lib/game/store";
import type { Problem } from "@/lib/game/types";
import { useI18n } from "@/lib/i18n";

interface ProblemCardProps {
  problem: Problem;
  input: string;
  feedback: Feedback;
  floatScore: number | null;
}

export function ProblemCard({ problem, input, feedback, floatScore }: ProblemCardProps) {
  const { t } = useI18n();
  const display = input.length > 0 ? input : "";
  const algebra = problem.factKey.startsWith("alg:");

  return (
    <div
      key={problem.id}
      className={cn(
        "paper-card relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-8 text-center sm:px-8 sm:py-10",
        feedback === "wrong" && "anim-shake",
        feedback === "correct" && "anim-pop",
      )}
    >
      <p className="font-sans text-xs font-extrabold tracking-[0.14em] text-accent-dark uppercase">
        {algebra ? t("Solve for x") : t("Forge the answer")}
      </p>
      <p
        className="font-display mt-5 text-[clamp(2.8rem,12vw,4.5rem)] leading-none font-black tracking-tight tabular-nums"
        aria-live="polite"
      >
        {problem.prompt}
      </p>
      <div className="mt-8 flex items-end justify-center gap-3">
        <span className="font-display text-3xl leading-none font-black text-ink/40">
          {algebra ? "x =" : "="}
        </span>
        <span
          className={cn(
            "font-display min-w-[3.2ch] border-b-4 pb-2 text-[clamp(2.2rem,9vw,3.2rem)] leading-none font-black tracking-tight tabular-nums",
            feedback === "wrong" ? "border-danger text-danger" : "border-ink/25 text-ink",
            feedback === "correct" && "border-success text-success",
          )}
        >
          {feedback === "wrong" ? problem.answer : display || "\u00a0"}
        </span>
      </div>
      {feedback === "wrong" && display && (
        <p className="mt-4 text-sm text-ink/50">
          {t("Almost. You entered")} <span className="font-bold tabular-nums">{display}</span>
        </p>
      )}
      {floatScore !== null && feedback === "correct" && (
        <span className="anim-float pointer-events-none absolute top-5 left-1/2 font-sans text-sm font-semibold text-success tabular-nums">
          +{floatScore}
        </span>
      )}
    </div>
  );
}
