import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ACCEPTANCE_STORY_EXECUTION_PLAN,
  buildAcceptanceStoryCoverage,
} from "./acceptance-story-plan.mjs";

const stories = Object.keys(ACCEPTANCE_STORY_EXECUTION_PLAN).map((id) => ({
  id,
  status: id === "hunt-isolation" ? "qualification-open" : "substrate-covered",
  evidence: ["test"],
}));

test("acceptance plan covers all twelve frozen stories", () => {
  const coverage = buildAcceptanceStoryCoverage(
    stories,
    new Set([
      "cli-package-suite",
      "web-full-suite",
      "web-composed-acceptance-substrates",
    ]),
  );

  assert.equal(coverage.length, 12);
  assert.equal(coverage.every((story) => story.substrateExecuted), true);
  assert.equal(coverage.find((story) => story.id === "hunt-isolation")?.qualificationRequired, true);
  assert.equal(coverage.find((story) => story.id === "free-scan")?.qualificationRequired, false);
});

test("acceptance plan rejects a story when its required surface did not execute", () => {
  assert.throws(
    () => buildAcceptanceStoryCoverage(stories, new Set(["cli-package-suite"])),
    /missing executed surfaces:/u,
  );
});

test("acceptance plan rejects duplicate or unknown story IDs", () => {
  const duplicate = [...stories.slice(0, 11), { ...stories[0] }];
  assert.throws(
    () => buildAcceptanceStoryCoverage(duplicate, new Set(["cli-package-suite", "web-full-suite", "web-composed-acceptance-substrates"])),
    /unknown or duplicate story/u,
  );
});
