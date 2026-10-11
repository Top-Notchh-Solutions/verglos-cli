import { createHash, createPublicKey, verify } from "node:crypto";
import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import { canonicalizeJson } from "./schema.js";
import { HuntRecipeSchema, parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";
import { ContentDigestSchema } from "./subject.js";

const SafeId = z.string().min(1).max(512).refine((value) => !/[\u0000-\u001f\u007f]/.test(value));
const HttpsUrl = z.string().url().max(2048).refine((value) => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.hash; } catch { return false; }
}, "must be an HTTPS URL without credentials or fragment");
const Origin = z.string().url().max(512).refine((value) => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash; } catch { return false; }
}, "must be an exact HTTPS origin");
const SignatureSchema = z.object({ algorithm: z.literal("ed25519"), keyId: SafeId, value: z.string().regex(/^(?:[A-Za-z0-9+/]{4}){21}[A-Za-z0-9+/]{2}==$/) }).strict();

const LicenseEvidenceSchema = z.object({
  /** Publisher-declared SPDX identifier; signature binds the declaration but does not grant legal clearance. */
  licenseId: z.string().min(1).max(128).regex(/^[A-Za-z0-9.+-]+$/),
  source: HttpsUrl,
  textDigest: ContentDigestSchema,
  /** Exact UTF-8 license text whose digest is checked locally; source retrieval is deliberately not implicit. */
  licenseText: z.string().min(1).max(262_144),
}).strict().superRefine((value, ctx) => {
  if (value.textDigest.algorithm !== "sha256") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["textDigest", "algorithm"], message: "license text digest must use sha256" });
});

const FeedEntrySchema = z.object({
  recipe: HuntRecipeSchema,
  recipeDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  license: LicenseEvidenceSchema,
}).strict();

const HuntRecipeFeedBaseSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:hunt-recipe-feed"),
  schemaVersion: z.literal("1.0.0"),
  feedId: StableContractIdSchema,
  origin: Origin,
  issuedAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }),
  entries: z.array(FeedEntrySchema).max(4096),
  revokedRecipeIds: z.array(StableContractIdSchema).max(4096),
  signature: SignatureSchema,
}).strict().superRefine((value, ctx) => {
  if (Date.parse(value.expiresAt) <= Date.parse(value.issuedAt)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiresAt"], message: "feed expiry must follow issuance" });
  const ids = value.entries.map((entry) => {
    try { return parseHuntRecipe(entry.recipe).recipeId; } catch { return ""; }
  });
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["entries"], message: "feed recipe IDs must be unique" });
  if (new Set(value.revokedRecipeIds).size !== value.revokedRecipeIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["revokedRecipeIds"], message: "revoked recipe IDs must be unique" });
});

export type HuntRecipeFeedDocument = z.infer<typeof HuntRecipeFeedBaseSchema>;

export const HuntRecipeTrustStoreSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:hunt-recipe-trust-store"),
  schemaVersion: z.literal("1.0.0"),
  feeds: z.array(z.object({
    feedId: StableContractIdSchema,
    origin: Origin,
  keys: z.array(z.object({
      keyId: SafeId,
      publicKeyPem: z.string().min(64).max(16_384),
      notBefore: z.string().datetime({ offset: true }).optional(),
      expiresAt: z.string().datetime({ offset: true }).optional(),
  }).strict().superRefine((key, ctx) => {
    if (key.notBefore && key.expiresAt && Date.parse(key.expiresAt) <= Date.parse(key.notBefore)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiresAt"], message: "key expiry must follow its validity start" });
    }
  })).min(1).max(64),
  }).strict()).max(128),
  signedFeeds: z.array(HuntRecipeFeedBaseSchema).max(128),
}).strict().superRefine((value, ctx) => {
  const feedIds = value.feeds.map((feed) => feed.feedId);
  if (new Set(feedIds).size !== feedIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["feeds"], message: "trusted feed IDs must be unique" });
  for (const feed of value.feeds) {
    const keyIds = feed.keys.map((key) => key.keyId);
    if (new Set(keyIds).size !== keyIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["feeds"], message: `feed ${feed.feedId} has duplicate key IDs` });
  }
  const signedIds = value.signedFeeds.map((feed) => feed.feedId);
  if (new Set(signedIds).size !== signedIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["signedFeeds"], message: "trust store must contain at most one signed feed per feed ID" });
});

export type HuntRecipeTrustStore = z.infer<typeof HuntRecipeTrustStoreSchema>;
/** Compatibility name retained for the planner/runner APIs; this is now a cryptographic trust store, not a signer allowlist. */
export type HuntRecipeTrustPolicy = HuntRecipeTrustStore;

export function parseHuntRecipeTrustPolicy(value: unknown): HuntRecipeTrustStore {
  const parsed = HuntRecipeTrustStoreSchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid Hunt trust store: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  return parsed.data;
}

