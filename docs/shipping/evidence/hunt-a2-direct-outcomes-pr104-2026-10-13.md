# HUNT-008 A2 direct harness outcome matrix — PR #104

Date: 2026-10-13  
Public repository: `Top-Notchh-Solutions/verglos-cli`  
Pull request: `#104`  
Public implementation head: `38a8b1ea`  
Merged into public `main` as:
`1b1ea0b08ecad1b18cfd3736252fa81f0161aa49`

## What was added

Each of the seven public A2 reference harnesses now has explicit process-level
fixtures for:

- positive result → harness emits `confirmed`;
- negative result → harness emits `not-reproduced`;
- unsupported result → harness emits `unsupported`;
- timeout → the bounded process runner observes a timeout;
- adapter failure → the harness exits with a non-zero code and the runner
  observes a failed process.

The seven families are SQL/NoSQL injection, command injection, path
traversal, SSRF, Agent/MCP boundary, safe XSS, and authorization/tenant/mass
assignment. The failure fixtures are deterministic and do not access a
network, database, browser, secret, customer source, or arbitrary shell.

## Verification

Local verification on the public implementation head:

```text
pnpm --filter @verglos/hunt test  PASS (66 passed, 16 explicit Linux-host skips, 0 failed)
pnpm --filter verglos test        PASS
pnpm build                        PASS (8/8)
git diff --check                  PASS
```

Protected validation passed:

- self-scan run `38328450179` — success;
- in-toto release binding run `38328450094` — success;
- Ubuntu, macOS, and Windows Node 20/22/24 matrix — all nine cells passed.

The PR was squash-merged normally. No failed-check or administrator bypass was
used.

## Acceptance limitation

This advances direct operational fixture evidence. It does not close HUNT-008:
the fixtures are sanitized reference harnesses rather than customer-code
qualification, and trusted/licensed provenance, supported-rule approval,
hosted entitlement, Linux/Docker adversarial host evidence, independent
review, and final release treatment remain separate acceptance requirements.

The private tracker remains at **228 checked / 52 unchecked / 280 total
(81.4%)**. No backlog checkbox changed from this implementation slice.
