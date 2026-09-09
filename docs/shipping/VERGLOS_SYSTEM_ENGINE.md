# Verglos System-Engine Mode

System-engine mode requires an explicit absolute executable path. Verglos
hashes that file and probes the same path for `--version`; it never searches
`PATH` or silently accepts a same-named binary. A non-responsive executable is
reported as unavailable with a computed digest, not trusted as verified.
