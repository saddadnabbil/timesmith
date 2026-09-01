import { useEffect, useRef, useState } from "react";
import { Heart, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberPad } from "@/components/game/number-pad";
import { ProblemCard } from "@/components/game/problem-card";
import { resumeAudio, sfxCorrect, sfxTap, sfxTick, sfxWrong, unlockAudio } from "@/lib/game/audio";
import { advanceAfterFeedback, useGame } from "@/lib/game/store";
import { PRACTICE_COUNT, SPRINT_SECONDS, STREAK_LIVES } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const FEEDBACK_MS = { correct: 280, wrong: 900 };

export function PlayScreen() {
  const session = useGame((s) => s.session);
  const muted = useGame((s) => s.save.muted);
  const setMuted = useGame((s) => s.setMuted);
  const submit = useGame((s) => s.submit);
  const tick = useGame((s) => s.tick);
  const togglePause = useGame((s) => s.togglePause);
  const quit = useGame((s) => s.quit);
  const [input, setInput] = useState("");
  const inputRef = useRef("");
  const lastTickSecond = useRef<number | null>(null);

  useEffect(() => {
    inputRef.current = "";
    setInput("");
  }, [session?.problem.id]);

  useEffect(() => {
    if (!session || session.feedback === "idle") return;
    const ms = FEEDBACK_MS[session.feedback];
    const t = window.setTimeout(() => {
      advanceAfterFeedback();
    }, ms);
    return () => window.clearTimeout(t);
  }, [session?.feedback, session?.problem.id]);

  useEffect(() => {
    if (!session || session.config.mode !== "sprint" || session.paused) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      tick(dt);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [session?.paused, session?.config.mode, session?.problem.id, tick]);

  useEffect(() => {
    if (!session || session.config.mode !== "sprint") return;
    const sec = Math.ceil(session.remainingMs / 1000);
    if (sec <= 5 && sec > 0 && lastTickSecond.current !== sec) {
      lastTickSecond.current = sec;
      sfxTick(muted);
    }
  }, [session?.remainingMs, session?.config.mode, muted]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") resumeAudio();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const current = useGame.getState().session;
      if (!current) return;
      if (e.key === "Escape") {
        togglePause();
        return;
      }
      if (current.paused || current.feedback !== "idle") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        appendDigit(e.key);
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause]);

  if (!session) return null;

  function appendDigit(d: string) {
    unlockAudio();
    sfxTap(useGame.getState().save.muted);
    const prev = inputRef.current;
    if (prev.length >= 4) return;
    const next = prev === "0" ? d : prev + d;
    inputRef.current = next;
    setInput(next);
  }

  function backspace() {
    const next = inputRef.current.slice(0, -1);
    inputRef.current = next;
    setInput(next);
  }

  function commit() {
    const raw = inputRef.current;
    if (!raw) return;
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    const before = useGame.getState().session;
    submit(value);
    const after = useGame.getState().session;
    if (!after || after.feedback === "idle") return;
    if (after.feedback === "correct") sfxCorrect(useGame.getState().save.muted, after.combo);
    else sfxWrong(useGame.getState().save.muted);
    if (before && after.feedback === "wrong") {
      // keep typed value visible via problem-card; input stays until next problem
    }
  }

  const locked = session.feedback !== "idle" || session.paused;
  const remainingSec = Math.max(0, Math.ceil(session.remainingMs / 1000));
  const timerPct = (session.remainingMs / (SPRINT_SECONDS * 1000)) * 100;
  const practicePct = Math.min(100, (session.asked / PRACTICE_COUNT) * 100);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Quit" onClick={quit}>
          <X className="size-5" />
        </Button>
        <HudCenter
          sessionMode={session.config.mode}
          remainingSec={remainingSec}
          asked={session.asked}
          feedback={session.feedback}
        />
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={session.paused ? "Resume" : "Pause"}
            onClick={togglePause}
          >
            {session.paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              unlockAudio();
              setMuted(!muted);
            }}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
        </div>
      </header>

      {session.config.mode === "sprint" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-elevated">
          <div
            className={cn(
              "h-full rounded-full bg-accent transition-[width] duration-100",
              remainingSec <= 5 && "bg-danger",
            )}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      )}
      {session.config.mode === "practice" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-accent" style={{ width: `${practicePct}%` }} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <div>
          <p className="text-[11px] tracking-wide text-subtle uppercase">Score</p>
          <p className="font-display text-2xl leading-none font-medium tabular-nums">{session.score}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] tracking-wide text-subtle uppercase">Combo</p>
          <p
            className={cn(
              "font-display text-2xl leading-none font-medium tabular-nums",
              session.combo >= 3 && "text-accent",
            )}
          >
            {session.combo}
          </p>
        </div>
        {session.config.mode === "streak" ? (
          <div className="flex justify-end gap-1" aria-label={`${session.lives} lives`}>
            {Array.from({ length: STREAK_LIVES }, (_, i) => (
              <Heart
                key={i}
                className={cn(
                  "size-5",
                  i < session.lives ? "fill-danger text-danger" : "text-subtle",
                )}
                strokeWidth={1.75}
              />
            ))}
          </div>
        ) : (
          <div className="text-right">
            <p className="text-[11px] tracking-wide text-subtle uppercase">Hit</p>
            <p className="font-display text-2xl leading-none font-medium tabular-nums">
              {session.correct}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <ProblemCard
          problem={session.problem}
          input={input}
          feedback={session.feedback}
          floatScore={session.floatScore}
        />
      </div>

      <div className="mt-auto pt-6">
        <NumberPad
          disabled={locked}
          onDigit={appendDigit}
          onBack={backspace}
          onEnter={commit}
        />
        <p className="mt-3 hidden text-center text-xs text-subtle sm:block">
          Keyboard: digits, Enter, Backspace. Esc pauses.
        </p>
      </div>

      {session.paused && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 px-6">
          <div className="w-full max-w-sm rounded-[var(--radius-xl)] bg-elevated p-6 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl font-medium">Paused</h2>
            <p className="mt-2 text-sm text-muted">The clock is stopped. Resume when you are ready.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button size="lg" onClick={togglePause}>
                Resume
              </Button>
              <Button variant="secondary" size="lg" onClick={quit}>
                End drill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HudCenter({
  sessionMode,
  remainingSec,
  asked,
  feedback,
}: {
  sessionMode: "sprint" | "streak" | "practice";
  remainingSec: number;
  asked: number;
  feedback: "idle" | "correct" | "wrong";
}) {
  if (sessionMode === "sprint") {
    return (
      <p className="font-display text-lg font-medium tabular-nums">
        {remainingSec}s
      </p>
    );
  }
  if (sessionMode === "practice") {
    const current = feedback === "idle" ? asked + 1 : asked;
    return (
      <p className="text-sm text-muted tabular-nums">
        {Math.min(Math.max(current, 1), PRACTICE_COUNT)} / {PRACTICE_COUNT}
      </p>
    );
  }
  return <p className="text-sm text-muted">Streak</p>;
}
