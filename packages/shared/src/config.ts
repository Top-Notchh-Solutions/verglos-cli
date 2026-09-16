import { z } from "zod";

export const VerglosConfigSchema = z.object({
  schemaVersion: z.literal("1.0.0").optional(),
  plan: z
    .enum(["free", "pro", "team", "studio", "enterprise", "compliance"])
    .default("free"),
  failOnCritical: z.boolean().default(true),
  failThreshold: z.number().min(0).max(100).default(60),
  ignorePaths: z.array(z.string().max(512)).max(256).default([
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
      sandbox: z.enum(["auto", "docker"]).optional(),
      maxDurationMs: z.number().int().min(1).max(10 * 60 * 1000).optional(),
      skip: z.array(z.string().max(512)).max(256).optional(),
    }).strict()
    .optional(),
  engine: z.object({ id: z.string().min(1).max(128) }).strict().optional(),
  record: z.object({ output: z.string().max(4096) }).strict().optional(),
  telemetry: z.object({ enabled: z.boolean() }).strict().optional(),
  attest: z
    .object({
      signingKeyPath: z.string().max(4096).optional(),
      verifyUrlBase: z.string().url().default("https://verglos.com/verify").optional(),
      whiteLabel: z
        .object({
          logoPath: z.string().max(4096).optional(),
          footer: z.string().max(4096).optional(),
        })
        .optional(),
    }).strict()
    .optional(),
});

export type VerglosConfig = z.infer<typeof VerglosConfigSchema>;

export const DEFAULT_CONFIG: VerglosConfig = VerglosConfigSchema.parse({});

export function mergeConfig(partial: Partial<VerglosConfig>): VerglosConfig {
  return VerglosConfigSchema.parse({ ...DEFAULT_CONFIG, ...partial });
}

export type ConfigMigrationWarning = Readonly<{
  id: "obsolete-sandbox" | "legacy-plan" | "legacy-attest" | "unversioned-config" | "unsupported-version" | "inactive-section" | "unknown-field" | "invalid-value";
  message: string;
}>;

export type ConfigMigrationInspection = Readonly<{
  status: "current" | "legacy" | "invalid";
  warnings: readonly ConfigMigrationWarning[];
}>;

