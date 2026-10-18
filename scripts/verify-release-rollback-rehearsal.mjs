import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { executeReleaseRollbackRehearsal } from "../packages/cli/dist/release-rollback-plan.js";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(repositoryRoot, "scripts", "fixtures", "release-rollback-rehearsal.json");

const exitCode = await executeReleaseRollbackRehearsal({
  manifestPath,
  json: true,
  quiet: true,
});
if (exitCode !== 0) process.exit(exitCode);
