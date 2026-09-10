# Verglos Artifact Resolver

Generic artifacts are immutable SHA-256 subjects over regular-file bytes or a
sorted directory projection. Media type, bounded size, and a safe relative
path are recorded. Special filesystem objects and artifacts larger than the
configured ceiling are rejected before a subject is emitted. Resolution reads
bytes only and never executes an artifact.
