
# Legal and licensing intake

**Private working packet — LIC-002, LIC-003**

## Plain-English meaning

This is not a Trivy login. It is an authorized legal/company reviewer deciding
what Verglos may ship, modify, copy, or redistribute.

## Existing technical material

Use these private records:

    docs/shipping/legal/legal-review-addendum-2026-10-09.md
    docs/shipping/legal/external-engines-and-standards-2026-10-03.md
    docs/shipping/legal/transitive-license-review-2026-10-08.md
    docs/shipping/VERGLOS_THIRD_PARTY_INVENTORY.md

## Reviewer decisions required

The reviewer must decide each item:

1. Trivy release/image, layers, database/source terms, LICENSE/NOTICE,
   attribution, and redistribution boundary.
2. detect-secrets source/release/notice obligations and whether it is only
   operator-installed.
3. Scanner fixtures, including copied OWASP Juice Shop material.
4. Hunt recipes/rules and any premium feed.
5. Modification and redistribution rights.
6. Trademark and endorsement wording.
7. Generated THIRD_PARTY_NOTICES, SBOMs, source-offer text, and package files.

For each item, the reviewer writes:

    Decision: approved / approved with conditions / not approved / needs more evidence
    Exact artifact/version:
    Conditions:
    Reviewer name, organization, role:
    Scope:
    Effective date:
    Expiry/re-review trigger:
    Signature or verifiable approval reference:

## How Codex helps

Codex can gather exact package versions, source commits, NOTICE files,
checksums, generated notices, and the list of unresolved rows. Codex can
prepare a clean review packet and implement conditions after the decision.

Codex cannot invent the legal decision or sign the packet.

## Human input

The founder must identify an authorized legal/company reviewer. The reviewer
then completes the existing addendum. No commit hash is needed from the founder.

