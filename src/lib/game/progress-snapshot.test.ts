import assert from "node:assert/strict";
import test from "node:test";
import { validateProgressSnapshot } from "./progress-snapshot.ts";
import { defaultSave } from "./save.ts";

test("accepts the current progress schema for cloud persistence", () => {
  const save = defaultSave();
  assert.equal(validateProgressSnapshot(save), save);
});

test("rejects a stale progress schema before cloud persistence", () => {
  const stale = { ...defaultSave(), version: 2 };
  assert.throws(() => validateProgressSnapshot(stale), /Invalid progress snapshot/);
});

test("rejects a malformed current-version snapshot", () => {
  const malformed = { ...defaultSave(), totals: { answered: "7", correct: 5 } };
  assert.throws(() => validateProgressSnapshot(malformed), /Invalid progress snapshot/);
});
