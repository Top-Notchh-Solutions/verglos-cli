import { join } from "node:path";
import {
  auditHuntReleaseEvidence,
  parseReleaseRecordManifestJson,
  readAndVerifyRecord,
} from "@verglos/shared";
import { readHuntJson } from "./hunt-execute.js";
import { readBoundedRegularFile } from "./record-sigstore.js";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

/** Audit a bounded Hunt proof/retest against an existing complete Release Record. */
export async function executeHuntReleaseAudit(
  evidencePath: string,
  recordStore: string,
  manifestPath: string | undefined,
  json = false,
  quiet = false,
): Promise<number> {
  try {
    const evidence = await readHuntJson(evidencePath, "Hunt release evidence");
    const manifest = parseReleaseRecordManifestJson(
      await readBoundedRegularFile(manifestPath ?? join(recordStore, "manifest.json"), MAX_MANIFEST_BYTES, "record manifest"),
    );
    const payloads = await readAndVerifyRecord(recordStore, manifest);
    const result = auditHuntReleaseEvidence({ evidence, manifest, payloads });
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) {
      console.log(`Hunt release audit: ${result.status}`);
      console.log(`Record: ${result.manifestDigest}`);
      console.log(`Finding: ${result.findingId}`);
      console.log(`Decision unchanged: ${result.decision}`);
      if (result.matchedVerificationAttemptPaths.length > 0) console.log(`Matched attempt: ${result.matchedVerificationAttemptPaths.join(", ")}`);
      for (const reason of result.reasons) console.log(`Reason: ${reason}`);
      for (const limitation of result.limitations) console.log(`Limitation: ${limitation}`);
    }
    return result.status === "auditable" ? 0 : 3;
  } catch (error) {
    if (json) console.log(JSON.stringify({ status: "error", code: "HUNT_RELEASE_AUDIT_INPUT", message: "Hunt release audit input is invalid" }));
    else if (!quiet) console.error(error instanceof Error ? error.message : "Hunt release audit input is invalid");
    return 78;
  }
}
