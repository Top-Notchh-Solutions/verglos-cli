import assert from "node:assert/strict";
import { test } from "node:test";
import { probeDetectSecrets } from "./detect-secrets-runner.js";
test("detect-secrets runner requires explicit executable and never installs", async () => { const result = await probeDetectSecrets("detect-secrets"); assert.equal(result.status, "unsupported"); assert.match(result.limitation ?? "", /absolute/); });
test("detect-secrets runner rejects unsafe executable paths", async () => { const result = await probeDetectSecrets("/tmp/\u0000runner"); assert.equal(result.status, "unsupported"); });
