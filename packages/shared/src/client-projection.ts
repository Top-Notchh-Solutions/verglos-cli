import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";

/** STUDIO-CLI-001 · explicit redacted client projection/upload admission. */
export const CLIENT_PROJECTION_SCHEMA = Object.freeze({ id: "urn:verglos:schema:client-projection", version: "1.0.0" });
const MAX_PROJECTION_BYTES = 256 * 1024;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;
const DIGEST = /^sha256:[a-f0-9]{64}$/u;

export type ClientProjection = Readonly<{
  schemaId: string;
  schemaVersion: string;
  organizationId: string;
  clientWorkspaceId: string;
  recordDigest: string;
  decision?: "PASS" | "BLOCK" | "REVIEW" | "INCOMPLETE";
  subjectDigest?: string;
  coverageStatus?: "incomplete" | "not-established";
  signerStatus?: "unsigned" | "unknown" | "unverified";
  limitations?: readonly string[];
}>;

export type ClientUploadApproval = Readonly<{
  action: "client-projection-upload";
  approvalId: string;
  organizationId: string;
  clientWorkspaceId: string;
  recordDigest: string;
  projectionDigest: string;
  approvedBy: string;
  issuedAt: string;
  expiresAt: string;
}>;

export type ClientProjectionDecision =
  | Readonly<{ ok: true; projection: ClientProjection; projectionDigest: string }>
  | Readonly<{ ok: false; reason: "cross_tenant" | "workspace_mismatch" | "record_mismatch" | "approval_required" | "approval_mismatch" | "approval_expired" | "invalid_projection" | "projection_too_large" | "private_field" | "unsupported_field" }>;

const SAFE_FIELDS = new Set(["organizationId", "clientWorkspaceId", "recordDigest", "decision", "subjectDigest", "coverageStatus", "signerStatus", "limitations"]);
const PRIVATE_FIELDS = new Set(["source", "paths", "findings", "observations", "issuedBy", "signerIdentity", "signerIssuer", "signature", "privateKey", "credentials", "secrets", "tenantId", "clientId", "policy", "policyId", "issuer"]);
const DECISIONS = new Set(["PASS", "BLOCK", "REVIEW", "INCOMPLETE"]);
const COVERAGE = new Set(["incomplete", "not-established"]);
const SIGNERS = new Set(["unsigned", "unknown", "unverified"]);
const WITHHELD_LIMITATION = "Limitation details withheld from this public projection.";

function validId(value: unknown): value is string { return typeof value === "string" && ID.test(value); }
function validDigest(value: unknown): value is string { return typeof value === "string" && DIGEST.test(value); }

function validateSafeFields(raw: Record<string, unknown>): "private_field" | "unsupported_field" | "invalid_projection" | null {
  for (const key of Object.keys(raw)) {
    if (PRIVATE_FIELDS.has(key)) return "private_field";
    if (!SAFE_FIELDS.has(key)) return "unsupported_field";
  }
  if ("decision" in raw && (typeof raw.decision !== "string" || !DECISIONS.has(raw.decision))) return "invalid_projection";
  if ("subjectDigest" in raw && !validDigest(raw.subjectDigest)) return "invalid_projection";
  if ("coverageStatus" in raw && (typeof raw.coverageStatus !== "string" || !COVERAGE.has(raw.coverageStatus))) return "invalid_projection";
  if ("signerStatus" in raw && (typeof raw.signerStatus !== "string" || !SIGNERS.has(raw.signerStatus))) return "invalid_projection";
  if ("limitations" in raw && (!Array.isArray(raw.limitations) || raw.limitations.some((value) => value !== WITHHELD_LIMITATION))) return "private_field";
  return null;
}

export function clientProjectionDigest(projection: ClientProjection): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(projection), "utf8").digest("hex")}`;
}

/** Admit a redacted projection only when tenant, workspace, record, and approval all bind exactly. */
export function admitClientProjectionUpload(input: Readonly<{
  actorOrganizationId: string;
  projection: unknown;
  approval?: ClientUploadApproval;
  now: string;
}>): ClientProjectionDecision {
  if (!input.projection || typeof input.projection !== "object" || Array.isArray(input.projection)) return { ok: false, reason: "invalid_projection" };
  const raw = input.projection as Record<string, unknown>;
  const organizationId = raw.organizationId;
  const clientWorkspaceId = raw.clientWorkspaceId;
  const recordDigest = raw.recordDigest;
  if (!validId(organizationId) || !validId(clientWorkspaceId) || !validDigest(recordDigest)) return { ok: false, reason: "invalid_projection" };
  if (organizationId !== input.actorOrganizationId) return { ok: false, reason: "cross_tenant" };
  const fieldError = validateSafeFields(raw);
  if (fieldError) return { ok: false, reason: fieldError };
  const projection = Object.freeze({ ...raw, schemaId: CLIENT_PROJECTION_SCHEMA.id, schemaVersion: CLIENT_PROJECTION_SCHEMA.version, organizationId, clientWorkspaceId, recordDigest });
  const bytes = Buffer.byteLength(canonicalizeJson(projection), "utf8");
  if (bytes > MAX_PROJECTION_BYTES) return { ok: false, reason: "projection_too_large" };
  if (!input.approval) return { ok: false, reason: "approval_required" };
  const approval = input.approval;
  if (approval.action !== "client-projection-upload") return { ok: false, reason: "approval_mismatch" };
  if (approval.organizationId !== organizationId) return { ok: false, reason: "approval_mismatch" };
  if (approval.clientWorkspaceId !== clientWorkspaceId) return { ok: false, reason: "workspace_mismatch" };
  if (approval.recordDigest !== recordDigest) return { ok: false, reason: "record_mismatch" };
  if (!validId(approval.approvalId) || !validId(approval.approvedBy)) return { ok: false, reason: "approval_mismatch" };
  const issued = Date.parse(approval.issuedAt); const expires = Date.parse(approval.expiresAt); const now = Date.parse(input.now);
  if (![issued, expires, now].every(Number.isFinite) || expires <= issued || now < issued || now >= expires) return { ok: false, reason: "approval_expired" };
  const projectionDigest = clientProjectionDigest(projection as ClientProjection);
  if (approval.projectionDigest !== projectionDigest) return { ok: false, reason: "approval_mismatch" };
  return { ok: true, projection: projection as ClientProjection, projectionDigest };
}

export { MAX_PROJECTION_BYTES };
