# QUAL-CLI-006 official in-toto validation — 2026-10-09

## Source and scope

- Authoritative CLI source: `1972af3abe648312a427c20dc96bbcce54db55a`.
- Merged public `main` commit: `f5686b5c5aa11f45f392e647bd9d7e31830654ba`
  from PR #88.
- Scope: build the public package archives from the exact hardened source and
  verify the archive set with the official `in-toto==3.0.0` verifier.

## Commands and result

1. `pnpm build` — **8/8 build tasks passed**.
2. `node scripts/pack-public-packages.mjs <temporary-output>` — produced the
   six expected public archives.
3. `python scripts/verify-in-toto-release.py <temporary-output>` with the
   official `in-toto-verify` executable from `in-toto==3.0.0` — **passed**:
   six archives with exact SHA-256 products were verified.

The temporary virtual environment and archive directory were outside the
repository; no package source, lockfile, or tracked configuration changed.

## Boundary

This is exact-source official-validator progress for `QUAL-CLI-006`. It does
not prove trusted keyless Sigstore/Fulcio/Rekor release identity, legal
clearance, protected npm publication, customer acceptance, or final release
approval. No npm publish/tag, Production plan/provider/payment, database,
migration, entitlement, account, or customer-data write occurred. The private
backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**; no
checkbox changed.
