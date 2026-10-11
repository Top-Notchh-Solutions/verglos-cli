
# Studio and Enterprise acceptance packet

**Private working packet — STUDIO-CLI-001, ENT-CLI-001**

## Studio in simple terms

Studio sends a deliberately limited evidence projection to a client. The user
must see what will leave Verglos before approving it. The proof is the
allowlist, digest, upload, recipient view, and no-leak result.

### Required Studio evidence

- exact CLI/Web commits, populated by Codex;
- preview of the fields sent;
- projection digest and approval binding;
- fields refused/redacted;
- tenant/client boundary result;
- hosted custody upload/retrieval result;
- authorized recipient confirmation that the artifact is understandable;
- deletion/expiry result if the recipient record is temporary.

Suggested file:

    docs/shipping/evidence/studio-cli-001-recipient-<date>.md

## Enterprise in simple terms

The Enterprise runner is a controlled machine that polls for a signed,
short-lived job. It is not remote shell access and must not accept arbitrary
commands.

### Required runner evidence

- runner enrollment and credential exchange;
- signed short-lived job;
- outbound GET-only polling;
- target allowlist;
- nonce/replay refusal;
- source-free result projection;
- success, expiry, malformed-job, duplicate-result, and network-failure runs;
- cleanup and credential revocation;
- required cross-platform run;
- approved operator/reviewer result.

Existing technical records:

    docs/shipping/evidence/ent-cli-001-private-runner-client-2026-10-07.md
    docs/shipping/evidence/ent-cli-001-private-runner-transport-2026-10-08.md
    docs/shipping/evidence/ent-cli-001-private-runner-e2e-2026-10-08.md
    docs/shipping/evidence/ent-cli-001-private-runner-replay-race-2026-10-08.md

## Human-only inputs

- Studio recipient or authorized internal recipient;
- Enterprise runner operator and approved test machine;
- recipient/operator confirmation of what they saw and whether it worked.

Codex can generate fixtures, run contracts, and prepare the report. Codex
cannot be the recipient or approve its own runner.

