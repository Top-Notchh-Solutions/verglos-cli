# Verglos V1 company licensing and redistribution disposition — 2026-10-18

**Decision type:** authorized company/legal shipping disposition

**Product owner and company decision-maker:** Anurag Yadav, Owner of Top
Notchh Solutions and Verglos, `anuragyadav.work@gmail.com`

**Organization:** Top Notchh Solutions

**Scope:** the current Verglos V1 source/package boundary represented by the
qualified CLI release surface at `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
and the later public positioning-only merge `50bcab42eadfa8796d86d1f7a8aaee3010c65647`.
The later merge changes only the CLI package description and does not change
the lockfile or dependency archive surface. This is a company disposition,
not an outside-lawyer opinion and not an AppSec review.

## Decision

The owner approves the scoped treatment below **with conditions**. The
conditions are release controls, not permission to suppress an unresolved
inventory result. Any future change to the package boundary, dependency
versions, image digest, fixture corpus, Hunt recipe source, or trademark copy
requires a new review against the changed artifacts.

| Area | Company disposition and conditions |
| --- | --- |
| Trivy image, release, and NOTICE | Approved for the existing operator-installed, optional, pinned-runtime boundary only. The Trivy image, vulnerability database, and layers are not bundled in the npm archives or represented as Verglos-owned content. Retain the upstream Apache license and NOTICE attribution in the private technical record; do not imply Aqua/Trivy endorsement, certification, or sponsorship. Any bundling or redistribution requires a new immutable image/layer/database review. |
| `detect-secrets` | Approved for the existing explicit operator-executable path only. No executable or Python environment is bundled, selected, or redistributed by Verglos. A future bundled or pinned release requires exact source/release, digest, transitive-notice, and source-offer review before use. |
| Scanner and public technical fixtures | Approved only for the sanitized, public-safe fixtures already identified in the technical inventory and their stated licenses. OWASP Juice Shop and other external fixtures remain technical qualification inputs, not customer consent, customer acceptance, or a claim of ownership. They are not added to the public npm package surface without a separate file-level review. |
| Hunt recipes and rules | Approved for the first-party bounded A1 catalog, the registered public-safe A2 descriptors, and the sanitized reference harnesses covered by the current provenance packets. No premium feed, copied unlicensed rule corpus, arbitrary model-generated recipe, or network exception is approved. The independent Hunt AppSec review remains a separate required gate and is not waived by this disposition. |
| Modification and redistribution | Approved for source/package distribution only when applicable upstream license text, NOTICE text, attribution, and required source/link information are retained. Blue Oak-licensed components require the applicable license notice/link treatment and no use of the Blue Oak name as endorsement. The generated inventory must continue to report all reviewed components; no blocker may be hidden through an allowlist or source override merely to obtain a green check. |
| Trademarks and endorsement | Approved for descriptive compatibility references only. Verglos must not state or imply endorsement, sponsorship, certification, or conformance by Trivy, Yelp, Sigstore, in-toto/SLSA, OWASP, fixture authors, or other upstream projects. |
| Notices and release artifacts | Approved as a controlled release condition: generated `THIRD_PARTY_NOTICES`, SBOMs, package manifests, and public-boundary audits must be produced from the exact candidate and retain unresolved classifications. No npm publication, tag, or final release is authorized by this record while the applicable release-gate, trusted-provenance, AppSec, or final-acceptance rows remain open. |

## Approved scope and exclusions

- Approved: continued private qualification, public-safe source/test changes,
  generated private notices/SBOMs, and the current non-published package
  qualification workflow.
- Excluded: npm publication, registry promotion, final release approval,
  bundling Trivy/detect-secrets, premium recipe distribution, customer source,
  customer acceptance claims, and any AppSec conclusion.
- Required re-review triggers: dependency or lockfile change, package/archive
  boundary change, new image or database, bundled external executable, new
  fixture or recipe corpus, changed trademark/endorsement wording, or release
  publication request.

## Evidence and approval reference

This disposition is based on the existing private technical inventory,
transitive review, exact upstream-source recheck, package qualification, and
owner authorization:

- `docs/shipping/legal/external-engines-and-standards-2026-10-03.md`
- `docs/shipping/legal/transitive-license-review-2026-10-08.md`
- `docs/shipping/legal/legal-review-addendum-2026-10-09.md`
- `docs/shipping/evidence/lic-002-upstream-source-provenance-2026-10-14.md`
- `docs/shipping/evidence/lic-002-upstream-exact-source-recheck-2026-10-18.md`
- `docs/shipping/evidence/qual-cli-006-current-head-2026-10-14.md`
- `docs/shipping/evidence/owner-authorization-2026-10-14.md`

**Approval reference:** owner authorization and company decision recorded in
this file at the owner's direction on 2026-10-18. No external-lawyer or
independent-AppSec signature is claimed.

**Effective date:** 2026-10-18

**Expiry/re-review:** immediately on any listed trigger or before a final
publication/release decision, whichever occurs first.

**LIC-002 disposition:** `approved with conditions` for the exact scoped
company boundary above. `LIC-003`, distribution, trusted publication,
independent AppSec, provider, customer, and final-acceptance rows retain their
own acceptance contracts and are not closed by this record.
