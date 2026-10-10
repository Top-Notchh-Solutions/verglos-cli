# STUDIO-CLI-001 hosted-custody block — 2026-10-10

## Completed in the current branch

The reviewed Studio projection workflow is now integrated at exact source
`99aea374`:

- `e1175b7` adds `record project-client` and the shared projection contract;
- `99aea374` binds approval to the exact canonical redacted preview bytes.

The client accepts only bounded allowlisted fields, binds organization,
workspace, and record digests, refuses private/source/finding/unknown/nested
fields, and requires an explicit time-bounded upload approval. The CLI emits a
preview without uploading anything.

## Verification

- shared client-projection tests: **4 passed / 0 failed**;
- CLI client-projection command test: **1 passed / 0 failed**;
- shared and CLI typecheck: passed;
- CLI build: passed;
- `git diff --check`: passed;
- full CLI test command rerun after rebuilding shared dependencies.

## Missing acceptance artifacts

`STUDIO-CLI-001` remains unchecked pending:

- hosted upload/custody transport and Web admission/persistence evidence;
- an independent proof that the redaction boundary is preserved at the
  hosted recipient, not only in the local projection contract;
- a real authorized Studio recipient/customer acceptance run.

Owner: authorized Studio customer/recipient and Web custody operator. Review:
2026-10-11 IST or immediately after hosted custody is enabled. No Production,
database, provider, customer-data, or upload write occurred.

## Queue decision

Keep the checkbox open and park this item. `LIC-002` is the next
dependency-ready unchecked item by backlog order; its legal/release evidence
must be assessed independently.
