import { SAVE_VERSION, type SaveData } from "./types";

const KEY = "timesmith.save.v1";

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    facts: {},
    best: { sprint: {}, streak: {} },
    muted: false,
    totals: { answered: 0, correct: 0 },
  };
}

function migrate(raw: unknown): SaveData {
  const base = defaultSave();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<SaveData>;
  return {
    version: SAVE_VERSION,
    facts: data.facts && typeof data.facts === "object" ? data.facts : {},
    best: {
      sprint: data.best?.sprint ?? {},
      streak: data.best?.streak ?? {},
    },
    muted: Boolean(data.muted),
    totals: {
      answered: Number(data.totals?.answered) || 0,
      correct: Number(data.totals?.correct) || 0,
    },
  };
}

export function loadSave(): SaveData {
  if (typeof window === "undefined") return defaultSave();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultSave();
  }
}

export function writeSave(save: SaveData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // private mode / quota — keep playing in memory
  }
}
