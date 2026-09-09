# Verglos SPDX JSON Importer

SPDX JSON import preserves document version/namespace, package and file
checksum/license fields, relationship objects, and exact source-byte digest.
Collections are validated as arrays of objects before normalization; malformed
or ambiguous content fails closed and remains unavailable to policy evaluation.
