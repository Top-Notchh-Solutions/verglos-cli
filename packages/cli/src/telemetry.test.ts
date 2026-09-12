import { test } from "node:test";
import assert from "node:assert/strict";
import { isTelemetryDisabled } from "./telemetry.js";

test("telemetry remains enabled for interactive scans by default", () => {
  const previous = process.env.VERGLOS_TELEMETRY;
  delete process.env.VERGLOS_TELEMETRY;
  try { assert.equal(isTelemetryDisabled(), false); }
  finally {
    if (previous === undefined) delete process.env.VERGLOS_TELEMETRY;
    else process.env.VERGLOS_TELEMETRY = previous;
  }
});

test("telemetry is opt-in for non-interactive scans", () => {
  const previous = process.env.VERGLOS_TELEMETRY;
  try {
    delete process.env.VERGLOS_TELEMETRY;
    assert.equal(isTelemetryDisabled(undefined, true), true);
    process.env.VERGLOS_TELEMETRY = "1";
    assert.equal(isTelemetryDisabled(undefined, true), false);
    process.env.VERGLOS_TELEMETRY = "0";
    assert.equal(isTelemetryDisabled(undefined, true), true);
  } finally {
    if (previous === undefined) delete process.env.VERGLOS_TELEMETRY;
    else process.env.VERGLOS_TELEMETRY = previous;
  }
});
