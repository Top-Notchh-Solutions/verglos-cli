# Current candidate reconciliation and freeze · 2026-10-24

## Candidate

- **CLI:** `aad2c74395a5c381c955ab9dfab7462295564840`
- **Web:** `98b5cf652623bf4f000ed93366b67a38154579e1`
- **Version:** `2.0.0-alpha.4`

## Reconciliation

The fail-closed release reconciler processed all **22** non-AppSec rows as
`partial` and recorded a **no-go** recommendation. No row was falsely promoted
to `shipped`. The current public-OSS launch scope is represented with
`customerConsent: passed`; no real-customer acceptance is claimed.

The remaining open gates are provider lifecycle, independent review,
authenticated-browser acceptance, field-CWV evidence, account-deletion
acceptance, and final release. The report records **6** correction items and
**1** rollback item.

## Candidate freeze

The freeze contract verified **24/24** digest-bound artifacts, including all
12 required artifact kinds, with **0** missing artifacts and **0** missing
artifact kinds. The candidate is still `blocked` with a recorded `no-go`
because the six gates remain open. This is a current reproducible freeze
record, not a release approval.

No npm package was published, no tag or GitHub release was created, no payment
was made, no customer data was used, and no files or records were deleted.

Artifacts:

- `acceptance-release-reconciliation-2026-10-24-current.json` SHA-256
  `b0e5b555c914a5375b7c4096a64cbb0f782b9041701f347f21d179fc345a6d0d`
- `acceptance-candidate-freeze-2026-10-24-current.json` SHA-256
  `df569ece3a411d461873d4ba45fd57187dbe1bf9f45e91c4415857ef2df0579c`

The additive acceptance bundle contains **228** files, verifies with **0**
mismatches, and passes its secret scan. The exact manifest digest is recorded
in the bundle artifact itself.
