# Hunt independent AppSec review runbook — 2026-10-14

## What this does—and does not do

This is the exact private runbook for the independent Hunt security review.
The authoritative public source is the regular merge commit from Verglos CLI
PR #127; review that commit exactly, not an earlier branch or release tag.
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

## Choose the available laptop

### Preferred: Windows with WSL2/Ubuntu

Use the Ubuntu terminal inside WSL2, not Windows PowerShell or Command Prompt.
The following is the complete from-zero setup for a reformatted Windows
laptop. Administrator permission is needed only for Windows/WSL and Docker
installation; the review commands themselves run as the reviewer’s normal
Ubuntu user.

#### Windows setup — run once

1. Open **PowerShell as Administrator** and run:

```powershell
wsl --install -d Ubuntu
```

Restart Windows when asked. On the first Ubuntu launch, choose a Linux
username and password. These are local laptop credentials; do not send them
to the shipping owner.

2. Update WSL from **PowerShell**, not from the Ubuntu shell:

```powershell
wsl.exe --update
```

Verify from PowerShell:

```powershell
wsl.exe -l -v
```

The Ubuntu row must show version `2`. If it does not, run from PowerShell:

```powershell
wsl.exe --set-version Ubuntu 2
wsl.exe --set-default-version 2
```

3. Install Docker Desktop for Windows. From **PowerShell as Administrator**,
either run:

```powershell
winget install --id Docker.DockerDesktop --exact
```

or download Docker Desktop from Docker’s official website. Start Docker
Desktop, keep **Use the WSL 2 based engine** enabled, then open
**Settings → Resources → WSL Integration** and enable integration for
**Ubuntu**. Docker Desktop must remain running during the review.

Do not install a second Docker Engine inside Ubuntu. Docker Desktop’s WSL2
integration supplies the Docker CLI and daemon to Ubuntu.

4. Close PowerShell and use a new **Ubuntu** terminal for the rest of this
runbook. Install the basic tools:

```bash
set -euo pipefail
sudo apt-get update
sudo apt-get install -y ca-certificates curl git build-essential
```

5. Install Node.js 22 through `nvm`, then enable the repository’s locked
package-manager version:

```bash
set -euo pipefail
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm alias default 22
nvm use 22
node --version
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm --version
```

The output must show Node 22.x and pnpm 9.15.9. If the next Ubuntu terminal
does not know `nvm`, run:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
```

6. Verify the review runtime before cloning the source:

```bash
uname -srm
docker version
docker info --format 'Docker server: {{.ServerVersion}}; OS: {{.OSType}}; arch: {{.Architecture}}'
```

The first command must identify a Linux kernel, `docker version` must show
both a client and a reachable server, and `docker info` must report Linux as
the server OS. If any check fails, stop and fix the laptop setup; do not
create a passing report from a partial run.

Then run Steps 1–5 below in that same Ubuntu terminal. No GitHub token,
repository secret, Vercel account, npm account, or private tracker access is
needed because the review source is public.

### MacBook

The MacBook is optional. It may be used for source inspection and a
preliminary Docker run, but the generated report must record that macOS is
being used. If the Windows laptop is available, use Windows WSL2 for the
authoritative review instead.

For a fresh Mac preliminary setup, in Terminal run:

```bash
set -euo pipefail
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
if [ -x /opt/homebrew/bin/brew ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ -x /usr/local/bin/brew ]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi
brew install git nvm
mkdir -p "$HOME/.nvm"
export NVM_DIR="$HOME/.nvm"
. "$(brew --prefix nvm)/nvm.sh"
nvm install 22
nvm alias default 22
nvm use 22
corepack enable
corepack prepare pnpm@9.15.9 --activate
brew install --cask docker
open -a Docker
```

Wait until Docker Desktop reports that it is running, then verify:

```bash
uname -srm
node --version
pnpm --version
docker version
```

The repository may explicitly skip Linux namespace assertions on macOS, so a
Mac-only run cannot by itself establish the full Linux AppSec qualification.
For a gate-ready review, use the Windows WSL2/Ubuntu environment or an Ubuntu
VM instead. Do not claim the macOS skip as a Linux pass.

Only one reviewer environment is needed. Do not run the review on both
laptops just to create extra activity; use the Linux-capable environment for
the authoritative run and record any separate Mac result only as a limitation.

## Step 1 — clone the exact public source

Run these commands in the prepared Ubuntu terminal on the reviewer’s Windows
WSL2 environment or Ubuntu VM:

```bash
set -euo pipefail

review_root="$(mktemp -d /tmp/verglos-appsec.XXXXXX)"
git clone https://github.com/Top-Notchh-Solutions/verglos-cli.git "$review_root/verglos-cli"
cd "$review_root/verglos-cli"

git checkout --detach fa77496b43d040fe8be977315078502e9e85b947
test "$(git rev-parse HEAD)" = "fa77496b43d040fe8be977315078502e9e85b947"

printf 'Reviewed commit: '
git rev-parse HEAD
```

Stop if the final line is not exactly:

```text
fa77496b43d040fe8be977315078502e9e85b947
```

## Step 2 — install the locked repository dependencies and verify Docker

Run this step from the same Ubuntu terminal in the checked-out repository.
Do not run `cd ..`; the prompt should end in:

```text
/tmp/verglos-appsec.XXXXXX/verglos-cli
```

Run the commands one at a time or paste the complete block. Do not include the
Markdown fence characters. This step intentionally does **not** use
`docker image inspect`: that command can terminate an Ubuntu/WSL terminal when
Docker Desktop’s WSL integration has an image-metadata problem. The pull log
and the digest listing provide the same pinned-image evidence without that
failure-prone call.

```bash
set -euo pipefail

pnpm install --frozen-lockfile

node --version
pnpm --version
docker version

docker_pull_log=/tmp/verglos-postgres-pull.log
docker pull postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a 2>&1 \
  | tee "$docker_pull_log"
grep -Fqx 'Digest: sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a' \
  "$docker_pull_log"

docker image ls --digests postgres:15-alpine
docker image ls --digests --format '{{.Digest}}' postgres:15-alpine \
  | grep -Fx 'sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a' \
  >/dev/null

printf 'Pinned image reference verified: docker.io/library/postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a\n'
```

Record the OS, architecture, kernel, Docker version, Node version, pnpm
version, the complete `docker image ls --digests` output, and the pull-log
digest line in the report. Keep `/tmp/verglos-postgres-pull.log` with the
review evidence until the report is complete.

If Ubuntu closes during this step, do not repeat the full block immediately.
Reopen Docker Desktop first, then open a new Ubuntu terminal and run:

```bash
set -euo pipefail
review_repo="$(find /tmp -maxdepth 2 -type d -path '/tmp/verglos-appsec.*/verglos-cli' -print -quit)"
test -n "$review_repo"
cd "$review_repo"
docker info
docker image ls --digests postgres:15-alpine
```

If `docker info` fails, Docker Desktop is not reachable through WSL2; enable
Ubuntu under **Docker Desktop → Settings → Resources → WSL Integration**, keep
Docker Desktop running, and retry. If `docker info` works but the digest
listing fails, stop and record the exact error as an infrastructure limitation;
do not create a passing AppSec result. The digest must be visible and must
match the pinned value before continuing to Step 3.

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
