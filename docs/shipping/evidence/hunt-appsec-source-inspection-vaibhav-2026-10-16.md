# Hunt AppSec source-inspection evidence — 2026-10-16

## Event identity

- **Evidence source:** owner-pasted Gmail transcript from the reviewer’s
  source-surface session.
- **Reviewer identity as supplied:** Vaibhav J
  (`vaibhavjain11303@gmail.com`).
- **Email timestamp as supplied:** Fri, Oct 16, 2026 at 6:07 PM. The
  timezone was not included in the pasted header and is not inferred here.
- **Reviewer organization, role/security experience, and explicit
  non-implementer statement:** not supplied in this event.
- **Review host shown by the terminal transcript:** `Vaibhav-PC`, Ubuntu under
  WSL2/Docker Desktop; the exact Linux kernel string was not included in the
  pasted transcript.

The original email remains the external source for the full numbered source
transcript. This private record does not duplicate the entire source listing.
No repository secret, `.env` file, customer source, browser session, or
private tracker file was sent to the reviewer.

## Exact source and runtime evidence

- **Repository:** `https://github.com/Top-Notchh-Solutions/verglos-cli`
- **Exact checked-out commit:**
  `fa77496b43d040fe8be977315078502e9e85b947`
- **Checkout result:** detached HEAD at the exact PR #127 regular merge
  commit; the Step 1 commit assertion passed.
- **Dependency install:** `pnpm install --frozen-lockfile` passed for all 9
  workspace projects.
- **Node:** `v22.23.3`
- **pnpm:** `9.15.9`
- **Docker client/server:** Docker Desktop `4.95.0 (242831)`, Engine
  `29.8.2`, Linux `amd64` client/server.
- **Pinned image pull:**
  `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- **Digest assertion:** the exact `Digest:` line was returned by
  `docker pull` and the shell `grep -Fqx` assertion returned successfully.
- **Image-listing limitation:** `docker image ls --digests` returned only a
  header and the formatted digest-listing command repeatedly terminated the
  Ubuntu terminal. Those commands are not credited as evidence and were
  removed from the runbook. The successful pull digest is the retained Step 2
  image-pin evidence.

## Source surface inspected

The email transcript contains numbered output for all ten required review
surfaces at the exact commit:

1. `packages/hunt/README.md`
2. `packages/hunt/src/docker-adapter.ts`
3. `packages/hunt/src/docker-runner.ts`
4. `packages/hunt/src/docker-sandbox-adapter.ts`
5. `packages/hunt/src/docker-runtime-adversarial.test.ts`
6. `packages/hunt/src/restricted-process-adapter.ts`
7. `packages/hunt/src/attack-worker.ts`
8. `packages/hunt/src/types.ts`
9. `scripts/hunt-adversarial-evidence.mjs`
10. `.github/workflows/self-scan.yml`

The transcript is source-inspection evidence only. It records the code shown to
the reviewer; it does not itself state findings, residual risks, or a security
recommendation.

## Acceptance status

This event establishes:

- exact public-source identity;
- successful locked dependency installation;
- Linux-capable Docker runtime metadata;
- pinned-image pull evidence; and
- completion of the requested source-surface reading session.

It does **not** yet establish the independent AppSec gate because the event
does not include:

- the reviewer’s organization and security role/experience;
- an explicit statement that the reviewer did not implement the Hunt boundary;
- the Step 4 adversarial-suite `report.json`, `run.log`, and terminal log;
- findings, residual risks, limitations, and a `PASS`, `PASS WITH LIMITATIONS`,
  or `FAIL` recommendation; or
- a dated signature or other verifiable reviewer approval reference.

No backlog checkbox or score changed. The current score remains **230 checked /
50 unchecked / 280 total (82.1%)**.

## Next required action

From the existing checkout, the reviewer must run Step 4 of the current
runbook, preserve the generated artifacts, and complete the report template.
The reviewer must then send the owner:

- `report.json`;
- `run.log`;
- `reviewer-terminal.log`;
- the completed independent report; and
- the missing identity/independence/recommendation fields above.

Only after those artifacts and the recommendation are reviewed against the
row contracts may the owner reconsider HUNT-011, QUAL-CLI-004, and dependent
Hunt rows. This partial source-inspection event does not close them.

## Step 4 setup attempt — 2026-10-16 13:02:32Z

The reviewer then attempted the adversarial suite from a new disposable clone
at `/tmp/verglos-appsec.nBJjp0/verglos-cli`. The generated report retained the
correct source commit, Linux `x64`, Node `v22.23.3`, image name, and pinned
digest, but recorded `pass: 0`, `skipped: 0`, `failed: 0`, and `exitCode: 1`.

The log shows that `pnpm install --frozen-lockfile` had not been run in this
new clone: workspace `node_modules` was missing, `tsc` was not found, and the
shared build exited with `spawn ENOENT`. No Hunt test executed, so this is an
incomplete environment setup rather than an AppSec finding or a failed
security control. The failed output directory was
`/tmp/verglos-hunt-review.TQYwgK`; it must be preserved as a failed setup
attempt and not used as a passing report.

The reviewer must install the locked dependencies in the current
`nBJjp0` checkout, rerun Step 4 into a new output directory, and retain the
new `report.json`, `run.log`, and terminal log. The AppSec gate and score are
unchanged.

## Step 4 technical run — 2026-10-16 13:25:33Z

The reviewer reran the suite from fresh checkout
`/tmp/verglos-appsec.Y91Fot/verglos-cli` after installing the frozen
dependencies. The generated report records:

- exact source commit `fa77496b43d040fe8be977315078502e9e85b947`;
- Linux `x64`, Node `v22.23.3`;
- image `postgres:15-alpine` and digest
  `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`;
- **96 passed / 2 skipped / 0 failed**; and
- exit code `0`.

This establishes successful pinned Linux technical qualification for the
repository-owned adversarial suite. The two skipped tests must be named from
`run.log` in the reviewer report. The report’s own limitation correctly says
that this suite is not an independent security review.

The AppSec gate remains pending the reviewer’s completed report: organization,
security role/experience, explicit non-implementer confirmation, findings,
residual risks, exact skipped-test explanation, recommendation, and verifiable
sign-off. No checkbox or score changed.
