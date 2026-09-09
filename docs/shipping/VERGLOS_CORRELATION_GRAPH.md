# Verglos Correlation Graph

Correlation groups observations by canonical fingerprint while retaining every
producer payload and an explicit disagreement flag. Grouping is not evidence
deduplication: producer lineage and conflicting severity/detail remain visible
for review. Fuzzy candidates are intentionally outside this exact-match graph.
