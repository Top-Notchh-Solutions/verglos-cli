# CLI merged-main platform matrix — 2026-10-03

Run: GitHub Actions `37115386171`

The workflow was manually dispatched against merged CLI `main` at
`18ab8e7da3003186b80346c3ee4a58c5d8211626`, specifically to requalify the
cache-persistence merge rather than relying on the feature-branch run.

At the latest poll, the in-toto binding and these six cells were terminal
successes:

- Ubuntu Node 20, 22, 24
- macOS Node 20, 22, 24

The run later reached terminal **success**. Windows Node 20, 22, and 24 all
completed successfully, joining the six Ubuntu/macOS cells and the successful
in-toto binding. This qualifies the merged cache-persistence source across the
full supported matrix; it does not qualify trusted publication, legal release,
customer acceptance, or production migration. No source, publication,
deployment, migration, or production operation was performed.
