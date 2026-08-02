import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { isMetadataKeyLine } from "../context.js";
import type { Detector } from "./types.js";

/**
 * Deep-auth detector (D2/D3/D4 — Pro tier `rule_pack_deep_auth`).
 *
 * Sits BENEATH the Free tier's auth-adjacent detectors:
 *   - AI-002 (ai-patterns) catches Math.random for tokens/OTPs.
 *   - AI-003 catches IDOR / lookup-by-id without ownership check.
 *   - AI-010 catches mutating routes with no authz check.
 *   - D4-003 (misconfig) catches Math.random in a security context.
 *
 * This pack owns the "the auth code compiles and passes tests but the
 * cryptography is wrong" surface — the class of bugs AI-generated
 * auth scaffolds ship regularly because the tutorial examples they
 * learned from also ship them.
 *
 * Rules shipped, all mapped to D2 (Auth & session) except AUTH-005
 * (cryptography):
 *
 *   AUTH-001  jwt.verify accepts `algorithms: [...'none'...]`
 *   AUTH-002  jwt.decode used as if it verified — no signature check
 *   AUTH-003  Password comparison with === / == (non-timing-safe)
 *   AUTH-004  Session/cookie missing httpOnly, secure, or sameSite
 *   AUTH-005  MD5 or SHA1 used as a password hash (D4)
 *   AUTH-006  session({ secret: 'hardcoded literal' })
 */

// ── AUTH-001: jwt algorithms includes 'none' ──────────────────────────────

