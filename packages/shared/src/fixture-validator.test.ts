import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { canonicalizeJson } from "./schema.js";
import { validateContractFixture, validateContractFixtureJson, supportedContractFixtureSchemaIds } from "./fixture-validator.js";

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), "../fixtures/contracts");

async function load(name: string): Promise<string> {
  return readFile(resolve(fixturesDir, name), "utf8");
}

test("frozen fixture catalog validates representative contract classes", async () => {
  const valid = validateContractFixtureJson(await load("failure-valid.json"));
  assert.equal(valid.valid, true);
  if (valid.valid) assert.equal(valid.canonicalJson, canonicalizeJson(JSON.parse(await load("failure-valid.json"))));

  const invalid = validateContractFixtureJson(await load("failure-invalid-exit.json"));
  assert.deepEqual(invalid, { valid: false, schemaId: "urn:verglos:schema:failure", error: "invalid-document" });

  const compatible = validateContractFixtureJson(await load("failure-backward-compatible.json"));
  assert.equal(compatible.valid, true);
});

test("fixture validator is deterministic and bounded", () => {
  const value = { schemaId: "urn:verglos:schema:failure", schemaVersion: "1.0.0", extra: true };
  assert.deepEqual(validateContractFixture(value), {
    valid: false,
    schemaId: "urn:verglos:schema:failure",
    error: "invalid-document",
  });
  assert.deepEqual(validateContractFixture({ schemaId: "urn:verglos:schema:not-real" }), {
    valid: false,
    schemaId: "urn:verglos:schema:not-real",
    error: "unsupported-schema",
  });
  assert.deepEqual(validateContractFixtureJson("{"), { valid: false, error: "malformed-json" });
  assert.equal(supportedContractFixtureSchemaIds().length, 12);
});
