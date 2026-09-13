import { test } from "node:test";
import { createApprovalReceipt, readApprovalReceipt } from "@verglos/shared";
import assert from "node:assert/strict";
import { authorizeHeaderFixTests, captureHeaderFixSnapshots, HeaderFixRollbackError, HeaderFixTestsError, NEXT_CONFIG_DECL, authorizeHeaderFix, headerFixWorkspaceTarget, planHeaderFixes, planHeaderFixTests, rescanOrRollbackHeaderFix, runApprovedHeaderFixTests, verifyOrRollbackHeaderFix } from "./fix.js";
import { applyHeaderFixes } from "./fix.js";
import { runCliFixture } from "./cli-fixture.js";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("fix approval requires mutate authority and exact planned file scope", async () => {
  const root = process.cwd();
  const otherRoot = await mkdtemp(join(tmpdir(), "verglos-fix-other-workspace-"));
  const request = { requestId: "523e4567-e89b-12d3-a456-426614174000", action: "mutate" as const, actor: "agent", target: await headerFixWorkspaceTarget(root), files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
  const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  try {
    assert.equal((await authorizeHeaderFix(receipt, ["next.config.js"], "2026-01-02T00:00:00Z", root)).allowed, true);
    assert.equal((await authorizeHeaderFix(receipt, ["next.config.js"], "2026-01-02T00:00:00Z", otherRoot)).reason, "workspace-target-mismatch");
    assert.equal((await authorizeHeaderFix(receipt, ["src/other.ts"], "2026-01-02T00:00:00Z", root)).reason, "file-scope-mismatch");
    assert.equal((await authorizeHeaderFix(receipt, [], "2026-01-02T00:00:00Z", root)).reason, "file-scope-mismatch");
    const widened = createApprovalReceipt({ ...request, files: ["next.config.js", "src/other.ts"] }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal((await authorizeHeaderFix(widened, ["next.config.js"], "2026-01-02T00:00:00Z", root)).reason, "file-scope-mismatch");
  } finally { await rm(otherRoot, { recursive: true, force: true }); }
});

test("header fix persists its approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-audit-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture", dependencies: { express: "1.0.0" } }));
    await mkdir(join(root, "src"));
    const planned = "src/verglos-security-headers.ts";
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "agent", target: await headerFixWorkspaceTarget(root), files: [planned], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await applyHeaderFixes(root, { approvalReceipt: receipt, approvalStoreRoot: join(root, "approvals"), now: "2026-01-01T00:02:00Z" }), 1);
    assert.match(await readFile(join(root, planned), "utf8"), /VERGLOS_SECURITY_HEADERS/);
    assert.equal((await readApprovalReceipt(join(root, "approvals"), receipt.requestDigest)).requestId, receipt.requestId);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("approved Next.js header patch atomically replaces its regular config", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-next-fix-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    await writeFile(join(root, "next.config.js"), "const nextConfig = {}; module.exports = nextConfig;\n");
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174055", action: "mutate", actor: "human", target: await headerFixWorkspaceTarget(root), files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await applyHeaderFixes(root, { approvalReceipt: receipt, now: "2026-01-01T00:02:00Z", quiet: true }), 1);
    assert.match(await readFile(join(root, "next.config.js"), "utf8"), /Content-Security-Policy/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
/**
 * Regression guard for the Next.js config detection in
 * `verglos fix`. The v1.8.1 regex only matched the bare JavaScript
 * shape `const nextConfig = { ... }` and silently no-op'd on the
 * TypeScript-typed shape that every `next.config.ts` template ships
 * with in Next 14+. That was CLAIM DRIFT — the pricing page says
 * "framework-aware headers" is a Pro capability, and it was failing
 * silently on the most common template.
 *
 * See verglos-cli/docs/TRUTH-AUDIT-FREE-PRO.md § "Fix #2".
 */

test("NEXT_CONFIG_DECL: matches bare `const nextConfig = {` (JS shape)", () => {
  const src = `
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;
`;
  assert.ok(NEXT_CONFIG_DECL.test(src));
});

test("NEXT_CONFIG_DECL: matches typed `const nextConfig: NextConfig = {` (TS default)", () => {
  const src = `
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
};
export default nextConfig;
`;
  assert.ok(
    NEXT_CONFIG_DECL.test(src),
    "the TypeScript-typed shape must match — this was the v1.8.1 regression",
  );
});

test("NEXT_CONFIG_DECL: matches generic type arg `const nextConfig: NextConfig<Options> = {`", () => {
  const src = `
import type { NextConfig } from "next";
type Options = { locales: string[] };
const nextConfig: NextConfig<Options> = {
  reactStrictMode: true,
};
export default nextConfig;
`;
  assert.ok(NEXT_CONFIG_DECL.test(src));
});

test("NEXT_CONFIG_DECL: matches `let nextConfig = {` (rare, still legal)", () => {
  const src = `let nextConfig = { reactStrictMode: true };`;
  assert.ok(NEXT_CONFIG_DECL.test(src));
});

test("NEXT_CONFIG_DECL: matches `satisfies NextConfig` clause", () => {
  const src = `
import type { NextConfig } from "next";
const nextConfig satisfies NextConfig = {
  reactStrictMode: true,
};
`;
  assert.ok(NEXT_CONFIG_DECL.test(src));
});

test("NEXT_CONFIG_DECL: matches with generic + preserves in replace", () => {
  const src = `const nextConfig: NextConfig<Options> = {\n  a: 1,\n};`;
  const match = src.match(NEXT_CONFIG_DECL);
  assert.ok(match, "must match");
  // The full match should include everything from the const keyword
  // through the opening brace — appending headersBlock after this
  // match keeps the type annotation intact.
  assert.ok(
    match[0].includes("NextConfig<Options>"),
    "match must preserve the generic type arg so replace() does not lose it",
  );
  assert.ok(match[0].endsWith("{"), "match must end at the opening brace");
});

test("NEXT_CONFIG_DECL: rejects unrelated `= {` on the same file", () => {
  // Make sure we do not accidentally match every object literal in
  // the file. Only lines whose LHS is `nextConfig` should hit.
  const src = `
const other = {
  reactStrictMode: true,
};
const also: SomeType = {
  foo: 1,
};
`;
  assert.equal(NEXT_CONFIG_DECL.test(src), false);
});

test("NEXT_CONFIG_DECL: does NOT match `const nextConfigured = {` (identifier boundary)", () => {
  const src = `const nextConfigured = { foo: 1 };`;
  assert.equal(
    NEXT_CONFIG_DECL.test(src),
    false,
    "identifier must be exactly `nextConfig` — no prefix-match on longer names",
  );
});

test("NEXT_CONFIG_DECL: does NOT match `const nextConfig` followed by non-object", () => {
  const src = `const nextConfig = someFactory();`;
  assert.equal(
    NEXT_CONFIG_DECL.test(src),
    false,
    "only object-literal RHS should trigger the header injection",
  );
});

test("NEXT_CONFIG_DECL: replace()-then-append produces valid patched output", () => {
  const headersBlock = "\n  async headers() { return []; },";
  const original = `import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
};
export default nextConfig;
`;
  const patched = original.replace(
    NEXT_CONFIG_DECL,
    (match) => `${match}${headersBlock}`,
  );
  assert.ok(patched.includes("NextConfig ="), "type annotation preserved");
  assert.ok(patched.includes("async headers()"), "headers block inserted");
  assert.ok(
    patched.indexOf("async headers()") > patched.indexOf("nextConfig: NextConfig ="),
    "headers block must appear AFTER the declaration, not before",
  );
  assert.ok(
    patched.indexOf("async headers()") < patched.indexOf("reactStrictMode"),
    "headers block must appear BEFORE the existing config keys, right after the `{`",
  );
});

test("fix planning identifies a bounded Next.js patch without mutating", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-plan-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    const original = "const nextConfig = {}; module.exports = nextConfig;\n";
    await writeFile(join(root, "next.config.js"), original);
    const plan = await planHeaderFixes(root);
    assert.equal(plan[0]?.action, "patch");
    assert.ok(plan[0]?.preview?.some((line) => line.includes("Content-Security-Policy")));
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), original);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fix CLI JSON dry-run is process-safe and does not mutate the project", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-process-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-fix-home-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    const original = "const nextConfig = {}; module.exports = nextConfig;\n";
    await writeFile(join(root, "next.config.js"), original);
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "selected.test.js"), "assert.ok(true);\n");
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--dry-run", "--test-file", "test/selected.test.js"], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    const output = JSON.parse(result.stdout) as { planned: readonly { action: string; diff: string }[]; testExecution: { action: string; policyEffect: string; warning: string } };
    assert.equal(output.planned[0]?.action, "patch");
    assert.match(output.planned[0]?.diff ?? "", /--- a\/next.config.js/);
    assert.match(output.planned[0]?.diff ?? "", /\+.*Content-Security-Policy/);
    assert.equal(output.testExecution.action, "execute");
    assert.match(output.testExecution.policyEffect, /network are not sandboxed/);
    assert.match(output.testExecution.warning, /normal OS filesystem\/process\/network permissions/);
    assert.equal(result.stderr, "");
    assert.deepEqual(result.files, []);
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), original);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("selected Node tests require exact execute approval and bind file bytes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-selected-tests-"));
  try {
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "security.test.js"), 'import assert from "node:assert/strict"; assert.equal(2 + 2, 4);\n');
    const plan = await planHeaderFixTests(root, ["test/security.test.js"]);
    assert.match(plan.policyEffect, /network are not sandboxed/);
    const receipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174001", action: "execute", actor: "agent", target: plan.target, files: ["test/security.test.js"], network: [], policyEffect: plan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal((await authorizeHeaderFixTests(receipt, plan, "2026-01-02T00:00:00Z", root)).allowed, true);
    assert.equal((await authorizeHeaderFixTests(receipt, { ...plan, policyEffect: "changed" }, "2026-01-02T00:00:00Z", root)).reason, "test-content-mismatch");
    assert.equal((await runApprovedHeaderFixTests(root, plan, receipt, "2026-01-02T00:00:00Z")).status, "passed");
    await writeFile(join(root, "test", "security.test.js"), "process.exitCode = 1;\n");
    await assert.rejects(() => runApprovedHeaderFixTests(root, plan, receipt, "2026-01-02T00:00:00Z"), (error: unknown) => error instanceof HeaderFixTestsError && error.reason === "changed-after-approval");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("selected test planning rejects path escape and symlink entrypoints", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-test-paths-"));
  const outside = await mkdtemp(join(tmpdir(), "verglos-fix-test-outside-"));
  try {
    await mkdir(join(root, "test"));
    await writeFile(join(outside, "outside.test.js"), "assert.ok(true);\n");
    await symlink(join(outside, "outside.test.js"), join(root, "test", "linked.test.js"));
    await assert.rejects(() => planHeaderFixTests(root, ["../outside/outside.test.js"]), /normalized relative path/);
    await assert.rejects(() => planHeaderFixTests(root, ["test/linked.test.js"]), /regular file/);
  } finally { await rm(root, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); }
});

