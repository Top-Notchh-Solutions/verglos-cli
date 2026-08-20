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
