import type { ApprovalReceipt, Finding, HuntExecutionBinding, HuntRecipe, HuntRecipeTrustPolicy, ScanResult } from "@verglos/shared";

export type HuntVerdict = "true" | "false" | "not_attemptable";

export interface HuntFindingOutcome {
  findingId: string;
  verdict: HuntVerdict;
  finding?: Finding;
  reason: string;
  evidencePath?: string;
  durationMs: number;
  evidenceDigest?: string;
  outputBytes?: number;
  truncated?: boolean;
  redacted?: true;
  executionStatus?: "completed" | "timed-out" | "failed";
}

export interface HuntResult {
  report: ScanResult;
  outcomes: readonly HuntFindingOutcome[];
  startedAt: string;
  completedAt: string;
  sandbox: string;
}

export interface SandboxAdapter {
  id: "node-vm" | "docker" | "firecracker" | string;
  prepare(): Promise<void>;
  execute(input: {
    finding: Finding;
    projectRoot: string;
    timeoutMs: number;
    binding: HuntExecutionBinding;
  }): Promise<HuntFindingOutcome>;
  cleanup(): Promise<void>;
}

export interface HuntExecutionContext {
  readonly recipe: HuntRecipe;
  readonly trust: HuntRecipeTrustPolicy;
  readonly approval: ApprovalReceipt;
  readonly ruleId: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly at: string;
}

export interface HuntOptions {
  projectRoot?: string;
  severity?: Array<Finding["severity"]>;
  findingId?: string;
  sandbox?: SandboxAdapter["id"];
  /** A locally selected, policy-approved adapter. Never populated from model text. */
  adapter?: SandboxAdapter;
  execution?: HuntExecutionContext;
  dryRun?: boolean;
  maxDurationMs?: number;
}
