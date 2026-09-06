import assert from "node:assert/strict";
import test from "node:test";
import { resolveLocale } from "./locale.ts";

test("resolveLocale selects Indonesian for Indonesian locale variants", () => {
  assert.equal(resolveLocale("id-ID"), "id");
  assert.equal(resolveLocale("id"), "id");
  assert.equal(resolveLocale("ID-id"), "id");
});

test("resolveLocale falls back to English for unsupported and missing locales", () => {
  assert.equal(resolveLocale("en-US"), "en");
  assert.equal(resolveLocale("ja-JP"), "en");
  assert.equal(resolveLocale(undefined), "en");
});