export function huntRecipeDigest(recipe: HuntRecipe): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(parseHuntRecipe(recipe)), "utf8").digest("hex")}`;
}

export function huntRecipeTrustPolicyDigest(policy: HuntRecipeTrustStore): string {
  const parsed = parseHuntRecipeTrustPolicy(policy);
  const canonical = {
    ...parsed,
    feeds: [...parsed.feeds].sort((a, b) => a.feedId.localeCompare(b.feedId)).map((feed) => ({ ...feed, keys: [...feed.keys].sort((a, b) => a.keyId.localeCompare(b.keyId)) })),
    signedFeeds: [...parsed.signedFeeds].sort((a, b) => a.feedId.localeCompare(b.feedId)),
  };
  return `sha256:${createHash("sha256").update(canonicalizeJson(canonical), "utf8").digest("hex")}`;
}

export type HuntRecipeTrustFailure = "unknown-feed" | "feed-origin-mismatch" | "unknown-key" | "key-not-valid" | "invalid-signature" | "feed-not-current" | "recipe-not-found" | "recipe-digest-mismatch" | "recipe-revoked" | "recipe-signer-mismatch" | "recipe-signature-status-invalid" | "license-digest-mismatch";
export type HuntRecipeVerification =
  | { readonly trusted: true; readonly executable: boolean; readonly feedId: string; readonly origin: string; readonly keyId: string; readonly feedDigest: string; readonly recipeDigest: string; readonly license: z.infer<typeof LicenseEvidenceSchema>; readonly limitation: "signed publisher license declaration and embedded text digest verified; legal clearance is not implied" }
  | { readonly trusted: false; readonly reason: HuntRecipeTrustFailure };

function verifyFeedSignature(feed: HuntRecipeFeedDocument, keyPem: string): boolean {
  try {
    const publicKey = createPublicKey(keyPem);
    if (publicKey.asymmetricKeyType !== "ed25519") return false;
    const { signature, ...unsigned } = feed;
    return verify(null, Buffer.from(canonicalizeJson(unsigned), "utf8"), publicKey, Buffer.from(signature.value, "base64"));
  } catch { return false; }
}

export function verifyHuntRecipe(
  recipeValue: HuntRecipe,
  trustValue: HuntRecipeTrustStore,
  at = new Date().toISOString(),
): HuntRecipeVerification {
  try {
    const recipe = parseHuntRecipe(recipeValue);
    const trust = parseHuntRecipeTrustPolicy(trustValue);
    if (!Number.isFinite(Date.parse(at))) return { trusted: false, reason: "feed-not-current" };
    const candidateFeeds = trust.signedFeeds.filter((entry) => entry.entries.some((candidate) => candidate.recipe.recipeId === recipe.recipeId));
    const feed = candidateFeeds.find((entry) => trust.feeds.some((root) => root.feedId === entry.feedId))
      ?? trust.signedFeeds.find((entry) => trust.feeds.some((root) => root.feedId === entry.feedId));
    if (!feed) return { trusted: false, reason: "unknown-feed" };
    const root = trust.feeds.find((entry) => entry.feedId === feed.feedId);
    if (!root) return { trusted: false, reason: "unknown-feed" };
    if (root.origin !== feed.origin) return { trusted: false, reason: "feed-origin-mismatch" };
    const key = root.keys.find((entry) => entry.keyId === feed.signature.keyId);
    if (!key) return { trusted: false, reason: "unknown-key" };
    const atMs = Date.parse(at);
    if ((key.notBefore && atMs < Date.parse(key.notBefore)) || (key.expiresAt && atMs >= Date.parse(key.expiresAt))) return { trusted: false, reason: "key-not-valid" };
    if (Date.parse(feed.issuedAt) > atMs || Date.parse(feed.expiresAt) <= atMs) return { trusted: false, reason: "feed-not-current" };
    if (!verifyFeedSignature(feed, key.publicKeyPem)) return { trusted: false, reason: "invalid-signature" };
    const digest = huntRecipeDigest(recipe);
    const entry = feed.entries.find((candidate) => {
      try { return parseHuntRecipe(candidate.recipe).recipeId === recipe.recipeId; } catch { return false; }
    });
    if (!entry) return { trusted: false, reason: "recipe-not-found" };
    if (feed.revokedRecipeIds.includes(recipe.recipeId)) return { trusted: false, reason: "recipe-revoked" };
    if (entry.recipeDigest !== digest || huntRecipeDigest(parseHuntRecipe(entry.recipe)) !== entry.recipeDigest) return { trusted: false, reason: "recipe-digest-mismatch" };
    if (recipe.signature.signer !== feed.signature.keyId) return { trusted: false, reason: "recipe-signer-mismatch" };
    if (recipe.signature.status !== "verified") return { trusted: false, reason: "recipe-signature-status-invalid" };
    const licenseDigest = `sha256:${createHash("sha256").update(entry.license.licenseText, "utf8").digest("hex")}`;
    if (entry.license.textDigest.algorithm !== "sha256" || entry.license.textDigest.value !== licenseDigest.slice("sha256:".length)) return { trusted: false, reason: "license-digest-mismatch" };
    return {
      trusted: true,
      executable: true,
      feedId: feed.feedId,
      origin: feed.origin,
      keyId: feed.signature.keyId,
      feedDigest: `sha256:${createHash("sha256").update(canonicalizeJson(feed), "utf8").digest("hex")}`,
      recipeDigest: digest,
      license: entry.license,
      limitation: "signed publisher license declaration and embedded text digest verified; legal clearance is not implied",
    };
  } catch {
    return { trusted: false, reason: "invalid-signature" };
  }
}

export function isTrustedHuntRecipe(recipe: HuntRecipe, trust: HuntRecipeTrustStore, at?: string): boolean {
  return verifyHuntRecipe(recipe, trust, at).trusted;
}

export function isExecutableHuntRecipe(recipe: HuntRecipe, trust: HuntRecipeTrustStore, at?: string): boolean {
  const result = verifyHuntRecipe(recipe, trust, at);
  return result.trusted && result.executable;
}
