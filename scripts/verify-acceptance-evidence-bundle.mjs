#!/usr/bin/env node

import { createHash } from "node:crypto";
import { constants, closeSync, fstatSync, lstatSync, openSync, readSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const MAX_EVIDENCE_BYTES = 16 * 1024 * 1024;
const FORBIDDEN = [
  /-----BEGIN (?:RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----/u,
  /(?:RAZORPAY_KEY_SECRET|CLERK_SECRET_KEY|DATABASE_URL)\s*=/u,
  /rzp_(?:test|live)_[A-Za-z0-9]{12,}/u,
];

function assertSafePath(pathValue) {
  if (typeof pathValue !== "string" || pathValue.length === 0 || pathValue.startsWith("/") || pathValue.includes("\\") || pathValue.split("/").includes("..")) {
    throw new Error(`evidence path is unsafe: ${String(pathValue)}`);
  }
}

function readBoundedFile(absolute, pathValue) {
  let before;
  try {
    before = lstatSync(absolute);
  } catch (error) {
    throw new Error(`evidence file missing: ${pathValue}`, { cause: error });
  }
  if (!before.isFile()) throw new Error(`evidence path must be a regular file: ${pathValue}`);
  if (before.size > MAX_EVIDENCE_BYTES) throw new Error(`evidence file exceeds size limit: ${pathValue}`);

  let descriptor;
  try {
    descriptor = openSync(absolute, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const opened = fstatSync(descriptor);
    if (!opened.isFile() || opened.size > MAX_EVIDENCE_BYTES || !sameIdentity(before, opened)) {
      throw new Error(`evidence file changed or exceeds size limit while opening: ${pathValue}`);
    }
    const chunks = [];
    let total = 0;
    while (true) {
      const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, MAX_EVIDENCE_BYTES + 1 - total));
      const bytesRead = readSync(descriptor, buffer, 0, buffer.byteLength, null);
      if (bytesRead === 0) break;
      total += bytesRead;
      if (total > MAX_EVIDENCE_BYTES) throw new Error(`evidence file exceeds size limit while reading: ${pathValue}`);
      chunks.push(buffer.subarray(0, bytesRead));
    }
    const after = fstatSync(descriptor);
    if (after.size > MAX_EVIDENCE_BYTES || after.size !== total || !sameIdentity(opened, after)) {
      throw new Error(`evidence file changed or exceeds size limit while reading: ${pathValue}`);
    }
    return Buffer.concat(chunks, total);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function validateBundleShape(bundle) {
  if (!bundle || bundle.schema !== "verglos.private.acceptance-evidence-bundle.v1") {
    throw new Error("unsupported acceptance evidence bundle schema");
  }
  if (!Array.isArray(bundle.files) || bundle.files.length === 0) {
    throw new Error("acceptance evidence bundle files are invalid");
  }
  const seen = new Set();
  let previousPath = "";
  for (const entry of bundle.files) {
    assertSafePath(entry?.path);
    if (seen.has(entry.path)) throw new Error(`duplicate evidence path: ${entry.path}`);
    if (entry.path < previousPath) throw new Error("acceptance evidence bundle entries are not sorted");
    previousPath = entry.path;
    seen.add(entry.path);
    if (!/^[a-f0-9]{64}$/u.test(entry.sha256) || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0) {
      throw new Error(`invalid evidence manifest entry: ${entry.path}`);
    }
  }
}

export function verifyAcceptanceEvidenceBundle({ bundlePath, bundleRoot = root } = {}) {
  if (typeof bundlePath !== "string" || bundlePath.length === 0) throw new Error("bundlePath is required");
  const resolvedRoot = resolve(bundleRoot);
  const absoluteBundlePath = resolve(resolvedRoot, bundlePath);
  const bundle = JSON.parse(readBoundedFile(absoluteBundlePath, bundlePath).toString("utf8"));
  validateBundleShape(bundle);

  const mismatches = [];
  const secretLikePaths = [];
  for (const entry of bundle.files) {
    const absolute = resolve(resolvedRoot, entry.path);
    try {
      const bytes = readBoundedFile(absolute, entry.path);
      const actualSha256 = createHash("sha256").update(bytes).digest("hex");
      const actualText = bytes.toString("utf8");
      if (FORBIDDEN.some((pattern) => pattern.test(actualText))) secretLikePaths.push(entry.path);
      if (bytes.byteLength !== entry.bytes || actualSha256 !== entry.sha256) {
        mismatches.push({ path: entry.path, expectedBytes: entry.bytes, actualBytes: bytes.byteLength, expectedSha256: entry.sha256, actualSha256 });
      }
    } catch (error) {
      mismatches.push({ path: entry.path, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const computedManifestSha256 = `sha256:${createHash("sha256").update(JSON.stringify(bundle.files)).digest("hex")}`;
  const manifestMatches = computedManifestSha256 === bundle.manifestSha256;
  const secretScan = secretLikePaths.length === 0 ? "passed" : "failed";
  return {
    schema: bundle.schema,
    bundlePath: relative(resolvedRoot, absoluteBundlePath),
    fileCount: bundle.files.length,
    mismatchCount: mismatches.length,
    mismatches,
    manifestMatches,
    manifestSha256: bundle.manifestSha256,
    computedManifestSha256,
    secretScan,
    secretLikePaths,
    gateBoundary: bundle.gateBoundary,
    status: mismatches.length === 0 && manifestMatches && secretScan === "passed" ? "passed" : "failed",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bundlePath = process.argv[2];
  if (!bundlePath) {
    console.error("usage: node scripts/verify-acceptance-evidence-bundle.mjs <bundle.json>");
    process.exitCode = 2;
  } else {
    try {
      const report = verifyAcceptanceEvidenceBundle({ bundlePath });
      console.log(JSON.stringify(report));
      if (report.status !== "passed") process.exitCode = 1;
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
