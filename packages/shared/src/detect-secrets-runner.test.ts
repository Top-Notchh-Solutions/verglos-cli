import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { probeDetectSecrets } from "./detect-secrets-runner.js";
test("detect-secrets runner requires explicit executable and never installs", async () => { const result = await probeDetectSecrets("detect-secrets"); assert.equal(result.status, "unsupported"); assert.match(result.limitation ?? "", /absolute/); });
test("detect-secrets runner rejects unsafe executable paths", async () => { const result = await probeDetectSecrets("/tmp/\u0000runner"); assert.equal(result.status, "unsupported"); });
test("detect-secrets runner accepts an absolute path using native platform syntax", async () => { const executable = join(tmpdir(), "missing-verglos-detect-secrets"); const result = await probeDetectSecrets(executable); assert.equal(result.executable, executable); assert.equal(result.status, "unsupported"); assert.match(result.limitation ?? "", /unavailable/); });
