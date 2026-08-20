import type { Finding, ScanResult } from "@verglos/shared";

export type HuntVerdict = "true" | "false" | "not_attemptable";

export interface HuntFindingOutcome {
  findingId: string;
  verdict: HuntVerdict;
  finding?: Finding;
  reason: string;
  evidencePath?: string;
  durationMs: number;
}

export interface HuntResult {
  report: ScanResult;
  outcomes: HuntFindingOutcome[];
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
  }): Promise<HuntFindingOutcome>;
  cleanup(): Promise<void>;
}

export interface HuntOptions {
  projectRoot?: string;
  severity?: Array<Finding["severity"]>;
  findingId?: string;
  sandbox?: SandboxAdapter["id"];
  dryRun?: boolean;
  maxDurationMs?: number;
}
