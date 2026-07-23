import type { Finding } from "@verglos/shared";

const TEST_FILE_PATTERNS = [
  /(?:^|\/)__tests__\//,
  /\.(?:spec|test)\.[cm]?[jt]sx?$/,
  /(?:^|\/)fixtures\//,
  /(?:^|\/)mocks\//,
  /(?:^|\/)__mocks__\//,
  /(?:^|\/)test-utils\.[cm]?[jt]sx?$/,
  /(?:^|\/)testdata\//,
  /(?:^|\/)e2e\//,
];

const SEVERITY_ORDER: Record<Finding["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

export function isTestFile(file?: string): boolean {
  if (!file) return false;
  return TEST_FILE_PATTERNS.some((pattern) => pattern.test(file));
}

/**
 * Match lines shaped like `key: "value"` or `key = "value"` where key
 * is a detector-metadata field — the *definition* of a vulnerability,
 * not an execution of one. Keeps the list narrow to noise-source keys
 * (bad/example/snippet/etc.) so common identifiers like `title` or
 * `description` in real code aren't accidentally suppressed.
 */
const METADATA_KEY_LINE =
  /^\s*(?:bad|good|example|snippet|why|fix|refs|rule|pattern|category|desc|covers|placeholder|hint|note)\s*[:=]\s*[`'"]/;

export function isMetadataKeyLine(line: string): boolean {
  return METADATA_KEY_LINE.test(line);
}

export function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const contextRank = contextSortRank(a) - contextSortRank(b);
    if (contextRank !== 0) return contextRank;

    const severityRank = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityRank !== 0) return severityRank;

    return `${a.file ?? ""}:${a.line ?? 0}:${a.title}`.localeCompare(
      `${b.file ?? ""}:${b.line ?? 0}:${b.title}`,
    );
  });
}

export function classifyFindings(findings: Finding[], strict = false): Finding[] {
  return sortFindings(
    findings.map((finding) => {
      if (isTestFile(finding.file)) {
        if (strict && finding.severity !== "info") {
          return {
            ...finding,
            context: "test",
            description: appendContextNote(finding.description, testNoteFor(finding)),
          };
        }

        return {
          ...finding,
          context: "test",
          severity: "info",
          description: appendContextNote(finding.description, testNoteFor(finding)),
        };
      }

      if (finding.context === "placeholder" || finding.context === "enum") {
        return finding;
      }

      return { ...finding, context: finding.context ?? "production" };
    }),
  );
}

function contextSortRank(finding: Finding): number {
  if (finding.context === "test") return 2;
  if (finding.severity === "info") return 1;
  return 0;
}

function appendContextNote(description: string, note: string): string {
  return description.includes(note) ? description : `${description} ${note}`;
}

function testNoteFor(finding: Finding): string {
  if (
    finding.detector === "secrets" &&
    /private key|begin .*private key/i.test(`${finding.title} ${finding.snippet ?? ""}`)
  ) {
    return "Private keys in test files are typically generated test fixtures for cryptographic unit tests. Confirm this key is not reused in any production environment.";
  }

  return "Found in test file — likely intentional test fixture. Verify this is not a real credential.";
}
