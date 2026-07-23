/**
 * Continuous CVE monitoring — the Pro-tier feature that watches a
 * registered dep tree against OSV and pings the developer when a
 * new critical/high vuln lands. Types shared between the CLI
 * (registration payload) and the API route (persistence + cron).
 *
 * Delivery channels: email (Resend), Slack (incoming webhook),
 * generic webhook.
 */

export interface MonitorDependency {
  name: string;
  version: string;
}

export interface MonitorRegistration {
  /** From @verglos/entitlement types — same fingerprint as the license. */
  projectFingerprint: string;
  /** Human-safe label the user picks. Defaults to the git repo basename. */
  projectLabel: string;
  /** Flat dep list (dependencies + devDependencies) from package-lock / pnpm-lock. */
  dependencies: MonitorDependency[];
  /** Where to send alerts. At least one channel is required. */
  channels: MonitorChannels;
  /** CLI version doing the registration. */
  cliVersion: string;
}

export interface MonitorChannels {
  email?: string;
  slackWebhookUrl?: string;
  webhookUrl?: string;
}

export type MonitorSeverity = "critical" | "high" | "medium" | "low";

export interface MonitorAlert {
  projectFingerprint: string;
  projectLabel: string;
  package: string;
  installedVersion: string;
  fixedVersion?: string;
  cveId: string;
  severity: MonitorSeverity;
  summary: string;
  discoveredAt: string; // ISO
  /**
   * True when the alert is being sent immediately (critical/high).
   * False when it's being included in the weekly digest.
   */
  immediate: boolean;
}

/**
 * At least one channel must be configured for a registration to
 * be accepted server-side. The CLI already validates this before
 * POSTing so users get a fast error, and the API route re-checks
 * because "never trust the client."
 */
export function validateChannels(channels: MonitorChannels): {
  ok: boolean;
  reason?: string;
} {
  if (
    !channels.email &&
    !channels.slackWebhookUrl &&
    !channels.webhookUrl
  ) {
    return {
      ok: false,
      reason:
        "at least one alert channel is required (email, slackWebhookUrl, or webhookUrl)",
    };
  }
  if (channels.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(channels.email)) {
    return { ok: false, reason: "email is not a valid address" };
  }
  if (
    channels.slackWebhookUrl &&
    !/^https:\/\/hooks\.slack\.com\/services\//.test(channels.slackWebhookUrl)
  ) {
    return {
      ok: false,
      reason: "slackWebhookUrl must start with https://hooks.slack.com/services/",
    };
  }
  if (channels.webhookUrl && !/^https:\/\//.test(channels.webhookUrl)) {
    return { ok: false, reason: "webhookUrl must use https://" };
  }
  return { ok: true };
}
