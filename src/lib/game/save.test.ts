import assert from "node:assert/strict";
import test from "node:test";
import { defaultSave, migrateSave, recordDailyPractice } from "./save.ts";

test("records one daily streak increment for a calendar day", () => {
  const first = recordDailyPractice(defaultSave(), new Date("2026-09-04T08:00:00"));
  const repeat = recordDailyPractice(first, new Date("2026-09-04T20:00:00"));

  assert.deepEqual(first.daily, {
    currentStreak: 1,
    bestStreak: 1,
    lastPracticeDate: "2026-09-04",
  });
  assert.deepEqual(repeat.daily, first.daily);
});

test("extends consecutive days and resets after a missed day", () => {
  const dayOne = recordDailyPractice(defaultSave(), new Date("2026-09-04T08:00:00"));
  const dayTwo = recordDailyPractice(dayOne, new Date("2026-09-05T08:00:00"));
  const afterGap = recordDailyPractice(dayTwo, new Date("2026-09-07T08:00:00"));

  assert.deepEqual(dayTwo.daily, {
    currentStreak: 2,
    bestStreak: 2,
    lastPracticeDate: "2026-09-05",
  });
  assert.deepEqual(afterGap.daily, {
    currentStreak: 1,
    bestStreak: 2,
    lastPracticeDate: "2026-09-07",
  });
});

test("migrates legacy browser progress into the current daily-streak shape", () => {
  const migrated = migrateSave({
    version: 2,
    facts: {},
    best: { sprint: {}, streak: {} },
    muted: false,
    profile: { id: "guest-1", name: "Ada", color: "#2FA8F8" },
    totals: { answered: 12, correct: 10 },
  });

  assert.deepEqual(migrated.daily, {
    currentStreak: 0,
    bestStreak: 0,
    lastPracticeDate: null,
  });
  assert.equal(migrated.totals.correct, 10);
});
