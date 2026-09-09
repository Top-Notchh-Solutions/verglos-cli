# Verglos CycloneDX Importer

CycloneDX import preserves BOM version/serial number, component and dependency
objects, and exact source-byte digest. Components, dependencies, PURLs,
hashes, licenses, and declared subject relationships remain source-linked for
later normalization; malformed arrays fail closed instead of being silently
discarded.
