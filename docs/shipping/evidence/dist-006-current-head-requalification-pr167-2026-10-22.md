# DIST-006 current merged-head rollback qualification · 2026-10-22

## Verification

The exact public CLI merged head
`db3510356ecd6c6e430d7dcb3b9354e514d777ee` built the real
`release rollback-rehearsal` command and passed the evidence generator and
focused regression test. The bounded fixture produced a matching manifest
digest, **5** operations covering npm, engine, Hunt, signing identity, and Web
boundaries, and preserved **2** historical records. The rehearsal exited 0.

## Boundary and disposition

This is a local fail-closed decision-contract rehearsal. It performs no npm,
registry, engine, Hunt-feed, signing-provider, Vercel, or other authenticated
external operation, and synthetic immutable identifiers are not live release
targets. `DIST-006` remains unchecked for authenticated rollback/revocation,
operational review, dependency completion, and final acceptance. Nothing was
deleted.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
