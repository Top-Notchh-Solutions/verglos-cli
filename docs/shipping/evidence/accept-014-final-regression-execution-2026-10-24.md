# ACCEPT-014 final regression execution · 2026-10-24

## Execution receipt

- Candidate CLI: `aad2c74395a5c381c955ab9dfab7462295564840`
- Candidate Web: `21f9cfbd559d2b06c328d985ef4615430643c0ed`
- Candidate version: `2.0.0-alpha.4`
- Frozen corpus: eight exact full-clone public OSS fixtures, verified at CLI
  commit `aad2c743` with all four architecture shapes present.
- Actual CLI executions: **12** local scans across all five plan simulations.
- Fixture coverage: **8/8** observed.
- Plan coverage: **5/5** observed (`free`, `pro`, `team`, `studio`, `enterprise`).
- Finding regressions: **0**.
- Performance regressions: **0**; aggregate duration delta was **-10,238 ms**.

The input and result are byte-bound through the final-regression runner. Their
SHA-256 digests are:

- `accept-014-final-regression-input-2026-10-24-v2.json`:
  `e3a52cbc7f43c88a5cfefe0d77aa7e5a07e782efd5dd3c29ebef312d47b8e0da`
- `accept-014-final-regression-result-2026-10-24-v2.json`:
  `58a7f4a7156b04ff22d25522ad47049e8a3fd87f4a842506db6487787a59fe3d`
- Input builder:
  `f5010c597700c93d1ae336b488d2291f18d3a69e8e9f932cf49dd73465146fcf`

## Fail-closed disposition

The run is a genuine **no-go**. All five final-regression gates remain open:
`truthRegistry`, `riskReview`, `heldOutCorrection`, `providerLifecycle`, and
`finalRelease`.

The scenario matrix is intentionally incomplete because the CLI-only execution
does not exercise Web/provider role or tenant behavior. The runner records the
missing dimensions rather than reusing owner/single measurements as false
coverage:

- Missing roles: `admin`, `approver`, `member`, `viewer`.
- Missing tenant mode: `multi`.
- Missing plans: none.
- Missing fixtures: none.

The twelve executed scans had complete scanner coverage and zero run failures;
the no-go is caused by the incomplete matrix and open release gates. No
customer repository, customer data, payment, publication, database mutation,
GitHub Actions run, npm release, tag, or deletion was performed.

This closes the missing *execution receipt* portion of ACCEPT-014's local
implementation work, but does **not** close ACCEPT-014. The row remains open
for the required role/tenant scenario execution, dependent correction/provider
gates, independent review, and final decision.
