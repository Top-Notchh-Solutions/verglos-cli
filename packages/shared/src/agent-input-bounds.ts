export interface AgentInputBounds { readonly codeMaxBytes: number; readonly pathMaxBytes: number; readonly contextMaxBytes: number; readonly packageNameMaxBytes: number; }
export const DEFAULT_AGENT_INPUT_BOUNDS: AgentInputBounds = Object.freeze({ codeMaxBytes: 1_000_000, pathMaxBytes: 4096, contextMaxBytes: 4096, packageNameMaxBytes: 512 });
export function validateAgentInputBounds(input: { readonly code?: string; readonly targetPath?: string; readonly context?: string; readonly packageName?: string }, bounds: AgentInputBounds = DEFAULT_AGENT_INPUT_BOUNDS): void {
  const checks: [string, string | undefined, number][] = [["code", input.code, bounds.codeMaxBytes], ["targetPath", input.targetPath, bounds.pathMaxBytes], ["context", input.context, bounds.contextMaxBytes], ["packageName", input.packageName, bounds.packageNameMaxBytes]];
  for (const [name, value, max] of checks) if (value !== undefined && Buffer.byteLength(value, "utf8") > max) throw new Error(`${name} exceeds ${max} UTF-8 bytes`);
}