test("selected test runner stops at its bounded output limit", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-test-output-"));
  try {
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "output.test.js"), 'process.stdout.write("x".repeat(300 * 1024));\n');
    const plan = await planHeaderFixTests(root, ["test/output.test.js"]);
    const receipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174005", action: "execute", actor: "agent", target: plan.target, files: ["test/output.test.js"], network: [], policyEffect: plan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    await assert.rejects(() => runApprovedHeaderFixTests(root, plan, receipt, "2026-01-02T00:00:00Z"), (error: unknown) => error instanceof HeaderFixTestsError && error.reason === "output-limit");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("selected test runner terminates timed-out Node test processes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-test-timeout-"));
  try {
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "hang.test.js"), "setInterval(() => {}, 1000);\n");
    const plan = await planHeaderFixTests(root, ["test/hang.test.js"]);
    const receipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174007", action: "execute", actor: "agent", target: plan.target, files: ["test/hang.test.js"], network: [], policyEffect: plan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    await assert.rejects(() => runApprovedHeaderFixTests(root, plan, receipt, "2026-01-02T00:00:00Z", { timeoutMs: 50 }), (error: unknown) => error instanceof HeaderFixTestsError && error.reason === "timed-out");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fix CLI reports a selected-test failure and restores the approved mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-test-cli-rollback-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-fix-test-cli-home-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    const original = "const nextConfig = {}; module.exports = nextConfig;\n";
    await writeFile(join(root, "next.config.js"), original);
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "failure.test.js"), "throw new Error('fixture failure');\n");
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const mutateReceipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174003", action: "mutate", actor: "agent", target: await headerFixWorkspaceTarget(root), files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const testPlan = await planHeaderFixTests(root, ["test/failure.test.js"]);
    const testReceipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174004", action: "execute", actor: "agent", target: testPlan.target, files: ["test/failure.test.js"], network: [], policyEffect: testPlan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const mutatePath = join(root, "mutate-approval.json");
    const testPath = join(root, "execute-approval.json");
    await writeFile(mutatePath, JSON.stringify(mutateReceipt));
    await writeFile(testPath, JSON.stringify(testReceipt));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--approve", "--approval-receipt", mutatePath, "--test-file", "test/failure.test.js", "--test-approval-receipt", testPath], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 78, `${result.stdout}\n${result.stderr}`);
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "FIX_TESTS_FAILED", message: "post-fix selected tests failed; mutation rolled back" });
    assert.equal(result.stderr, "");
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), original);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("failed approved selected tests roll back the applied fix", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-test-rollback-"));
  try {
    await writeFile(join(root, "next.config.js"), "original config\n");
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "failure.test.js"), "process.exitCode = 1;\n");
    const snapshots = await captureHeaderFixSnapshots(root, ["next.config.js"]);
    await writeFile(join(root, "next.config.js"), "mutated config\n");
    const testPlan = await planHeaderFixTests(root, ["test/failure.test.js"]);
    const receipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174002", action: "execute", actor: "agent", target: testPlan.target, files: ["test/failure.test.js"], network: [], policyEffect: testPlan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    await assert.rejects(
      () => verifyOrRollbackHeaderFix(snapshots, [{ phase: "tests", run: () => runApprovedHeaderFixTests(root, testPlan, receipt, "2026-01-02T00:00:00Z") }]),
      (error: unknown) => error instanceof HeaderFixRollbackError && error.rollbackSucceeded && error.phase === "tests",
    );
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), "original config\n");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("fix CLI approved JSON mutation uses the exact receipt and reports the write", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-approved-process-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-fix-approved-home-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    await writeFile(join(root, "next.config.js"), "const nextConfig = {}; module.exports = nextConfig;\n");
    await mkdir(join(root, "test"));
    await writeFile(join(root, "test", "verification.test.js"), 'import assert from "node:assert/strict"; assert.ok(true);\n');
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174099", action: "mutate", actor: "human", target: await headerFixWorkspaceTarget(root), files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const receiptPath = join(root, "approval.json");
    await writeFile(receiptPath, JSON.stringify(receipt));
    const testPlan = await planHeaderFixTests(root, ["test/verification.test.js"]);
    const testReceipt = createApprovalReceipt({ requestId: "623e4567-e89b-12d3-a456-426614174006", action: "execute", actor: "agent", target: testPlan.target, files: ["test/verification.test.js"], network: [], policyEffect: testPlan.policyEffect, requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const testReceiptPath = join(root, "test-approval.json");
    await writeFile(testReceiptPath, JSON.stringify(testReceipt));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--approve", "--approval-receipt", receiptPath, "--test-file", "test/verification.test.js", "--test-approval-receipt", testReceiptPath, "--rescan"], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    const output = JSON.parse(result.stdout) as { fixed: number; rescanned: boolean; tests: { status: string; files: string[]; durationMs: number; outputBytes: number; outputTruncated: boolean; executionNotice: string }; planned: readonly { action: string }[] };
    assert.equal(output.fixed, 1);
    assert.equal(output.rescanned, true);
    assert.equal(output.tests.status, "passed");
    assert.deepEqual(output.tests.files, ["test/verification.test.js"]);
    assert.equal(output.tests.outputTruncated, false);
    assert.match(output.tests.executionNotice, /no sandbox was applied/);
    assert.equal(output.planned[0]?.action, "patch");
    assert.equal(result.stderr, "");
    assert.match(await readFile(join(root, "next.config.js"), "utf8"), /Content-Security-Policy/);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("fix CLI rejects a receipt approved for a different workspace before mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-wrong-workspace-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-fix-wrong-workspace-home-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    const original = "const nextConfig = {}; module.exports = nextConfig;\n";
    await writeFile(join(root, "next.config.js"), original);
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174100", action: "mutate", actor: "human", target: "workspace:/tmp/unrelated-project", files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const receiptPath = join(root, "approval.json");
    await writeFile(receiptPath, JSON.stringify(receipt));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--approve", "--approval-receipt", receiptPath], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", code: "FIX_APPROVAL_DENIED", message: "fix approval denied" });
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), original);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("failed post-fix rescan restores prior files and removes newly created fixes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-rollback-"));
  try {
    const existingPath = join(root, "next.config.js");
    const createdPath = join(root, "src", "verglos-security-headers.ts");
    const original = "const nextConfig = {}; module.exports = nextConfig;\n";
    await mkdir(join(root, "src"));
    await writeFile(existingPath, original);
    const snapshots = await captureHeaderFixSnapshots(root, ["next.config.js", "src/verglos-security-headers.ts"]);
    await writeFile(existingPath, "mutated config");
    await writeFile(createdPath, "new helper");

    await assert.rejects(
      () => rescanOrRollbackHeaderFix(snapshots, async () => { throw new Error("fixture scan failure"); }),
      (error: unknown) => error instanceof HeaderFixRollbackError && error.rollbackSucceeded,
    );
    assert.equal(await readFile(existingPath, "utf8"), original);
    await assert.rejects(() => readFile(createdPath), { code: "ENOENT" });
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("rollback replaces a raced-in symlink without changing its external target", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-rollback-failure-"));
  const outside = await mkdtemp(join(tmpdir(), "verglos-fix-rollback-outside-"));
  try {
    const path = join(root, "next.config.js");
    const outsidePath = join(outside, "outside.js");
    await writeFile(path, "original");
    await writeFile(outsidePath, "outside remains unchanged");
    const snapshots = await captureHeaderFixSnapshots(root, ["next.config.js"]);
    await rm(path);
    await symlink(outsidePath, path);

    await assert.rejects(
      () => rescanOrRollbackHeaderFix(snapshots, async () => { throw new Error("fixture scan failure"); }),
      (error: unknown) => error instanceof HeaderFixRollbackError && error.rollbackSucceeded,
    );
    assert.equal(await readFile(path, "utf8"), "original");
    assert.equal(await readFile(outsidePath, "utf8"), "outside remains unchanged");
  } finally { await rm(root, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); }
});

test("header fix does not follow a symlinked src directory outside its workspace", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-symlink-src-"));
  const outside = await mkdtemp(join(tmpdir(), "verglos-fix-symlink-outside-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { express: "5.0.0" } }));
    await symlink(outside, join(root, "src"), "dir");
    const plan = await planHeaderFixes(root);
    assert.equal(plan[0]?.file, "verglos-security-headers.ts");
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174101", action: "mutate", actor: "human", target: await headerFixWorkspaceTarget(root), files: ["verglos-security-headers.ts"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await applyHeaderFixes(root, { approvalReceipt: receipt, now: "2026-01-01T00:02:00Z", quiet: true }), 1);
    await assert.rejects(() => readFile(join(outside, "verglos-security-headers.ts")), { code: "ENOENT" });
    assert.match(await readFile(join(root, "verglos-security-headers.ts"), "utf8"), /VERGLOS_SECURITY_HEADERS/);
  } finally { await rm(root, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); }
});
