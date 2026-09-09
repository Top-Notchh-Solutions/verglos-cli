import assert from "node:assert/strict";
import { test } from "node:test";
import { planInspect } from "./inspect-plan.js";

test("inspect planning is deterministic and execution-free", () => {
  const plan = planInspect({ targetKind: "filesystem", producers: ["trivy", "native", "sarif"] });
  assert.deepEqual(plan.steps.map((step) => step.producer), ["native", "trivy", "sarif"]);
  assert.ok(plan.steps.every((step) => step.executesTargetCode === false && step.network === "none"));
  assert.equal(planInspect({ targetKind: "filesystem", producers: ["sarif", "native", "trivy"] }).steps[0]?.producer, "native");
});

test("inspect planning rejects unsupported, duplicate, and oversized requests", () => {
  assert.throws(() => planInspect({ targetKind: "package", producers: ["native", "nope"] }), /unsupported inspect producer/);
  assert.throws(() => planInspect({ targetKind: "filesystem", producers: ["native", "native"] }), /cannot repeat/);
  assert.throws(() => planInspect({ targetKind: "filesystem", producers: ["native"], maxSteps: 0 }), /step bound/);
});
