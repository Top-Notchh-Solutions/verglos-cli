# GitHub PR promotion and merge qualification · 2026-10-22

## Scope

The implementation work was promoted from the real clean CLI/Web worktrees to
GitHub as normal feature branches and merged without squashing or rewriting
history.

### CLI

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Branch: `codex/dist-003-checksum-generation-20261022`
- Implementation commits: `5072204f9164c0f2b2e846dde98ee2a1c8d7bf89`,
  `e44ce8a673fb1d9119a3231f896d0f86a00cdc3c`
- Pull request: [#158](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/158)
- Merge commit: `145ff5d902289ecfb670a397c9e87860eb06309d`
- Merged: `2026-10-22T09:45:38Z`
- Hosted workflows at `e44ce8a6`: Platform matrix `39756195090`, Self-scan
  `39756194960`, and Standard validation `39756194921` all completed
  successfully.

### Web

- Repository: `anuragyadav-git/verglos-web`
- Branch: `codex/studio-entitlement-recipient-20261019`
- Implementation commits through merge: `38d6eb0`, `62a54b5`, `938dd7e5`,
  `a3819c1`, `70f69de`, `cb23021`, `81904e8`, `08750cb`
- Pull request: [#229](https://github.com/anuragyadav-git/verglos-web/pull/229)
- Merge commit: `939ea4c29e4518dcd9564705e8341b0ef7e7234c`
- Merged: `2026-10-22T09:45:38Z`
- Hosted workflows at `08750cb`: Verify web `39757724439` and Private runner
  qualification `39757724442` both completed successfully.

The Web branch also repaired the hosted qualification failure encountered at
the prior head: the isolated PostgreSQL service moved from public ECR to the
pinned Google mirror, and the dependency audit's high `follow-redirects`
findings were closed by a lockfile-enforced `>=1.16.1` override. The new
private-runner workflow contract passed **25/25** locally; local dependency
audit reported **0 high/critical** findings and four moderate findings.

## Local qualification

CLI evidence at `e44ce8a6`:

- build **8/8**;
- focused archive/release suite **9/9**;
- broader release contract suite **37/37**;
- seven public archives passed packed-manifest and clean-consumer checks.

Web evidence at `08750cb`:

- private-runner suite **25/25**;
- typecheck passed;
- Drizzle schema check passed;
- **43** ordered migrations passed;
- landing release contract **4/4**;
- public-release smoke contract **2/2**;
- dependency audit: **0 high/critical** findings.

## Disposition

This proves real GitHub promotion, hosted CI, and normal merge history. It does
not by itself check `DIST-001`, `DIST-002`, `DIST-003`, `STUDIO-CLI-001`, or
`ENT-CLI-001`: those rows retain their own dependency, legal/release,
recipient/enterprise, publication, or acceptance conditions. No npm
publication, provider, Production, database, entitlement, customer, or
AppSec operation occurred. Current score remains **239 checked / 41 open / 280
total (85.4%)**.
