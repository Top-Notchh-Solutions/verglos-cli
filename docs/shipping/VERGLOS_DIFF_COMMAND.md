# `verglos diff`

`verglos diff <base> <head>` compares two local release snapshot JSON files.
It is offline, deterministic, and reports added/fixed/unchanged fingerprints
plus explicit identity, coverage, and policy-input changes. Invalid snapshots
fail with the usage/integrity exit rather than being guessed.
