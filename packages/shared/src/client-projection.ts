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
  projection: Readonly<Record<string, unknown>>;
}>;

export type ClientUploadApproval = Readonly<{
  approvalId: string;
  organizationId: string;
  clientWorkspaceId: string;
  recordDigest: string;
  approvedBy: string;
  issuedAt: string;
  expiresAt: string;
}>;

export type ClientProjectionDecision =
  | Readonly<{ ok: true; projection: ClientProjection; projectionDigest: string }>
  | Readonly<{ ok: false; reason: "cross_tenant" | "workspace_mismatch" | "record_mismatch" | "approval_required" | "approval_mismatch" | "approval_expired" | "invalid_projection" | "projection_too_large" | "private_field" }>;

const PRIVATE_FIELDS = new Set(["source", "paths", "findings", "observations", "issuedBy", "signerIdentity", "signerIssuer", "signature", "privateKey", "credentials", "secrets"]);

function validId(value: unknown): value is string { return typeof value === "string" && ID.test(value); }
function validDigest(value: unknown): value is string { return typeof value === "string" && DIGEST.test(value); }

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
  if (Object.keys(raw).some((key) => PRIVATE_FIELDS.has(key))) return { ok: false, reason: "private_field" };
  const projection = Object.freeze({ ...raw, schemaId: CLIENT_PROJECTION_SCHEMA.id, schemaVersion: CLIENT_PROJECTION_SCHEMA.version, organizationId, clientWorkspaceId, recordDigest });
  const bytes = Buffer.byteLength(canonicalizeJson(projection), "utf8");
  if (bytes > MAX_PROJECTION_BYTES) return { ok: false, reason: "projection_too_large" };
  if (!input.approval) return { ok: false, reason: "approval_required" };
  const approval = input.approval;
  if (approval.organizationId !== organizationId) return { ok: false, reason: "approval_mismatch" };
  if (approval.clientWorkspaceId !== clientWorkspaceId) return { ok: false, reason: "workspace_mismatch" };
  if (approval.recordDigest !== recordDigest) return { ok: false, reason: "record_mismatch" };
  if (!validId(approval.approvalId) || !validId(approval.approvedBy)) return { ok: false, reason: "approval_mismatch" };
  const issued = Date.parse(approval.issuedAt); const expires = Date.parse(approval.expiresAt); const now = Date.parse(input.now);
  if (![issued, expires, now].every(Number.isFinite) || expires <= issued || now < issued || now >= expires) return { ok: false, reason: "approval_expired" };
  const projectionDigest = `sha256:${createHash("sha256").update(canonicalizeJson(projection), "utf8").digest("hex")}`;
  return { ok: true, projection: projection as ClientProjection, projectionDigest };
}

export { MAX_PROJECTION_BYTES };
