# Verglos CLI Agent Context

Canonical positioning:

> Verglos hunts the vulnerabilities other AI agents left in your code, fires each one in a local sandbox to prove it's real, and signs the surviving evidence so you can hand it to a client.

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
- `verglos hunt` — Pro shell in alpha; functional local sandbox verification lands in v2.0.0-beta.
- `verglos attest` — Studio shell in alpha; functional Ed25519 signing lands in v2.0.0-beta.

## Plan summary

- Free: scan, provenance, slopsquat, local reports, MCP scan, CI critical gate, pre-commit hook.
- Pro $29/mo: hunt Critical + High, MCP hunt tools, fix, CI threshold, `ci --hunt`, continuous CVE monitoring.
- Studio $199/mo: hunt Medium, attest, public verify URL, white-label report, Firecracker adapter, agency dashboard, MCP attest.
- Enterprise: SSO/SCIM, self-hosted verify chain, audit log, custom detector packs.

## Code split

Public Apache-2.0 packages: `scanner`, `cli`, `reporter`, `shared`, `mcp`, `entitlement`.

Private v2.0.0-beta packages: `hunt`, `hunt-rules`, `attest`, `sandbox-adapters`, `agency-dashboard-backend`. In alpha, `packages/hunt` and `packages/attest` are interface scaffolds only.

## Shipping rules

- No AI attribution in commits, PR text, code comments, or docs.
- One logical step per commit.
- Do not invent customers, revenue, maturity, published metrics, or traction.
- Do not implement hunt proof synthesis, sandbox runtime, signing logic, or the ICP-300 v2 scan campaign in alpha.
- `hunt` and `attest` shells exit `78` for entitled users and point to v2.0.0-beta.

## GitHub UI settings

If repository settings are updated through the GitHub UI, keep the public
description aligned to "Security evidence agent for AI-generated code" and keep
the homepage URL set to `https://verglos.com`. Do not describe hunt or attest as
fully functional until the beta implementation ships.