/** Inspect config data without loading, rewriting, or applying it to a command. */
export function inspectConfigMigration(value: unknown): ConfigMigrationInspection {
  const warnings: ConfigMigrationWarning[] = [];
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const hunt = raw.hunt && typeof raw.hunt === "object" ? raw.hunt as Record<string, unknown> : {};
  if (hunt.sandbox === "node-vm" || hunt.sandbox === "firecracker") warnings.push({ id: "obsolete-sandbox", message: `hunt.sandbox=${hunt.sandbox} is obsolete; select a supported adapter explicitly when Hunt execution is shipped.` });
  if (raw.schemaVersion === undefined) warnings.push({ id: "unversioned-config", message: "config has no schemaVersion; add schemaVersion: '1.0.0' after reviewing this read-only migration report." });
  else if (raw.schemaVersion !== "1.0.0") warnings.push({ id: "unsupported-version", message: "schemaVersion is unsupported; use a reader for that version or explicitly migrate to 1.0.0." });
  if (Object.hasOwn(raw, "plan")) warnings.push({ id: "legacy-plan", message: "plan is legacy metadata and is not an entitlement authority; use verified license state." });
  const attest = raw.attest && typeof raw.attest === "object" ? raw.attest as Record<string, unknown> : {};
  if (Object.hasOwn(raw, "hunt")) warnings.push({ id: "inactive-section", message: "hunt settings are validated for migration only; they do not execute recipes or enable the unsupported Hunt command." });
  if (Object.hasOwn(attest, "verifyUrlBase") || Object.hasOwn(attest, "whiteLabel")) warnings.push({ id: "legacy-attest", message: "attest hosted verification and white-label fields are deferred; they are not activated by local config." });
  if (Object.hasOwn(raw, "attest") && !Object.hasOwn(attest, "verifyUrlBase") && !Object.hasOwn(attest, "whiteLabel")) warnings.push({ id: "inactive-section", message: "attest settings are validated for migration only and do not activate record signing or hosted verification." });
  const nestedUnknown = (scope: string, object: Record<string, unknown>, known: readonly string[]) => {
    for (const key of Object.keys(object).sort()) if (!known.includes(key)) warnings.push({ id: "unknown-field", message: `unknown config field '${scope}.${key}' is ignored until a versioned migration defines it.` });
  };
  nestedUnknown("hunt", hunt, ["sandbox", "maxDurationMs", "skip"]);
  nestedUnknown("attest", attest, ["signingKeyPath", "verifyUrlBase", "whiteLabel"]);
  const whiteLabel = attest.whiteLabel && typeof attest.whiteLabel === "object" ? attest.whiteLabel as Record<string, unknown> : {};
  nestedUnknown("attest.whiteLabel", whiteLabel, ["logoPath", "footer"]);
  for (const section of ["engine", "record", "telemetry"] as const) {
    const sectionValue = raw[section];
    if (sectionValue !== undefined && sectionValue !== null && typeof sectionValue === "object" && !Array.isArray(sectionValue)) {
      const message = section === "engine"
        ? "engine settings are validated for migration only and do not select or install an engine; use the explicit engine commands."
        : section === "record"
          ? "record settings are validated for migration only and do not create or upload a record; use explicit record commands."
          : "telemetry settings are validated for migration only and do not grant consent or enable transmission; use the explicit privacy consent flow.";
      warnings.push({ id: "inactive-section", message });
    }
  }
  const engine = raw.engine && typeof raw.engine === "object" && !Array.isArray(raw.engine) ? raw.engine as Record<string, unknown> : {};
  nestedUnknown("engine", engine, ["id"]);
  const record = raw.record && typeof raw.record === "object" && !Array.isArray(raw.record) ? raw.record as Record<string, unknown> : {};
  nestedUnknown("record", record, ["output"]);
  const telemetry = raw.telemetry && typeof raw.telemetry === "object" && !Array.isArray(raw.telemetry) ? raw.telemetry as Record<string, unknown> : {};
  nestedUnknown("telemetry", telemetry, ["enabled"]);
  const knownFields = new Set(["schemaVersion", "plan", "failOnCritical", "failThreshold", "ignorePaths", "secretScanDepth", "reportFormat", "preCommitHook", "hunt", "attest", "engine", "record", "telemetry"]);
  for (const key of Object.keys(raw).sort()) if (!knownFields.has(key)) warnings.push({ id: "unknown-field", message: `unknown config field '${key}' is ignored until a versioned migration defines it.` });
  const parsed = VerglosConfigSchema.safeParse(value);
  if (!parsed.success) {
    let hasUnreportedInvalidValue = false;
    for (const issue of parsed.error.issues) {
      const path = issue.path.map(String).join(".");
      if (issue.code === "unrecognized_keys") continue;
      if (path === "schemaVersion" && warnings.some((warning) => warning.id === "unsupported-version")) { hasUnreportedInvalidValue = true; continue; }
      if (path === "hunt.sandbox" && warnings.some((warning) => warning.id === "obsolete-sandbox")) { hasUnreportedInvalidValue = true; continue; }
      hasUnreportedInvalidValue = true;
      warnings.push({ id: "invalid-value", message: `invalid config value${path ? ` at '${path}'` : ""}: use a value allowed by schemaVersion 1.0.0.` });
    }
    return { status: hasUnreportedInvalidValue ? "invalid" : "legacy", warnings: [...new Map(warnings.map((warning) => [warning.message, warning])).values()] };
  }
  return { status: warnings.length ? "legacy" : "current", warnings };
}
