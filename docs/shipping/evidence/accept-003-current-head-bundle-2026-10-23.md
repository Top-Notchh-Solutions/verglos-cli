# ACCEPT-003 current-head evidence bundle · 2026-10-23

The private `acceptance:evidence:bundle` implementation now includes the
current merged CLI/Web execution evidence in addition to the preserved
historical evidence entries. The source change is in
`scripts/build-acceptance-evidence-bundle.mjs`.

## Reproduction

```text
VERGLOS_ACCEPTANCE_BUNDLE_OUTPUT=/tmp/verglos-acceptance-evidence-bundle-2026-10-23-dist002.json node scripts/build-acceptance-evidence-bundle.mjs
```

The run produced schema
`verglos.private.acceptance-evidence-bundle.v1` with **115** hashed evidence
files, including **40** current 2026-10-23 entries. The secret-like material
scan passed. The bounded output was written to `/tmp` and did not overwrite a
tracked historical bundle.

Bundle SHA-256:

```text
bf4a0500be2ad809f5853fd651d812d7851b7f5a3af31650035320c214e0e59a  verglos-acceptance-evidence-bundle-2026-10-23-dist002-final.json
```

## Explicit boundary

The generated manifest keeps these states open:

- provider lifecycle;
- customer consent;
- independent review;
- authenticated browser and field-CWV evidence; and
- account deletion.

The bundle contains hashes and bounded evidence references only. It contains
no source, credentials, customer data, provider captures, or reviewer
sign-off. `ACCEPT-003` therefore remains unchecked for its reviewer and
external/hosted evidence requirements. The npm observation remains a
read-only historical registry check; no provider, Production, customer, or
final-release action occurred, and nothing was deleted.
