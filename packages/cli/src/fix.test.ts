import { test } from "node:test";
import { createApprovalReceipt, readApprovalReceipt } from "@verglos/shared";
import assert from "node:assert/strict";
import { NEXT_CONFIG_DECL, authorizeHeaderFix, planHeaderFixes } from "./fix.js";
import { applyHeaderFixes } from "./fix.js";
import { runCliFixture } from "./cli-fixture.js";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("fix approval requires mutate authority and exact planned file scope", () => {
  const request = { requestId: "523e4567-e89b-12d3-a456-426614174000", action: "mutate" as const, actor: "agent", target: "workspace:app", files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
  const receipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  assert.equal(authorizeHeaderFix(receipt, ["next.config.js"], "2026-01-02T00:00:00Z").allowed, true);
  assert.equal(authorizeHeaderFix(receipt, ["src/other.ts"], "2026-01-02T00:00:00Z").reason, "file-scope-mismatch");
});

test("header fix persists its approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-audit-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture", dependencies: { express: "1.0.0" } }));
    await mkdir(join(root, "src"));
    const planned = "src/verglos-security-headers.ts";
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174001", action: "mutate", actor: "agent", target: "workspace:app", files: [planned], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    assert.equal(await applyHeaderFixes(root, { approvalReceipt: receipt, approvalStoreRoot: join(root, "approvals"), now: "2026-01-01T00:02:00Z" }), 1);
    assert.match(await readFile(join(root, planned), "utf8"), /VERGLOS_SECURITY_HEADERS/);
    assert.equal((await readApprovalReceipt(join(root, "approvals"), receipt.requestDigest)).requestId, receipt.requestId);
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
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--dry-run"], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(JSON.parse(result.stdout).planned[0].action, "patch");
    assert.equal(result.stderr, "");
    assert.deepEqual(result.files, []);
    assert.equal(await readFile(join(root, "next.config.js"), "utf8"), original);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("fix CLI approved JSON mutation uses the exact receipt and reports the write", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-fix-approved-process-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-fix-approved-home-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { next: "15.0.0" } }));
    await writeFile(join(root, "next.config.js"), "const nextConfig = {}; module.exports = nextConfig;\n");
    await mkdir(join(home, ".verglos"), { recursive: true });
    await writeFile(join(home, ".verglos", "capabilities.json"), JSON.stringify({ plan: "pro", capabilities: ["fix"], cache_ttl_seconds: 60, simulated: false, active: true, fetchedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    const receipt = createApprovalReceipt({ requestId: "523e4567-e89b-12d3-a456-426614174099", action: "mutate", actor: "human", target: "workspace:fixture", files: ["next.config.js"], network: [], policyEffect: "security headers", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const receiptPath = join(root, "approval.json");
    await writeFile(receiptPath, JSON.stringify(receipt));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "fix", "--json", "--approve", "--approval-receipt", receiptPath], root, { env: { HOME: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_API_URL: "http://127.0.0.1:1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    const output = JSON.parse(result.stdout) as { fixed: number; planned: readonly { action: string }[] };
    assert.equal(output.fixed, 1);
    assert.equal(output.planned[0]?.action, "patch");
    assert.equal(result.stderr, "");
    assert.match(await readFile(join(root, "next.config.js"), "utf8"), /Content-Security-Policy/);
  } finally { await rm(root, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});
