import { z } from "zod";
import { projectPublicRecord } from "./public-record-projection.js";
import { parseReleaseDecisionJson, type ReleaseDecisionDocument } from "./release-decision.js";
import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { canonicalizeJson } from "./schema.js";

export const RELEASE_RECORD_PACKAGE_SCHEMA = { id: "urn:verglos:schema:release-record-package", version: "1.0.0" } as const;
export const RELEASE_RECORD_PACKAGE_FILES = {
  descriptor: ".vgl-package.json",
  viewer: ".vgl-viewer.html",
  export: ".vgl-release.intoto.json",
  signature: ".vgl-signature.json",
} as const;

const DescriptorSchema = z.object({
  schemaId: z.literal(RELEASE_RECORD_PACKAGE_SCHEMA.id),
  schemaVersion: z.literal(RELEASE_RECORD_PACKAGE_SCHEMA.version),
  transport: z.literal("directory-v1"),
  manifestDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u),
  signatureIncluded: z.boolean(),
}).strict();

export type ReleaseRecordPackageDescriptor = z.infer<typeof DescriptorSchema>;

export function createReleaseRecordPackageDescriptor(manifest: ReleaseRecordManifestDocument, signatureIncluded: boolean): ReleaseRecordPackageDescriptor {
  const parsed = parseReleaseRecordManifest(manifest);
  return DescriptorSchema.parse({
    schemaId: RELEASE_RECORD_PACKAGE_SCHEMA.id,
    schemaVersion: RELEASE_RECORD_PACKAGE_SCHEMA.version,
    transport: "directory-v1",
    manifestDigest: releaseRecordManifestDigest(parsed),
    signatureIncluded,
  });
}

export function parseReleaseRecordPackageDescriptor(value: unknown): ReleaseRecordPackageDescriptor {
  return DescriptorSchema.parse(value);
}

/** Render only fixed, allowlisted record facts; never embed member or limitation text. */
export function renderReleaseRecordViewer(input: {
  readonly manifest: ReleaseRecordManifestDocument;
  readonly decision: ReleaseDecisionDocument;
  readonly signatureIncluded: boolean;
}): string {
  const manifest = parseReleaseRecordManifest(input.manifest);
  const projection = projectPublicRecord(manifest);
  const decision = parseReleaseDecisionJson(canonicalizeJson(input.decision));
  const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
  if (!decisionMember) throw new Error("record viewer requires a release-decision member");

  const fields = [
    ["Decision", decision.decision],
    ["Subjects", String(decision.subjects.length)],
    ["Generated", projection.generatedAt],
    ["Manifest digest", projection.manifestDigest],
    ["Decision member digest", `${decisionMember.digest.algorithm}:${decisionMember.digest.value}`],
    ["Redaction declaration", projection.redaction.status],
    ["Limitations", String(projection.limitations.length)],
    ["Detached signature", input.signatureIncluded
      ? "Included; signer identity is not verified by this static viewer."
      : "Not included."],
  ] as const;
  const rows = fields.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("\n");

  return [
    "<!doctype html>", "<html lang=\"en\">", "<head>", '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'">',
    "<title>Verglos Release Record</title>", "</head>", "<body>", "<main>",
    "<h1>Verglos Release Record</h1>",
    "<p>This is a limited, static summary. Verify the original package and its signature against a separately trusted key before relying on signer identity.</p>",
    "<p>Redaction metadata is producer-declared and is not independent proof of sanitization. The package may contain sensitive evidence; inspect it and keep it private before sharing.</p>",
    `<dl>${rows}</dl>`, "</main>", "</body>", "</html>", "",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}
