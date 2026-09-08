# Verglos open-core and commercial boundary

Status: governing inventory for `TRUTH-005`

Reviewed: 2026-09-08

Implementation baseline: `77d72bc`

Scope: `verglos-cli`, `verglos-web`, current embedded data, and target V1 feeds. This is an engineering ownership and release boundary, not a substitute for legal review.

## Boundary rule

Verglos keeps local evidence creation and independent verification useful without a hosted account. Paid value is enforced by server authorization and comes from maintained services, official distribution, retained history, workflow, collaboration, support, and protected trust identities. A removable entitlement check in Apache-licensed client code is never treated as a security or commercial boundary.

Every package and feed has one primary class in this inventory:

- `CORE`: Apache-2.0 local core and public interoperability contracts.
- `HOSTED`: commercially operated control-plane code and service operations; no public source-license grant is established by the current web repository.
- `CONTENT`: separately delivered, continuously maintained rule, policy, or recipe content. It cannot ship until its content license and notices are explicit.
- `IDENTITY`: names, logos, domains, official trust roots, signing identities, credentials, and secrets. Source availability never discloses or grants authority over these assets.
- `THIRD_PARTY`: upstream data, engines, standards implementations, or fixtures governed by their own terms.
- `CUSTOMER`: customer source, configuration, evidence, keys, and tenant data governed by customer authorization and product/privacy contracts, not a Verglos software-content license.

The class describes the asset, not where it happens to be stored. For example, customer evidence stored by the hosted service remains `CUSTOMER`; retention, access control, and delivery operations around it are `HOSTED`.

## Current package ownership

All eight packages under `verglos-cli/packages` declare `Apache-2.0`, including the two packages marked private for npm publication. `private: true` is a publication setting, not a proprietary license. The root Apache license and package declarations are not changed by this task.

| Package | Primary class | Accountable engineering owner | Boundary consequence |
|---|---|---|---|
| `@verglos/shared` | `CORE` | Evidence contracts | Finding, score, configuration, plan-display, fingerprint, and explanation contracts remain open and portable. |
| `@verglos/scanner` | `CORE` | Scanner | Current baseline and capability-gated detector source remains Apache-2.0; existing files cannot be silently reclassified as premium content. |
| `@verglos/reporter` | `CORE` | Evidence presentation | Local JSON/HTML/terminal output remains usable without the hosted service. |
| `@verglos/entitlement` | `CORE` | Entitlement protocol | Token types, verification, public-key handling, and signing primitives are open code. Hosted authorization state and production private keys are separate `HOSTED`/`IDENTITY` assets. |
| `@verglos/mcp` | `CORE` | Agent integration | Local MCP contracts and bounded local tools remain open; an agent receives no extra hosted or signing authority. |
| `verglos` | `CORE` | CLI distribution | The one npm front door, local orchestration, commands, and local artifacts remain Apache-2.0. Official package provenance is an `IDENTITY` boundary. |
| `@verglos/hunt` | `CORE` | Hunt runtime | The current shell and future safe local runner/contracts are core. Separately delivered signed recipe payloads may be `CONTENT`; arbitrary proprietary shell hidden in the package is not the model. |
| `@verglos/attest` | `CORE` | Release Records | Record creation and independent verification contracts remain open. Official or managed signing custody and hosted verification operations are not bundled authority. |

The legal copyright owner and future inbound-contribution mechanism are unresolved and remain assigned to `LIC-005`. The engineering owners above are stewardship roles, not assertions of legal title.

## Hosted application and operations

| Asset or operation | Primary class | Accountable engineering owner | Boundary consequence |
|---|---|---|---|
| `verglos-web` application outside `src/vendor` | `HOSTED` | Hosted platform | Private application code for auth, billing, tenants, licenses, dashboards, monitoring, delivery, retention, and support. Its private package has no license field and the repository exposes no root `LICENSE`; this inventory does not infer a public license grant. |
| `verglos-web/src/vendor/shared/*` | `CORE` | Evidence contracts | Copied CLI-origin source must retain the applicable Apache license and attribution. Exact provenance and modification notices are a `TRUTH-006` blocker. |
| `verglos-web/src/vendor/reporter/*` | `CORE` | Evidence presentation | Copied CLI-origin source remains open-code carry-through inside the hosted app; it is not converted to proprietary code by location. |
| Hosted authentication, tenant authorization, billing, quota, and entitlement decisions | `HOSTED` | Hosted platform | Authorization is enforced against server-owned state even when a caller modifies the CLI. |
| Hosted monitoring schedules, advisory processing, alert delivery, retries, and operational telemetry | `HOSTED` | Monitoring operations | Customers pay for reliable operation, bounded retention, delivery, and support rather than access to removable local checks. |
| Hosted evidence retention, collaboration, approvals, receipts, public-verification delivery, and client workspaces | `HOSTED` | Evidence platform | Canonical facts stay portable; multi-user workflow and managed availability are service value. |
| Private/managed runners, SLA, onboarding, and support | `HOSTED` | Operations | Compute and human service require server-side allowance, cost, and access enforcement. |

