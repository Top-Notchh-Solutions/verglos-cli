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

## Hosted custody implementation progress

Web commit `e3e416d` adds the hosted custody boundary:

- `POST`/`GET /api/v1/organizations/:organizationId/projects/:projectId/client-projections`;
- strict parity validation for the CLI projection and time-bounded approval;
- tenant/project authorization through the existing `publish_record`/`view`
  access boundary;
- dedicated `client_projection_custody` persistence with organization-scoped
  projection/approval uniqueness and digest/expiry checks;
- private, no-store responses and retry-safe projection identity handling.

The isolated Neon test database received migration `0039_client_projection_custody`.
The read-only migration audit then reported **40 expected / 40 applied**, zero
pending migrations, zero missing tables, and the custody table present. The
route integration test passed **1/1** against isolated PostgreSQL; the pure
contract tests passed **2/2**; Web typecheck, Drizzle check, migration check,
and the 47-page production build passed.

No Production database, provider, entitlement, account, customer, or public
deployment write occurred in this batch. The test migration was isolated to
the explicitly selected Test database.

## Verification

- shared client-projection tests: **4 passed / 0 failed**;
- CLI client-projection command test: **1 passed / 0 failed**;
- shared and CLI typecheck: passed;
- CLI build: passed;
- `git diff --check`: passed;
- full CLI test command rerun after rebuilding shared dependencies.

## Missing acceptance artifacts

`STUDIO-CLI-001` remains unchecked pending:

- an independent proof that the redaction boundary is preserved at the
  hosted recipient, not only in the local projection contract;
- a real authorized Studio recipient/customer acceptance run.

Owner: authorized Studio customer/recipient and Web custody operator. Review:
2026-10-11 IST or immediately after the independent/customer artifacts are
available. No Production, provider, entitlement, account, or customer-data
write occurred; only the isolated Test database migration described above was
applied.

## Queue decision

Keep the checkbox open and park this item. `LIC-002` is the next
dependency-ready unchecked item by backlog order; its legal/release evidence
must be assessed independently.
