# Verglos Filesystem Resolver

Filesystem subjects are deterministic tree identities. Entries are sorted by
relative UTF-8 path, regular-file bytes are hashed, symlinks are recorded as
link text without following them, and special or unreadable entries produce
explicit incomplete coverage. The fixed ignore policy is itself hashed and
bound to the subject, so a policy change changes identity. Resolution is data
only and never executes files.
