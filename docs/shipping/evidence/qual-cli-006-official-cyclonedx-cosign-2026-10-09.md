# QUAL-CLI-006 — official CycloneDX and Cosign tool qualification

Date: 2026-10-09

## Scope

The current private shipping tree generated release-shaped SBOM artifacts in
a temporary directory and ran cached official validator containers. No source
file, tracked artifact, registry, transparency log, Production environment,
or public release was changed.

## Results

- Generated CycloneDX JSON: format `CycloneDX`, specification `1.5`, 150
  components.
- Generated SPDX JSON: specification `SPDX-2.3`, 150 packages.
- `cyclonedx/cyclonedx-cli:0.33.1 validate --input-format json
  --input-version v1_5 --fail-on-errors` returned success: **BOM validated
  successfully**.
- `gcr.io/projectsigstore/cosign:v2.4.1` generated an ephemeral test key,
  signed a non-production fixture with transparency-log upload disabled, and
  verified the signature successfully.

The Cosign result is deliberately limited: the key was ephemeral, the
signature was not uploaded to Rekor, no Fulcio/OIDC identity was used, and no
release signing identity was exercised. The validator run therefore proves
tool invocation and local artifact shape only.

## Disposition

`QUAL-CLI-006` remains unchecked. Exact release-candidate consumer
install/upgrade/rollback, independent official validation for every required
format, trusted keyless Sigstore identity, protected publishing, legal
clearance, and final acceptance remain open. No Production, database,
payment, provider, deployment, npm publication, or release state changed.
