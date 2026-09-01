import { create } from "zustand";
import { bestKey, nextProblem, scoreFor } from "./facts";
import { defaultSave, loadSave, writeSave } from "./save";
import {
  DEFAULT_CONFIG,
  PRACTICE_COUNT,
  SPRINT_SECONDS,
  STREAK_LIVES,
  type DrillConfig,
  type Problem,
  type SaveData,
  type Screen,
  type SessionResult,
} from "./types";

export type Feedback = "idle" | "correct" | "wrong";

interface Session {
  config: DrillConfig;
  problem: Problem;
  startedAt: number;
  problemStartedAt: number;
  remainingMs: number;
  lives: number;
  score: number;
  combo: number;
  comboBest: number;
  correct: number;
  missed: number;
  asked: number;
  paused: boolean;
  feedback: Feedback;
  lastAnswer: number | null;
  floatScore: number | null;
  weakThisRun: Array<{ key: string; prompt: string; answer: number }>;
}

interface GameState {
  hydrated: boolean;
  screen: Screen;
  config: DrillConfig;
  save: SaveData;
  session: Session | null;
  result: SessionResult | null;
  hydrate: () => void;
  setConfig: (patch: Partial<DrillConfig>) => void;
  setMuted: (muted: boolean) => void;
  start: (override?: Partial<DrillConfig>) => void;
  submit: (value: number) => void;
  tick: (dtMs: number) => void;
  togglePause: () => void;
  finish: () => void;
  quit: () => void;
  goHome: () => void;
  goProgress: () => void;
}

function persist(save: SaveData): SaveData {
  writeSave(save);
  return save;
}

function recordFact(
  save: SaveData,
  key: string,
  correct: boolean,
  elapsedMs: number,
): SaveData {
  const prev = save.facts[key] ?? { attempts: 0, correct: 0, lastMs: 0, avgMs: 0 };
  const attempts = prev.attempts + 1;
  const nextCorrect = prev.correct + (correct ? 1 : 0);
  const avgMs = Math.round((prev.avgMs * prev.attempts + elapsedMs) / attempts);
  return {
    ...save,
    facts: {
      ...save.facts,
      [key]: { attempts, correct: nextCorrect, lastMs: elapsedMs, avgMs },
    },
    totals: {
      answered: save.totals.answered + 1,
      correct: save.totals.correct + (correct ? 1 : 0),
    },
  };
}

export const useGame = create<GameState>((set, get) => ({
  hydrated: false,
  screen: "home",
  config: DEFAULT_CONFIG,
  save: defaultSave(),
  session: null,
  result: null,

  hydrate: () => {
    if (get().hydrated) return;
    set({ save: loadSave(), hydrated: true });
  },

  setConfig: (patch) => {
    set((s) => ({ config: { ...s.config, ...patch } }));
  },

  setMuted: (muted) => {
    set((s) => ({ save: persist({ ...s.save, muted }) }));
  },

  start: (override) => {
    const config = { ...get().config, ...override };
    const problem = nextProblem(config, get().save.facts);
    const now = performance.now();
    set({
      config,
      screen: "play",
      result: null,
      session: {
        config,
        problem,
        startedAt: now,
        problemStartedAt: now,
        remainingMs: SPRINT_SECONDS * 1000,
        lives: STREAK_LIVES,
        score: 0,
        combo: 0,
        comboBest: 0,
        correct: 0,
        missed: 0,
        asked: 0,
        paused: false,
        feedback: "idle",
        lastAnswer: null,
        floatScore: null,
        weakThisRun: [],
      },
    });
  },

  submit: (value) => {
    const { session, save } = get();
    if (!session || session.paused || session.feedback !== "idle") return;
    const elapsed = Math.max(0, performance.now() - session.problemStartedAt);
    const ok = value === session.problem.answer;
    const combo = ok ? session.combo + 1 : 0;
    const gained = ok ? scoreFor(elapsed, combo) : 0;
    const nextSave = recordFact(save, session.problem.factKey, ok, elapsed);
    const weakThisRun = ok
      ? session.weakThisRun
      : [
          ...session.weakThisRun.filter((w) => w.key !== session.problem.factKey),
          {
            key: session.problem.factKey,
            prompt: session.problem.prompt,
            answer: session.problem.answer,
          },
        ];

    set({
      save: persist(nextSave),
      session: {
        ...session,
        score: session.score + gained,
        combo,
        comboBest: Math.max(session.comboBest, combo),
        correct: session.correct + (ok ? 1 : 0),
        missed: session.missed + (ok ? 0 : 1),
        asked: session.asked + 1,
        lives: ok ? session.lives : session.lives - 1,
        feedback: ok ? "correct" : "wrong",
        lastAnswer: value,
        floatScore: ok ? gained : null,
        weakThisRun,
      },
    });
  },

  tick: (dtMs) => {
    const { session } = get();
    if (!session || session.paused || session.config.mode !== "sprint") return;
    const remainingMs = session.remainingMs - dtMs;
    if (remainingMs <= 0) {
      set({ session: { ...session, remainingMs: 0 } });
      get().finish();
      return;
    }
    set({ session: { ...session, remainingMs } });
  },

  togglePause: () => {
    const { session, screen } = get();
    if (!session || screen !== "play") return;
    set({ session: { ...session, paused: !session.paused } });
  },

  finish: () => {
    const { session, save } = get();
    if (!session) return;
    const result: SessionResult = {
      config: session.config,
      score: session.score,
      correct: session.correct,
      missed: session.missed,
      comboBest: session.comboBest,
      elapsedMs: performance.now() - session.startedAt,
      weak: session.weakThisRun.slice(-8),
    };
    const key = bestKey(session.config);
    const nextBest = { ...save.best };
    if (session.config.mode === "sprint") {
      nextBest.sprint = {
        ...nextBest.sprint,
        [key]: Math.max(nextBest.sprint[key] ?? 0, session.score),
      };
    }
    if (session.config.mode === "streak") {
      nextBest.streak = {
        ...nextBest.streak,
        [key]: Math.max(nextBest.streak[key] ?? 0, session.correct),
      };
    }
    set({
      screen: "results",
      session: null,
      result,
      save: persist({ ...save, best: nextBest }),
    });
  },

  quit: () => {
    const { session } = get();
    if (session && session.asked > 0) {
      get().finish();
      return;
    }
    set({ screen: "home", session: null, result: null });
  },

  goHome: () => set({ screen: "home", session: null }),
  goProgress: () => set({ screen: "progress" }),
}));

export function advanceAfterFeedback(): void {
  const state = useGame.getState();
  const session = state.session;
  if (!session) return;

  if (session.config.mode === "streak" && session.lives <= 0) {
    state.finish();
    return;
  }
  if (session.config.mode === "practice" && session.asked >= PRACTICE_COUNT) {
    state.finish();
    return;
  }

  const problem = nextProblem(session.config, state.save.facts, session.problem.factKey);
  useGame.setState({
    session: {
      ...session,
      problem,
      problemStartedAt: performance.now(),
      feedback: "idle",
      lastAnswer: null,
      floatScore: null,
    },
  });
}
