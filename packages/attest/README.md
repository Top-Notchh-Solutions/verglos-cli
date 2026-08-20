# @verglos/attest

`@verglos/attest` is the planned signing engine behind `verglos attest`.

Attest turns verified findings into a portable evidence bundle for client handoff. The intended bundle is JSON plus HTML evidence, signed with Ed25519 and anchored to a public verify URL trust chain. That is the Studio wedge: agencies and startups need something they can hand to a client, procurement team, or diligence reviewer without asking that reviewer to trust a local terminal screenshot.

This alpha package is interface scaffolding only. The stable contract is `signBundle(report, signingKey): Promise<AttestationBundle>`, plus the `EvidenceArtifact`, `VerifyChain`, and `AttestationBundle` types in `src/types.ts`. Functional signing, verify URLs, and white-label bundles land in v2.0.0-beta.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md).
