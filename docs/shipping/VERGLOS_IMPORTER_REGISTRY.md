# Verglos Importer Registry

Imported evidence enters through a bounded JSON reader and explicit format
registry. SARIF, CycloneDX, and SPDX detection requires their identifying
version fields; unknown or ambiguous documents fail closed. Every accepted
document preserves the exact source-byte SHA-256 digest for lineage, while
format-specific normalization remains a separate adapter responsibility.
