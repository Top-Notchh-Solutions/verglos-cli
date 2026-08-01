import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TIER_CAPABILITIES,
  defaultCapabilitiesFor,
  normalizeTier,
} from "./tier-defaults.js";

test("TIER_CAPABILITIES: each higher tier is a strict superset of the one below", () => {
  const free = new Set(TIER_CAPABILITIES.free);
  const pro = new Set(TIER_CAPABILITIES.pro);
  const studio = new Set(TIER_CAPABILITIES.studio);
  const compliance = new Set(TIER_CAPABILITIES.compliance);

  for (const cap of free) assert.ok(pro.has(cap), `pro missing free cap: ${cap}`);
  for (const cap of pro) assert.ok(studio.has(cap), `studio missing pro cap: ${cap}`);
  for (const cap of studio) {
    assert.ok(compliance.has(cap), `compliance missing studio cap: ${cap}`);
  }
});

test("TIER_CAPABILITIES: mirrors the pricing-page fence exactly (regression guard)", () => {
  // If any of these strings change, they must also change on the
  // server (verglos-web/src/lib/entitlement/capabilities.ts) in the
  // same commit or offline Pro drifts from online Pro.
  const proAdds = TIER_CAPABILITIES.pro.filter(
    (c) => !TIER_CAPABILITIES.free.includes(c),
  );
  const expectedProAdds = [
    "fix",
    "ci_threshold",
    "monitor_register",
    "monitor_daily",
    "channel_email",
    "channel_slack",
    "channel_webhook",
    "rule_pack_agent_surface",
    "rule_pack_api_hardening",
    "rule_pack_deep_auth",
    "score_history_30d",
  ];
  assert.deepEqual([...proAdds].sort(), [...expectedProAdds].sort());
});

test("normalizeTier: coerces unknown strings to free", () => {
  assert.equal(normalizeTier("PRO"), "pro");
  assert.equal(normalizeTier("bogus"), "free");
  assert.equal(normalizeTier(undefined), "free");
  assert.equal(normalizeTier(null), "free");
});

test("defaultCapabilitiesFor: returns a fresh mutable array (no reference sharing)", () => {
  const a = defaultCapabilitiesFor("pro");
  const b = defaultCapabilitiesFor("pro");
  a.push("cap_not_shipped");
  assert.equal(b.includes("cap_not_shipped"), false);
});
