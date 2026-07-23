import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  riskLevelLabel,
  type Finding,
  type RepoProvenance,
  type ScanResult,
} from "@verglos/shared";

interface SecurityDomain {
  id: number;
  name: string;
  summary: string;
}

interface DomainGroup {
  domain: SecurityDomain;
  findings: Finding[];
  counts: Record<Finding["severity"], number>;
}

const SECURITY_DOMAINS: SecurityDomain[] = [
  {
    id: 1,
    name: "Input Validation and Injection",
    summary: "SQL, command, XSS, traversal, and unsafe user-controlled input.",
  },
  {
    id: 2,
    name: "Authentication and Session",
    summary: "Passwords, tokens, JWTs, cookies, OAuth, MFA, and logout.",
  },
  {
    id: 3,
    name: "Authorization and Access Control",
    summary: "IDOR, mass assignment, privilege checks, and role boundaries.",
  },
  {
    id: 4,
    name: "Cryptography",
    summary: "Secrets, randomness, keys, hashing, encryption, and TLS.",
  },
  {
    id: 5,
    name: "Security Misconfiguration",
    summary: "CORS, headers, debug behavior, unsafe defaults, and verbose errors.",
  },
  {
    id: 6,
    name: "Dependency and Supply Chain",
    summary: "Known CVEs, vulnerable packages, lockfiles, and package risk.",
  },
  {
    id: 7,
    name: "API Security",
    summary: "Rate limits, payload limits, webhook handling, and API exposure.",
  },
  {
    id: 8,
    name: "Data Exposure and Privacy",
    summary: "Sensitive logs, leaked data, git history, and privacy boundaries.",
  },
  {
    id: 9,
    name: "Infrastructure and Runtime",
    summary: "SSRF, runtime execution, environment, containers, and platform risk.",
  },
  {
    id: 10,
    name: "Monitoring and Incident Response",
    summary: "Audit logging, detection coverage, alerting, and response readiness.",
  },
];

const DOMAIN_BY_ID = new Map(SECURITY_DOMAINS.map((domain) => [domain.id, domain]));

function severityColor(severity: Finding["severity"]): string {
  switch (severity) {
    case "critical":
      return "#E85D4C";
    case "high":
      return "#F59E0B";
    case "medium":
      return "#3B82F6";
    case "low":
      return "#6B7280";
    case "info":
      return "#9CA3AF";
  }
}

