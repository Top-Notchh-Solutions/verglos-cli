import assert from "node:assert/strict";
import { test } from "node:test";
import { projectChangeActions } from "./change-actions.js";

test("change projection preserves deterministic diff fields and explicit deltas", () => {
  const projection = projectChangeActions({ added: ["sha256:b", "sha256:a"], fixed: ["sha256:c"], unchanged: [], identityChanged: true, coverageChanged: false, policyChanged: true });
  assert.deepEqual(projection.added, ["sha256:b", "sha256:a"]);
  assert.deepEqual(projection.deltas, { identity: true, coverage: false, policy: true });
  assert.equal("worsened" in projection, false);
  assert.equal("owner" in projection, false);
  assert.equal("remediation" in projection, false);
});

test("change projection gives a bounded no-change action", () => {
  const projection = projectChangeActions({ added: [], fixed: [], unchanged: ["sha256:a"], identityChanged: false, coverageChanged: false, policyChanged: false });
  assert.deepEqual(projection.nextActions, ["No recorded release changes require follow-up."]);
  assert.ok(Object.isFrozen(projection));
});
