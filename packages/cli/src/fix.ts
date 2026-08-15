import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { detectProjectType } from "@verglos/scanner";
import type { ProjectType } from "@verglos/shared";

/**
 * Framework-aware security header injection for `verglos fix`.
 *
 * Two shapes:
 *
 *   1. Next.js — direct patch of next.config.js. Existing behavior;
 *      the file is standard and users expect security headers to
 *      live there. Only modifies if the file already declares
 *      `const nextConfig = { ... }` and doesn't already have CSP.
 *
 *   2. Everything else — write a new file at
 *      `src/verglos-security-headers.ts` (or the closest equivalent
 *      given the framework), then print a snippet the user pastes
 *      into their app entry. Never edits the entry file.
 */

interface FixResult {
  file: string;
  action: "created" | "patched" | "skipped";
  instructions?: string;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function pickSrcDir(projectRoot: string): Promise<string> {
  if (await fileExists(join(projectRoot, "src"))) return "src";
  return ".";
}

// ── Next.js ────────────────────────────────────────────────────────────────

async function fixNextjs(projectRoot: string): Promise<FixResult | null> {
  const candidates = ["next.config.js", "next.config.mjs", "next.config.ts"];
  for (const name of candidates) {
    const path = join(projectRoot, name);
    let content: string;
    try {
      content = await readFile(path, "utf8");
    } catch {
      continue;
    }

    if (content.includes("Content-Security-Policy") || content.includes("X-Frame-Options")) {
      return { file: name, action: "skipped" };
    }

    const headersBlock = `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },`;

    if (NEXT_CONFIG_DECL.test(content)) {
      const updated = content.replace(
        NEXT_CONFIG_DECL,
        (match) => `${match}${headersBlock}`,
      );
      await writeFile(path, updated, "utf8");
      return { file: name, action: "patched" };
    }
  }
  return null;
}

/**
 * Matches every real-world shape of the Next.js config declaration we
 * expect to encounter. Kept exported for unit testing.
 *
 * Accepts:
 *   const nextConfig = {
 *   let nextConfig = {
 *   const nextConfig: NextConfig = {                      ← Next 14/15 default
 *   const nextConfig: NextConfig<Options> = {             ← generic type arg
 *   const nextConfig satisfies NextConfig = {             ← satisfies clause
 *
 * Rejects deliberately:
 *   const nextConfig: NextConfig<{ inline: object }> = {  ← inline object
 *     types are exotic in real configs and would require a real parser
 *     to disambiguate the closing `>` from the declaration `= {`. When
 *     hit, `verglos fix` falls through to the middleware-style path
 *     (writes src/verglos-security-headers.ts) which is safe.
 *
 * The identifier-name-first alternation and the tight character class
 * inside the generic argument prevent this from matching arbitrary
 * `= {` on unrelated lines.
 */
export const NEXT_CONFIG_DECL =
  /(?:const|let)\s+nextConfig(?:\s*:\s*[A-Za-z_$][\w$]*(?:\s*<\s*[\w$,\s]+\s*>)?|\s+satisfies\s+[A-Za-z_$][\w$]*(?:\s*<\s*[\w$,\s]+\s*>)?)?\s*=\s*\{/;

// ── Middleware-style frameworks (Express / Hono / Fastify / Nest) ─────────

const HEADERS_HELPER_TS = `/**
 * Verglos security headers. Injected by \`verglos fix --headers\`.
 * @see https://verglos.com/docs/headers
 */

export const VERGLOS_SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
`;

const HEADERS_HELPER_EXTRAS: Partial<Record<ProjectType, string>> = {
  express: `
export function verglosSecurityHeadersExpress(_req: unknown, res: {
  setHeader(name: string, value: string): void;
}, next: () => void) {
  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) {
    res.setHeader(k, v);
  }
  next();
}
`,
  fastify: `
export function verglosSecurityHeadersFastify(
  _req: unknown,
  reply: { header(name: string, value: string): void },
  done: () => void,
) {
  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) {
    reply.header(k, v);
  }
  done();
}
`,
};

const WIRE_INSTRUCTIONS: Partial<Record<ProjectType, string>> = {
  express:
    "Wire it in with:\n" +
    "  import { verglosSecurityHeadersExpress } from './verglos-security-headers';\n" +
    "  app.use(verglosSecurityHeadersExpress);",
  fastify:
    "Wire it in with:\n" +
    "  import { verglosSecurityHeadersFastify } from './verglos-security-headers';\n" +
    "  app.addHook('onSend', verglosSecurityHeadersFastify);",
  node:
    "In your request handler:\n" +
    "  import { VERGLOS_SECURITY_HEADERS } from './verglos-security-headers';\n" +
    "  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) res.setHeader(k, v);",
  react:
    "React apps set headers server-side. Configure your host (Vercel / Netlify / nginx) using VERGLOS_SECURITY_HEADERS as the source of truth.",
};

async function fixWithHelperFile(
  projectRoot: string,
  projectType: ProjectType,
): Promise<FixResult> {
  const srcDir = await pickSrcDir(projectRoot);
  const helperPath = join(projectRoot, srcDir, "verglos-security-headers.ts");
  const alreadyExists = await fileExists(helperPath);
  if (alreadyExists) return { file: helperPath, action: "skipped" };

  await mkdir(dirname(helperPath), { recursive: true });
  const extras = HEADERS_HELPER_EXTRAS[projectType] ?? "";
  await writeFile(helperPath, HEADERS_HELPER_TS + extras, "utf8");

  const wire = WIRE_INSTRUCTIONS[projectType] ??
    "Import VERGLOS_SECURITY_HEADERS and set each key on your outgoing responses.";
  return {
    file: helperPath,
    action: "created",
    instructions: wire,
  };
}

// ── Public entry point ────────────────────────────────────────────────────

/**
 * Returns the number of files created or patched. Prints per-file
 * status to stdout; instructions when a helper file was created.
 */
export async function applyHeaderFixes(projectRoot: string): Promise<number> {
  const { type } = await detectProjectType(projectRoot);
  let changed = 0;

  if (type === "nextjs") {
    const result = await fixNextjs(projectRoot);
    if (result?.action === "patched") {
      console.log(chalk.green(`  ✓ Patched ${result.file} with security headers`));
      changed++;
    } else if (result?.action === "skipped") {
      console.log(chalk.gray(`  · ${result.file} already declares security headers`));
    } else {
      console.log(
        chalk.gray(
          "  · No next.config.* with a `const nextConfig = { … }` block — skipping.",
        ),
      );
    }
    return changed;
  }

  if (type === "express" || type === "fastify" || type === "node" || type === "react") {
    const result = await fixWithHelperFile(projectRoot, type);
    if (result.action === "created") {
      console.log(chalk.green(`  ✓ Created ${result.file}`));
      if (result.instructions) {
        console.log("");
        for (const line of result.instructions.split("\n")) {
          console.log(chalk.gray("    " + line));
        }
      }
      changed++;
    } else {
      console.log(chalk.gray(`  · ${result.file} already exists — skipping.`));
    }
    return changed;
  }

  console.log(
    chalk.gray(
      `  · Detected project type "${type}" — no header template available yet.`,
    ),
  );
  return changed;
}
