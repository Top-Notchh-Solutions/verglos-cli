# External engines, standards, and fixture license record

Status: technical license/provenance record only. This file is private and is **not** legal approval, redistribution authorization, or an independent review.

Reviewed by implementation owner: 2026-10-03
Final legal reviewer: pending
Final approval date: pending

## Trivy adapter

- Upstream: https://github.com/aquasecurity/trivy
- Selected release: `v0.74.0`
- Selected runtime image: `ghcr.io/aquasecurity/trivy@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969` (the adapter's pinned digest; verify against the release artifact before use)
- Upstream revision observed locally: `e1fd17a0ea4a8cf24bc4b4dd7e2cfbf4bb31b994`
- License evidence: upstream `LICENSE` declares Apache-2.0; upstream `NOTICE` carries Aqua Security copyright/product attribution. Immutable release URLs: `https://github.com/aquasecurity/trivy/blob/v0.74.0/LICENSE` and `https://github.com/aquasecurity/trivy/blob/v0.74.0/NOTICE`.
- Redistribution permission: Apache-2.0 permits redistribution and modification subject to its conditions; the image and all layers/database content remain a separate artifact review.
- Modification permission: only under Apache-2.0 conditions; modified upstream files must be marked and notices retained.
- Attribution: retain Apache license, applicable NOTICE text, Aqua attribution, and identify Verglos changes if any.
- Trademark: do not imply Aqua/Trivy endorsement, certification, or sponsorship.
- Current use: operator-installed optional OCI runtime; not bundled in Verglos npm archives. The adapter disables pulls/network and does not establish vulnerability-database freshness.
- Unresolved restrictions: image signature/provenance, layer-by-layer notices, vulnerability database/source terms, and any future bundling path require separate review.

## Yelp detect-secrets boundary

- Upstream: https://github.com/Yelp/detect-secrets
- Selected release/digest: none. Verglos accepts an explicit operator executable path and probes only `--version`; no executable is bundled or selected.
- License evidence: upstream repository identifies Apache-2.0. The moving `master` page is not an immutable release record.
- Redistribution permission: not claimed because no executable/version is redistributed by Verglos.
- Modification permission: not applicable to the current adapter; any future fork or bundled binary requires immutable source/release evidence and Apache conditions.
- Attribution: if bundled later, retain upstream license/notice and identify the exact release.
- Trademark: do not imply Yelp endorsement or certify the external executable.
- Unresolved restrictions: immutable release, executable digest, transitive Python dependency notices, and any redistribution/source-offer obligations.

## Sigstore libraries and test fixtures

- Upstream: https://github.com/sigstore/sigstore-js and https://github.com/sigstore/community
- Selected package versions: `@sigstore/bundle@4.0.0`, `@sigstore/protobuf-specs@0.5.2`, `@sigstore/verify@3.1.1`; test-only `@sigstore/mock@0.12.0`.
- License evidence: installed package metadata declares Apache-2.0; Sigstore community licensing policy requires Apache-2.0 for Sigstore projects. Fixture source commit: `769a53d8713248a8bf49edfc2a5d1955b0dcc24d`.
- Fixture digests: `bundle-v03-dsse.json` `sha256:a7e2c7ffa0c93340afddf8126216f6a7ac6d1a62b7690be9faa25da0c29eaa44`; `trusted-root.json` `sha256:d05ead996fbe78a5ff0fac1f76a9715281cbc0e53c2b4bdc9c9ffbc2c401ca94`.
- Redistribution/modification: Apache-2.0 conditions apply to code and copied fixture material; retain © 2023 Sigstore Authors attribution and license.
- Trademark: preserve Sigstore identity without implying endorsement or production trust from test fixtures.
- Current use: verification dependency and test-only fixture; the fixture trusted root is not a production key or release identity.
- Unresolved restrictions: verify final archive contents and dependency notices; no fixture may be promoted into a production trust configuration without separate review.

## in-toto / SLSA materials

- Upstream governance: https://github.com/in-toto/community/blob/main/GOVERNANCE.md
- Selected tool: official `in-toto==3.0.0` used for validation evidence; no upstream specification prose is copied into the product.
- License evidence: in-toto governance states software is Apache-2.0, documentation CC-BY-4.0, and specification Community Specification License.
- Redistribution/modification: classify code, documentation, and specification separately; do not infer permission to copy specification text from using the format.
- Attribution: retain the applicable license and source identity for any copied material.
- Trademark: do not imply in-toto/SLSA endorsement or conformance certification from format compatibility tests.
- Unresolved restrictions: exact future copied schema/example files and any release bundling require file-level review.

## Standards implemented without vendoring

- SARIF 2.1.0, CycloneDX/VEX, SPDX, OCI, and in-toto/SLSA are currently implemented as interoperability code paths; the checked implementation tree does not establish permission to redistribute upstream schemas/prose/examples.
- If a schema, example, license list, generated model, image layer, or rule/recipe corpus is later copied, create a new record with exact upstream URL, immutable version/digest, license/NOTICE text, modification status, attribution, trademark limits, and reviewer approval before release.

## Fixtures and premium content

- No premium Hunt rule/recipe feed is currently selected or authorized for redistribution.
- Existing public scanner fixtures require a separate authorship/publication decision before being treated as customer or acceptance corpus.
- OWASP Juice Shop is recorded separately in `juice-shop-fixture-2026-10-02.md`; it is a public technical fixture, not customer consent or legal approval.

## Approval record

- Implementation-owner review: recorded above; this confirms only that the engineering inventory was transcribed.
- Legal/licensing approval: **pending**.
- Independent Hunt review: **pending**.
- Unresolved restrictions: all items listed above remain release blockers for bundling/redistribution until reviewed.
