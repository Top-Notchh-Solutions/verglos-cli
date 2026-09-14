import { randomUUID } from "node:crypto";
import { computeProjectFingerprint } from "@verglos/shared";
import type { ScanResult } from "@verglos/shared";
import { DEFAULT_API_URL, loadCredentials } from "./credentials.js";

/**
 * Account score history is a product-sync operation, not analytics. It uses
 * its own authenticated endpoint and allowlisted schema; it is skipped when
 * no paid account credential or stable project fingerprint is available.
 */
export async function sendAccountScanSync(
  result: ScanResult,
  options: { projectRoot: string; cliVersion: string },
): Promise<void> {
  const credentials = await loadCredentials();
  if (!credentials.licenseKey) return;

  const project = await computeProjectFingerprint(options.projectRoot);
  if (!project.fingerprint) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    await fetch(`${DEFAULT_API_URL}/api/v1/account/scan-sync`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${credentials.licenseKey}`,
      },
      body: JSON.stringify({
        event_id: randomUUID(),
        project_fingerprint: project.fingerprint,
        score: result.score.value,
        finding_critical: result.score.counts.critical,
        finding_high: result.score.counts.high,
        cli_version: options.cliVersion,
      }),
      signal: controller.signal,
    });
  } catch {
    // A score sync outage must never fail or delay the local scan result.
  } finally {
    clearTimeout(timer);
  }
}
