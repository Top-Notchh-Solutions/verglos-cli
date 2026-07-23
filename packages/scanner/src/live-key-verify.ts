import { createHash, createHmac } from "node:crypto";

/**
 * Live-key verification for a small set of high-value providers.
 * When a matched secret comes back "live," Verglos upgrades the
 * finding to `certain` confidence + `critical` severity + a
 * distinct title, §milestone:
 *
 *   "A verified live key is `certain` confidence and severity
 *    `critical`. This one detail is worth more than 50 extra
 *    patterns — it's the difference between 'might be a secret'
 *    and 'this key works right now.'"
 *
 * Only three providers here; more get added carefully because
 * every provider we call is a network dependency at scan time
 * and a support-load risk if their auth flow changes.
 *
 *   AWS     STS GetCallerIdentity (SigV4-signed)
 *   GitHub  /user
 *   Stripe  /v1/balance
 *
 * The key value never leaves this process except to hit the
 * provider's own API. Verification is opt-in (`--verify-secrets`
 * flag) — design §1's "the free path makes zero network calls"
 * invariant means we cannot verify by default.
 */

const HTTP_TIMEOUT_MS = 5000;

export type LiveKeyKind = "aws" | "github" | "stripe";

export interface LiveKeyResult {
  live: boolean;
  /** Freeform detail — account id, username, etc. Safe to show. */
  detail?: string;
  /** Human-readable reason when live=false. */
  reason?: string;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// ─── GitHub ───────────────────────────────────────────────────────────────

/** ghp_* fine-grained / classic PAT, gho_* OAuth, ghs_* server token. */
export async function verifyGitHubKey(
  token: string,
): Promise<LiveKeyResult> {
  const res = await withTimeout(
    fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "verglos-scanner/live-key-verify",
        Accept: "application/vnd.github+json",
      },
    }),
    HTTP_TIMEOUT_MS,
  );
  if (!res) return { live: false, reason: "network timeout" };
  if (res.status === 401 || res.status === 403) {
    return { live: false, reason: `revoked or invalid (HTTP ${res.status})` };
  }
  if (res.status !== 200) {
    return { live: false, reason: `unexpected HTTP ${res.status}` };
  }
  try {
    const data = (await res.json()) as { login?: string };
    return {
      live: true,
      detail: data.login ? `logged in as @${data.login}` : "auth accepted",
    };
  } catch {
    return { live: true, detail: "auth accepted" };
  }
}

// ─── Stripe ───────────────────────────────────────────────────────────────

/** sk_live_… / sk_test_… / rk_live_… — the /v1/balance call works for all. */
export async function verifyStripeKey(
  key: string,
): Promise<LiveKeyResult> {
  const res = await withTimeout(
    fetch("https://api.stripe.com/v1/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
    }),
    HTTP_TIMEOUT_MS,
  );
  if (!res) return { live: false, reason: "network timeout" };
  if (res.status === 401) {
    return { live: false, reason: "revoked or invalid (HTTP 401)" };
  }
  if (res.status !== 200) {
    return { live: false, reason: `unexpected HTTP ${res.status}` };
  }
  const mode = key.startsWith("sk_test_") || key.startsWith("rk_test_")
    ? "test mode"
    : "live mode";
  return { live: true, detail: `Stripe ${mode} key accepted` };
}

// ─── AWS STS ──────────────────────────────────────────────────────────────

interface AwsSecret {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

/**
 * SigV4-signed STS GetCallerIdentity. Hand-rolled to avoid the
 * multi-megabyte @aws-sdk/client-sts dep — the algorithm is well-
 * defined and only needs node:crypto. Only supports the four-part
 * signing key derivation and no session token.
 *
 * Returns { live: true, detail: "account 123 · Arn arn:aws:iam::123:user/foo" }
 * on success.
 */
export async function verifyAwsKey(
  secret: AwsSecret,
): Promise<LiveKeyResult> {
  const region = secret.region ?? "us-east-1";
  const service = "sts";
  const host = "sts.amazonaws.com";
  const payload = "Action=GetCallerIdentity&Version=2011-06-15";
  const method = "POST";
  const contentType = "application/x-www-form-urlencoded";

  const now = new Date();
  const amzDate = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = createHash("sha256").update(payload).digest("hex");

  const canonicalHeaders =
    `content-type:${contentType}\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalRequest = [
    method,
    "/",
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    scope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const hmac = (key: Buffer, data: string): Buffer =>
    createHmac("sha256", key).update(data).digest();
  const kDate = hmac(Buffer.from(`AWS4${secret.secretAccessKey}`), dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");

  const authHeader =
    `${algorithm} Credential=${secret.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await withTimeout(
    fetch(`https://${host}/`, {
      method,
      headers: {
        "Content-Type": contentType,
        "X-Amz-Date": amzDate,
        Authorization: authHeader,
      },
      body: payload,
    }),
    HTTP_TIMEOUT_MS,
  );
  if (!res) return { live: false, reason: "network timeout" };
  if (res.status === 403 || res.status === 401) {
    return { live: false, reason: `revoked or invalid (HTTP ${res.status})` };
  }
  if (res.status !== 200) {
    return { live: false, reason: `unexpected HTTP ${res.status}` };
  }
  const body = await res.text();
  // Response is XML; parse the two fields we care about with a
  // regex — pulling in a full XML parser for this is overkill.
  const account = body.match(/<Account>(\d+)<\/Account>/)?.[1];
  const arn = body.match(/<Arn>([^<]+)<\/Arn>/)?.[1];
  const detail =
    account && arn
      ? `AWS account ${account} · Arn ${arn}`
      : "STS GetCallerIdentity accepted";
  return { live: true, detail };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────

export function detectLiveKeyKind(value: string): LiveKeyKind | null {
  if (/^gh[pous]_[A-Za-z0-9]{20,}$/.test(value)) return "github";
  if (/^(sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{20,}$/.test(value))
    return "stripe";
  if (/^AKIA[0-9A-Z]{16}$/.test(value)) return "aws";
  return null;
}
