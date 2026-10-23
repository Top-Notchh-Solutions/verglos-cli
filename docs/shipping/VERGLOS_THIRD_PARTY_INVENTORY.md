# Verglos third-party inventory

Status: governing baseline for `TRUTH-006`

Reviewed: 2026-09-14

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

The prior clean-store audit found `pnpm licenses list --json` failing in both repositories because pnpm could not find store index metadata for `turbo@2.10.6` in the CLI store and `@tailwindcss/postcss@4.3.3` in the web store. In the current CLI workspace, the command now succeeds and reports 148 package groups / 150 version rows / 11 direct entries with zero declared-license blockers. This is only the installed host's view: the current CLI lockfile contains 181 package entries, and optional OS/CPU variants are not all represented in the 150 reported version rows. Therefore LIC-001 still needs a reproducible lock-complete classifier and must fail on any missing metadata; the current command output is not complete release evidence.

### 2026-09-12 CLI notice-generator update

CLI commit `9a1dad4` makes the notice generator inspect all installed paths for each package/version group, retain distinct LICENSE and NOTICE text, de-duplicate identical texts, cap candidate files at 512 KiB, and emit explicit review markers for unsafe or unreadable entries. Focused tests pass 7/7 and the CLI monorepo test/typecheck/build graph passes 23/23 tasks with cache disabled. This improves the producer but does not close LIC-001/002/003, complete web asset qualification, or authorize redistribution.

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

### 2026-09-14 implementation recheck (progress only; LIC-002 remains open)

- **Trivy is now integrated as an optional, user-local Docker adapter, not merely a target contract.** `packages/shared/src/trivy-adapter.ts` pins `ghcr.io/aquasecurity/trivy@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969`. Local Docker metadata identifies Trivy `0.74.0`, upstream revision `e1fd17a0ea4a8cf24bc4b4dd7e2cfbf4bb31b994`, and the Aqua Security source URL. The adapter uses `--pull=never`, network-disabled/read-only container settings, and scans only `misconfig,secret`; DB/check/version update switches are skipped. This is **not** Trivy vulnerability-database evidence or a vulnerability scan. Offline embedded checks have no qualified policy freshness; the image digest/version observation is computed-only, not signature/provenance verification. Upstream `v0.74.0` has Apache-2.0 `LICENSE` and an Aqua copyright/product `NOTICE`. Neither the image nor DB is bundled in the npm packages; the runtime is expected to be installed locally by the operator. This local image inspection is not publisher authentication or legal clearance.
- **detect-secrets is an optional user-provided executable boundary, not bundled scanner code.** `probeDetectSecrets` requires an explicit absolute path and invokes only bounded `--version`; it does not run a scan. The baseline importer/exporter handles JSON documents but is not the upstream scanner. No executable version, digest, or signature is selected by Verglos. Yelp's upstream repository currently identifies Apache-2.0; its moving `master` license page is not an immutable release record. Do not redistribute or claim compatibility with an unverified executable build.
- **Sigstore is now a selected software dependency and copied-fixture case.** CLI runtime manifests pin `@sigstore/bundle@4.0.0`, `@sigstore/protobuf-specs@0.5.2`, and `@sigstore/verify@3.1.1`; the test dependency `@sigstore/mock@0.12.0` is also present. Installed manifests declare Apache-2.0. `packages/cli/src/fixtures/sigstore/README.md` attributes the test-only DSSE bundle and trusted-root fixture to `sigstore/sigstore-js` commit `769a53d8713248a8bf49edfc2a5d1955b0dcc24d`, © 2023 Sigstore Authors, Apache-2.0. Local SHA-256: `bundle-v03-dsse.json` `a7e2c7ffa0c93340afddf8126216f6a7ac6d1a62b7690be9faa25da0c29eaa44`; `trusted-root.json` `d05ead996fbe78a5ff0fac1f76a9715281cbc0e53c2b4bdc9c9ffbc2c401ca94`. The direct `npm pack --dry-run` for `verglos@2.0.0-alpha.1` did not include those fixture JSON files, but this is not a substitute for the protected staged-archive/release-artifact check. The fixture is historical public verification material, not a Verglos key, trust root, or production identity.
- **Standards integrations are code paths, not automatically redistributed standards.** The CLI has SARIF/CycloneDX/SPDX/in-toto and detect-secrets import/export or record code; the Web generates CycloneDX inventory from dependency metadata. The current repository scan found no separately vendored external SARIF/CycloneDX/SPDX/VEX/in-toto schema file in these implementation paths. Keep the existing exact-file check in release qualification: generated JSON support does not grant rights to copy upstream schema, prose, or examples.
- **Premium rule/recipe content remains unqualified and absent as a distinct content release.** The reviewed CLI tree has Hunt recipe schema/trust code, but no `packages/hunt-rules` package or separately versioned premium rule/recipe feed corpus. No authenticated publisher root, content-source/license grant, modification record, customer license, or trademark-use wording has been established for such a corpus. Do not infer these terms from `private: true`, repository licensing, or the presence of a recipe verifier. Treat future first-party and third-party content as separate records before release.
- **Existing scanner fixtures require an ownership decision.** The `insecure-app` and `nextjs-noise-suppression` fixture trees have no separate provenance/attribution record. They are already tracked in the public CLI source repository; a `private: true` fixture manifest does not make public Git content private. Do not repackage them as customer/acceptance corpora until source/authorship and publication scope are confirmed. Any removal or history cleanup is a separate public-repository operation and is not performed by this inventory update.

