import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { parseReleaseDecision, type ReleaseDecisionDocument } from "./release-decision.js";
import { SubjectIdSchema } from "./subject.js";

const DIGEST = /^sha256:[a-f0-9]{64}$/u;
const GIT_COMMIT = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u;

export type CiCheckPayloadInput = Readonly<{
  releaseDecision: ReleaseDecisionDocument;
  recordManifestDigest: string;
  recordUrl: string;
  commit: string;
}>;

export type CiCheckPayload = Readonly<{
  name: "Verglos / release decision";
  externalKey: string;
  commit: string;
  subject: Readonly<{ subjectId: string; digest: string }>;
  decision: ReleaseDecisionDocument["decision"];
  policy: Readonly<{ id: string; version: string; digest: string }>;
  record: Readonly<{ manifestDigest: string; url: string }>;
  summary: string;
  payloadDigest: string;
}>;

export type CiCheckPayloadDecision =
  | Readonly<{ ok: true; payload: CiCheckPayload }>
  | Readonly<{
      ok: false;
      reason:
        | "commit_invalid"
        | "manifest_digest_invalid"
        | "record_url_invalid"
        | "subject_invalid"
        | "subject_digest_mismatch";
    }>;

function subjectDigest(subjectId: string): string | null {
  const match = subjectId.match(/:sha256:([a-f0-9]{64})$/u);
  return match ? `sha256:${match[1]}` : null;
}

function safeHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * Project only the exact release decision identity required by a CI check.
 * Source, paths, findings, and arbitrary record members never cross this
 * boundary. The caller must provide a record URL; the URL is constrained to
 * HTTPS and is included in the signed-by-digest payload exactly as rendered.
 */
export function composeCiCheckPayload(input: CiCheckPayloadInput): CiCheckPayloadDecision {
  if (!GIT_COMMIT.test(input.commit)) return { ok: false, reason: "commit_invalid" };
  if (!DIGEST.test(input.recordManifestDigest)) return { ok: false, reason: "manifest_digest_invalid" };
  const url = safeHttpsUrl(input.recordUrl);
  if (!url) return { ok: false, reason: "record_url_invalid" };

  let decision: ReleaseDecisionDocument;
  try {
    decision = parseReleaseDecision(input.releaseDecision);
  } catch {
    return { ok: false, reason: "subject_invalid" };
  }
  const primary = decision.subjects.find((subject) => subject.role === "primary");
  if (!primary || !SubjectIdSchema.safeParse(primary.subjectId).success) return { ok: false, reason: "subject_invalid" };
  const digest = subjectDigest(primary.subjectId);
  if (!digest) return { ok: false, reason: "subject_invalid" };
  const evaluationDigest = subjectDigest(decision.evaluation.subjectId);
  if (!evaluationDigest || digest !== evaluationDigest) {
    return { ok: false, reason: "subject_digest_mismatch" };
  }

  const record = { manifestDigest: input.recordManifestDigest, url: url.toString() } as const;
  const policy = {
    id: decision.policy.id,
    version: decision.policy.version,
    digest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}`,
  } as const;
  const identity = { commit: input.commit, subjectId: primary.subjectId, manifestDigest: input.recordManifestDigest };
  const externalKey = createHash("sha256").update(canonicalizeJson(identity), "utf8").digest("hex").slice(0, 32);
  const summary = `Decision ${decision.decision}; subject ${digest}; policy ${policy.id}@${policy.version}.`;
  const payloadWithoutDigest = { name: "Verglos / release decision" as const, externalKey, commit: input.commit, subject: { subjectId: primary.subjectId, digest }, decision: decision.decision, policy, record, summary };
  const payloadDigest = `sha256:${createHash("sha256").update(canonicalizeJson(payloadWithoutDigest), "utf8").digest("hex")}`;
  return { ok: true, payload: Object.freeze({ ...payloadWithoutDigest, payloadDigest }) };
}

export function decideCiCheckDelivery(input: { currentPayloadDigest: string; storedPayloadDigest: string }): "update" | "noop" {
  return input.currentPayloadDigest === input.storedPayloadDigest ? "noop" : "update";
}
