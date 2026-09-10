export type EngineLifecycleAction = "install" | "status" | "update" | "rollback";
export interface EngineLifecycleRequest { readonly action: EngineLifecycleAction; readonly engineId: string; readonly currentVersion?: string; readonly requestedVersion?: string; readonly rollbackVersion?: string; readonly approvalGranted?: boolean; readonly sourceAvailable: boolean; readonly compatible: boolean; }
export type EngineLifecycleDecision = { readonly allowed: true; readonly action: EngineLifecycleAction; readonly requiresMutation: boolean; readonly targetVersion?: string } | { readonly allowed: false; readonly reason: "approval-required" | "source-unavailable" | "incompatible" | "missing-version" | "invalid-transition" };

/** Plans an engine lifecycle operation; execution remains a separate explicitly approved step. */
export function planEngineLifecycle(request: EngineLifecycleRequest): EngineLifecycleDecision {
  if (!request.engineId || !request.sourceAvailable && request.action !== "status") return { allowed: false, reason: request.sourceAvailable ? "invalid-transition" : "source-unavailable" };
  if (request.action === "status") return { allowed: true, action: "status", requiresMutation: false };
  if (!request.approvalGranted) return { allowed: false, reason: "approval-required" };
  if (!request.compatible) return { allowed: false, reason: "incompatible" };
  if (request.action === "install" || request.action === "update") {
    if (!request.requestedVersion) return { allowed: false, reason: "missing-version" };
    if (request.action === "update" && request.requestedVersion === request.currentVersion) return { allowed: false, reason: "invalid-transition" };
    return { allowed: true, action: request.action, requiresMutation: true, targetVersion: request.requestedVersion };
  }
  if (!request.rollbackVersion || !request.currentVersion || request.rollbackVersion === request.currentVersion) return { allowed: false, reason: "invalid-transition" };
  return { allowed: true, action: "rollback", requiresMutation: true, targetVersion: request.rollbackVersion };
}
