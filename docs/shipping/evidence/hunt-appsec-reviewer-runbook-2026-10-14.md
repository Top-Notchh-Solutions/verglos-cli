# Hunt independent AppSec review runbook — 2026-10-14

## What this does—and does not do

This is the exact private runbook for the independent Hunt security review.
The commands only obtain and exercise the public CLI source at the exact
review commit. They do not require an npm publication, Vercel access,
Preview secrets, customer repositories, or the private shipping tracker.

Running the commands alone does **not** open the AppSec gate. The gate needs a
dated report from a real, security-competent reviewer who is not Anurag Yadav
and did not implement the Hunt boundary. The report must identify the exact
commit and environment, describe the source inspection and commands actually
run, record findings and limitations, and give a recommendation. A `FAIL`
does not open the gate. `PASS WITH LIMITATIONS` is acceptable only if the
specific backlog row expressly allows the stated limitations; otherwise the
row remains open until the limitations are resolved or formally accepted by
the applicable contract.

This review is scoped to the Hunt execution/Docker isolation boundary, not the
whole Verglos product. It is not a penetration test, product-security
certification, customer acceptance, or permission to run arbitrary commands.

## Reviewer requirements

- Use the reviewer’s real name and organization in the report.
- The reviewer must be independent of the Hunt implementation and have
  suitable AppSec/security competence.
- Use a separate Linux laptop or an Ubuntu Linux VM when possible. A
  Mac-only Docker Desktop run may explicitly skip Linux namespace checks and
  cannot by itself establish the full Linux qualification.
- Do not receive or request repository secrets, `.env` files, customer data,
  browser sessions, or private tracker files.

## Step 1 — clone the exact public source

Run these commands in a fresh terminal on the reviewer’s Linux laptop or
Ubuntu VM:

```bash
set -euo pipefail

review_root="$(mktemp -d /tmp/verglos-appsec.XXXXXX)"
git clone https://github.com/Top-Notchh-Solutions/verglos-cli.git "$review_root/verglos-cli"
cd "$review_root/verglos-cli"

git checkout --detach ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a
test "$(git rev-parse HEAD)" = "ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a"

printf 'Reviewed commit: '
git rev-parse HEAD
```

Stop if the final line is not exactly:

```text
ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a
```

## Step 2 — install the locked toolchain and verify Docker

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install --frozen-lockfile

node --version
pnpm --version
docker version

docker pull postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a
docker_digest="$(docker image inspect postgres:15-alpine --format '{{index .RepoDigests 0}}')"
printf 'Resolved image reference: %s\n' "$docker_digest"
case "$docker_digest" in
  *"@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a") ;;
  *) echo 'Pinned image digest mismatch; stop and report it.' >&2; exit 1 ;;
esac
```

Record the OS, architecture, kernel, Docker version, Node version, pnpm
version, and the resolved image reference in the report.

## Step 3 — inspect the review surface before running it

Read these files at the checked-out commit:

```text
packages/hunt/README.md
packages/hunt/src/docker-adapter.ts
packages/hunt/src/docker-runner.ts
packages/hunt/src/docker-sandbox-adapter.ts
packages/hunt/src/docker-runtime-adversarial.test.ts
packages/hunt/src/restricted-process-adapter.ts
packages/hunt/src/attack-worker.ts
packages/hunt/src/types.ts
scripts/hunt-adversarial-evidence.mjs
.github/workflows/self-scan.yml
```

Check the implementation and tests against these questions:

1. Is execution recipe-bound, approval-bound, and trust/digest-bound?
2. Is network access denied by default, with no accidental host socket,
   device, or unrestricted host namespace exposure?
3. Are the source/root filesystem, user identity, privileges, namespaces,
   processes, CPU, memory, output, timeout, and temporary storage bounded?
4. Are secrets, host paths, and target content redacted from output and
   reports?
5. Are cleanup and partial-start failures deterministic?
6. Are unavailable runtimes and infrastructure failures classified as
   infrastructure failures rather than positive security findings?
7. Do the tests exercise negative paths as well as successful fixture paths?

Record any concern, even if the command run is green. A green test result is
not a substitute for source inspection.

## Step 4 — run the exact pinned adversarial suite

```bash
review_output="$(mktemp -d /tmp/verglos-hunt-review.XXXXXX)"

set +e
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
node scripts/hunt-adversarial-evidence.mjs "$review_output" 2>&1 \
  | tee "$review_output/reviewer-terminal.log"
run_status="${PIPESTATUS[0]}"
set -e

printf 'Suite exit code: %s\n' "$run_status"
test "$run_status" -eq 0
cat "$review_output/report.json"
```

The script runs the repository’s `@verglos/hunt` test package with the pinned
Docker integration settings and writes `report.json` and `run.log`. Preserve
those files and the terminal transcript. Do not edit the generated report.

## Step 5 — create the independent review report

Create a separate report file, for example
`hunt-independent-review-<reviewer>-2026-10-14.md`, containing:

```text
Reviewer name:
Organization:
Role / security experience:
Contact or verifiable approval reference:
Review date (UTC):
Not the implementer: yes/no

Repository:
Exact commit reviewed:
OS / architecture / kernel:
Node / pnpm / Docker versions:
Pinned image and digest:

Source files inspected:
Commands actually run:
Generated report and transcript paths:
Pass / skip / fail totals:

Findings:
Residual risks:
Limitations or non-reproduced checks:
Recommended disposition: PASS / PASS WITH LIMITATIONS / FAIL
Reviewer signature or verifiable approval reference:
```

The reviewer must return the report together with `report.json`, `run.log`,
and the terminal transcript. The report must be private and must not contain
credentials, environment-variable values, customer source, or unrelated
private tracker content.

## When the gate can be recorded as open

Give the completed report and generated artifacts to the shipping owner. The
owner records them in the private tracker and maps the exact recommendation
to each affected row. Only then may the AppSec-dependent Hunt/provenance rows
be reconsidered. This evidence does not automatically close legal,
provenance, customer-target, hosted-entitlement, npm, or final-acceptance
criteria that remain separately open.

Until that independent report exists and its recommendation satisfies the
row contracts, the AppSec gate remains open and the score must not change.