These observations update the engineering inventory only. They do not constitute legal advice, final license compatibility approval, publisher provenance verification, or permission to redistribute external tools/content.

| Target | Preliminary upstream evidence | V1 rule before use or redistribution |
|---|---|---|
| Trivy 0.74.0 OCI image / database | Source pin `ghcr.io/aquasecurity/trivy@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969`; local OCI labels report upstream revision `e1fd17a0ea4a8cf24bc4b4dd7e2cfbf4bb31b994`. The upstream [`v0.74.0 LICENSE`](https://github.com/aquasecurity/trivy/blob/v0.74.0/LICENSE) is Apache-2.0 and [`NOTICE`](https://github.com/aquasecurity/trivy/blob/v0.74.0/NOTICE) retains Aqua copyright/product attribution. The Verglos adapter disables network/pulls and DB/check updates and does not produce vulnerability DB coverage. | Image is operator-installed and not npm-bundled; digest pinning is not publisher signature verification. Keep computed-only trust and embedded-policy freshness incomplete; do not imply Aqua endorsement or current vulnerability/advisory coverage. If bundling is proposed, qualify image provenance, all image-layer licenses/notices, DB/source licenses, and exact artifact distribution separately. |
| detect-secrets executable/baseline | [Yelp upstream LICENSE](https://github.com/Yelp/detect-secrets/blob/master/LICENSE) currently declares Apache-2.0; implementation accepts an explicit path and probes only `--version`, while import/export handles baseline JSON. No executable version/digest is selected or bundled. | Do not call this a Verglos scanner execution. If an executable integration or redistribution is added, record immutable release/digest, license/NOTICE, exact command/data boundary, changes, and no-endorsement terms. |
| Docker/OCI execution | Exact runtime and distribution are not selected. Docker Engine components, Docker Desktop, image layers, base images, and OCI specifications are distinct assets. | Never assume one license covers all of them. V1 defaults to invoking an approved customer installation; any runtime/image bundling requires an artifact-level record. |
| Sigstore libraries and test fixtures | CLI dependencies: `@sigstore/bundle@4.0.0`, `@sigstore/protobuf-specs@0.5.2`, `@sigstore/verify@3.1.1`, test-only `@sigstore/mock@0.12.0`; installed metadata declares Apache-2.0. Copied historical fixtures are attributed in-tree to `sigstore/sigstore-js` commit `769a53d8713248a8bf49edfc2a5d1955b0dcc24d`, Apache-2.0, with local fixture digests recorded above. | Preserve dependency notices and exact fixture attribution; verify release-archive contents and provenance. A fixture trusted root is test-only and cannot be promoted to production trust configuration. Preserve Sigstore identity without implying endorsement. |
| in-toto/SLSA | in-toto software, documentation, and specification use different license classes; [community governance](https://github.com/in-toto/community/blob/main/GOVERNANCE.md) states software is Apache-2.0, docs CC-BY-4.0, and specification Community Specification License. | Classify the exact code, schema, and specification material separately; implementation is not permission to copy all documentation. |

Preliminary evidence is not authorization to bundle a future version. `LIC-002` re-verifies the exact selected release and all data/rule artifacts at their immutable digest.

## Standards and schema materials

Verglos may implement an interoperable format without copying upstream prose or schemas into the package. If it vendors a schema, example, generated model, license list, or specification excerpt, that exact file becomes a redistributed third-party asset.

| Standard/material | Current state | Preliminary governance | Gate |
|---|---|---|---|
| SARIF 2.1.0 | CLI importer implementation exists; no external schema/prose file found vendored in the checked implementation tree. | [OASIS TC specification materials](https://github.com/oasis-tcs/sarif-spec) use OASIS process/IPR terms rather than a normal open-source repository license; [schema redistribution has required explicit clarification](https://github.com/oasis-tcs/sarif-spec/issues/583). | Treat implementation/interop as distinct from copying schema or prose. Do not vendor OASIS materials until exact redistribution terms and required notices are approved. |
| CycloneDX / VEX | CycloneDX import/export/SBOM generation code exists; no upstream schema file found vendored in the checked implementation tree. VEX-specific coverage is not established by this inventory. | [Official schemas](https://github.com/CycloneDX/specification) are available under Apache-2.0 and the specification is now ECMA-424. | Record exact serialized/spec version at artifact qualification. Preserve Apache attribution for any later-vendored schema, and keep ECMA/OWASP identity descriptive. |
| SPDX | SPDX import/export and SBOM generation code exists; no upstream schema file found vendored in the checked implementation tree. | [Current specification terms](https://github.com/spdx/spdx-spec/blob/develop/LICENSE) are Community-Spec-1.0; pre-existing portions are CC-BY-3.0; implementation attribution differs from copying specification materials. | Record the exact spec/model/license-list artifact and version; include required acceptance/attribution notices if copied or distributed. |
| in-toto/SLSA predicates | Bounded statement/DSSE import/export code exists; no upstream schema/specification text was found vendored in the checked implementation tree. | Code, documentation, and specifications have distinct terms. | Preserve input bytes and source attribution; pin and classify any future copied schema/example independently. |
| OCI image/layout/distribution specifications | The optional Trivy adapter invokes a pinned user-local OCI image; no OCI specification file found vendored in the checked implementation tree. | Exact OCI specification release and conformance material are not selected. | Do not equate OCI runtime use with permission to redistribute image contents. Record exact image/layers, notices, and trademark language before bundling. |

## Fixture inventory

| Fixture class | Current files | Provenance/license state | Release rule |
|---|---|---|---|
| `packages/scanner/fixtures/insecure-app` | `.env.example`, manifest, and server source | Already tracked in the public CLI repository; no separate provenance/attribution record. Its fixture manifest is private-marked, but the Git tree is public. | Confirm author/source and intended publication; do not publish/repackage as an acceptance corpus until reviewed. Keep synthetic credentials inert. Public-source exposure is not undone by this record. |
| `packages/scanner/fixtures/nextjs-noise-suppression` | Next/React-like source/test files, private manifest, and lockfile | Already tracked in the public CLI repository; no separate provenance/attribution record. Manifest dependency references alone do not establish fixture-source provenance. | Confirm author/source and intended publication; do not publish/repackage as an acceptance corpus until reviewed. Public-source exposure is not undone by this record. |
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
