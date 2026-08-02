import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deepAuthDetector } from "./deep-auth.js";
import type { ScannedFile } from "../walker.js";

const tmpRoot = mkdtempSync(join(tmpdir(), "verglos-deep-auth-"));
after(() => rmSync(tmpRoot, { recursive: true, force: true }));

let seq = 0;
function fixture(source: string, extension = "ts"): ScannedFile[] {
  const name = `f${seq++}.${extension}`;
  const abs = join(tmpRoot, name);
  writeFileSync(abs, source, "utf8");
  return [
    {
      path: abs,
      relativePath: name,
      size: Buffer.byteLength(source),
      isAiGenerated: false,
    } as ScannedFile,
  ];
}

// ── AUTH-001: JWT alg=none ────────────────────────────────────────────────

test("AUTH-001: fires on algorithms: ['none']", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    const claims = jwt.verify(token, key, { algorithms: ['none'] });
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-001");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "critical");
});

test("AUTH-001: fires when 'none' is one of several algorithms", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    jwt.verify(t, k, { algorithms: ['RS256', 'none'] });
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-001");
  assert.equal(hit.length, 1);
});

test("AUTH-001: does NOT fire on algorithms: ['RS256']", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    jwt.verify(t, k, { algorithms: ['RS256'] });
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-001");
  assert.equal(hit.length, 0);
});

// ── AUTH-002: jwt.decode used to authenticate ─────────────────────────────

test("AUTH-002: fires on `const user = jwt.decode(token)`", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    const user = jwt.decode(token);
    if (user.role === 'admin') { /* trust it */ }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-002");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "critical");
});

test("AUTH-002: fires on `const claims = decode(t)` bare-form", async () => {
  const files = fixture(`
    import { decode } from 'jsonwebtoken';
    const claims = decode(token);
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-002");
  assert.equal(hit.length, 1);
});

test("AUTH-002: does NOT fire when the variable is not auth-shaped", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    const debug = jwt.decode(token); // pure logging, ok
    console.log('token header:', debug);
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-002");
  assert.equal(hit.length, 0);
});

// ── AUTH-003: non-timing-safe password compare ────────────────────────────

test("AUTH-003: fires on `if (password === input)`", async () => {
  const files = fixture(`
    export function check(password: string, input: string) {
      if (password === input) return true;
      return false;
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-003");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "high");
});

test("AUTH-003: does NOT fire when bcrypt.compare is used in the same file", async () => {
  const files = fixture(`
    import bcrypt from 'bcrypt';
    export async function check(password: string, hash: string) {
      if (password === '') return false; // early exit — ok, we bcrypt below
      return bcrypt.compare(password, hash);
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-003");
  assert.equal(hit.length, 0);
});

test("AUTH-003: does NOT fire when crypto.timingSafeEqual is used in the same file", async () => {
  const files = fixture(`
    import { timingSafeEqual } from 'node:crypto';
    export function check(password: Buffer, expected: Buffer) {
      if (password === expected) return true; // sloppy but hint present in file
      return timingSafeEqual(password, expected);
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-003");
  assert.equal(hit.length, 0);
});

// ── AUTH-004: session/cookie missing flags ────────────────────────────────

test("AUTH-004: fires on cookie block with none of httpOnly/secure/sameSite", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({
      secret: process.env.SESSION_SECRET!,
      cookie: {
        maxAge: 86400_000,
      },
    }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-004");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "high");
  assert.match(hit[0]?.title ?? "", /httpOnly.*secure.*sameSite/);
});

test("AUTH-004: fires with medium severity when only sameSite is missing", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({
      secret: process.env.SESSION_SECRET!,
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 86400_000,
      },
    }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-004");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "medium");
  assert.match(hit[0]?.title ?? "", /sameSite/);
  assert.doesNotMatch(hit[0]?.title ?? "", /httpOnly/);
});

test("AUTH-004: does NOT fire when all three flags are set", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({
      secret: process.env.SESSION_SECRET!,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      },
    }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-004");
  assert.equal(hit.length, 0);
});

// ── AUTH-005: MD5/SHA1 for passwords ──────────────────────────────────────

test("AUTH-005: fires on createHash('md5') near a password variable", async () => {
  const files = fixture(`
    import { createHash } from 'node:crypto';
    export function hashPassword(password: string) {
      return createHash('md5').update(password).digest('hex');
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-005");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "critical");
});

test("AUTH-005: fires on createHash('sha1') near a password variable", async () => {
  const files = fixture(`
    import { createHash } from 'node:crypto';
    const passwordHash = createHash('sha1').update(user.password).digest('hex');
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-005");
  assert.equal(hit.length, 1);
});

test("AUTH-005: does NOT fire on md5 used as a cache key (no password context)", async () => {
  const files = fixture(`
    import { createHash } from 'node:crypto';
    export function cacheKey(input: string) {
      return createHash('md5').update(input).digest('hex');
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-005");
  assert.equal(hit.length, 0);
});

// ── AUTH-006: hardcoded session secret ────────────────────────────────────

test("AUTH-006: fires on session({ secret: 'keyboard cat' })", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({ secret: 'keyboard cat', resave: false }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-006");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "critical");
  assert.match(hit[0]?.title ?? "", /tutorial/i);
});

test("AUTH-006: fires on any other hardcoded literal (high severity)", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({ secret: 'my-project-specific-secret-2024', resave: false }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-006");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "high");
});

test("AUTH-006: does NOT fire when secret is read from env", async () => {
  const files = fixture(`
    import session from 'express-session';
    app.use(session({ secret: process.env.SESSION_SECRET!, resave: false }));
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "AUTH-006");
  assert.equal(hit.length, 0);
});

// ── Regression: domain / detector tagging ─────────────────────────────────

test("deep-auth: all findings carry detector 'deep-auth'", async () => {
  const files = fixture(`
    import jwt from 'jsonwebtoken';
    import session from 'express-session';
    import { createHash } from 'node:crypto';
    const user = jwt.decode(token);
    app.use(session({ secret: 'keyboard cat', cookie: {} }));
    export function hashPassword(password: string) {
      return createHash('md5').update(password).digest('hex');
    }
  `);
  const findings = await deepAuthDetector.run(files, tmpRoot);
  assert.ok(findings.length >= 3);
  for (const f of findings) {
    assert.equal(f.detector, "deep-auth");
    assert.ok(f.domain === "D2" || f.domain === "D4");
  }
});
