import { z } from "zod";
import { canonicalizeJson, parseSchemaVersion, type SchemaDescriptor } from "./schema.js";

export const ENGINE_MANIFEST_SCHEMA = { id: "urn:verglos:schema:engine-manifest", version: "1.0.0" } as const satisfies SchemaDescriptor;
const Digest = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const Platform = z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*\/[a-z0-9]+(?:[._-][a-z0-9]+)*$/);
export const EngineManifestSchema = z.object({ schemaId: z.literal(ENGINE_MANIFEST_SCHEMA.id), schemaVersion: z.string().refine((v) => parseSchemaVersion(v) !== null), engineId: z.string().min(1).max(128), version: z.string().min(1).max(128), artifacts: z.array(z.object({ platform: Platform, digest: Digest, size: z.number().int().nonnegative().safe(), source: z.string().url(), license: z.string().min(1).max(128) }).strict()).min(1).max(32), compatibleCli: z.string().min(1).max(128), rollback: z.object({ previousVersion: z.string().min(1).max(128), manifestDigest: Digest }).strict().optional(), signature: z.object({ algorithm: z.literal("ed25519"), keyId: z.string().min(1).max(128), value: z.string().min(1).max(4096) }).strict() }).strict();
export type EngineManifest = z.infer<typeof EngineManifestSchema>;
export function parseEngineManifest(value: unknown): EngineManifest { return EngineManifestSchema.parse(value); }
export function canonicalEngineManifest(value: EngineManifest): string { return canonicalizeJson(parseEngineManifest(value)); }
