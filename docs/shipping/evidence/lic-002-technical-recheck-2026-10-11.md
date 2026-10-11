# LIC-002 technical license recheck — 2026-10-11

## Mechanical inventory

- `node scripts/license-inventory.mjs --check`: **exit 0**.
- Installed dependency entries: **148**.
- Automated dependency review blockers: **0**.
- License/notice tests: **5 passed / 0 failed**.
- The inventory and notice tests confirm deterministic output, retained
  upstream identity/license text, and bounded handling of missing or oversized
  license files.

## External-content record

The private record
`docs/shipping/legal/external-engines-and-standards-2026-10-03.md` still
contains unresolved decisions for the selected Trivy image/layers/database
terms, detect-secrets immutable release and redistribution status, fixture
authorship/rights, premium Hunt recipe provenance, and trademark language.
The legal packet
`docs/shipping/legal/legal-review-addendum-2026-10-09.md` is explicitly a
**review request, not legal approval**, and has no reviewer, signature,
decision, or approval date.

## Acceptance boundary

`LIC-002` remains unchecked. A passing dependency inventory does not prove
permission to redistribute external engines, databases, fixtures, rules, or
recipes. The missing artifact is an authorized legal/company review covering
the exact release artifacts and the unresolved external-content decisions.
No package, registry, Production, provider, database, entitlement, account,
or customer-data state was changed by this recheck. `LIC-003` is the next
dependency-ready assessment.
