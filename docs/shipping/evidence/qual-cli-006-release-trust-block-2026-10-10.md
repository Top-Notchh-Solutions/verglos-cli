# QUAL-CLI-006 release-trust block — 2026-10-10

## Qualification completed

The existing official-format and clean-consumer record proves SPDX,
CycloneDX, in-toto, six-archive packaging, public-boundary checks, standards
validation, and the recorded upgrade/rollback transition. The exact evidence
is `qual-cli-006-official-current-head-2026-10-10.md`.

## Missing acceptance artifacts

`QUAL-CLI-006` remains unchecked because the recorded Cosign operation used an
ephemeral local fixture. Acceptance still needs:

- trusted keyless Sigstore/Fulcio/Rekor identity and transparency-log evidence;
- protected npm/Vercel release approval and immutable publication/attestation;
- final legal/licensing clearance for the exact archives and notices;
- independent review of the release-boundary evidence;
- final clean-consumer install/upgrade/rollback acceptance from the protected
  release pipeline, not only local or historical runs.

Owner: authorized release maintainer, legal reviewer, and independent reviewer.
Review: 2026-10-11 IST or on release-candidate change. No npm publication,
Production deployment, provider, database, entitlement, or customer-data write
occurred.

## Queue decision

Keep the checkbox open and park this item. `QUAL-WEB-006` is the next
dependency-ready unchecked item by backlog order.
