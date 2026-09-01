import type { Difficulty, DrillConfig, FactStat, Operation, Problem } from "./types";

const OP_SYMBOL: Record<Operation, string> = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};

const ALL_OPS: Operation[] = ["add", "sub", "mul", "div"];

let nextId = 1;

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick<T>(items: T[]): T {
  return items[randInt(0, items.length - 1)]!;
}

export function opSymbol(op: Operation): string {
  return OP_SYMBOL[op];
}

export function formatPrompt(a: number, op: Operation, b: number): string {
  return `${a} ${OP_SYMBOL[op]} ${b}`;
}

/** Canonical key so 7×8 and 8×7 share a memory slot. */
export function factKey(op: Operation, a: number, b: number): string {
  if (op === "add" || op === "mul") {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return `${op}:${lo}:${hi}`;
  }
  return `${op}:${a}:${b}`;
}

export function parseFactKey(key: string): { op: Operation; a: number; b: number } | null {
  const parts = key.split(":");
  if (parts.length !== 3) return null;
  const op = parts[0] as Operation;
  const a = Number(parts[1]);
  const b = Number(parts[2]);
  if (!ALL_OPS.includes(op) || !Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { op, a, b };
}

export function promptFromKey(key: string): string {
  const parsed = parseFactKey(key);
  if (!parsed) return key;
  return formatPrompt(parsed.a, parsed.op, parsed.b);
}

export function computeAnswer(a: number, op: Operation, b: number): number {
  switch (op) {
    case "add":
      return a + b;
    case "sub":
      return a - b;
    case "mul":
      return a * b;
    case "div":
      return b === 0 ? 0 : a / b;
  }
}

interface Range {
  addMin: number;
  addMax: number;
  mulMin: number;
  mulMax: number;
}

const RANGES: Record<Difficulty, Range> = {
  easy: { addMin: 0, addMax: 10, mulMin: 1, mulMax: 10 },
  medium: { addMin: 1, addMax: 20, mulMin: 2, mulMax: 12 },
  hard: { addMin: 10, addMax: 99, mulMin: 2, mulMax: 12 },
};

function resolveOp(config: DrillConfig): Operation {
  if (config.operation !== "mix") return config.operation;
  return pick(ALL_OPS);
}

function makeProblem(a: number, op: Operation, b: number): Problem {
  const answer = computeAnswer(a, op, b);
  return {
    id: nextId++,
    a,
    b,
    op,
    answer,
    prompt: formatPrompt(a, op, b),
    factKey: factKey(op, a, b),
  };
}

function operandsFor(
  op: Operation,
  range: Range,
  table: number | null,
): { a: number; b: number } {
  if (op === "mul") {
    const focused = table ?? randInt(range.mulMin, range.mulMax);
    const other = randInt(range.mulMin, range.mulMax);
    return Math.random() < 0.5 ? { a: focused, b: other } : { a: other, b: focused };
  }

  if (op === "div") {
    const divisor = table && table > 0 ? table : randInt(range.mulMin, range.mulMax);
    const quotient = randInt(range.mulMin, range.mulMax);
    return { a: divisor * quotient, b: divisor };
  }

  if (op === "add") {
    const focused = table ?? randInt(range.addMin, range.addMax);
    const other = randInt(range.addMin, range.addMax);
    return Math.random() < 0.5 ? { a: focused, b: other } : { a: other, b: focused };
  }

  // subtraction: non-negative result
  const max = range.addMax;
  const min = range.addMin;
  let a = table ?? randInt(min, max);
  let b = randInt(min, Math.max(min, a));
  if (table !== null) {
    // Keep the focused number visible; ensure a >= b.
    if (Math.random() < 0.5) {
      a = Math.max(table, randInt(min, max));
      b = table;
    } else {
      a = table;
      b = randInt(min, table);
    }
  }
  if (a < b) {
    const t = a;
    a = b;
    b = t;
  }
  return { a, b };
}

function accuracy(stat: FactStat | undefined): number {
  if (!stat || stat.attempts === 0) return 0.5;
  return stat.correct / stat.attempts;
}

/**
 * Next problem. ~35% of the time, pull from the player's weakest facts
 * in the current drill so missed items come back.
 */
export function nextProblem(
  config: DrillConfig,
  facts: Record<string, FactStat>,
  avoidKey?: string,
): Problem {
  const range = RANGES[config.difficulty];
  const op = resolveOp(config);

  const weakPool = Object.entries(facts)
    .filter(([key, stat]) => {
      if (stat.attempts < 1) return false;
      if (accuracy(stat) >= 0.85 && stat.attempts >= 4) return false;
      const parsed = parseFactKey(key);
      if (!parsed) return false;
      if (config.operation !== "mix" && parsed.op !== config.operation) return false;
      if (config.table !== null) {
        if (parsed.a !== config.table && parsed.b !== config.table) return false;
      }
      return true;
    })
    .sort((a, b) => accuracy(a[1]) - accuracy(b[1]) || a[1].attempts - b[1].attempts)
    .slice(0, 8);

  if (weakPool.length > 0 && Math.random() < 0.35) {
    const chosen = pick(weakPool)[0];
    const parsed = parseFactKey(chosen);
    if (parsed && chosen !== avoidKey) {
      // For commutative ops, randomly flip display order.
      if ((parsed.op === "mul" || parsed.op === "add") && Math.random() < 0.5) {
        return makeProblem(parsed.b, parsed.op, parsed.a);
      }
      return makeProblem(parsed.a, parsed.op, parsed.b);
    }
  }

  for (let i = 0; i < 8; i++) {
    const { a, b } = operandsFor(op, range, config.table);
    const problem = makeProblem(a, op, b);
    if (problem.factKey !== avoidKey) return problem;
  }

  const { a, b } = operandsFor(op, range, config.table);
  return makeProblem(a, op, b);
}

export function scoreFor(elapsedMs: number, combo: number): number {
  const speed = Math.max(0, 120 - elapsedMs / 25);
  const comboMult = 1 + Math.min(8, Math.floor(combo / 3)) * 0.25;
  return Math.round((80 + speed) * comboMult);
}

export function configKey(config: DrillConfig): string {
  return `${config.operation}:${config.mode}:${config.difficulty}:${config.table ?? "all"}`;
}

export function bestKey(config: DrillConfig): string {
  return `${config.operation}:${config.difficulty}:${config.table ?? "all"}`;
}

export function masteryOf(stat: FactStat | undefined): "none" | "weak" | "learning" | "mastered" {
  if (!stat || stat.attempts === 0) return "none";
  const acc = accuracy(stat);
  if (stat.attempts >= 5 && acc >= 0.9) return "mastered";
  if (stat.attempts >= 3 && acc < 0.6) return "weak";
  return "learning";
}
