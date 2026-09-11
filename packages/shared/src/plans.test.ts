import assert from "node:assert/strict";
import { test } from "node:test";
import { PLAN_LIMITS, PLAN_MATRIX, type PlanId } from "./plans.js";

test("shared plan contract keeps the canonical public tiers", () => {
  assert.deepEqual(Object.keys(PLAN_MATRIX), ["free", "pro", "team", "studio", "enterprise"]);
  assert.equal(PLAN_MATRIX.free.label, "Free");
  assert.equal(PLAN_MATRIX.pro.label, "Pro");
  assert.equal(PLAN_MATRIX.team.label, "Team");
  assert.equal(PLAN_MATRIX.studio.label, "Studio");
  assert.equal(PLAN_MATRIX.enterprise.price, "contact sales");
});

test("Team inherits Pro limits while Studio remains a distinct tier", () => {
  const team = PLAN_LIMITS.team;
  const pro = PLAN_LIMITS.pro;
  assert.equal(team.id, "team" satisfies PlanId);
  assert.ok(team.projects! > pro.projects!);
  assert.ok(team.seats! > pro.seats!);
  assert.equal(PLAN_LIMITS.studio.monthlyPriceUsd, 249);
});
