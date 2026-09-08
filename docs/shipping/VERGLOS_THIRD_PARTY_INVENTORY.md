# Verglos third-party inventory

Status: governing baseline for `TRUTH-006`

Reviewed: 2026-09-08

Implementation baseline: `df0af1e`

Scope: locked npm dependencies, existing license/notice packaging, copied source, external services and engines, standards artifacts, and current/target fixtures across `verglos-cli` and `verglos-web`.

This is an engineering release inventory, not legal advice. A declaration observed in package metadata is evidence to review; it is not by itself a final legal approval.

## Release rule

An unknown or unreviewed license, notice, provenance, modification, trademark, source-offer, or service-term classification blocks redistribution or bundling of that asset. It does not block local contract design, parsing against synthetic fixtures, or an adapter that invokes a user-supplied installation without copying the asset.

`pnpm-lock.yaml` is the exact version/integrity enumeration for each repository. This document records the current human-readable classification. `LIC-001` must turn every lock node and bundled subcomponent into a reproducible machine-generated row before release.

## Audit method and limits

- Reinstalled both repositories from their unchanged frozen lockfiles, including optional cross-platform binaries.
- Parsed every available dependency `package.json` under the pnpm virtual store and deduplicated by package name/version.
- Compared manifest-direct dependencies with resolved installed versions.
- Searched tracked source outside `node_modules` for `LICENSE`, `NOTICE`, `COPYING`, and third-party notice files.
- Ran `npm pack --dry-run --ignore-scripts --json` for all six publishable Verglos packages.
- Compared the five web vendor files to their CLI source counterparts by SHA-256 and content diff.
- Reviewed current external endpoints and planned engine/standard references in code and shipping contracts.

The native `pnpm licenses list --json` command still fails in both repositories after the frozen reinstall because pnpm cannot find store index metadata for `turbo@2.10.6` in the CLI store and `@tailwindcss/postcss@4.3.3` in the web store. The source packages and their declared license fields are present, but this prevents treating pnpm's report as release evidence. `LIC-001` must use a reproducible clean-store classifier and fail on missing metadata.

## Locked dependency summary

| Repository | Lockfile package entries | Available unique package/version metadata | Direct external dependencies | Unknown declared licenses | Notes |
|---|---:|---:|---:|---:|---|
| `verglos-cli` | 180 | 181 | 12 | 0 | The extra metadata row is `benchmark@1.0.0`, a nested benchmark fixture inside `fast-uri`, not a lock node. |
| `verglos-web` | 233 | 246 | 17 | 0 | Thirteen extra rows are bundled subcomponents inside locked packages, principally Next.js-compiled runtime assets. They still require classification. |

Counts include production, development, optional, platform-specific, peer-resolved, and bundled package metadata available after the forced frozen install. They do not assert which files a particular deployment or npm consumer ultimately receives.

### Declared license buckets

| Declared license | CLI rows | Web rows | Preliminary handling |
|---|---:|---:|---|
| MIT | 166 | 194 | Preserve copyright and permission notice in distributed copies/substantial portions. |
| ISC | 11 | 3 | Preserve copyright and permission notice. |
| BSD-3-Clause | 2 | 2 | Preserve license/copyright/disclaimer; do not imply endorsement. |
| BSD-2-Clause | 1 | 1 | Preserve license/copyright/disclaimer. |
| Apache-2.0 | 1 | 16 | Include license, retain applicable notices/attribution, mark redistributed modifications, and preserve upstream `NOTICE` when supplied. |
| 0BSD | 0 | 1 | Preserve available package provenance; final policy approval remains `LIC-001`. |
| Unlicense | 0 | 1 | Final jurisdiction/policy approval remains `LIC-001`. |
| MPL-2.0 | 0 | 13 | File-level weak copyleft. Distribution requires license/notice handling and source availability for covered modified files; exact deployment content needs review. |
| LGPL-3.0-or-later | 0 | 10 | Binary/library redistribution needs license, corresponding-source/relinking analysis, and legal approval. |
| Apache-2.0 AND LGPL-3.0-or-later | 0 | 3 | Satisfy both declared sets; applies to Windows sharp/libvips artifacts. |
| Apache-2.0 AND LGPL-3.0-or-later AND MIT | 0 | 1 | Satisfy every declared component license; applies to the sharp WASM artifact. |
| CC-BY-4.0 | 0 | 1 | Attribute creator/source, link the license, and indicate changes where applicable. |

