import { z } from "zod";

export const VerglosConfigSchema = z.object({
  plan: z
    .enum(["free", "pro", "studio", "compliance"])
    .default("free"),
  failOnCritical: z.boolean().default(true),
  failThreshold: z.number().min(0).max(100).default(60),
  ignorePaths: z.array(z.string()).default([
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/coverage/**",
    "**/build/**",
    "**/.git/**",
    "**/.turbo/**",
    "**/.vercel/**",
    "**/.pnpm-store/**",
    "**/.claude/**",
    "**/.clerk/**",
    "**/.cursor/**",
    "**/.playwright-mcp/**",
    "**/verglos-report*.html",
    "**/verglos-report*.json",
    "**/*.tgz",
  ]),
  secretScanDepth: z.number().min(0).max(500).default(100),
  reportFormat: z.enum(["html", "json", "both"]).default("both"),
  preCommitHook: z.boolean().default(true),
  hunt: z
    .object({
      sandbox: z.enum(["auto", "node-vm", "docker", "firecracker"]).optional(),
      maxDurationMs: z.number().int().positive().optional(),
      skip: z.array(z.string()).optional(),
    })
    .optional(),
  attest: z
    .object({
      signingKeyPath: z.string().optional(),
      verifyUrlBase: z.string().url().default("https://verglos.com/verify").optional(),
      whiteLabel: z
        .object({
          logoPath: z.string().optional(),
          footer: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type VerglosConfig = z.infer<typeof VerglosConfigSchema>;

export const DEFAULT_CONFIG: VerglosConfig = VerglosConfigSchema.parse({});

export function mergeConfig(partial: Partial<VerglosConfig>): VerglosConfig {
  return VerglosConfigSchema.parse({ ...DEFAULT_CONFIG, ...partial });
}

export type ConfigMigrationWarning = Readonly<{
  id: "obsolete-sandbox" | "legacy-plan" | "legacy-attest" | "unknown-field";
  message: string;
}>;

export type ConfigMigrationInspection = Readonly<{
  status: "current" | "legacy" | "invalid";
  warnings: readonly ConfigMigrationWarning[];
}>;

/** Inspect config data without loading, rewriting, or applying it to a command. */
export function inspectConfigMigration(value: unknown): ConfigMigrationInspection {
  const warnings: ConfigMigrationWarning[] = [];
  const parsed = VerglosConfigSchema.safeParse(value);
  if (!parsed.success) return { status: "invalid", warnings };
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const hunt = raw.hunt && typeof raw.hunt === "object" ? raw.hunt as Record<string, unknown> : {};
  if (hunt.sandbox === "node-vm" || hunt.sandbox === "firecracker") warnings.push({ id: "obsolete-sandbox", message: `hunt.sandbox=${hunt.sandbox} is obsolete; select a supported adapter explicitly when Hunt execution is shipped.` });
  if (Object.hasOwn(raw, "plan")) warnings.push({ id: "legacy-plan", message: "plan is legacy metadata and is not an entitlement authority; use verified license state." });
  const attest = raw.attest && typeof raw.attest === "object" ? raw.attest as Record<string, unknown> : {};
  if (Object.hasOwn(attest, "verifyUrlBase") || Object.hasOwn(attest, "whiteLabel")) warnings.push({ id: "legacy-attest", message: "attest hosted verification and white-label fields are deferred; they are not activated by local config." });
  const knownFields = new Set(["plan", "failOnCritical", "failThreshold", "ignorePaths", "secretScanDepth", "reportFormat", "preCommitHook", "hunt", "attest"]);
  for (const key of Object.keys(raw).sort()) if (!knownFields.has(key)) warnings.push({ id: "unknown-field", message: `unknown config field '${key}' is ignored until a versioned migration defines it.` });
  return { status: warnings.length ? "legacy" : "current", warnings };
}