function createSeverityCounts(): Record<Finding["severity"], number> {
  return {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
}

function domainForFinding(finding: Finding): SecurityDomain {
  const category = finding.category.toLowerCase();
  const title = finding.title.toLowerCase();
  const description = finding.description.toLowerCase();
  const text = `${category} ${title} ${description}`;

  if (finding.detector === "dependencies" || category.includes("dependency")) {
    return DOMAIN_BY_ID.get(6)!;
  }

  if (finding.detector === "secrets" || finding.detector === "git-history") {
    if (finding.detector === "git-history" || text.includes("log")) {
      return DOMAIN_BY_ID.get(8)!;
    }
    return DOMAIN_BY_ID.get(4)!;
  }

  if (
    finding.detector === "injection" ||
    category.includes("injection") ||
    text.includes("xss") ||
    text.includes("sql injection") ||
    text.includes("path traversal") ||
    text.includes("nosql")
  ) {
    if (text.includes("ssrf") || text.includes("shell command") || text.includes("exec")) {
      return DOMAIN_BY_ID.get(9)!;
    }
    if (text.includes("mass assignment")) {
      return DOMAIN_BY_ID.get(3)!;
    }
    return DOMAIN_BY_ID.get(1)!;
  }

  if (
    text.includes("jwt") ||
    text.includes("session") ||
    text.includes("password") ||
    text.includes("token")
  ) {
    return DOMAIN_BY_ID.get(2)!;
  }

  if (
    category.includes("cryptography") ||
    text.includes("math.random") ||
    text.includes("random")
  ) {
    return DOMAIN_BY_ID.get(4)!;
  }

  if (
    category.includes("data exposure") ||
    text.includes("sensitive data") ||
    text.includes("console.log")
  ) {
    return DOMAIN_BY_ID.get(8)!;
  }

  if (text.includes("api") || text.includes("rate limit") || text.includes("body size")) {
    return DOMAIN_BY_ID.get(7)!;
  }

  if (text.includes("audit log") || text.includes("monitoring") || text.includes("incident")) {
    return DOMAIN_BY_ID.get(10)!;
  }

  return DOMAIN_BY_ID.get(5)!;
}

function groupFindingsByDomain(findings: Finding[]): DomainGroup[] {
  const grouped = new Map<number, DomainGroup>();
  for (const domain of SECURITY_DOMAINS) {
    grouped.set(domain.id, {
      domain,
      findings: [],
      counts: createSeverityCounts(),
    });
  }

  for (const finding of findings) {
    const domain = domainForFinding(finding);
    const group = grouped.get(domain.id)!;
    group.findings.push(finding);
    group.counts[finding.severity] = (group.counts[finding.severity] ?? 0) + 1;
  }

  return [...grouped.values()];
}

function domainStatusLabel(count: number): string {
  return count === 0 ? "No findings" : `${count} finding${count === 1 ? "" : "s"}`;
}

function renderDomainPill(group: DomainGroup): string {
  const count = group.findings.length;
  const active = count > 0 ? "active" : "clean";
  return `
    <a class="domain-pill ${active}" href="#domain-${group.domain.id}">
      <span class="domain-number">${group.domain.id.toString().padStart(2, "0")}</span>
      <span>
        <strong>${escapeHtml(group.domain.name)}</strong>
        <small>${domainStatusLabel(count)}</small>
      </span>
    </a>
  `;
}

function renderSeverityStack(counts: Record<Finding["severity"], number>): string {
  const entries: Array<[Finding["severity"], string]> = [
    ["critical", "Critical"],
    ["high", "High"],
    ["medium", "Medium"],
    ["low", "Low"],
    ["info", "Info"],
  ];

  return `
    <div class="severity-stack">
      ${entries
        .filter(([severity]) => (counts[severity] ?? 0) > 0)
        .map(
          ([severity, label]) => `
            <span style="border-color:${severityColor(severity)}33;color:${severityColor(severity)}">
              ${counts[severity] ?? 0} ${label}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderFinding(f: Finding): string {
  const location = f.file
    ? `<span class="location">${f.file}${f.line ? `:${f.line}` : ""}</span>`
    : "";

  const snippet = f.snippet
    ? `<pre class="snippet">${escapeHtml(f.snippet)}</pre>`
    : "";

  const fix = f.fix
    ? `<div class="fix"><strong>Fix:</strong> ${escapeHtml(f.fix)}</div>`
    : "";

  return `
    <div class="finding" data-severity="${f.severity}">
      <div class="finding-header">
        <span class="badge" style="background:${severityColor(f.severity)}">${f.severity.toUpperCase()}</span>
        <span class="detector">${escapeHtml(f.detector.replace("-", " "))}</span>
        <span class="title">${escapeHtml(f.title)}</span>
        ${location}
      </div>
      <p class="description">${escapeHtml(f.description)}</p>
      ${snippet}
      ${fix}
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders the AI-authorship "headline" block — the differentiator
 * Shows the AI-authored
 * percentage as a horizontal bar, the density ratio when guardrails
 * pass, and the "N of M criticals live in AI-authored files" line.
 *
 * If provenance is missing (--no-provenance) or contains no fired
 * signals, this returns an empty string so the report stays clean.
 */
function renderProvenance(p: RepoProvenance | undefined): string {
  if (!p) return "";
  const noEvidence =
    p.confidence === "low" &&
    p.aiAuthoredPercent === 0 &&
    (p.method === "no signals fired" ||
      p.method === "no JS/TS files to analyze");
  if (noEvidence) return "";

  const aiPct = Math.max(0, Math.min(100, p.aiAuthoredPercent));
  const humanPct = 100 - aiPct;
  const ratioLine =
    p.densityRatio !== null
      ? `<p class="prov-ratio">AI-authored files carry <strong>${p.densityRatio}×</strong> the finding density of human-written files.</p>`
      : `<p class="prov-ratio prov-ratio-muted">Density ratio hidden — not enough LOC per bucket to print a defensible number (guardrail).</p>`;

  const criticalsLine =
    p.criticalsTotal > 0
      ? `<p class="prov-line"><span class="prov-num">${p.criticalsInAIFiles}</span> of <span class="prov-num">${p.criticalsTotal}</span> criticals live in AI-authored files.</p>`
      : "";

  return `
    <section class="prov">
      <h2>AI-authorship</h2>
      <p class="section-kicker">Verglos infers who wrote each file — the developer or an AI agent — and shows whether findings cluster on one side. Signals fired: ${escapeHtml(p.method)}. Confidence: <strong>${p.confidence}</strong>. Opt out with <code>verglos scan --no-provenance</code>.</p>
      <div class="prov-bar">
        <div class="prov-bar-ai" style="width:${aiPct}%" title="AI-authored: ${aiPct}%">
          <span class="prov-bar-label">${aiPct}% AI</span>
        </div>
        <div class="prov-bar-human" style="width:${humanPct}%" title="Human-authored: ${humanPct.toFixed(1)}%">
          <span class="prov-bar-label">${humanPct.toFixed(1)}% human</span>
        </div>
      </div>
      ${ratioLine}
      ${criticalsLine}
    </section>
  `;
}

function scoreArc(score: number): string {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score < 50 ? "#E85D4C" : score < 75 ? "#F59E0B" : "#22C55E";

  return `
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#1f1f23" stroke-width="12"/>
      <circle cx="100" cy="100" r="${radius}" fill="none" stroke="${color}" stroke-width="12"
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
        stroke-linecap="round" transform="rotate(-90 100 100)"/>
      <text x="100" y="95" text-anchor="middle" fill="${color}" font-size="36" font-weight="bold" font-family="monospace">${score}</text>
      <text x="100" y="120" text-anchor="middle" fill="#9CA3AF" font-size="12" font-family="monospace">/ 100</text>
    </svg>
  `;
}

export function renderHtmlReport(result: ScanResult): string {
  const { score, findings } = result;
  const testFindings = findings.filter((f) => f.context === "test");
  const mainFindings = findings.filter((f) => f.context !== "test");
  const domainGroups = groupFindingsByDomain(mainFindings);
  const domainsWithFindings = domainGroups.filter((group) => group.findings.length > 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verglos Security Report — Score ${score.value}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #e4e4e7; line-height: 1.6; }
    .container { max-width: 1080px; margin: 0 auto; padding: 2rem; }
    header { text-align: center; padding: 2rem 0; border-bottom: 1px solid #27272a; margin-bottom: 2rem; }
    .logo { font-family: monospace; font-size: 0.75rem; letter-spacing: 0.2em; color: #E85D4C; text-transform: uppercase; }
    h1 { font-size: 1.5rem; margin: 1rem 0 0.5rem; }
    .risk { color: #9CA3AF; font-size: 0.875rem; }
    .gauge { margin: 1.5rem 0; }
    .counts { display: flex; gap: 1.5rem; justify-content: center; margin: 1rem 0; }
    .count { text-align: center; }
    .count-num { font-size: 1.5rem; font-weight: bold; font-family: monospace; }
    .count-label { font-size: 0.75rem; color: #9CA3AF; text-transform: uppercase; }
    .paywall { background: #18181b; border: 1px solid #E85D4C33; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; text-align: center; }
    .paywall h2 { color: #E85D4C; margin-bottom: 0.5rem; }
    .paywall p { color: #9CA3AF; font-size: 0.875rem; }
    .paywall code { background: #27272a; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace; }
    section { margin: 2rem 0; }
    section h2 { font-size: 1.125rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #27272a; }
    .section-kicker { color: #9CA3AF; font-size: 0.875rem; max-width: 680px; margin-top: -0.5rem; margin-bottom: 1rem; }
    .domains-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0 2rem; }
    .domain-pill { display: grid; grid-template-columns: 2.25rem 1fr; gap: 0.75rem; align-items: start; min-height: 4.25rem; padding: 0.875rem; border: 1px solid #27272a; border-radius: 8px; background: #111113; color: #e4e4e7; text-decoration: none; }
    .domain-pill.active { border-color: #E85D4C55; background: #18181b; }
    .domain-pill.clean { color: #a1a1aa; }
    .domain-number { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 999px; background: #0a0a0b; border: 1px solid #27272a; color: #9CA3AF; font-family: monospace; font-size: 0.75rem; }
    .domain-pill.active .domain-number { border-color: #E85D4C66; color: #E85D4C; }
    .domain-pill strong { display: block; font-size: 0.875rem; line-height: 1.25rem; }
    .domain-pill small { display: block; margin-top: 0.25rem; color: #71717a; font-size: 0.75rem; }
    .domain-section { border: 1px solid #27272a; border-radius: 8px; background: #111113; padding: 1rem; }
    .domain-section + .domain-section { margin-top: 1rem; }
    .domain-header { display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; margin-bottom: 1rem; }
    .domain-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .domain-heading h3 { font-size: 1.125rem; line-height: 1.35; }
    .domain-summary { color: #9CA3AF; font-size: 0.875rem; margin-top: 0.25rem; }
    .severity-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .severity-stack span { border: 1px solid; border-radius: 999px; padding: 0.125rem 0.5rem; font-size: 0.6875rem; font-family: monospace; text-transform: uppercase; }
    .finding { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }
    .domain-section .finding:last-child { margin-bottom: 0; }
    .finding-header { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .badge { font-size: 0.625rem; padding: 0.125rem 0.5rem; border-radius: 4px; color: white; font-weight: bold; letter-spacing: 0.05em; }
    .detector { font-size: 0.625rem; padding: 0.125rem 0.5rem; border: 1px solid #3f3f46; border-radius: 4px; color: #a1a1aa; font-family: monospace; text-transform: uppercase; letter-spacing: 0.04em; }
    .title { font-weight: 600; }
    .location { font-family: monospace; font-size: 0.75rem; color: #9CA3AF; }
    .locked { font-size: 0.75rem; color: #E85D4C; }
    .description { font-size: 0.875rem; color: #a1a1aa; }
    .snippet { background: #0a0a0b; border: 1px solid #27272a; border-radius: 4px; padding: 0.75rem; margin: 0.5rem 0; font-family: monospace; font-size: 0.75rem; overflow-x: auto; }
    .fix { background: #052e1620; border-left: 3px solid #22C55E; padding: 0.5rem 0.75rem; margin-top: 0.5rem; font-size: 0.875rem; }
    .upgrade-hint { font-size: 0.75rem; color: #6B7280; margin-top: 0.5rem; font-style: italic; }
    footer { text-align: center; padding: 2rem 0; color: #52525b; font-size: 0.75rem; border-top: 1px solid #27272a; margin-top: 2rem; }
    .meta { font-size: 0.75rem; color: #52525b; margin-top: 0.5rem; }
    .prov { padding: 1.25rem; border: 1px solid #E85D4C40; border-radius: 8px; background: linear-gradient(180deg, #18181b 0%, #111113 100%); }
    .prov h2 { border-bottom: 0; padding-bottom: 0; }
    .prov code { background: #27272a; padding: 0.125rem 0.375rem; border-radius: 4px; font-family: monospace; font-size: 0.75rem; }
    .prov-bar { display: flex; width: 100%; height: 2.5rem; border-radius: 6px; overflow: hidden; border: 1px solid #27272a; margin: 1rem 0 0.75rem; background: #0a0a0b; }
    .prov-bar-ai { background: #E85D4C; color: white; display: flex; align-items: center; justify-content: flex-start; padding: 0 0.75rem; min-width: 0; overflow: hidden; }
    .prov-bar-human { background: #3B82F6; color: white; display: flex; align-items: center; justify-content: flex-end; padding: 0 0.75rem; min-width: 0; overflow: hidden; }
    .prov-bar-label { font-family: monospace; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
    .prov-ratio { color: #fef2f2; font-size: 0.9375rem; margin-top: 0.75rem; }
    .prov-ratio strong { color: #E85D4C; font-family: monospace; font-size: 1.125rem; padding: 0 0.125rem; }
    .prov-ratio-muted { color: #71717a; font-style: italic; font-size: 0.8125rem; }
    .prov-line { color: #d4d4d8; font-size: 0.875rem; margin-top: 0.25rem; }
    .prov-num { color: #E85D4C; font-family: monospace; font-weight: 600; }
    @media (max-width: 760px) {
      .container { padding: 1rem; }
      .counts { gap: 0.75rem; flex-wrap: wrap; }
      .domains-grid { grid-template-columns: 1fr; }
      .domain-header { grid-template-columns: 1fr; gap: 0.75rem; }
      .domain-heading { align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">Verglos</div>
      <h1>Security Report</h1>
      <p class="risk">${riskLevelLabel(score.riskLevel)}</p>
      <div class="gauge">${scoreArc(score.value)}</div>
      <div class="counts">
        <div class="count"><div class="count-num" style="color:#E85D4C">${score.counts.critical}</div><div class="count-label">Critical</div></div>
        <div class="count"><div class="count-num" style="color:#F59E0B">${score.counts.high}</div><div class="count-label">High</div></div>
        <div class="count"><div class="count-num" style="color:#3B82F6">${score.counts.medium}</div><div class="count-label">Medium</div></div>
        <div class="count"><div class="count-num" style="color:#6B7280">${score.counts.low}</div><div class="count-label">Low</div></div>
        <div class="count"><div class="count-num" style="color:#9CA3AF">${score.counts.info}</div><div class="count-label">Info</div></div>
      </div>
      ${score.testFileFindings.total > 0 ? `<p class="meta">Test file findings (review only): ${score.testFileFindings.total}. Excluded from the default score.</p>` : ""}
      <p class="meta">Scanned ${result.scannedAt} · ${result.durationMs}ms · ${result.projectType}</p>
    </header>

    ${renderProvenance(result.provenance)}

    <section>
      <h2>10 Security Domains</h2>
      <p class="section-kicker">Each finding below is grouped by the security domain it belongs to, so you can see whether the risk is about input handling, secrets, dependencies, configuration, or another part of the attack surface.</p>
      <div class="domains-grid">
        ${domainGroups.map(renderDomainPill).join("")}
      </div>
    </section>

    <section>
      <h2>Findings by Domain</h2>
      ${
        domainsWithFindings.length > 0
          ? domainsWithFindings
              .map(
                (group) => `
                  <div class="domain-section" id="domain-${group.domain.id}">
                    <div class="domain-header">
                      <span class="domain-number">${group.domain.id.toString().padStart(2, "0")}</span>
                      <div>
                        <div class="domain-heading">
                          <h3>${escapeHtml(group.domain.name)}</h3>
                          ${renderSeverityStack(group.counts)}
                        </div>
                        <p class="domain-summary">${escapeHtml(group.domain.summary)}</p>
                      </div>
                    </div>
                    ${group.findings.map((f) => renderFinding(f)).join("")}
                  </div>
                `,
              )
              .join("")
          : `<p class="section-kicker">No findings were detected across the 10 security domains.</p>`
      }
    </section>

    ${
      testFindings.length > 0
        ? `
    <section>
      <h2>Test file findings (review only)</h2>
      <p class="section-kicker">${escapeHtml(score.testFileFindings.note)}</p>
      ${testFindings.map((f) => renderFinding(f)).join("")}
    </section>
    `
        : ""
    }

    <footer>
      Generated by <strong>Verglos</strong> · <a href="https://verglos.dev" style="color:#E85D4C">verglos.dev</a>
    </footer>
  </div>
</body>
</html>`;
}

export async function writeHtmlReport(
  result: ScanResult,
  projectRoot: string,
): Promise<string> {
  const path = join(projectRoot, "verglos-report.html");
  await writeFile(path, renderHtmlReport(result), "utf8");
  return path;
}

export function generateBadgeMarkdown(score: number): string {
  const color = score >= 80 ? "brightgreen" : score >= 60 ? "yellow" : "red";
  return `[![Secured by Verglos](https://img.shields.io/badge/Verglos-${score}-${color}?style=flat-square)](https://verglos.dev)`;
}