No installed package declares GPL, AGPL, SSPL, BUSL, or an unknown license field. That observation is not an allowlist decision and does not replace source-file, dual-license, or generated-bundle inspection.

### Dependencies requiring explicit notice/source review

| Dependency family | Rows | Why it is singled out | Release action |
|---|---:|---|---|
| `lightningcss@1.32.0`, platform binaries, and bundled `@vercel/og@0.7.2` | 13 | Declared MPL-2.0 in the web dependency tree. | Determine whether deployed/distributed artifacts contain covered files; retain MPL notices and satisfy covered-source obligations. |
| `@img/sharp-libvips-*@1.2.4` | 10 | Declared LGPL-3.0-or-later. | Record exact binary/source pairing and upstream offer; legal review before redistributing a build containing it. |
| `@img/sharp-win32-*@0.34.5` | 3 | Declared Apache-2.0 AND LGPL-3.0-or-later. | Carry both licenses and complete the same libvips review. |
| `@img/sharp-wasm32@0.34.5` | 1 | Declared Apache-2.0 AND LGPL-3.0-or-later AND MIT. | Carry all applicable terms and verify corresponding source/relink mechanics. |
| `caniuse-lite@1.0.30001806` | 1 | Declared CC-BY-4.0 data. | Add attribution/source/license and change status to generated notices if shipped. |

These dependencies are currently web transitive or bundled assets, not Verglos-authored code. Hosting and redistribution triggers must be assessed separately.

## Direct dependency inventory

Workspace links are first-party `CORE` packages and are excluded from this table.

### CLI monorepo

| Scope | Resolved dependency | Declared license |
|---|---|---|
| runtime | `@modelcontextprotocol/sdk@1.29.0` | MIT |
| runtime | `chalk@5.6.2` | MIT |
| runtime | `chokidar@4.0.3` | MIT |
| runtime | `commander@14.0.3` | MIT |
| runtime | `fast-glob@3.3.3` | MIT |
| runtime | `open@10.2.0` | MIT |
| runtime | `ora@8.2.0` | MIT |
| runtime | `zod@3.25.76` | MIT |
| development | `@types/node@22.20.1` | MIT |
| development | `tsx@4.23.1` | MIT |
| development | `turbo@2.10.6` | MIT |
| development | `typescript@5.9.3` | Apache-2.0 |

### Hosted web application

| Scope | Resolved dependency | Declared license |
|---|---|---|
| runtime | `@clerk/nextjs@6.39.6` | MIT |
| runtime | `@neondatabase/serverless@1.1.0` | MIT |
| runtime | `drizzle-orm@0.44.7` | Apache-2.0 |
| runtime | `jose@6.2.4` | MIT |
| runtime | `next@15.5.21` | MIT |
| runtime | `react@19.2.8` | MIT |
| runtime | `react-dom@19.2.8` | MIT |
| runtime | `razorpay@2.9.8` | MIT |
| runtime | `zod@3.25.76` | MIT |
| development | `@tailwindcss/postcss@4.3.3` | MIT |
| development | `@types/node@22.20.1` | MIT |
| development | `@types/react@19.2.17` | MIT |
| development | `@types/react-dom@19.2.3` | MIT |
| development | `drizzle-kit@0.31.10` | MIT |
| development | `tailwindcss@4.3.3` | MIT |
| development | `tsx@4.23.1` | MIT |
| development | `typescript@5.9.3` | Apache-2.0 |

## Existing license, notice, and copied-source state

