import { SAVE_VERSION, type SaveData } from "./types.ts";

const KEY = "timesmith.save.v1";

const GUEST_COLORS = ["#2FA8F8", "#147CC0", "#5ABCF7", "#356FE3", "#1D5EAB"];

export const GUEST_PROFILE_NAME = "Guest Smith";

function guestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    facts: {},
    best: { sprint: {}, streak: {} },
    muted: false,
    profile: { id: "guest", name: GUEST_PROFILE_NAME, color: GUEST_COLORS[0]! },
    totals: { answered: 0, correct: 0 },
    daily: { currentStreak: 0, bestStreak: 0, lastPracticeDate: null },
  };
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateDistance(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Number.isFinite(start) && Number.isFinite(end)
    ? Math.round((end - start) / 86_400_000)
    : 0;
}

export function recordDailyPractice(save: SaveData, date = new Date()): SaveData {
  const today = localDateKey(date);
  if (save.daily.lastPracticeDate === today) return save;

  const currentStreak =
    save.daily.lastPracticeDate && dateDistance(save.daily.lastPracticeDate, today) === 1
      ? save.daily.currentStreak + 1
      : 1;

  return {
    ...save,
    daily: {
      currentStreak,
      bestStreak: Math.max(save.daily.bestStreak, currentStreak),
      lastPracticeDate: today,
    },
  };
}

export function migrateSave(raw: unknown): SaveData {
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
    profile: {
      id: data.profile?.id && data.profile.id !== "guest" ? data.profile.id : guestId(),
      name: data.profile?.name?.trim().slice(0, 24) || GUEST_PROFILE_NAME,
      color: GUEST_COLORS.includes(data.profile?.color ?? "")
        ? data.profile!.color
        : GUEST_COLORS[Math.floor(Math.random() * GUEST_COLORS.length)]!,
    },
    totals: {
      answered: Number(data.totals?.answered) || 0,
      correct: Number(data.totals?.correct) || 0,
    },
    daily: {
      currentStreak: Math.max(0, Number(data.daily?.currentStreak) || 0),
      bestStreak: Math.max(0, Number(data.daily?.bestStreak) || 0),
      lastPracticeDate:
        typeof data.daily?.lastPracticeDate === "string" ? data.daily.lastPracticeDate : null,
    },
  };
}

export function loadSave(): SaveData {
  if (typeof window === "undefined") return defaultSave();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = defaultSave();
      fresh.profile.id = guestId();
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return migrateSave(JSON.parse(raw));
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
