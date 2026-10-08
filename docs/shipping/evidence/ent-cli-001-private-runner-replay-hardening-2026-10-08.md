# ENT-CLI-001 private-runner replay-state hardening · 2026-10-08

## Delivered

CLI PR #86 (`cfb38c1f8019fa50ebbdcafade0c25c000792dd3`) merged to `main` as
`fc452ba05dc9222a5a454653ab29906107b09045`.

The private runner replay-state writer now:

- restores the replay directory to mode `0700` before each persistence;
- creates each temporary replay path with a random UUID and exclusive create;
- preserves `0600` replay files, `fsync`, atomic rename, and cleanup behavior.

The regression test first makes the parent directory too permissive and then
asserts the corrected directory/file permissions. Windows uses an
owner-writable assertion because POSIX mode bits are not represented reliably
there.

## Verification

- focused private-runner tests: **5/5**;
- complete `pnpm --filter verglos test`: exit **0**;
- CLI typecheck: pass;
- CLI build: pass;
- `git diff --check`: pass;
- final hosted workflow `37822993184`: all nine Ubuntu/macOS/Windows × Node
  20/22/24 cells, plus in-toto release binding, pass;
- hosted Verglos scan `37822993198`: pass.

## Disposition

This is implementation and qualification progress for `ENT-CLI-001`. It does
not prove operational runner enrollment, approved isolated job execution,
durable result reconciliation, cross-platform operational exchange, or the
required independent Hunt/security review. No production, database, payment,
provider, deployment, customer, registry, npm, or release write occurred.

No backlog checkbox changed. The authoritative score remains **218 checked /
62 unchecked / 280 total (77.9%)**.
