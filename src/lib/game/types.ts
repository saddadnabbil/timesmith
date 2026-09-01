export type Operation = "add" | "sub" | "mul" | "div";
export type OperationFilter = Operation | "mix";
export type Mode = "sprint" | "streak" | "practice";
export type Difficulty = "easy" | "medium" | "hard";
export type Screen = "home" | "play" | "results" | "progress";

export interface DrillConfig {
  operation: OperationFilter;
  mode: Mode;
  difficulty: Difficulty;
  /** When set, one operand is always this number (classic times-table drill). */
  table: number | null;
}

export interface Problem {
  id: number;
  a: number;
  b: number;
  op: Operation;
  answer: number;
  prompt: string;
  factKey: string;
}

export interface FactStat {
  attempts: number;
  correct: number;
  lastMs: number;
  avgMs: number;
}

export interface SessionResult {
  config: DrillConfig;
  score: number;
  correct: number;
  missed: number;
  comboBest: number;
  elapsedMs: number;
  weak: Array<{ key: string; prompt: string; answer: number }>;
}

export interface SaveData {
  version: number;
  facts: Record<string, FactStat>;
  best: {
    sprint: Record<string, number>;
    streak: Record<string, number>;
  };
  muted: boolean;
  totals: {
    answered: number;
    correct: number;
  };
}

export const DEFAULT_CONFIG: DrillConfig = {
  operation: "mul",
  mode: "sprint",
  difficulty: "medium",
  table: null,
};

export const SPRINT_SECONDS = 60;
export const STREAK_LIVES = 3;
export const PRACTICE_COUNT = 20;
export const SAVE_VERSION = 1;
