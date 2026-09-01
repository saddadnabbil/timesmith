import { cn } from "@/lib/utils";
import type { Feedback } from "@/lib/game/store";
import type { Problem } from "@/lib/game/types";

interface ProblemCardProps {
  problem: Problem;
  input: string;
  feedback: Feedback;
  floatScore: number | null;
}

export function ProblemCard({ problem, input, feedback, floatScore }: ProblemCardProps) {
  const display = input.length > 0 ? input : "";

  return (
    <div
      key={problem.id}
      className={cn(
        "paper-card relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-8 text-center sm:px-8 sm:py-10",
        feedback === "wrong" && "anim-shake",
        feedback === "correct" && "anim-pop",
      )}
    >
      <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-ink/45 uppercase">
        Find the answer
      </p>
      <p
        className="font-display mt-5 text-[clamp(2.4rem,10vw,3.6rem)] leading-none font-medium tracking-tight tabular-nums"
        aria-live="polite"
      >
        {problem.prompt}
      </p>
      <div className="mt-8 flex items-end justify-center gap-3">
        <span className="font-display text-3xl leading-none text-ink/40">=</span>
        <span
          className={cn(
            "font-display min-w-[3.2ch] border-b-2 pb-1 text-[clamp(2rem,8vw,2.8rem)] leading-none tracking-tight tabular-nums",
            feedback === "wrong" ? "border-danger text-danger" : "border-ink/25 text-ink",
            feedback === "correct" && "border-success text-success",
          )}
        >
          {feedback === "wrong" ? problem.answer : display || "\u00a0"}
        </span>
      </div>
      {feedback === "wrong" && display && (
        <p className="mt-4 text-sm text-ink/50">
          You entered <span className="tabular-nums">{display}</span>
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
