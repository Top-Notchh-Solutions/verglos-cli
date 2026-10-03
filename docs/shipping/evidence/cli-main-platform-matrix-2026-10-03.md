# CLI merged-main platform matrix — 2026-10-03

Run: GitHub Actions `37115386171`

The workflow was manually dispatched against merged CLI `main` at
`18ab8e7da3003186b80346c3ee4a58c5d8211626`, specifically to requalify the
cache-persistence merge rather than relying on the feature-branch run.

At the latest poll, the in-toto binding and these six cells were terminal
successes:

- Ubuntu Node 20, 22, 24
- macOS Node 20, 22, 24

The three Windows cells (Node 20, 22, 24) remained `in_progress` with no
terminal conclusion. This repeats the earlier hosted runner/control-plane
stall pattern. The run is not recorded as a matrix pass or failure until GitHub
reports a terminal state. No source, publication, deployment, migration, or
production operation was performed.
