
# Acceptance, consent, comprehension, and commercial packet

**Private working packet — ACCEPT-002 to ACCEPT-010**

## Technical acceptance stories

Codex can run and record the twelve story substrates:

- Free;
- CI;
- Trivy import;
- multi-tool deduplication;
- mismatch/incomplete evidence;
- exception;
- Hunt;
- offline record;
- modified CLI;
- Studio recipient;
- Enterprise runner;
- account deletion.

Existing protocol/evidence:

    docs/shipping/acceptance/comprehension-test-protocol.md
    docs/shipping/acceptance/external-workflow-protocol.md
    docs/shipping/acceptance/consent-record.template.md
    docs/shipping/acceptance/hunt-adjudication-protocol.md
    docs/shipping/evidence/acceptance-stories-verification-2026-10-10.md

## Private/customer repository consent

For each private repository, Codex will create a copy of:

    docs/shipping/acceptance/consent-record.template.md

The repository owner must fill and approve:

- owner and organization/role;
- exact URL and commit;
- permitted paths/commands;
- network policy;
- whether findings may be stored;
- allowed evidence fields;
- retention/expiry;
- revocation/deletion;
- owner approval and founder approval.

For a public repository, no consent form is needed, but URL, commit, license,
NOTICE, scope, and digest still go into the private corpus manifest.

## Comprehension test

A real developer/lead/recipient answers:

- What artifact was produced?
- What decision does it represent?
- What changed?
- What risk remains?
- How is authenticity checked?
- What limitations apply?

Codex records the real answers and corrections; AI does not impersonate the
participant.

## Hunt adjudication

Freeze the method, then evaluate at least 100 independently adjudicated
findings. Separate confirmed, not reproduced, inconclusive, environment
failure, policy denied, and unsupported. Keep the held-out set from tuning.

## Commercial evidence

Record Test Mode/manual-renewal plan tests, support time, hosted cost,
recipient value, and explicit allowances. Team/Studio price hypotheses remain
hypotheses until this evidence exists.

## Output files

    docs/shipping/evidence/acceptance-stories-<date>.json
    docs/shipping/evidence/acceptance-review-<date>.md
    docs/shipping/evidence/comprehension-results-<date>.md
    docs/shipping/evidence/hunt-adjudication-study-<date>.md
    docs/shipping/evidence/commercial-acceptance-<date>.md

