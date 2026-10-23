# DIST-001 · current public package boundary addendum · 2026-10-11

## Scope

The CLI shipping worktree at commit `0ef96caab27474d3495b9d4ac0a77851059eb873`
was rebuilt and checked as the six-package public release surface. This is a
current addendum; the earlier same-date evidence remains preserved in
`dist-001-package-boundary-recheck-2026-10-11.md`.

## Verification

- Turbo build: **6/6 packages successful**.
- Source package-contents audit: passed for all six public packages.
- Packer: created exactly six `2.0.0-alpha.1` archives.
- Packed-manifest audit: passed for all six archives.
- Package contract tests: **8/8 passed**.
- Clean consumer: installed all six local archives, imported every public
  library, executed `Verglos 2.0.0-alpha.1`, and confirmed no external engine
  installation/cache was created.
- `git diff --check`: passed.

Archive SHA-256 values:

```text
verglos-2.0.0-alpha.1.tgz              ce0c00e4308740d982da4aa77e01073864c746b6ea7b4e75369d0e2896d11f83
verglos-entitlement-2.0.0-alpha.1.tgz  a8bbbc4cc651134862da4aa77e01073864c746b6ea7b4e75369d0e2896d11f83
verglos-mcp-2.0.0-alpha.1.tgz          043e4b0165699abae3475401a10e901e43f9d4a6b42638bec1b51cd6e3571c03
verglos-reporter-2.0.0-alpha.1.tgz     e5b875ce8a159c021c86fe99c0e965c76ff55c45d8e8574ba3c89e14bf02c65b
verglos-scanner-2.0.0-alpha.1.tgz      bd5ec859ea85d8eaf73b70e4429357240f501bd35a2960620690a580e0851d8b
verglos-shared-2.0.0-alpha.1.tgz       57655bc82397a2084f6b9504a946234f046da4769e6f8e7c2ee58c427abfb8be
```

## Environment boundary

The machine’s shared pnpm store lacked package-index metadata and the shared
npm cache contained root-owned files. Verification was rerun in disposable
task-scoped pnpm/npm stores; no global ownership or cache was changed.

## Acceptance boundary

`DIST-001` remains unchecked. The package boundary is qualified, but the row
depends on the still-open LOCAL/HUNT/RECORD product surfaces and final legal,
trusted-release, and publication qualification. No npm publication, registry
write, Production/provider/database/entitlement/customer write, or release
promotion occurred.

Owner: CLI/release qualification. Next dependency-ready assessment:
`QUAL-WEB-006` after this package boundary is parked.

Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
