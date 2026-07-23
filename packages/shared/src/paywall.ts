import type { Finding } from "./types.js";

/**
 * The free tier is fully unlocked — paths, lines, snippets, fixes,
 * everything. This module used to redact those fields for
 * unlicensed users; that fear-paywall is dead.
 *
 * The functions are kept as identity no-ops so we don't have to
 * ripple-remove them from every caller in one commit — follow-up does
 * the cleanup pass. Do not add new callers.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function redactFinding(finding: Finding, _unlocked: boolean): Finding {
  return finding;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function redactFindings(
  findings: Finding[],
  _unlocked: boolean,
): Finding[] {
  return findings;
}
