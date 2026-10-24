# ACCEPT-010 current freeze workspace-root replay · 2026-10-24

## Replay

The current freeze input was replayed against the workspace root so its
repository-relative `.worktrees/...` and `.local-evidence/...` artifact paths
were resolved exactly as recorded. The earlier failed replay used the CLI
worktree itself as the artifact root; that was a path-root error, not a missing
artifact or a product failure. Historical freeze inputs and reports remain
unchanged.

```text
VERGLOS_RELEASE_ARTIFACT_ROOT=/Users/anuragyadav/Developer/TopNotchh-Workspace \
node scripts/freeze-release-candidate.mjs \
  docs/shipping/evidence/acceptance-candidate-freeze-input-2026-10-24-v2.json \
  /tmp/verglos-freeze-current-2026-10-24.json

schema=verglos.private.release-candidate-freeze.v1
status=blocked
openGates=6
missingArtifacts=0
missingArtifactKinds=0
artifactCount=24
requiredArtifactCount=12
presentArtifactCount=24
decision=no-go
goEligible=false
```

## Boundary

All **24/24** recorded artifacts and **12/12** required kinds are present and
digest-valid. The candidate remains blocked only by the recorded open gates:
`providerLifecycle`, `independentReview`, `authenticatedBrowser`, `fieldCwv`,
`accountDeletion`, and `finalRelease`. No provider or Production write,
publication, customer access, independent review, or release sign-off was
performed. `ACCEPT-010` remains unchecked; this receipt is implementation and
artifact-integrity evidence only.