No current route may imply that caller-supplied attest summaries are signed Release Records. The hosted attestation prototype remains the partial behavior recorded by `TRUTH-002`.

## Rule, recipe, and data-feed ownership

| Package, dataset, or feed | Current/target | Primary class | Accountable owner | Release rule |
|---|---|---|---|---|
| Detector implementations and rule metadata in `packages/scanner/src/detectors` | current | `CORE` | Scanner | Apache-2.0 source; current so-called Pro detector files remain core regardless of entitlement UX. |
| Explanation bank in `packages/shared/src/explain-bank.ts` | current | `CORE` | Evidence contracts | Ships with the rules it explains and stays available for offline interpretation. |
| Embedded npm-name comparison corpora in scanner and MCP | current | `CORE` | Supply-chain detection | Repository-maintained source data currently ships under the package license; origin/refresh evidence is audited by `TRUTH-006`. |
| `.vgl` schemas, canonicalization rules, verifier, standard import/export contracts, policy-decision vocabulary, and engine manifest schema | target | `CORE` | Evidence contracts | Must be implementable and independently verifiable without a hosted account. |
| Free baseline detector/policy content distributed in the npm package | target | `CORE` | Scanner and policy | Must remain materially useful; paid plans cannot depend on degrading the local baseline. |
| New premium detector packs and policy packs delivered outside the Apache package | target | `CONTENT` | Maintained content | Require an explicit content license, provenance, version/digest, update policy, notices, entitlement, revocation, and offline behavior before distribution. |
| Signed Hunt recipe feed and recipe payloads | target | `CONTENT` | Hunt content | Require the same controls plus supported-rule scope, declared isolation, expiry/revocation, and signature verification. No content license has been selected yet. |
| Content/engine feed formats, client, cache, signature verifier, and trust-store behavior | target | `CORE` | Distribution runtime | Open protocol and verification code; access to a particular maintained payload may still be entitled. |
| Official feed index, package provenance statement, release signature, and compatibility manifest signature | target | `IDENTITY` | Release engineering | Public verification material may be distributed, but only controlled release infrastructure may exercise the official signing identity. |
| npm registry metadata and package documents | current | `THIRD_PARTY` | Supply-chain integrations | Consume under upstream service/data terms; do not present as Verglos-owned content. |
| OSV vulnerability responses | current | `THIRD_PARTY` | Vulnerability intelligence integration | Preserve source attribution and upstream semantics; exact license/terms are resolved in `TRUTH-006`. |
| External engine binaries, databases, rule bundles, and their metadata, including Trivy | target | `THIRD_PARTY` | Engine integrations | Preserve upstream license, notices, source, name, version, database/config digest, and modification status; unknown redistribution status blocks bundling. |
| Imported SARIF, CycloneDX, SPDX, VEX, provenance, and scanner outputs | target | `CUSTOMER` | Import and evidence ingestion | Treat the supplied artifact and embedded third-party notices as customer-controlled input; never claim ownership or endorsement. |
| Scanned source, git history, manifests, lockfiles, images, configs, and generated local evidence | current/target | `CUSTOMER` | Local runtime | Read only within explicit command scope; no ownership transfer. Network and privacy controls are audited by `TRUTH-007`. |
| Monitor registrations, dependency snapshots, report uploads, scan telemetry, score history, and recipient/handoff data | current/target | `CUSTOMER` | Hosted data governance | Raw tenant data remains customer-controlled. Storage, aggregation, access, deletion, and retention are hosted operations governed separately. |
| Customer-managed signing keys and customer/organization identity | target | `CUSTOMER` | Signing and tenant identity | Verglos may verify or use a key under explicit authorization but never treats it as an official Verglos identity. |
| Verglos-authored synthetic acceptance fixtures | target | `CORE` | Release qualification | Publish only when authorship and safe redistribution are established. Intentionally vulnerable fixtures remain non-public unless explicitly approved. |
| Third-party or customer acceptance fixtures | target | `THIRD_PARTY` or `CUSTOMER` | Release qualification | Keep each fixture in its corresponding class with exact commit/digest and license/authorization; unknown status blocks redistribution. |

