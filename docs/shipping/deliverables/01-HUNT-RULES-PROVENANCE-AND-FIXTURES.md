
# Hunt rules, provenance, approval, and fixtures

**Private working packet — HUNT-008, HUNT-009, HUNT-010**

## What is already verified

The current public CLI evidence describes an A1 fixture-probe catalog with
five first-party deterministic probes. Each has an adapter, command,
assertion, bounded input, denied network, cleanup, redaction, and
positive/negative/timeout/adapter-failure expectations. These are still
fixture-level checks; they are not target-code attack agents.

Relevant existing evidence:

- docs/shipping/evidence/hunt-008-supported-recipe-catalog-2026-10-06.md
- docs/shipping/evidence/hunt-008-contract-recheck-2026-10-11.md
- docs/shipping/evidence/hunt-008-requalification-block-2026-10-10.md
- docs/shipping/evidence/hunt-009-supported-recipe-execution-pr75-2026-10-07.md
- docs/shipping/evidence/hunt-009-entitlement-gate-pr76-2026-10-07.md

The current local CLI head observed on 2026-10-12 is:

    74fd6cdc595ae6911792d0afb444dbbb5ca5985f

The Hunt independent-review packet intentionally targets a different
qualification head, 8bea4be2fa18533eafd088122be769e942965626. The reviewer
must use the packet's exact head unless a refreshed packet is created.

## What still has to be decided

### Rule ownership/source

Choose one truthful answer for each enabled rule:

- FIRST-PARTY: authored by Top Notchh Solutions and stored in the CLI at a
  named commit;
- THIRD-PARTY: copied or adapted from a named publisher/source;
- OPERATOR-INSTALLED: Verglos invokes it but does not redistribute it;
- EXCLUDED: not enabled in V1.

For every non-first-party rule, record the exact source URL, version/tag/commit,
artifact digest where relevant, license/NOTICE, modification rights,
redistribution rights, publisher, and trademark restrictions.

### Supported-rule approval

Create one record per enabled rule with:

- rule ID and catalog digest;
- supported TypeScript/JavaScript input;
- allowed command/adapter;
- positive and negative assertion;
- timeout/resource/network policy;
- redacted output fields;
- approver and date;
- exact CLI head reviewed.

### Fixture matrix

| Fixture | Synthetic input to create/verify | Required result |
|---|---|---|
| Positive | Small text containing the intended synthetic canary | Intended finding/verdict |
| Negative | Near-match that must not trigger | No false confirmation |
| Timeout | Bounded test input that exceeds the declared limit | Timeout/environment classification |
| Adapter failure | Missing/invalid/unsupported adapter fixture | Infrastructure/policy classification, never clean |

Do not use real API keys, customer source, or real secrets. Use synthetic
canaries and redact output before storing evidence.

## Files Codex will create or update

- docs/shipping/evidence/hunt-recipe-provenance-<rule-id>.md
- docs/shipping/evidence/hunt-supported-rule-approval-<rule-id>.md
- docs/shipping/evidence/hunt-<rule-id>-fixture-results-<date>.md

The files must remain DRAFT until the ownership/license facts are confirmed.
Codex may fill technical fields and exact commits automatically.

## Small founder input needed

Reply with one line per enabled rule:

    Rule <id>: FIRST-PARTY / THIRD-PARTY / OPERATOR-INSTALLED / EXCLUDED
    If third-party: source URL and license decision owner
    If first-party: confirm Top Notchh Solutions authored it

No commit SHA is needed from you. Codex will read it from Git.
