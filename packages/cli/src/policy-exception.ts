import { lstat, open } from "node:fs/promises";
import { projectExceptionExport } from "@verglos/shared";

const MAX_EXCEPTION_DOCUMENT_BYTES = 256 * 1024;

async function readDocument(path: string): Promise<unknown> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("exception input must be a regular file");
  if (entry.size > MAX_EXCEPTION_DOCUMENT_BYTES) throw new Error("exception input exceeds the 256 KiB limit");
  const handle = await open(path, "r");
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || (entry.ino !== 0 && opened.ino !== 0 && (entry.dev !== opened.dev || entry.ino !== opened.ino))) throw new Error("exception input changed during validation");
    if (opened.size > MAX_EXCEPTION_DOCUMENT_BYTES) throw new Error("exception input exceeds the 256 KiB limit");
    const bytes = await handle.readFile();
    if (bytes.byteLength > MAX_EXCEPTION_DOCUMENT_BYTES) throw new Error("exception input exceeds the 256 KiB limit");
    return JSON.parse(bytes.toString("utf8")) as unknown;
  } finally {
    await handle.close();
  }
}

export async function executePolicyExceptionShow(exceptionPath: string, approvalPath: string, json = false, quiet = false): Promise<number> {
  try {
    const [exception, approval] = await Promise.all([readDocument(exceptionPath), readDocument(approvalPath)]);
    const projection = projectExceptionExport(exception, approval);
    if (json) console.log(JSON.stringify(projection));
    else if (!quiet) {
      console.log(`Exception: ${projection.exceptionId}`);
      console.log(`Subject: ${projection.scope.subjectId}`);
      console.log(`Observations: ${projection.scope.observationIds.join(", ")}`);
      console.log(`Owner: ${projection.owner.kind} ${projection.owner.id}`);
      console.log(`Reason: ${projection.reason}`);
      console.log(`Controls: ${projection.controls.length}`);
      for (const control of projection.controls) console.log(`  - ${control.description} (owner: ${control.owner.kind} ${control.owner.id}; evidence digest: ${control.evidence.digest.algorithm}:${control.evidence.digest.value})`);
      console.log(`Validity: ${projection.effectiveFrom} → ${projection.expiresAt}`);
      console.log(`Approval: ${projection.approval.decision}; binding ${projection.approval.binding}; time ${projection.approval.timeState}; applicability ${projection.approval.applicability.status}`);
      console.log("Export choices:");
      for (const choice of projection.exportChoices) console.log(`  ${choice.format}: ${choice.status} — ${choice.reason}`);
      if (projection.limitations.length) console.log(`Limitations: ${projection.limitations.join("; ")}`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Exception projection failed.";
    if (json) console.log(JSON.stringify({ status: "error", code: "POLICY_EXCEPTION_INPUT", message: "policy exception projection failed" }));
    else if (!quiet) console.error(`[POLICY_EXCEPTION_INPUT] ${message}`);
    return 2;
  }
}
