# DIST-002/003 npm publication observation · 2026-10-23

## Observation

The private registry verifier queried npm's public registry for the seven
current public package names at version `2.0.0-alpha.1`, binding the requested
source to public CLI `origin/main` commit
`74c9b4ff79c4b8f80e022c8f25f1d321357f9cf5`. The verifier performs no registry
write and stores only bounded package metadata, attestation metadata, and
digests.

Command:

```text
node scripts/verify-npm-publication.mjs 2.0.0-alpha.1 74c9b4ff79c4b8f80e022c8f25f1d321357f9cf5 docs/shipping/evidence/dist-002-003-npm-publication-observation-2026-10-23.json
```

## Result

- verifier result: **rejected / fail-closed**;
- package set: **0/7 accepted**;
- six packages (`verglos`, `@verglos/shared`, `@verglos/scanner`,
  `@verglos/reporter`, `@verglos/mcp`, and `@verglos/entitlement`) are present
  with npm metadata and SLSA provenance;
- those six attestations all bind to historical source commit
  `207bef93b5b67c611052243f28f3993af6b720bd` and GitHub Actions run
  `32725815493`, not the requested current candidate commit;
- `@verglos/hunt@2.0.0-alpha.1` is absent from the registry and has no
  attestation; and
- the bounded report recorded **12** failures and has SHA-256
  `5df12f780be5a1c2f0dafac91cae7d9bb2ff843293acc781a62816e03060dbea`.

The report is an observation of existing public state, not a release claim.
The old six-package publication is historical provider evidence only. It does
not prove publication of the current candidate, complete seven-package
publication, current-source provenance, legal clearance, customer acceptance,
independent review, or final release approval.

## Disposition

Keep `DIST-002` and `DIST-003` unchecked. The next qualifying provider action
must publish the complete seven-package candidate from one immutable tag and
produce matching npm provenance for that exact source commit. No npm,
provider, Production, database, customer, or release-sign-off write occurred
in this observation. Customer acceptance remains `not-claimed`, and
independent review remains required. Nothing was deleted.

Evidence: `docs/shipping/evidence/dist-002-003-npm-publication-observation-2026-10-23.json`.
