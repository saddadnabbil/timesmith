import { SAVE_VERSION, type SaveData } from "./types.ts";

const MAX_SNAPSHOT_BYTES = 500_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

function isFactStat(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonNegativeNumber(value.attempts) &&
    isNonNegativeNumber(value.correct) &&
    isNonNegativeNumber(value.lastMs) &&
    isNonNegativeNumber(value.avgMs)
  );
}

function isNumberRecord(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every(isNonNegativeNumber);
}

function isProgressSave(value: unknown): value is SaveData {
  if (!isRecord(value) || value.version !== SAVE_VERSION) return false;
  if (!isRecord(value.facts) || !Object.values(value.facts).every(isFactStat)) return false;
  if (!isRecord(value.best) || !isNumberRecord(value.best.sprint) || !isNumberRecord(value.best.streak))
    return false;
  if (typeof value.muted !== "boolean") return false;
  if (
    !isRecord(value.profile) ||
    typeof value.profile.id !== "string" ||
    typeof value.profile.name !== "string" ||
    typeof value.profile.color !== "string"
  )
    return false;
  if (
    !isRecord(value.totals) ||
    !isNonNegativeNumber(value.totals.answered) ||
    !isNonNegativeNumber(value.totals.correct)
  )
    return false;
  return (
    isRecord(value.daily) &&
    isNonNegativeNumber(value.daily.currentStreak) &&
    isNonNegativeNumber(value.daily.bestStreak) &&
    (value.daily.lastPracticeDate === null || typeof value.daily.lastPracticeDate === "string")
  );
}

/**
 * The public boundary for a saved progress payload before it reaches cloud storage.
 * Keeping this pure makes browser saves and server persistence share one contract.
 */
export function validateProgressSnapshot(input: unknown): SaveData {
  if (!isProgressSave(input) || JSON.stringify(input).length > MAX_SNAPSHOT_BYTES) {
    throw new Error("Invalid progress snapshot");
  }
  return input;
}
