import { test } from "node:test";
import assert from "node:assert/strict";
import { apiHardeningDetector } from "./api-hardening.js";
import type { ScannedFile } from "../walker.js";

/**
 * Fixture builder — the detector reads file contents directly, so we
 * fake the disk read by pointing `path` at a file that already exists
 * in the repo. Cleanest way: write a real tmp file per test.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after } from "node:test";

const tmpRoot = mkdtempSync(join(tmpdir(), "verglos-api-hardening-"));
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

// ── API-001: auth route + no rate limit ───────────────────────────────────

test("API-001: fires on POST /login without a rate limiter in the file", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      // ... verify credentials ...
      res.json({ ok: true });
    });
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-001");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "high");
  assert.match(hit[0]?.title ?? "", /\/login/);
});

test("API-001: does NOT fire when express-rate-limit is imported in-file", async () => {
  const files = fixture(`
    import express from 'express';
    import rateLimit from 'express-rate-limit';
    const app = express();
    const limiter = rateLimit({ windowMs: 60_000, max: 10 });
    app.post('/login', limiter, async (req, res) => {
      res.json({ ok: true });
    });
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-001");
  assert.equal(hit.length, 0);
});

test("API-001: does NOT fire on a non-auth route (/users)", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.post('/users', async (req, res) => {
      res.json({ ok: true });
    });
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-001");
  assert.equal(hit.length, 0);
});

test("API-001: fires for reset-password, verify, otp, and mfa routes", async () => {
  for (const path of ["/reset-password", "/verify", "/otp", "/mfa"]) {
    const files = fixture(`
      import express from 'express';
      const app = express();
      app.post('${path}', async (req, res) => { res.json({ ok: true }); });
    `);
    const findings = await apiHardeningDetector.run(files, tmpRoot);
    const hit = findings.filter((f) => f.rule === "API-001");
    assert.equal(hit.length, 1, `expected exactly one API-001 for ${path}, got ${hit.length}`);
  }
});

// ── API-002: unbounded body ───────────────────────────────────────────────

test("API-002: fires on express.json({ limit: Infinity })", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.use(express.json({ limit: Infinity }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "high");
});

test("API-002: fires on express.json({ limit: '100mb' })", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.use(express.json({ limit: '100mb' }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 1);
});

test("API-002: fires on Next.js route with sizeLimit '50mb'", async () => {
  const files = fixture(`
    export const config = {
      api: { bodyParser: { sizeLimit: '50mb' } },
    };
    export default function handler(req, res) { res.status(200).end(); }
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 1);
});

test("API-002: fires on Fastify bodyLimit: 0 (Fastify treats 0 as unlimited)", async () => {
  const files = fixture(`
    import Fastify from 'fastify';
    const fastify = Fastify({ bodyLimit: 0 });
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 1);
});

test("API-002: does NOT fire on a small explicit limit (1mb)", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.use(express.json({ limit: '1mb' }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 0);
});

test("API-002: does NOT fire on express.json() with no options (framework default is safe)", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.use(express.json());
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-002");
  assert.equal(hit.length, 0);
});

// ── API-004: CORS credentials + wildcard ──────────────────────────────────

test("API-004: fires on cors({ origin: '*', credentials: true })", async () => {
  const files = fixture(`
    import cors from 'cors';
    import express from 'express';
    const app = express();
    app.use(cors({ origin: '*', credentials: true }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-004");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "critical");
});

test("API-004: fires on cors({ credentials: true, origin: true }) (reflect + creds)", async () => {
  const files = fixture(`
    import cors from 'cors';
    import express from 'express';
    const app = express();
    app.use(cors({ credentials: true, origin: true }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-004");
  assert.equal(hit.length, 1);
});

test("API-004: does NOT fire on cors({ origin: 'https://app.example.com', credentials: true })", async () => {
  const files = fixture(`
    import cors from 'cors';
    import express from 'express';
    const app = express();
    app.use(cors({ origin: 'https://app.example.com', credentials: true }));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-004");
  assert.equal(hit.length, 0);
});

// ── API-005: helmet on Express ────────────────────────────────────────────

test("API-005: fires on express() app without helmet()", async () => {
  const files = fixture(`
    import express from 'express';
    const app = express();
    app.get('/', (_req, res) => res.send('hi'));
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-005");
  assert.equal(hit.length, 1);
  assert.equal(hit[0]?.severity, "medium");
});

test("API-005: does NOT fire when helmet() is applied", async () => {
  const files = fixture(`
    import express from 'express';
    import helmet from 'helmet';
    const app = express();
    app.use(helmet());
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-005");
  assert.equal(hit.length, 0);
});

test("API-005: does NOT fire in a file that never uses Express at all", async () => {
  const files = fixture(`
    export function add(a: number, b: number) { return a + b; }
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  const hit = findings.filter((f) => f.rule === "API-005");
  assert.equal(hit.length, 0);
});

// ── Domain / detector tagging regression guard ────────────────────────────

test("api-hardening: all findings carry domain D7 and detector 'api-hardening'", async () => {
  const files = fixture(`
    import express from 'express';
    import cors from 'cors';
    const app = express();
    app.use(cors({ origin: '*', credentials: true }));
    app.use(express.json({ limit: Infinity }));
    app.post('/login', async (req, res) => { res.json({ ok: true }); });
  `);
  const findings = await apiHardeningDetector.run(files, tmpRoot);
  assert.ok(findings.length >= 3);
  for (const f of findings) {
    assert.equal(f.detector, "api-hardening");
    assert.equal(f.domain, "D7");
    assert.equal(f.category, "API Hardening");
  }
});
