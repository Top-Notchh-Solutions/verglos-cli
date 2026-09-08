import { z } from "zod";

export const TARGET_KINDS = ["repository", "package", "filesystem", "artifact", "sbom", "oci"] as const;
export type TargetKind = (typeof TARGET_KINDS)[number];

export const TargetSpecSchema = z.object({
  kind: z.enum(TARGET_KINDS),
  value: z.string().min(1).max(4096),
  platform: z.string().min(1).max(128).optional(),
}).strict();
export type TargetSpec = z.infer<typeof TargetSpecSchema>;

export const TARGET_RESOLVER_CAPABILITIES = [
  "resolve-repository",
  "resolve-package",
  "resolve-filesystem",
  "resolve-artifact",
  "resolve-sbom",
  "resolve-oci",
] as const;
export type TargetResolverCapability = (typeof TARGET_RESOLVER_CAPABILITIES)[number];

export interface TargetResolverContext {
  readonly cwd: string;
  readonly allowNetwork: boolean;
  readonly executeProjectCode: false;
}

export interface TargetResolution {
  readonly target: TargetSpec;
  readonly subject: unknown;
  readonly coverage: "complete" | "incomplete";
  readonly limitations: readonly string[];
}

export interface TargetResolver {
  readonly id: string;
  readonly capabilities: readonly TargetResolverCapability[];
  resolve(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution>;
}

export function parseTargetSpec(value: unknown): TargetSpec {
  return TargetSpecSchema.parse(value);
}

export function assertNoExecutionContext(context: TargetResolverContext): void {
  if (context.executeProjectCode !== false) throw new Error("Target resolution cannot execute project code.");
}

export function targetCapabilityFor(kind: TargetKind): TargetResolverCapability {
  return `resolve-${kind}` as TargetResolverCapability;
}
