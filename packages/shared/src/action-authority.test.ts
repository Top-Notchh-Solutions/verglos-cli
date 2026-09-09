import assert from "node:assert/strict";
import { test } from "node:test";
import { AGENT_ACTIONS, actionAuthority } from "./action-authority.js";

test("agent action authority requires approval for every side effect", () => {
  assert.equal(actionAuthority("inspect").approvalRequired, false);
  assert.equal(actionAuthority("propose").approvalRequired, false);
  for (const action of AGENT_ACTIONS.filter((item) => !["inspect", "propose"].includes(item))) assert.equal(actionAuthority(action).approvalRequired, true);
});
