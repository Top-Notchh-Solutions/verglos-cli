import { z } from "zod";
import { OciPlatformSchema, type OciPlatform } from "./subject.js";

const DIGEST = /^sha256:[a-f0-9]{64}$/;
const TAG = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/;
const REPOSITORY = /^[a-z0-9]+(?:(?:[._-]|\/)[a-z0-9]+)*$/;
const REGISTRY = /^[a-z0-9](?:[a-z0-9.-]{0,252}[a-z0-9])?(?::(?:[1-9][0-9]{0,4}))?$/;

export const OciReferenceSchema = z.object({
  registry: z.string().regex(REGISTRY),
  repository: z.string().regex(REPOSITORY),
  tag: z.string().regex(TAG).optional(),
  digest: z.string().regex(DIGEST).optional(),
  platform: OciPlatformSchema.optional(),
}).strict().refine((value) => value.tag !== undefined || value.digest !== undefined, "OCI reference requires a tag or digest");
export type OciReference = z.infer<typeof OciReferenceSchema>;

export class OciReferenceError extends Error {
  override readonly name = "OciReferenceError";
  constructor(readonly code: "INVALID_REFERENCE" | "INVALID_PLATFORM", message: string) { super(message); }
}

export function parseOciReference(input: string, platform?: string): OciReference {
  if (typeof input !== "string" || input.length > 2048 || /\s/.test(input)) throw new OciReferenceError("INVALID_REFERENCE", "OCI reference contains unsupported characters.");
  if (input.includes("://") || input.includes("@") && input.split("@").length !== 2) throw new OciReferenceError("INVALID_REFERENCE", "OCI reference must not contain a scheme or credentials.");
  const at = input.lastIndexOf("@");
  const base = at >= 0 ? input.slice(0, at) : input;
  const digest = at >= 0 ? input.slice(at + 1) : undefined;
  let registry = "docker.io"; let path = base;
  const firstSlash = base.indexOf("/");
  if (firstSlash > 0 && (base.slice(0, firstSlash).includes(".") || base.slice(0, firstSlash).includes(":") || base.slice(0, firstSlash) === "localhost")) { registry = base.slice(0, firstSlash); path = base.slice(firstSlash + 1); }
  let tag: string | undefined;
  if (digest === undefined) { const colon = path.lastIndexOf(":"); if (colon > path.lastIndexOf("/")) { tag = path.slice(colon + 1); path = path.slice(0, colon); } }
  try {
    const parsedPlatform = platform ? parsePlatform(platform) : undefined;
    return OciReferenceSchema.parse({ registry, repository: path, ...(tag ? { tag } : {}), ...(digest ? { digest } : {}), ...(parsedPlatform ? { platform: parsedPlatform } : {}) });
  } catch (error) { if (error instanceof OciReferenceError) throw error; throw new OciReferenceError(platform && platform.length > 0 ? "INVALID_PLATFORM" : "INVALID_REFERENCE", "OCI reference failed strict validation."); }
}

function parsePlatform(value: string): OciPlatform {
  const [os, architecture, variant] = value.split("/");
  if (!os || !architecture || value.split("/").length > 3) throw new OciReferenceError("INVALID_PLATFORM", "Platform must be os/architecture[/variant].");
  return OciPlatformSchema.parse({ os, architecture, ...(variant ? { variant } : {}) });
}