| Surface | Evidence | Current conclusion | Gate |
|---|---|---|---|
| CLI repository | Root `LICENSE` contains Apache-2.0; no root `NOTICE` or `THIRD_PARTY_NOTICES` exists. | Source intent is documented, dependency notices are not assembled. | Generate human-readable notices and SBOM before GA. |
| Six publishable npm packages | Each manifest declares Apache-2.0 and limits `files` to `dist` (CLI also packs its package README). Dry-run tarballs contain no `LICENSE`, `NOTICE`, or third-party notice file. | The prospective package artifacts do not carry a copy of the Apache license. | Blocks the next npm publication until packaging includes the root license and required notices. |
| Hosted web repository | Private package has no license field; no root `LICENSE`, `NOTICE`, or `THIRD_PARTY_NOTICES` exists. | No public license grant is established for the application, and deployment notice preservation is unverified. | Generate deployment/distribution notices; do not claim the whole web repo is Apache-2.0. |
| Web vendor source | `src/vendor` has five CLI-origin files. `shared/fingerprint.ts` is byte-identical; the other four differ. None carries an origin commit, copyright/license header, or prominent modification notice. | Apache provenance and changed-file obligations are not traceable in-place. | Record source commit/digest, retain license/attribution, and mark modifications before redistribution. |
| Dependency installs | Package-level license files exist under `node_modules`; preservation by npm/Vercel output is not proven. | Presence in the build environment is not evidence that recipients receive required notices/source offers. | `LIC-003` must test the actual npm tarball and deployed/downloadable artifacts. |

## External services and data

