import assert from "node:assert/strict";
import test from "node:test";
import { AUTH_PROVIDERS } from "./providers.ts";

test("offers Google only with the broker-compatible callback provider id", () => {
  assert.deepEqual(AUTH_PROVIDERS, [
    { providerId: "google", idp: "google", label: "Google" },
  ]);
});
