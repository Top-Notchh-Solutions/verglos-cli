# QUAL-CLI-006 · official current-head qualification · 2026-10-10

## Scope

This record qualifies the exact public CLI `main` head
`f5686b5c5aa11f45f392e647bd9d7e31830654ba` in a temporary detached worktree.
The validation artifacts were written outside the repository and were not
published, tagged, uploaded, or copied into the public CLI tree.

No npm publication, Production deployment, provider/payment request, database
or migration write, entitlement/account/customer write, or release approval
was performed.

## Results

- `node scripts/generate-spdx.mjs` produced SPDX 2.3 output with **255
  packages** and **256 relationships**.
- `node scripts/generate-sbom.mjs` produced CycloneDX 1.5 output with **255
  components**.
- Official `cyclonedx/cyclonedx-cli:0.33.1 validate` returned
  `BOM validated successfully`.
- Official `spdx-tools==0.8.5` `pyspdxtools` validation/normalization accepted
  the SPDX 2.3 document and reported **255 packages**.
- The exact source workspace build passed **8/8** Turbo tasks.
- Public packaging produced all six expected archives:
  `verglos`, `verglos-entitlement`, `verglos-mcp`, `verglos-reporter`,
  `verglos-scanner`, and `verglos-shared`, each at version `2.0.0-alpha.1`.
- Official `in-toto==3.0.0` verification accepted the exact SHA-256 release
  binding for all six archives.
- The shared standards-validation corpus passed **7/7** tests.
- The public-boundary audit passed; no internal shipping documents or founder
  assets were tracked in the public package tree.
- Cosign `v2.4.1` signed and locally verified an ephemeral fixture with
  `--insecure-ignore-tlog=true`.

## Qualification boundary

This is substantial current-head backend and artifact progress, but it is not
the final `QUAL-CLI-006` acceptance. The Cosign result is only a local
ephemeral signature: it does not prove a trusted Fulcio/OIDC identity,
Rekor transparency-log inclusion, protected npm publication, legal clearance,
independent review, clean-consumer platform install/upgrade/rollback, or final
acceptance. Those gates remain open and no backlog checkbox changed.

Current score after this batch: **219 checked / 61 unchecked / 280 total
(78.2%)**.
