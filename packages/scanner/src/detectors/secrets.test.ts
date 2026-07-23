import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { secretsDetector } from "./secrets.js";
import { walkProject } from "../walker.js";
import { mergeConfig } from "@verglos/shared";

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, "../../fixtures/nextjs-noise-suppression");

test("secrets detector: golden-file — Next.js noise suppression", async () => {
  const config = mergeConfig({});
  const files = await walkProject(fixtureRoot, config);
  const findings = await secretsDetector.run(files, fixtureRoot);

  const byIssuer = findings.map((f) => `${f.title} @ ${f.file}`).sort();

  assert.ok(
    findings.some((f) => f.title === "Exposed secret: AWS Access Key"),
    `expected AWS Access Key finding, got: ${JSON.stringify(byIssuer, null, 2)}`,
  );
  assert.ok(
    findings.some((f) => f.title === "Exposed secret: Anthropic API Key"),
    `expected Anthropic API Key finding, got: ${JSON.stringify(byIssuer, null, 2)}`,
  );
  assert.ok(
    findings.some(
      (f) =>
        f.title === "[Placeholder] Exposed secret: AWS Access Key" &&
        f.context === "placeholder",
    ),
    `expected AWS EXAMPLE placeholder finding, got: ${JSON.stringify(byIssuer, null, 2)}`,
  );

  for (const f of findings) {
    assert.notEqual(
      f.file,
      "package-lock.json",
      `package-lock.json integrity hashes must not be flagged (got ${f.title})`,
    );
    assert.notEqual(
      f.title,
      "High-entropy string (possible secret)",
      `entropy pass should not fire in fixture — hits are false positives (got ${f.file}:${f.line})`,
    );
  }

  const clerkPk = findings.find((f) =>
    (f.snippet ?? "").includes("pk_test_"),
  );
  assert.equal(
    clerkPk,
    undefined,
    "Clerk pk_test_* publishable keys are public — must not be flagged",
  );
});
