import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import {
  canonicalizeJson,
  parseHuntRecipe,
  parseHuntRecipeTrustPolicy,
  huntRecipeTrustPolicyDigest,
  verifyHuntRecipe,
} from "@verglos/shared";

const MAX_TRUST_INPUT_BYTES = 32 * 1024 * 1024;

async function readBoundedRegularJson(path: string, label: string): Promise<unknown> {
  if (!path || path.length > 4096 || /[\u0000-\u001f\u007f]/.test(path)) throw new Error(`${label} path is invalid`);
  const before = await lstat(path);
  if (!before.isFile()) throw new Error(`${label} must be a regular file`);
  if (before.size > MAX_TRUST_INPUT_BYTES) throw new Error(`${label} exceeds the 32 MiB limit`);
  const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
  const handle = await open(path, flags);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_TRUST_INPUT_BYTES) throw new Error(`${label} must be a bounded regular file`);
    const bytes = await handle.readFile();
    if (bytes.byteLength > MAX_TRUST_INPUT_BYTES) throw new Error(`${label} exceeds the 32 MiB limit`);
    let value: unknown;
    try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { throw new Error(`${label} must contain valid UTF-8 JSON`); }
    return value;
  } finally {
    await handle.close();
  }
}

/** Verify a recipe against the caller-supplied, locally persisted trust store. This does not execute recipes or confer official trust by itself. */
export async function executeHuntRecipeVerification(
  recipePath: string,
  trustStorePath: string,
  options: { readonly json?: boolean; readonly quiet?: boolean; readonly at?: string } = {},
): Promise<number> {
  try {
    const [recipeValue, trustValue] = await Promise.all([
      readBoundedRegularJson(recipePath, "Hunt recipe"),
      readBoundedRegularJson(trustStorePath, "Hunt trust store"),
    ]);
    const recipe = parseHuntRecipe(recipeValue);
    const trustStore = parseHuntRecipeTrustPolicy(trustValue);
    const result = verifyHuntRecipe(recipe, trustStore, options.at ?? new Date().toISOString());
    const projection = result.trusted
      ? {
          verified: true,
          recipeTrustedByProvidedStore: true,
          recipeId: recipe.recipeId,
          ruleId: recipe.ruleId,
          trustStoreDigest: huntRecipeTrustPolicyDigest(trustStore),
          feedId: result.feedId,
          feedOrigin: result.origin,
          feedDigest: result.feedDigest,
          recipeDigest: result.recipeDigest,
          license: { id: result.license.licenseId, source: result.license.source, textDigest: result.license.textDigest },
          legalClearance: false,
          executionAuthorized: false,
          limitation: result.limitation,
          trustLimitation: "verification is relative to this caller-supplied trust store; publisher-root authenticity must be established out of band",
        }
      : {
          verified: false,
          recipeTrustedByProvidedStore: false,
          recipeId: recipe.recipeId,
          trustStoreDigest: huntRecipeTrustPolicyDigest(trustStore),
          reason: result.reason,
          legalClearance: false,
          executionAuthorized: false,
          trustLimitation: "verification is relative to this caller-supplied trust store; publisher-root authenticity must be established out of band",
        };
    if (options.json) console.log(canonicalizeJson(projection));
    else if (!options.quiet) {
      console.log(projection.verified
        ? `Recipe ${recipe.recipeId} verifies against the provided local trust store; execution is not authorized.`
        : `Recipe ${recipe.recipeId} is not trusted by the provided local trust store (${projection.reason}).`);
    }
    return result.trusted ? 0 : 2;
  } catch (error) {
    if (options.json) console.log(JSON.stringify({ status: "error", code: "HUNT_RECIPE_VERIFY_INPUT", message: "recipe verification input is invalid" }));
    else if (!options.quiet) console.error(error instanceof Error ? error.message : "recipe verification failed");
    return 78;
  }
}
