import { lstat, readFile } from "node:fs/promises";
import { composeCiCheckPayload, parseReleaseDecisionJson, type ReleaseDecisionDocument } from "@verglos/shared";

const MAX_DECISION_BYTES = 8 * 1024 * 1024;
const COMMIT = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u;
const DIGEST = /^sha256:[a-f0-9]{64}$/u;

export interface CiCheckPayloadOptions {
  readonly decisionPath: string;
  readonly recordManifestDigest: string;
  readonly recordUrl: string;
  readonly commit: string;
  readonly json?: boolean;
  readonly quiet?: boolean;
}

/**
 * Project a verified local Release Decision into the source-free payload that
 * a hosted SCM adapter can later deliver. This command never opens a record
 * URL, sends source, or contacts a provider.
 */
export async function executeCiCheckPayload(input: CiCheckPayloadOptions): Promise<number> {
  try {
    if (!COMMIT.test(input.commit)) throw new Error("commit must be a 40- or 64-character lowercase hexadecimal value");
    if (!DIGEST.test(input.recordManifestDigest)) throw new Error("record manifest digest must be sha256:<64 lowercase hexadecimal characters>");
    const entry = await lstat(input.decisionPath);
    if (!entry.isFile() || entry.isSymbolicLink() || entry.size > MAX_DECISION_BYTES) throw new Error("release decision must be a bounded regular file");
    const decision = parseReleaseDecisionJson(await readFile(input.decisionPath)) as ReleaseDecisionDocument;
    const projected = composeCiCheckPayload({ releaseDecision: decision, recordManifestDigest: input.recordManifestDigest, recordUrl: input.recordUrl, commit: input.commit });
    if (!projected.ok) throw new Error(`release decision cannot be projected (${projected.reason})`);
    if (input.json) console.log(JSON.stringify(projected.payload));
    else if (!input.quiet) {
      console.log(`Decision: ${projected.payload.decision}`);
      console.log(`Subject: ${projected.payload.subject.subjectId}`);
      console.log(`Policy: ${projected.payload.policy.id}@${projected.payload.policy.version}`);
      console.log(`Record: ${projected.payload.record.url}`);
      console.log(`Commit: ${projected.payload.commit}`);
      console.log(`Payload: ${projected.payload.payloadDigest}`);
    }
    return 0;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "CI check payload input is invalid";
    if (input.json) console.log(JSON.stringify({ status: "error", code: "CI_CHECK_PAYLOAD_INPUT", message: "CI check payload projection failed" }));
    else if (!input.quiet) console.error(`[CI_CHECK_PAYLOAD_INPUT] ${detail}`);
    return 2;
  }
}
