/** @type {import('@verglos/shared').VerglosConfig} */
module.exports = {
  "plan": "free",
  "failOnCritical": true,
  "failThreshold": 60,
  "ignorePaths": [
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
    "**/files (*)/**",
    "**/local-notes/**",
    "packages/scanner/src/detectors/**",
    "packages/shared/src/explain-bank.ts",
    "packages/mcp/src/tools/check-before-write.ts",
    "packages/scanner/fixtures/**"
  ],
  "secretScanDepth": 100,
  "reportFormat": "both",
  "preCommitHook": true
};
