# ENT-CLI-001 hosted private-runner lifecycle qualification — 2026-10-18

## Scope and boundary

This packet records a real operational lifecycle against an isolated Vercel
Preview deployment of the current Web source. It exercises the existing
outbound-only private-runner transport; it is not a production deployment,
customer run, enterprise acceptance, or independent AppSec review.

No Production environment, customer repository, npm registry, billing state,
or AppSec gate was changed. The Preview-only credentials were generated for
this qualification, kept out of the packet, and are not recorded here:
`VERGLOS_PRIVATE_RUNNER_ENROLLMENT_HMAC_SECRET`,
`VERGLOS_PRIVATE_RUNNER_SIGNING_PRIVATE_KEY`, `LICENSE_HMAC_SECRET`, the
Preview test-auth secret, the enrollment token, and the license bearer.

## Exact deployment and fixture

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Source commit: `25adc4abb5a7d989c8349eb7a288f7011143f5b7`
- Deployment: `dpl_AdGGkqwkPvZGdg5x8A8yE4kVkAXs`
- Preview URL: `https://verglos-4bl114kmh-anuragyadav20062002s-projects.vercel.app`
- Deployment state: `READY`; Preview build and typecheck completed successfully.
- Synthetic allowlisted target: `oci://preview.verglos.test/qualification`
- Synthetic organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- Synthetic tenant external ID: `org_86c33589-b7dc-4237-8e78-ed2a7bb110be`
- Runner ID: `9793e1d2-f585-4023-af0b-c92f7327bb9c`
- Job ID: `job_3a258e42-768c-4956-89cb-de2f11596902`

## Operational steps and results

The following actions were performed directly against the READY Preview
deployment. Only status fields and bounded identifiers are retained; raw
responses containing credentials were not copied into the shipping tracker.

1. Preview CLI authorization created a fresh synthetic founder fixture. The
   returned license bearer validated successfully through the license-status
   endpoint; its value is intentionally not recorded.
2. Organization creation returned HTTP 201.
3. Runner enrollment returned HTTP 201 and issued a one-time enrollment token.
   The token was consumed only by the qualification process and is not
   recorded.
4. The first outbound poll returned HTTP 200 with `status=empty`, activating
   the enrolled runner without accepting source, commands, or client tenant
   authority.
5. A bounded job request returned HTTP 201. The job used protocol `1.0.0`, a
   fixed recipe ID, the exact allowlisted target, `network=denied`,
   `timeoutMs=5000`, `outputBytes=4096`, `memoryMb=128`, and `processes=2`.
6. The runner poll returned HTTP 200 with `status=ready`; the job was claimed
   once and contained a signature.
7. Local Ed25519 verification returned `verified=true`. Re-verifying the same
   signature after mutating the target returned `mutationRejected=true`.
8. The runner uploaded a source-free result projection with
   `state=completed`, `findingCount=0`, `coverage=complete`, and a synthetic
   evidence digest. The first upload returned HTTP 201 with
   `idempotent=false`.
9. Replaying the exact same result returned HTTP 200 with
   `idempotent=true` and the same result digest
   `sha256:ef69e379bb3aa7db66a72f54a1b7d9cd04f186d30f1a65984bb896b9abd3c450`.
10. A final outbound poll returned HTTP 200 with `status=empty`, confirming no
    second delivery of the completed job.

## Negative-boundary observations

- A second enrollment request for `oci://foreign.verglos.test/not-allowlisted`
  returned `target_not_in_allowlist`.
- A job request for that foreign target on the enrolled runner returned
  `target_not_in_runner_scope`.
- A malformed result body returned `invalid_runner_result` before persistence.

These observations preserve the fail-closed target allowlist, runner-scope,
schema, and replay boundaries. No general remote-shell or arbitrary-command
field was used or accepted.

## Evidence artifacts

The private terminal artifact directory was
`/tmp/verglos-runner-live.QjiVyG` while this packet was assembled. It contains
the generated deployment/auth responses, job signature verification summary,
bounded result projection, replay response, and negative-boundary responses.
Credential-bearing raw responses remain outside the repository and are not
part of this packet.

## Remaining acceptance boundary

This closes the operational-enrollment and approved-runner-execution portion
of the row as evidence, but does not close `ENT-CLI-001`. The row still
requires cross-platform operational evidence, an independent security review
of the runner/Hunt boundary, and authorized enterprise acceptance. The live
backlog checkbox therefore remains unchecked and the score remains
**232 checked / 48 open / 280 total (82.9%)**.

