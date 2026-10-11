import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { ScanResult } from "@verglos/shared";
import { saveCredentials } from "./credentials.js";
import { sendAccountScanSync } from "./account-scan-sync.js";

test("account score sync uses a separate authenticated allowlisted request", async () => {
  const home = await mkdtemp(join(tmpdir(), "verglos-account-sync-home-"));
  const project = await mkdtemp(join(tmpdir(), "verglos-account-sync-project-"));
  const oldHome = process.env.HOME;
  const oldUserProfile = process.env.USERPROFILE;
  const oldFetch = globalThis.fetch;
  const requests: Array<{ url: string; headers: Headers; body: string }> = [];
  try {
    process.env.HOME = home;
    process.env.USERPROFILE = home;
    await writeFile(join(project, "package.json"), JSON.stringify({ name: "PRIVATE_PROJECT_NAME", version: "1.2.3" }));
    await saveCredentials({ apiUrl: "https://verglos.com", licenseKey: "LICENSE_SECRET_SENTINEL" });
    globalThis.fetch = async (input, init = {}) => {
      requests.push({ url: String(input), headers: new Headers(init.headers), body: String(init.body ?? "") });
      return new Response(null, { status: 200 });
    };
    const result = {
      score: { value: 81, counts: { critical: 1, high: 2, medium: 3, low: 4, info: 0 } },
      findings: [{ title: "FINDING_PRIVATE_SENTINEL", file: "/private/customer/src.ts" }],
    } as unknown as ScanResult;

    await sendAccountScanSync(result, { projectRoot: project, cliVersion: "2.0.0-alpha.1" });

    assert.equal(requests.length, 1);
    const request = requests[0]!;
    assert.equal(request.url, "https://verglos.com/api/v1/account/scan-sync");
    assert.equal(request.headers.get("authorization"), "Bearer LICENSE_SECRET_SENTINEL");
    const body = JSON.parse(request.body) as Record<string, unknown>;
    assert.deepEqual(Object.keys(body).sort(), ["cli_version", "event_id", "finding_critical", "finding_high", "project_fingerprint", "score"]);
    assert.match(String(body.project_fingerprint), /^[a-f0-9]{64}$/u);
    assert.equal(body.score, 81);
    assert.equal(JSON.stringify(request).includes("PRIVATE_PROJECT_NAME"), false);
    assert.equal(JSON.stringify(request).includes("FINDING_PRIVATE_SENTINEL"), false);
    assert.equal(JSON.stringify(request).includes("/private/customer/src.ts"), false);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldHome === undefined) delete process.env.HOME;
    else process.env.HOME = oldHome;
    if (oldUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = oldUserProfile;
    await Promise.all([rm(home, { recursive: true, force: true }), rm(project, { recursive: true, force: true })]);
  }
});
