# Point 5 public npm-package qualification batch 2 — 2026-10-12

**Evidence type:** repository-owned qualification batch
**Status:** partial Point-5 progress; not final POC or release acceptance
**CLI source commit:** `04b9a2b333a7dab8370ab40ae26f46c6b10a0156`
**Package version:** `2.0.0-alpha.1`

## Additional authorized repositories

The repositories were cloned publicly and scanned locally from the exact
checkout shown below. The first is a public MIT-licensed fork under the
company GitHub account. The other two are public company-owned repositories.
No source, report, or secret was uploaded to Verglos or committed to the
public repository.

| Language | Repository | Exact commit | Result |
|---|---|---|---|
| TypeScript | `https://github.com/anuragyadav-git/TutorTrek` | `49f0438c15eb37c0b0f11807024351fa330ff252` | complete coverage; 328 files walked; score 100; 0 findings; exit 0 |
| TypeScript | `https://github.com/anuragyadav-git/White-label-Appointment-Booking-Agent` | `64ff07a30e21f0d3d12f4695b480abe7d1f257dd` | complete coverage; 64 files walked; score 98; 2 findings; exit 0 |
| JavaScript | `https://github.com/anuragyadav-git/full-stack-assessment` | `2d9a649196ab25199949574c99a5a44bb9a278c1` | complete coverage; 17 files walked; score 100; 2 findings; exit 0 |

Each scan used the packed npm CLI with `VERGLOS_TELEMETRY=0`,
`--no-telemetry`, and an isolated temporary `HOME`/`USERPROFILE`. The scan
reports marked coverage `complete`; no provider verification or customer
claim was made from these technical fixtures.

## Docker/Trivy qualification

The `TutorTrek` checkout includes Dockerfiles and Compose configuration. The
packed CLI ran the Trivy producer in Docker with network access denied:

- Trivy image: `0.74.0`
- Image digest:
  `sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969`
- Execution class: `container`
- Network: `none`
- Target code executed: `false`
- Requested/executed capabilities: `trivy.misconfiguration`, `trivy.secrets`
- Process result: code 0, but overall CLI result **exit 3 / incomplete**

The fail-closed limitation is recorded rather than converted to a green
result: this offline profile has no qualified vulnerability database, Trivy
emitted diagnostics whose content was intentionally omitted, and two findings
had no safe bounded identity or relative source location. This proves the
container boundary and incomplete-coverage handling; it does not claim full
Trivy vulnerability coverage.

## Disposition

This batch strengthens Point 5 and provides an owned-fork fixture. It does
not close a backlog checkbox. The remaining Point-5 corpus, plan/hosted
entitlement paths, Hunt/records/MCP qualification, and final acceptance remain
open. The live private tracker remains **228 checked / 52 unchecked / 280
total (81.4%)**.
