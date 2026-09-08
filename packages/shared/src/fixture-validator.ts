import {
  canonicalizeJson,
  parseBoundedJson,
  parseVersionedJson,
  LEGACY_SCAN_REPORT_SCHEMA,
  VERGLOS_SCHEMA_IDS,
  type ParseJsonOptions,
} from "./schema.js";
import { parseSubject } from "./subject.js";
import { parseEngineHealth, parseToolRun } from "./engine.js";
import { parseObservation } from "./observation.js";
import { parseAIChangeContext } from "./ai-change-context.js";
import { parseVerificationAttempt } from "./verification.js";
import { parsePolicyException, parseExceptionApproval } from "./exception.js";
import { parsePolicyEvaluation } from "./policy-evaluation.js";
import { parseReleaseDecision } from "./release-decision.js";
import { parseReleaseRecordManifest } from "./record-manifest.js";
import { parseFailure } from "./failure.js";

const PARSERS: Readonly<Record<string, (value: unknown) => unknown>> = {
  [VERGLOS_SCHEMA_IDS.subject]: parseSubject,
  [VERGLOS_SCHEMA_IDS.engineHealth]: parseEngineHealth,
  [VERGLOS_SCHEMA_IDS.toolRun]: parseToolRun,
  [VERGLOS_SCHEMA_IDS.observation]: parseObservation,
  [VERGLOS_SCHEMA_IDS.aiChangeContext]: parseAIChangeContext,
  [VERGLOS_SCHEMA_IDS.verificationAttempt]: parseVerificationAttempt,
  [VERGLOS_SCHEMA_IDS.policyException]: parsePolicyException,
  [VERGLOS_SCHEMA_IDS.exceptionApproval]: parseExceptionApproval,
  [VERGLOS_SCHEMA_IDS.policyEvaluation]: parsePolicyEvaluation,
  [VERGLOS_SCHEMA_IDS.releaseDecision]: parseReleaseDecision,
  [VERGLOS_SCHEMA_IDS.releaseRecordManifest]: parseReleaseRecordManifest,
  [VERGLOS_SCHEMA_IDS.failure]: parseFailure,
};

export type FixtureValidation =
  | { readonly valid: true; readonly schemaId: string; readonly canonicalJson: string }
  | { readonly valid: false; readonly schemaId?: string; readonly error: "invalid-document" | "unsupported-schema" | "malformed-json" };

function schemaIdOf(value: unknown): string | undefined {
  return typeof value === "object" && value !== null && "schemaId" in value && typeof value.schemaId === "string"
    ? value.schemaId
    : undefined;
}

export function validateContractFixture(value: unknown): FixtureValidation {
  const schemaId = schemaIdOf(value);
  if (!schemaId && typeof value === "object" && value !== null && "schemaVersion" in value && "projectRoot" in value) {
    try {
      const parsed = parseVersionedJson<Record<string, unknown>>(JSON.stringify(value), {
        expectedSchema: LEGACY_SCAN_REPORT_SCHEMA,
        legacySchemaId: LEGACY_SCAN_REPORT_SCHEMA.id,
      });
      return { valid: true, schemaId: LEGACY_SCAN_REPORT_SCHEMA.id, canonicalJson: canonicalizeJson(parsed.document) };
    } catch {
      return { valid: false, error: "invalid-document" };
    }
  }
  if (!schemaId || !PARSERS[schemaId]) return { valid: false, ...(schemaId ? { schemaId } : {}), error: "unsupported-schema" };
  try {
    const parsed = PARSERS[schemaId](value);
    return { valid: true, schemaId, canonicalJson: canonicalizeJson(parsed) };
  } catch {
    return { valid: false, schemaId, error: "invalid-document" };
  }
}

export function validateContractFixtureJson(input: string | Uint8Array, options: ParseJsonOptions = {}): FixtureValidation {
  try {
    return validateContractFixture(parseBoundedJson(input, options));
  } catch {
    return { valid: false, error: "malformed-json" };
  }
}

export function supportedContractFixtureSchemaIds(): readonly string[] {
  return Object.freeze(Object.keys(PARSERS).sort());
}
