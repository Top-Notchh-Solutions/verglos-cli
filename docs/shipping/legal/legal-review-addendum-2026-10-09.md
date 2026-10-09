# Verglos V1 legal/licensing review addendum · 2026-10-09

**Status: REVIEW REQUEST — NOT LEGAL APPROVAL**

This private addendum is a decision packet for an authorized company/legal
reviewer. It does not grant permission, resolve an open license question, or
replace the technical inventories referenced below. No reviewer identity,
signature, approval, or legal conclusion may be invented.

## Review scope

- Product: Verglos V1 CLI/Web release candidate and private shipping evidence.
- Current CLI source reference: `8bea4be2fa18533eafd088122be769e942965626`.
- Review date requested: 2026-10-09.
- Intended distribution: public npm packages and hosted Web application, only
  after the release gates and package-boundary checks pass.
- Private records to review:
  - `docs/shipping/legal/external-engines-and-standards-2026-10-03.md`
  - `docs/shipping/legal/transitive-license-review-2026-10-08.md`
  - `docs/shipping/legal/juice-shop-fixture-2026-10-02.md`
  - `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`
  - generated license, notice, SBOM, and package-boundary artifacts for the
    exact release candidate.

## Required decisions

The reviewer must make a separate written decision for every section. Use
`approved`, `approved with conditions`, `not approved`, or `needs more
evidence`; cite the exact artifact/version and required condition.

### 1. Trivy image, release, and NOTICE usage

Review the selected Trivy release, OCI image digest, upstream `LICENSE` and
`NOTICE`, image layers, vulnerability database/source terms, signatures or
provenance, attribution, modification markings, and whether the image is
operator-installed only or redistributed by Verglos. Confirm that product
copy does not imply Aqua/Trivy endorsement, certification, or sponsorship.

Decision: ____________________  Conditions/evidence: ______________________

### 2. `detect-secrets`

Review the operator-executable-only boundary, selected version or absence of
a selected release, executable/source obligations, transitive notices, and
the rule that no binary is bundled or redistributed without a new immutable
source/release review.

Decision: ____________________  Conditions/evidence: ______________________

### 3. Scanner fixtures and public technical fixtures

Review every fixture included in source, tests, package archives, CI
artifacts, or private evidence, including OWASP Juice Shop and any copied
license/NOTICE text. Confirm authorship, license, modification status,
redistribution scope, attribution, trademark limits, and that public
fixtures are not represented as customer consent or customer acceptance.

Decision: ____________________  Conditions/evidence: ______________________

### 4. Hunt recipes and rules

Review the current A1 recipe/catalog, any signed recipe or trust-root
material, premium rule/recipe feeds, copied examples, provenance, license,
modification, redistribution, network exceptions, and trademark language.
Confirm that no premium feed or unlicensed content is enabled by implication.

Decision: ____________________  Conditions/evidence: ______________________

### 5. Modification and redistribution rights

For each third-party component or copied artifact, decide whether Verglos may
modify, distribute, publish generated notices/SBOMs, provide source offers,
and retain the material in public packages or only in private CI/review
fixtures. Identify any attribution, patent, notice, source-offer, or
reciprocity obligation.

Decision: ____________________  Conditions/evidence: ______________________

### 6. Trademark and endorsement restrictions

List required wording restrictions for Trivy, Yelp, Sigstore, in-toto/SLSA,
OWASP, fixture authors, and any other named project. Confirm that format
compatibility or technical use is not described as endorsement,
certification, or conformance approval.

Decision: ____________________  Conditions/evidence: ______________________

### 7. Required notices and release artifacts

Review the exact generated `THIRD_PARTY_NOTICES`, package contents, SBOMs,
license files, source-offer information, attribution wording, and archive
surface. Confirm that generated notices retain applicable upstream identity
and text without implying endorsement and that unresolved inventory rows fail
closed rather than being suppressed.

Decision: ____________________  Conditions/evidence: ______________________

## Scope, expiry, and approval record

- Approved product/release scope: ______________________________________
- Excluded artifacts or environments: ___________________________________
- Geographic/customer/product limitation: _______________________________
- Approval effective date: ______________________________________________
- Approval expiry or re-review trigger: _________________________________
- Required re-review triggers (dependency, image, recipe, fixture, package,
  trademark, or release change): _______________________________________
- Authorized reviewer name: _____________________________________________
- Organization and role: ________________________________________________
- Reviewer contact or verifiable approval reference: ____________________
- Final decision: `approved` / `approved with conditions` /
  `not approved` / `needs more evidence`
- Conditions closed by: _________________________________________________
- Signature or verifiable approval reference: ____________________________
- Approval date: _______________________________________________________

Until this record is completed by an authorized reviewer and reconciled with
the exact release artifacts, Gate 7, `LIC-002`, `LIC-003`, `DIST-001`–`DIST-003`,
and related release rows remain open. This packet contains no customer source,
credentials, provider secrets, or production data.
