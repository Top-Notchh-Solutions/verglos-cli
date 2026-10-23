# DIST-002 npm alpha.4 publication observation — 2026-10-24

## Read-only registry result

- **Candidate:** CLI `aad2c74395a5c381c955ab9dfab7462295564840`
- **Version:** `2.0.0-alpha.4`
- **Verifier:** `scripts/verify-npm-publication.mjs`
- **Packages checked:** **7**
- **Accepted:** **0/7**
- **Provider writes:** none
- **Release environment:** `VERGLOS_FINAL_RELEASE_READY` is absent.
- **Owner secret:** `NPM_TOKEN` exists, but this observation did not consume it.

The read-only npm observation found:

- `verglos@2.0.0-alpha.4`: registry package and attestation both HTTP 404.
- `@verglos/hunt@2.0.0-alpha.4`: registry package and attestation both HTTP
  404.
- `@verglos/shared`, `@verglos/scanner`, `@verglos/reporter`, `@verglos/mcp`,
  and `@verglos/entitlement`: registry records exist, but their SLSA
  attestations bind to older source commit
  `ed318f06b97771f45cc6970f745868fb1aa09404`, not the current candidate.

## Disposition

This is a truthful registry/publication boundary record, not a publication
attempt. No npm token, tag, GitHub Actions workflow, registry write, or release
sign-off was used. `DIST-002/003/006` remain open for the trusted complete
seven-package publication and immutable provenance bound to the approved
candidate; the publish workflow remains stable-only and requires the explicit
release-ready variable. The authoritative score remains **245 checked / 35 open / 280
total (87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec**.
