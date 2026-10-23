# Current CLI self-scan — 2026-10-06

- Source: pinned current CLI worktree
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Command: `node packages/cli/dist/index.js scan --json --no-telemetry --all`
  from the pinned worktree.
- Result: exit `0`; 470 files walked; 75 findings; score `67`; risk level
  `high`; severity counts critical 1, high 2, medium 3, low 0, info 69.
  Thirty-seven test-file findings were explicitly excluded from the score.
- Coverage: `complete`; all 11 requested detectors executed; no limitations.
- Output digest: `sha256:a8bf08360d60f4f3f62ce9c0e23fe7a0f7841525b1f5cab18d9b222ca91f278e`.

The findings and critical result are retained as evidence. This is a
qualification self-scan, not a claim that the source tree is clean or that the
release gates pass.
