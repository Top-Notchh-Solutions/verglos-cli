import { readFile, lstat } from "node:fs/promises";
import { basename } from "node:path";
import {
  explainPolicyEvaluation,
  parsePolicyEvaluationJson,
  parseReleaseRecordManifestJson,
  policyDecisionExitCode,
  readAndVerifyRecord,
} from "@verglos/shared";

const MAX_POLICY_BYTES = 8 * 1024 * 1024;

async function readBoundedStdin(): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of process.stdin) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    total += bytes.byteLength;
    if (total > MAX_POLICY_BYTES) throw new Error("policy evaluation exceeds the 8 MiB limit");
    chunks.push(bytes);
  }
  return Buffer.concat(chunks, total);
}

export interface PolicyCheckOptions {
  readonly recordStore?: string;
}

export async function executePolicyCheck(path: string, json = false, quiet = false, options: PolicyCheckOptions = {}): Promise<number> {
  try {
    if (path !== "-") {
      const entry = await lstat(path);
      if (!entry.isFile()) throw new Error("policy evaluation path must be a regular file");
    }
    const bytes = path === "-" ? await readBoundedStdin() : await readFile(path);
    if (bytes.byteLength > MAX_POLICY_BYTES) throw new Error("policy evaluation exceeds the 8 MiB limit");
    const name = basename(path).toLowerCase();
    const evaluation = await parseEvaluationInput(path, bytes, name, options);
    const explanation = explainPolicyEvaluation(evaluation);
    if (json) console.log(JSON.stringify(explanation));
    else if (!quiet) {
      console.log(`Decision: ${explanation.decision}`);
      console.log(`Subject: ${explanation.subjectId}`);
      console.log(`Policy: ${explanation.policy.id}@${explanation.policy.version} (${explanation.policy.digest})`);
      if (explanation.limitations.length) console.log(`Limitations: ${explanation.limitations.join("; ")}`);
      for (const reason of explanation.reasons) console.log(`- [${reason.code}] ${reason.detail} (${reason.owner}; next: ${reason.nextAction})`);
    }
    return policyDecisionExitCode(evaluation.decision);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate policy document.";
    if (json) console.log(JSON.stringify({ status: "error", code: "POLICY_CHECK_INPUT", message })); else if (!quiet) console.error(`[POLICY_CHECK_INPUT] ${message}`);
    return 2;
  }
}

async function parseEvaluationInput(path: string, bytes: Uint8Array, name: string, options: PolicyCheckOptions) {
  if (options.recordStore) {
    const manifest = parseReleaseRecordManifestJson(bytes);
    const members = await readAndVerifyRecord(options.recordStore, manifest);
    const evaluation = manifest.members.find((member) => member.kind === "policy-evaluation");
    if (!evaluation) throw new Error("record does not contain a policy-evaluation member");
    const payload = members.get(evaluation.path);
    if (!payload) throw new Error("record policy-evaluation member is unavailable");
    return parsePolicyEvaluationJson(payload);
  }
  if (name.endsWith(".vgl") || name.endsWith(".snapshot") || name.endsWith(".snapshot.json")) {
    let parsed: unknown;
    try { parsed = JSON.parse(Buffer.from(bytes).toString("utf8")); } catch { throw new Error("record and snapshot inputs require --record-store or an embedded policy evaluation"); }
    if (parsed && typeof parsed === "object" && "policyEvaluation" in parsed) {
      return parsePolicyEvaluationJson(JSON.stringify((parsed as { policyEvaluation: unknown }).policyEvaluation));
    }
    throw new Error("record and snapshot inputs require --record-store or an embedded policy evaluation");
  }
  const parsed: unknown = JSON.parse(Buffer.from(bytes).toString("utf8"));
  if (parsed && typeof parsed === "object" && "policyEvaluation" in parsed) {
    return parsePolicyEvaluationJson(JSON.stringify((parsed as { policyEvaluation: unknown }).policyEvaluation));
  }
  return parsePolicyEvaluationJson(bytes);
}
