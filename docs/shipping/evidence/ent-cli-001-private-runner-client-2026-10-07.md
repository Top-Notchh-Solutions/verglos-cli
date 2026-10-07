# ENT-CLI-001 private runner client — 2026-10-07

## Implementation

- Repository: `verglos-cli`
- Branch: `feat/cli-private-runner-client`
- Commits: `723f655acc314584d93205caee2f7f35bf76379c` and follow-up
  `68772d71232faa955953c34b77c84b6160e904f1`
- PR: #78 (`https://github.com/Top-Notchh-Solutions/verglos-cli/pull/78`)
- Exact current-head hosted runs: platform matrix `37621823761`; self-scan
  `37621823764`. Both were pending at capture; no hosted pass is claimed.

The shared protocol now canonicalizes and verifies Ed25519-signed jobs before
admission. The CLI adds `verglos runner poll <tenantId> <runnerId>` with a
relative-path, authenticated GET-only poll, explicit trusted public key,
tenant/runner/target allowlisting, bounded short-lived admission, and a local
mode-0600 replay cache keyed by job ID and nonce. The output is a least-evidence
admission summary; the command never executes a remote command and never
uploads a result.

## Verification

- shared private-runner focused tests: 5/5
- CLI private-runner focused tests: 3/3
- shared typecheck: pass
- CLI typecheck and build: pass
- full configured CLI suite: pass, 0 failures, exit 0
- `git diff --check`: pass
- public-boundary audit: pass
- command-surface smoke: help output and bounded invalid-input exit 78

## Acceptance boundary

ENT-CLI-001 remains unchecked. This is code-side progress only. Hosted runner
endpoint integration, live runner enrollment, trusted-root custody, actual
bounded recipe execution, result persistence/reconciliation, cross-platform
qualification, and independent review remain required. No production,
database, provider, payment, deployment, browser, or customer operation was
performed.
