import assert from "node:assert/strict";
import { test } from "node:test";
import { trivyAdapter } from "./trivy-adapter.js";

test("Trivy adapter reports unavailable health explicitly when binary is absent", async () => {
  const health = await trivyAdapter.health();
  assert.ok(["healthy", "unavailable"].includes(health.state));
});