const JWT_ALG_NONE = /algorithms\s*:\s*\[[^\]]*['"`]none['"`][^\]]*\]/i;

// ── AUTH-002: jwt.decode used to authenticate ─────────────────────────────

/**
 * `jwt.decode(token)` returns claims WITHOUT verifying the signature.
 * Legitimate uses exist (peeking at the payload before verify), but
 * assigning the result to a variable named like `user` / `claims` /
 * `payload` and then using it to authorize a request is a well-known
 * catastrophic pattern.
 */
const JWT_DECODE_AS_AUTH =
  /\b(?:const|let|var)\s+(?:user|claims|payload|session|principal|auth|identity)\b[^=]*=\s*(?:jwt|jsonwebtoken)?\.?decode\s*\(/i;

// ── AUTH-003: non-timing-safe password compare ────────────────────────────

/**
 * A === or == comparing anything named like a password/hash/token to
 * another value, in a file that does NOT import bcrypt / argon2 /
 * timingSafeEqual. Deliberately conservative: we require the
 * password-shaped variable on either side of the comparator.
 */
const PWD_STRICT_EQ =
  /\b(password|passwd|pwd|hash|passHash|passwordHash|storedHash|passwordDigest)\b\s*===?\s*\S|\S\s*===?\s*\b(password|passwd|pwd|hash|passHash|passwordHash|storedHash|passwordDigest)\b/i;

const TIMING_SAFE_HINT =
  /bcrypt|argon2|scrypt\.timingSafeEqual|crypto\.timingSafeEqual|timingSafeEqual/;

// ── AUTH-004: session/cookie missing flags ────────────────────────────────

/**
 * We only look at explicit `cookie: { ... }` blocks passed to
 * express-session / cookie-session / cookie-parser / next-auth. If any
 * of httpOnly / secure / sameSite is missing from a paying-attention
 * config, that is worth surfacing.
 */
const COOKIE_BLOCK_START = /\bcookie\s*:\s*\{/;

// ── AUTH-005: weak hash for passwords ─────────────────────────────────────

/**
 * createHash('md5' | 'sha1') USED inside a function/context that looks
 * password-ish. Whole-line match against createHash + one of the two
 * weak algos + a password-shaped token nearby.
 */
const WEAK_HASH_LINE =
  /createHash\s*\(\s*['"`](md5|sha1)['"`]\s*\)/i;

const PWD_NEAR_HASH =
  /\b(password|passwd|pwd|user|account|login|hashPassword|hashPw|hashPwd|pwHash|passwordHash)\b/i;

// ── AUTH-006: hardcoded session secret ────────────────────────────────────

const SESSION_SECRET_LITERAL =
  /\bsession\s*\(\s*\{[^)]*\bsecret\s*:\s*['"`]([^'"`$][^'"`]{3,})['"`]/i;

const KNOWN_TUTORIAL_SECRETS = new Set([
  "keyboard cat",
  "changeme",
  "secret",
  "supersecret",
  "your-secret-key",
  "shhhhh",
  "top-secret",
]);

function containsAny(content: string, needles: RegExp[]): boolean {
  return needles.some((rx) => rx.test(content));
}

export const deepAuthDetector: Detector = {
  id: "deep-auth",
  async run(files: ScannedFile[]): Promise<Finding[]> {
    const findings: Finding[] = [];

    for (const file of files) {
      if (/\.(md|mdx|markdown|txt|rst)$/i.test(file.relativePath)) continue;
      if (!/\.(m?[jt]sx?|mts|cts)$/i.test(file.relativePath)) continue;

      let content: string;
      try {
        content = await readFile(file.path, "utf8");
      } catch {
        continue;
      }
      const lines = content.split("\n");
      const usesTimingSafe = TIMING_SAFE_HINT.test(content);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (isMetadataKeyLine(line)) continue;

        // AUTH-001 — jwt algorithms includes 'none'
        if (JWT_ALG_NONE.test(line)) {
          findings.push({
            id: randomUUID(),
            detector: "deep-auth",
            rule: "AUTH-001",
            domain: "D2",
            severity: "critical",
            title: "JWT verify accepts algorithms: ['none']",
            description:
              "This jwt.verify call includes 'none' in its algorithms allowlist, so an attacker can forge a token by omitting the signature entirely.",
            why: "The 'none' algorithm was the original alg-confusion bug in the JWT spec and remains the fastest full-auth-bypass in any codebase that accepts it. Even one call site that lists 'none' as valid means the whole app trusts unsigned tokens.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Remove 'none' from the algorithms option. Pin exactly the algorithm you sign with (e.g. algorithms: ['RS256'] or ['EdDSA']).",
            confidence: "certain",
            category: "Auth & session",
          });
        }

        // AUTH-002 — jwt.decode used as if it verified
        if (JWT_DECODE_AS_AUTH.test(line)) {
          findings.push({
            id: randomUUID(),
            detector: "deep-auth",
            rule: "AUTH-002",
            domain: "D2",
            severity: "critical",
            title: "jwt.decode() result assigned to an auth-shaped variable — no signature verified",
            description:
              "This line calls decode(), which returns the token claims WITHOUT verifying the signature, and then binds the result to a variable named like user / claims / session / principal.",
            why: "jwt.decode() is a debug helper. It parses the base64 segments and hands you the payload. Nothing about it validates that the token was issued by you. If this value ends up in an authorization check, anyone can forge a token by writing whatever claims they want.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Use jwt.verify(token, publicKey, { algorithms: ['RS256'] }) — verify() throws on a bad signature. Only use decode() for logging/inspection, never for authorization.",
            confidence: "high",
            category: "Auth & session",
          });
        }

        // AUTH-003 — password compare with === / == (no timingSafe/bcrypt/argon2 in file)
        if (PWD_STRICT_EQ.test(line) && !usesTimingSafe) {
          findings.push({
            id: randomUUID(),
            detector: "deep-auth",
            rule: "AUTH-003",
            domain: "D2",
            severity: "high",
            title: "Password compared with === / == (not timing-safe)",
            description:
              "This line compares a password-shaped value with === or ==. The file does not import bcrypt, argon2, scrypt, or crypto.timingSafeEqual.",
            why: "String === in Node short-circuits on the first differing byte, leaking the length of the matching prefix through response-time timing. An attacker can recover a password character by character with enough requests. bcrypt.compare / crypto.timingSafeEqual take constant time regardless of where the mismatch is.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Store password hashes with bcrypt / argon2 / scrypt and compare with the library's constant-time verify function. For non-password tokens, use crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)) with equal-length buffers.",
            confidence: "high",
            category: "Auth & session",
          });
        }

        // AUTH-004 — cookie block missing httpOnly / secure / sameSite
        if (COOKIE_BLOCK_START.test(line)) {
          // Extract the balanced cookie: { ... } block starting on this
          // line — cheap forward scan (up to 20 lines) rather than a
          // full parser. Enough to catch AI-generated shapes.
          const start = i;
          const end = Math.min(lines.length, i + 20);
          const block = lines.slice(start, end).join("\n");
          const closeIdx = block.indexOf("}", block.indexOf("{"));
          if (closeIdx !== -1) {
            const scope = block.slice(0, closeIdx + 1);
            const missing = [
              /httpOnly\s*:/.test(scope) ? null : "httpOnly",
              /secure\s*:/.test(scope) ? null : "secure",
              /sameSite\s*:/.test(scope) ? null : "sameSite",
            ].filter(Boolean);
            if (missing.length > 0) {
              findings.push({
                id: randomUUID(),
                detector: "deep-auth",
                rule: "AUTH-004",
                domain: "D2",
                severity: missing.length === 3 ? "high" : "medium",
                title: `Cookie config missing ${missing.join(", ")}`,
                description: `The cookie block starting on this line does not set ${missing.join(", ")}.`,
                why: "httpOnly stops JavaScript from reading the cookie (mitigates XSS session theft). secure stops the cookie from riding non-HTTPS requests (mitigates network sniffing). sameSite=strict|lax stops the cookie from riding cross-site requests (mitigates CSRF). Missing any of the three shifts responsibility for real attacks onto the rest of the stack.",
                file: file.relativePath,
                line: i + 1,
                snippet: line.trim().slice(0, 120),
                fix: `Add ${missing.map((m) => `${m}: true`).join(", ")} (sameSite: 'lax' or 'strict') inside the cookie block.`,
                confidence: "high",
                category: "Auth & session",
              });
            }
          }
        }

        // AUTH-005 — MD5/SHA1 used near password-ish token
        const weakHash = WEAK_HASH_LINE.exec(line);
        if (weakHash) {
          // Widen the context: is a password-shaped token on this or
          // an adjacent line? MD5 of an arbitrary blob for a cache key
          // is fine; MD5 of a password is not.
          const contextStart = Math.max(0, i - 3);
          const contextEnd = Math.min(lines.length, i + 4);
          const context = lines.slice(contextStart, contextEnd).join("\n");
          if (PWD_NEAR_HASH.test(context)) {
            findings.push({
              id: randomUUID(),
              detector: "deep-auth",
              rule: "AUTH-005",
              domain: "D4",
              severity: "critical",
              title: `${weakHash[1]?.toUpperCase() ?? "Weak hash"} used to hash a password-shaped value`,
              description: `createHash('${weakHash[1]}') runs on or near a variable that looks like a password. ${weakHash[1]?.toUpperCase()} is not a password hash.`,
              why: "MD5 and SHA1 are unsalted, unstretched, and GPU-cheap: consumer hardware brute-forces billions per second. A password 'hashed' with them is essentially stored in plaintext once the dump leaks.",
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: "Use bcrypt (12+ rounds), argon2id, or scrypt. Every one of them takes a salt, is memory-hard, and takes ~100ms to check per attempt.",
              confidence: "high",
              category: "Cryptography",
            });
          }
        }

        // AUTH-006 — session({ secret: 'hardcoded literal' })
        const secretMatch = SESSION_SECRET_LITERAL.exec(line);
        if (secretMatch) {
          const literal = (secretMatch[1] ?? "").toLowerCase();
          const isKnownTutorial = KNOWN_TUTORIAL_SECRETS.has(literal);
          findings.push({
            id: randomUUID(),
            detector: "deep-auth",
            rule: "AUTH-006",
            domain: "D2",
            severity: isKnownTutorial ? "critical" : "high",
            title: isKnownTutorial
              ? `session({ secret }) uses a well-known tutorial value: '${literal}'`
              : "session({ secret }) is a hardcoded string literal",
            description: `The session middleware's secret is set to a string literal in source, not a value read from an environment variable or secret manager.`,
            why: "A committed session secret leaks the same way a committed .env does — anyone with source access can forge session cookies for any user. Well-known tutorial values (e.g. 'keyboard cat') are worse because botnets scan for them.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Read the session secret from process.env.SESSION_SECRET (or a secret manager) and refuse to boot when it is missing.",
            confidence: "certain",
            category: "Auth & session",
          });
        }
      }
    }

    return findings;
  },
};
