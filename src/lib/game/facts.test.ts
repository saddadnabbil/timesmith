import assert from "node:assert/strict";
import test from "node:test";
import { nextProblem } from "./facts.ts";
import type { Difficulty, DrillConfig } from "./types.ts";

for (const difficulty of ["easy", "medium", "hard"] satisfies Difficulty[]) {
  test(`algebra ${difficulty} generates positive integer solutions`, () => {
    const config: DrillConfig = {
      subject: "algebra",
      operation: "mix",
      mode: "practice",
      difficulty,
      table: null,
    };
    for (let index = 0; index < 250; index += 1) {
      const problem = nextProblem(config, {});
      assert.match(problem.factKey, /^alg:/);
      assert.match(problem.prompt, /x/);
      assert.equal(Number.isInteger(problem.answer), true);
      assert.equal(problem.answer > 0, true);
    }
  });
}
