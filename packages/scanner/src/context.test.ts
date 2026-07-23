import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runScan } from "./index.js";

test("scanner classifies test fixtures, placeholders, enum constants, and contextual sinks", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-context-"));
  try {
    await mkdir(join(root, "src"), { recursive: true });
    await mkdir(join(root, "__tests__"), { recursive: true });

    await writeFile(
      join(root, "src", "prod.ts"),
      [
        "const realToken = 'sk-ant-api03-abcdefghijklmnopqrstuvwxyzabcdef';",
        "const JWT_SECRET = 'JWT_SECRET';",
        "const sampleApiKey = 'sample-api-key-1234567890';",
        "const otp = Math.floor(100000 + Math.random() * 900000);",
        "const trackingId = `trk_${Math.random()}`;",
        "el.innerHTML = `<span>${IconEdit}</span>`;",
      ].join("\n"),
      "utf8",
    );

    await writeFile(
      join(root, "__tests__", "auth.spec.ts"),
      [
        "const token = 'Bearer complex.payload.token';",
        "const fixtureKey = '-----BEGIN PRIVATE KEY-----';",
        "console.log(auth.token);",
        "const otp = Math.random();",
      ].join("\n"),
      "utf8",
    );

    const result = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["secrets", "misconfig", "injection", "ai-patterns"],
      noProvenance: true,
    });

    // 2 criticals: Anthropic key (D4-001) + Math.random reaching an OTP sink
    // (AI-002 — takes precedence over misconfig's D4-003 for named sinks).
    assert.equal(result.score.counts.critical, 2);
    // 0 high in prod: misconfig's Math.random for `otp` is now delegated to
    // AI-002, so the previous "high" count on that pattern moves to critical.
    assert.equal(result.score.counts.high, 0);
    assert.equal(result.score.counts.low, 2);
    assert.equal(result.score.testFileFindings.total, 4);

    assert.ok(
      result.findings.some((f) => f.context === "enum" && f.severity === "info"),
      "enum-like secret values should be downgraded to info",
    );
    assert.ok(
      result.findings.some((f) => f.context === "placeholder" && f.severity === "info"),
      "placeholder secret values should be downgraded to info",
    );
    assert.ok(
      result.findings
        .filter((f) => f.context === "test")
        .every((f) => f.severity === "info"),
      "test file findings should be info by default",
    );

    const strict = await runScan({
      projectRoot: root,
      unlocked: true,
      detectors: ["secrets", "misconfig", "injection", "ai-patterns"],
      strict: true,
      noProvenance: true,
    });

    assert.ok(
      strict.score.value < result.score.value,
      "--strict should include non-placeholder test findings in the score",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
