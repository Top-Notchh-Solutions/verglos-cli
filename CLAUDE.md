# Verglos CLI Agent Context

Canonical positioning:

> Verglos scans AI-assisted JavaScript and TypeScript locally, with a bounded A1/A2 Hunt verification path and signed evidence moving through the qualification track.

Short form: The evidence agent for AI-generated code.

## Three moats

1. **AI-authorship provenance** — every finding annotated human / AI / mixed with commit-shape + agent-artifact evidence.
2. **Local-first** — scan and hunt run 100% on the developer's machine. Source never leaves. Free tier stays free because there is no cloud LLM cost.
3. **Signed evidence artifact** — Studio wedge. `verglos attest` produces a portable JSON+HTML bundle signed with Ed25519, with a public verify URL.

## Refusals

- Not another autonomous pentester.
- Not a cloud SAST.
- Not a Vanta replacement.
- Not "AI-powered" as a headline claim.

## CLI trio

- `verglos scan` — Free, deterministic local SAST/SCA scanner.
- `verglos hunt` — Pro capability. The public package contains bounded signed-recipe execution through restricted-process A1 probes and pinned-Docker A2 reference harnesses. Final acceptance remains qualification-gated.
- `verglos attest` — Studio shell in alpha; functional Ed25519 signing lands in v2.0.0-beta.

## Plan summary

- Free: scan, provenance, slopsquat, local reports, MCP scan, CI critical gate, pre-commit hook.
- Pro $29/mo: hunt Critical + High, MCP hunt tools, fix, CI threshold, `ci --hunt`, continuous CVE monitoring.
- Studio $199/mo: hunt Medium, attest, public verify URL, white-label report, Firecracker adapter, agency dashboard, MCP attest.
- Enterprise: SSO/SCIM, self-hosted verify chain, audit log, custom detector packs.

## Code split

Public Apache-2.0 packages: `scanner`, `cli`, `reporter`, `shared`, `mcp`, `entitlement`, `hunt`.

Private or hosted-only surfaces: `attest`, `sandbox-adapters` beyond the public Docker adapter, and `agency-dashboard-backend`. `packages/hunt` is public bounded runtime code, not an autonomous pentester.

## Shipping rules

- No AI attribution in commits, PR text, code comments, or docs.
- One logical step per commit.
- Do not invent customers, revenue, maturity, published metrics, or traction.
- Do not claim complete customer-code coverage, general remote DAST, autonomous AI attacking agents, or a host/OS isolation guarantee. A2 reference harnesses are sanitized public fixtures and do not establish final customer acceptance.
- Hunt execution requires an exact supported recipe, trust verification, approval receipt, entitlement, and execution binding. The convenience command remains fail-closed until its release gates pass; the explicit signed execution path is the qualification surface.
- `attest` remains a partial/qualification surface until its signing, hosted publication, and verification gates are complete.
