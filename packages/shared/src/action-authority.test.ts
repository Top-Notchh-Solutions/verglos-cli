import assert from "node:assert/strict";
import { test } from "node:test";
import { AGENT_ACTIONS, AgentActionValidationError, actionAuthority, parseAgentAction } from "./action-authority.js";

test("agent action authority requires approval for every side effect", () => {
  assert.equal(actionAuthority("inspect").approvalRequired, false);
  assert.equal(actionAuthority("propose").approvalRequired, false);
  for (const action of AGENT_ACTIONS.filter((item) => !["inspect", "propose"].includes(item))) assert.equal(actionAuthority(action).approvalRequired, true);
});

test("agent action authority rejects unknown values and freezes metadata", () => {
  for (const value of [null, 42, "not-an-action"]) assert.throws(() => parseAgentAction(value), AgentActionValidationError);
  assert.equal(parseAgentAction("inspect"), "inspect");
  assert.ok(Object.isFrozen(actionAuthority("mutate")));
  assert.throws(() => (actionAuthority("mutate") as { approvalRequired: boolean }).approvalRequired = false, TypeError);
});
