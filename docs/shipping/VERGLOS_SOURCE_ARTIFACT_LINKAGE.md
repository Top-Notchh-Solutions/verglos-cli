# Verglos Source-to-Artifact Linkage

Linkage is an explicit declaration between immutable subject IDs. The evaluator
returns matched, mismatched, unavailable, or unverifiable; it never upgrades a
missing declaration into provenance. A mismatch is a hard incomplete signal for
policy consumers, while an unavailable or unverifiable declaration remains
visible as a coverage limitation. This contract does not claim a build was
reproduced or that a producer identity was authenticated.
