export type TrivyFailureKind = "missing-engine" | "stale-database" | "incompatible-output" | "database-error" | "execution-error";
export interface TrivyCoverageDecision { readonly coverage: "complete" | "incomplete"; readonly reason: TrivyFailureKind | null; readonly message: string; }

export function classifyTrivyFailure(kind?: TrivyFailureKind): TrivyCoverageDecision {
  if (!kind) return { coverage: "complete", reason: null, message: "Trivy completed with supported evidence." };
  const messages: Record<TrivyFailureKind, string> = { "missing-engine": "Trivy executable is unavailable.", "stale-database": "Trivy vulnerability database is stale.", "incompatible-output": "Trivy output is outside the supported compatibility set.", "database-error": "Trivy could not load its vulnerability database.", "execution-error": "Trivy execution failed before complete evidence was produced." };
  return { coverage: "incomplete", reason: kind, message: messages[kind] };
}