New material must not be labeled `CONTENT` merely because it is valuable. It qualifies only when it is separately delivered, newly governed, provenance-recorded, and covered by an approved content license. Contributions copied into the Apache tree remain governed by the repository's inbound/outbound terms.

## Protected identity and secret boundary

| Identity or secret | Primary class | Accountable owner | Handling rule |
|---|---|---|---|
| Verglos name, logos, domains, official account identity, and trust claims | `IDENTITY` | Brand owner | Apache-2.0 section 6 does not grant trademark permission except for customary descriptive use. No separate trademark/brand policy exists yet; publication and enforcement require legal/founder approval. |
| Official npm namespace/package, GitHub organization/repositories, domains, deployment identities, and release provenance | `IDENTITY` | Release engineering | Access is least-privilege, auditable, revocable, and never derived from possession of source code. |
| Entitlement, record, recipe, feed, and release private signing keys | `IDENTITY` | Security and release engineering | Generated and used only in approved signing infrastructure/KMS; never committed, logged, included in a package, or sent to a customer. Rotation and revocation are ship gates. |
| Pinned public keys, public certificates, key IDs, transparency references, and verification roots | `IDENTITY` | Security and release engineering | Safe to distribute for verification, but distribution grants verification capability—not authority to sign as Verglos. Placeholder keys are never production trust. |
| License HMAC, JWT, webhook, cron, payment, database, provider, and IP-hashing secrets | `IDENTITY` | Hosted security | Hosted-only secret management with rotation, audit, environment separation, and fail-closed production configuration. |

## Enforcement and migration rules

1. Local scan, import/export, record creation, and independent verification cannot require a hosted account solely to create artificial paid friction.
2. Hosted APIs authorize every tenant, plan, role, allowance, and mutation server-side. The CLI may improve UX but is not the authority.
3. Existing Apache detector, explanation, Hunt-shell, or Attest-shell source is not relicensed by moving or copying it. A proprietary fork does not erase upstream obligations.
4. A separately licensed feed never changes the meaning or verifiability of the public evidence contract. Cached content records source, license, version, digest, entitlement state, expiry, and revocation status.
5. `THIRD_PARTY` assets preserve their own license, notices, attribution, modification status, and identity. Unresolved rights block redistribution, not local architecture work.
6. `CUSTOMER` data is never converted into proprietary rules, public fixtures, benchmarks, or model-training material without explicit authorization and an approved privacy/contract basis.
7. Branding may change presentation only. It cannot rewrite canonical evidence, signer identity, upstream attribution, policy, limitations, or verification results.
8. Paid-plan acceptance must demonstrate value with a modified local CLI. If bypassing a client flag unlocks the paid service, the server boundary has failed.

## Open gates and follow-on ownership

| Gap | Blocking effect | Backlog owner |
|---|---|---|
| Exact copyright owner and inbound contribution terms are not documented. | Blocks accepting material outside contributions and final ownership claims. | `LIC-005` |
| No premium-content license, notice form, or redistribution terms are approved. | Blocks distribution of premium detector/policy packs and Hunt recipes as `CONTENT`. | `LIC-002`, legal approval |
| No root license/notice is present in `verglos-web`, including for copied CLI-origin vendor files. | Blocks a clean redistribution/compliance assertion for the hosted build. | `TRUTH-006`, `LIC-001`, `LIC-003` |
| Third-party dependencies, data APIs, engines, standards tooling, and fixtures are not fully classified. | Unknown classifications block redistribution or bundling. | `TRUTH-006`, `LIC-001`, `LIC-002` |
| No trademark/brand-use policy is published. | Blocks claims about authorized third-party brand use; descriptive Apache use remains governed by section 6. | legal/founder approval |
| Production signing roots, rotation, revocation, and incident procedures are not established. | Blocks trusted official entitlements, feeds, recipes, releases, and records. | `DIST-002`, `DIST-006`, record/signing gates |

`TRUTH-005` changes no runtime behavior, package visibility, license text, plan enforcement, blog content, or landing-page content.
