import { test } from "node:test";
import assert from "node:assert/strict";
import { NEXT_CONFIG_DECL } from "./fix.js";

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
