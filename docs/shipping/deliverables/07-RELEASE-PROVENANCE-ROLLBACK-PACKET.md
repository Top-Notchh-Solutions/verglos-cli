
# Release, provenance, protected publication, and rollback packet

**Private working packet — DIST-001 to DIST-003, DIST-006, QUAL-CLI-006**

## What Codex can collect automatically

From the exact release candidate, Codex can generate:

- package archive file list and public/private boundary result;
- executable/export checks;
- checksums;
- THIRD_PARTY_NOTICES;
- CycloneDX/SPDX SBOM;
- SARIF/CycloneDX/SPDX validation;
- in-toto/Sigstore verification results;
- clean-consumer install and upgrade/rollback matrix;
- exact CLI/Web commit references.

Current local refs observed on 2026-10-12:

- CLI main: 74fd6cdc595ae6911792d0afb444dbbb5ca5985f
- CLI shipping worktree: 04b9a2b333a7dab8370ab40ae26f46c6b10a0156
- Web working branch: 399d5b8e6432af7b3d1deda39036d66ef7477b00

These refs are not yet a final release freeze.

## Human/protected controls still required

- GitHub OIDC/trusted npm publishing;
- protected environment approval;
- least-privilege workflow;
- immutable version/tag policy;
- no long-lived npm token;
- legal clearance;
- authorized publish decision;
- rollback/revocation rehearsal approval.

## Safe qualification order

1. Freeze the candidate and record its exact refs.
2. Run package boundary and official-format checks.
3. Run npm pack --dry-run and inspect the archive.
4. Generate notices/SBOM/provenance/checksums.
5. Test a disposable package/tag/Preview rollback.
6. Record the protected approval and recovery result.
7. Publish/tag/deploy only after a separate founder go/no-go.

Use the existing Web migration/restore runbook for database rollback:

    docs/shipping/HOSTED_013_EXECUTION_RUNBOOK.md

## Evidence files

Codex will place generated reports under:

    docs/shipping/evidence/dist-001-package-audit-<date>.md
    docs/shipping/evidence/dist-003-provenance-<date>.md
    docs/shipping/evidence/dist-006-rollback-rehearsal-<date>.md

Nothing in this packet authorizes a public npm release or Production migration.

