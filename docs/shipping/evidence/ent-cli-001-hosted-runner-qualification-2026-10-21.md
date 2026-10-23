# ENT-CLI-001 current Preview runner lifecycle qualification · 2026-10-21

## Scope and acceptance boundary

This packet records a fresh owner-authorized synthetic Preview lifecycle against
the current Web source. It strengthens deployed operational evidence for the
private-runner protocol; it is not enterprise acceptance, customer evidence,
Production operation, or independent Hunt/AppSec review.

## Source and deployment

- Web source: clean Studio qualification branch commit `a3819c1` (including
  the current private-runner routes and migration `0042`).
- Preview deployment: `dpl_ETFtQmHWA9m5EL77n4rDBX254icz`.
- Preview URL:
  `https://verglos-3r92ldtzb-anuragyadav20062002s-projects.vercel.app`.
- Deployment status: Ready; remote build compiled successfully and generated
  **49/49** static pages.
- CLI protocol/client implementation and cross-platform evidence remain mapped
  by `ent-cli-001-current-merge-requalification-2026-10-18.md`,
  `ent-cli-001-current-cli-requalification-2026-10-19.md`, and the existing
  runner credential exchange packet. No CLI bearer, enrollment token, private
  key, or raw target output is recorded here.

## Synthetic Preview fixture

- Organization: `bca7f024-3053-4f56-af0a-207bf0138862`.
- Tenant external ID: `org_86c33589-b7dc-4237-8e78-ed2a7bb110be`.
- Runner ID: `3ca9620a-fc72-4acb-bd30-544ff9d6d8ee`.
- Target: `oci://preview.verglos.test/qualification`.
- Job ID: `job_29de4230-e424-48a7-beaa-93b69c240f09`.
- Result digest: `sha256:0e101c9809e69c6bba0a501ec41a3131016206a443a4ce7fb0ab4fee34cc8eab`.

The runner and target are synthetic owner-controlled Preview fixtures. The
result projection contains no source, findings, command text, credentials, or
customer data.

## Observed route lifecycle

1. Owner-authenticated runner enrollment returned `201`; the requested target
   was accepted only from the configured Preview allowlist.
2. One-time enrollment redemption returned `201`; the returned runner bearer
   was used only for runner routes and is not retained in this packet.
3. The first outbound poll returned `{"status":"empty"}` and activated the
   runner.
4. A bounded job request returned `201`. The subsequent poll returned
   `{"status":"ready"}` with protocol `1.0.0`, the exact tenant/runner/target
   binding, a non-empty signature, `network.mode=denied`, and limits of
   `timeoutMs=5000`, `outputBytes=4096`, `memoryMb=128`, and `processes=2`.
5. A source-free completed result returned `201` with `idempotent=false` and
   the result digest above.
6. Replaying the identical result returned `200` with `idempotent=true` and
   the same digest.
7. A malformed result returned `400 invalid_runner_result` before persistence.
8. Polling the same runner credential under
   `org_foreign_preview` returned `401 runner_access_denied`.
9. A final correctly scoped poll returned `{"status":"empty"}`, confirming
   no second delivery after completion.

## Remaining gate

This qualifies current deployed enrollment, bounded signed-job transport,
runner-only credential use, result persistence, replay idempotency, tenant
binding, malformed-input refusal, and source-free projection behavior. It does
not close `ENT-CLI-001`: authorized enterprise acceptance, cross-platform
operational acceptance as a complete release gate, and the independent
runner/Hunt isolation review remain required. The backlog row remains
unchecked and the score remains **239 checked / 41 open / 280 total (85.4%)**.
