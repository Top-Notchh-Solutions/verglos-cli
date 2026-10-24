# DIST-002/003 current alpha.4 artifact recheck · 2026-10-24

## Exact candidate and local artifact flow

- **CLI source:** `aad2c74395a5c381c955ab9dfab7462295564840`.
- **Version:** `2.0.0-alpha.4`.
- **License inventory:** `--require-clear` passed; external license records
  validated **8/8**.
- **Public pack:** seven npm archives were produced in a disposable local
  directory; packed-manifest audit passed for all seven.
- **Consumer:** clean-consumer verification passed for all seven archives,
  library imports, CLI execution, no implicit external engine installation,
  and the bounded signed fixture runtime.
- **Artifact verification:** release origin metadata, notes, checksums, and
  strict release-artifact verification all passed for **15 artifacts** (seven
  archives and eight sidecars); `THIRD_PARTY_NOTICES` matched every archive.
- **Upgrade/rollback:** `1.8.3 -> 2.0.0-alpha.4 -> 1.8.3` passed.

The local `SHA256SUMS` digest is
`sha256:5b40743fa4db1397b6720feeee33e917846c6d3b1917ac0254eac450e28ec1ea`;
`RELEASE_METADATA.json` is
`sha256:f3ee55c0cee25bceb2e7d3ab3c7579100f2677f6c3c6f2f34edb84fc7ccac0f9`;
and `clean-consumer-verification.txt` is
`sha256:fb93e4d9c33cff0059fd67ef5fddc3bebb0705c75538af53435d05b1904cdde5`.

## Boundary and disposition

This is a local release-artifact recheck. It did not publish to npm, create a
tag, invoke trusted publication, attest to a provider, or perform a Production
release. `DIST-002` and `DIST-003` remain open for protected trusted
publication/attestation, provider action, independent review, and final
release acceptance. No release or customer state was deleted or overwritten.
Score remains **245 checked / 35 open / 280 total (87.5%)**.
