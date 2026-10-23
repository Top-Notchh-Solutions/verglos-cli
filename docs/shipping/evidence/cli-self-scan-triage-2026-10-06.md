# CLI self-scan finding triage — 2026-10-06

The raw self-scan result remains at
`docs/shipping/evidence/cli-self-scan-2026-10-06.md`; this note records source
triage and does not rewrite the result.

- Critical `AGENT-002`: reported file `~/.cursor/mcp.json`, an operator-level
  Cursor configuration outside the Verglos CLI checkout. It is not a tracked
  Verglos source or release archive member and cannot be fixed by changing the
  product repository. The remediation is operator-side credential rotation and
  replacing the plaintext value with an environment reference; this was not
  performed automatically.
- High `AUTH-003` at `packages/shared/src/verification.ts:355` and `:358`:
  the code validates a URL origin by requiring empty `url.password` and
  `url.hash` components. These are URL-component equality checks, not password
  authentication or token comparison. The same function also validates HTTPS,
  username, pathname, and query absence. Replacing these checks with a
  password-hashing primitive would be incorrect and would weaken URL
  validation semantics.

The scan's critical/high counts remain unchanged for auditability. This triage
does not claim a clean scan or close any release gate.