| Producer/service | Current use | Classification | Redistribution/terms rule |
|---|---|---|---|
| npm registry | Package existence, versions, update metadata, and dependency inputs | Current third-party API/data | Query use is not ownership. Review npm terms and each package's own metadata license before caching, republishing, or using registry-derived corpora. |
| OSV.dev | CLI dependency/vendored CVE queries and hosted monitor batch queries | Current mixed-source vulnerability data | Preserve OSV/advisory IDs and source attribution. OSV aggregates sources under CC-BY-4.0, CC0, MIT, BSD, Apache-2.0, CC-BY-SA-4.0, and other source-specific terms; bulk redistribution needs per-source handling. See [OSV data sources](https://google.github.io/osv.dev/data/). |
| GitHub, Stripe, and AWS STS APIs | Explicit live-key verification | Current service API | No provider code/data is bundled by the call. Provider terms, rate limits, credential handling, and trademark rules still apply; results must not imply provider endorsement. |
| Clerk, Neon/Postgres, Razorpay, Resend, Slack, and Vercel | Hosted auth, database, payment, email, webhooks, and deployment | Current service/vendor contracts | Track commercial terms, DPAs, subprocessor/privacy duties, export/delete paths, and operational exit separately from open-source licenses. Generic customer webhooks remain customer-selected destinations. |

## External engines and maintained data

No external scanner executable, Docker runtime, standards library, SARIF schema, SBOM schema, VEX schema, Sigstore client, or in-toto client is currently a direct dependency or bundled artifact. Current Trivy, detect-secrets, Docker/OCI, SARIF, CycloneDX, SPDX, VEX, in-toto, and Sigstore references are target contracts only.

| Target | Preliminary upstream evidence | V1 rule before use or redistribution |
|---|---|---|
| Trivy binary and databases | [Trivy source](https://github.com/aquasecurity/trivy) declares Apache-2.0 and carries both `LICENSE` and `NOTICE`. Database/advisory content has source-specific provenance. | Pin artifact version and digest, verify official signature/checksum, retain license/NOTICE/name/version, enumerate database sources, mark modifications, and avoid implied Aqua endorsement. User-supplied/local invocation may proceed before Verglos bundles it. |
| detect-secrets | [Yelp source](https://github.com/Yelp/detect-secrets/blob/master/LICENSE) declares Apache-2.0 and identifies Yelp copyright. | Prefer explicit user-supplied local invocation; if redistributed, pin exact artifact and retain license/copyright/modification notices without implied Yelp endorsement. |
| Docker/OCI execution | Exact runtime and distribution are not selected. Docker Engine components, Docker Desktop, image layers, base images, and OCI specifications are distinct assets. | Never assume one license covers all of them. V1 defaults to invoking an approved customer installation; any runtime/image bundling requires an artifact-level record. |
| Sigstore/cosign | [Sigstore project policy](https://github.com/sigstore/community/blob/main/LICENSING.md) requires Apache-2.0 for project software. | Select and pin the exact client/artifact, carry its license/notices, verify release provenance, and preserve Sigstore identity without implied endorsement. |
| in-toto/SLSA | in-toto software, documentation, and specification use different license classes; [community governance](https://github.com/in-toto/community/blob/main/GOVERNANCE.md) states software is Apache-2.0, docs CC-BY-4.0, and specification Community Specification License. | Classify the exact code, schema, and specification material separately; implementation is not permission to copy all documentation. |

Preliminary evidence is not authorization to bundle a future version. `LIC-002` re-verifies the exact selected release and all data/rule artifacts at their immutable digest.

## Standards and schema materials

Verglos may implement an interoperable format without copying upstream prose or schemas into the package. If it vendors a schema, example, generated model, license list, or specification excerpt, that exact file becomes a redistributed third-party asset.

| Standard/material | Current state | Preliminary governance | Gate |
|---|---|---|---|
| SARIF 2.1.0 | Planned; no schema/library vendored | [OASIS TC specification materials](https://github.com/oasis-tcs/sarif-spec) use OASIS process/IPR terms rather than a normal open-source repository license; [schema redistribution has required explicit clarification](https://github.com/oasis-tcs/sarif-spec/issues/583). | Implement from the final standard; do not vendor OASIS schema/prose until exact redistribution terms and required notices are approved. |
| CycloneDX / VEX | Planned; no schema/library vendored | [Official schemas](https://github.com/CycloneDX/specification) are available under Apache-2.0 and the specification is now ECMA-424. | Pin schema/spec version, retain Apache license/attribution for vendored schemas, and keep ECMA/OWASP identity descriptive. |
| SPDX | Planned; no schema/library vendored | [Current specification terms](https://github.com/spdx/spdx-spec/blob/develop/LICENSE) are Community-Spec-1.0; pre-existing portions are CC-BY-3.0; implementation attribution differs from copying specification materials. | Record the exact spec/model/license-list artifact and version; include required acceptance/attribution notices if copied or distributed. |
| in-toto/SLSA predicates | Planned; no schema/library vendored | Code, documentation, and specifications have distinct terms. | Pin and classify each copied schema/example independently. |
| OCI image/layout/distribution specifications | Planned; no schema/library vendored | Exact specification release and conformance material are not selected. | Record exact repository commit/release, license, notices, and trademark language before vendoring. |

## Fixture inventory

| Fixture class | Current files | Provenance/license state | Release rule |
|---|---|---|---|
| `packages/scanner/fixtures/insecure-app` | Two source/config files and private manifest | Tracked under the Apache-2.0 repository; no separate attribution or copied-origin record. | Keep internal until authorship is confirmed; mark synthetic credentials clearly and never deploy publicly. |
| `packages/scanner/fixtures/nextjs-noise-suppression` | Four source/test files plus private manifest and lockfile | Tracked under the Apache-2.0 repository; manifest references Next/React but does not vendor their source. No separate fixture provenance record. | Confirm authorship, retain the generated lock's package provenance, and keep intentionally sensitive-looking samples synthetic. |
| Future public acceptance repositories | None selected | Unknown | Freeze exact commit/digest and license/NOTICE; unknown or incompatible rights block copying or redistribution. Prefer references/clones over vendoring. |
| Future intentionally vulnerable images/apps | None selected | Unknown | Never expose publicly; pin every image/layer/base and preserve all component notices. |
| Customer-authorized fixtures | None selected | Customer-controlled | Require written scope, retention/deletion terms, redaction, and explicit permission before internal use; never publish by default. |

## Modification and attribution controls

1. Preserve upstream copyright, patent, trademark, attribution, license, and `NOTICE` material applicable to every redistributed asset.
2. Mark modified Apache-covered files prominently. For the existing web vendor copies, record the source repository, source commit/digest, copied path, modification status, and local owner.
3. Do not use required attribution to imply certification, sponsorship, or endorsement by Aqua, Yelp, OASIS, OWASP, Ecma, SPDX, Linux Foundation, Sigstore, in-toto, npm, Google/OSV, or another provider.
4. Keep producer identity, name, version, artifact/database/config digest, run timestamp, license reference, and modification status in engine/import evidence.
5. Generate `THIRD_PARTY_NOTICES` from the actual release artifact, not only the development lockfile. Validate the npm tarball, each platform package, web deployment/download, engine cache, recipe feed, and offline bundle separately.
6. Preserve corresponding-source and relinking obligations when weak-copyleft binaries are distributed. If the distribution form cannot satisfy them confidently, exclude the asset until legal review approves a compliant path.
7. Attribution data must survive normalization, deduplication, report rendering, Release Record creation, redaction, and public verification.
8. Re-run classification on every lockfile, engine manifest, standard schema, fixture, or feed change; a missing/unknown result fails the redistribution gate.

`TRUTH-006` changes no application behavior, dependency version, license text, blog content, or landing-page content.
