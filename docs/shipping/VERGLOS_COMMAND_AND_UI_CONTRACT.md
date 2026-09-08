# Verglos command and UI/UX contract

## Design principles

- One primary question per surface: **Can this exact release ship?**
- First view shows decision, change, owner, and missing evidence; detail is progressive disclosure.
- Use plain-language statuses plus technical evidence, never severity color alone.
- Every observation shows source (`Verglos`, `Trivy`, imported tool), subject identity, timestamp, confidence, and coverage class.
- Keep local work useful without signup. Hosted views add memory, collaboration, alerts, and retention.
- Every action is reversible or records an audit event.

Research anchors: [Leadde SaaS explainer framework](https://leadde.ai/blog/how-to-create-a-saas-explainer-video), [GitHub code-scanning alerts](https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning-alerts), [GitLab vulnerability report](https://docs.gitlab.com/user/application_security/vulnerability_report/), [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/).

## CLI command contract

All commands support `--help`, `--json`, `--quiet`, `--config <path>`, `--policy <path>`, and deterministic exit codes. Exact flags are versioned before implementation.

| Command | Purpose | Default output | Paid boundary |
|---|---|---|---|
| `verglos scan [path]` | Native source/dependency inspection | terminal summary + local HTML/JSON | Free |
| `verglos scan --ci` | CI-safe decision and machine output | SARIF/JSON + exit code | Free/basic; policy thresholds Pro+ |
| `verglos evidence import <file>` | Import SARIF, SBOM, VEX, provenance, detect-secrets, or adapter output | normalized observation summary | All |
| `verglos target inspect <path\|image\|artifact>` | Resolve commit, digest, package, image/index, and build identity | subject manifest | All |
| `verglos policy check <record>` | Evaluate thresholds, freshness, exceptions, and coverage | PASS/REVIEW/BLOCK/INCOMPLETE | Basic All; shared policy Team+ |
| `verglos diff <base> <head>` | Show new/fixed/worsened/unchanged evidence | release diff | Free local; hosted history Pro+ |
| `verglos fix <finding>` | Prepare bounded patch, test, rescan | proposed diff + regression result | Pro+ |
| `verglos hunt <finding>` | Run signed, bounded local recipe | structured verdict + limits | Supported Pro+; alpha shell until shipped |
| `verglos record create` | Assemble canonical `.vgl` Release Record | path + digest | All |
| `verglos record sign` | Sign record with configured identity | signature metadata | Guided supported identity Pro+; user-supplied local signing remains open |
| `verglos record verify <file>` | Independently verify record | valid/invalid + reason | All |
| `verglos monitor register` | Register inventory for advisory monitoring | registration id/status | Pro+ |
| `verglos report view <file>` | Open local viewer | browser/local viewer | All |
| `verglos mcp` | Start MCP server using same contracts | capability list | Basic All; advanced Pro+ |

Exit semantics: `0` success/pass, `1` policy block or findings under explicit CI mode, `2` usage/configuration error, `3` incomplete evidence, `78` capability not shipped/available in current alpha. No empty successful result when an engine is missing or stale.

## Local viewer

1. **Release header:** decision, exact subject/digest, policy version, generated time, signer status.
2. **What changed:** new/fixed/worsened/unchanged findings and coverage delta.
3. **Action queue:** critical/high items with owner, reason, fix, rescan, or Hunt eligibility.
4. **Evidence drawer:** source tool, raw artifact link, lineage, confidence, timestamp, and engine health.
5. **Exceptions:** scope, reason, owner, expiry, compensating control.
6. **Export:** `.vgl`, JSON, SARIF, HTML/PDF presentation.

## Hosted dashboard information architecture

### Pro

Home → Releases → Applications → Findings → Monitoring → Alerts → Policy → Members → Billing.

Home shows one decision card, five-application health, recent release changes, expiring exceptions, and allowance usage. Finding detail opens as a side panel before a full page. Pro has two seats, five monitored applications, 100 hosted records/month, and 90-day history at launch defaults.

### Team

Adds Organizations, shared policy versions, approvals, RBAC, CI integrations, Jira/Linear links, and 12-month history. The home view groups by application and owner, not by scanner vendor.

### Studio

Adds Client workspaces, branded record projections, handoff receipts, public verification, custom domains, portfolio status, and 3-year history. Canonical facts remain immutable beneath branding.

### Enterprise

Adds SSO/SCIM, audit log, private runner/verifier, KMS/HSM identity, residency/retention controls, custom detector packs, and contract-specific support/SLA surfaces.

## Non-negotiable UI states

- `PASS`: required checks satisfied; show exact policy and subject.
- `REVIEW`: human decision or evidence gap remains; show owner and next action.
- `BLOCK`: release violates policy; show the blocking observation and remediation path.
- `INCOMPLETE`: engine, artifact, identity, or evidence coverage is missing/stale; never render as green.
- Empty state: explain setup and show a safe sample, never fake customer data.
- Permission denied: reveal no resource existence or private evidence.
- Quota warning: warn at 80%; at 100% preserve records/local operation and require explicit upgrade/overage.
