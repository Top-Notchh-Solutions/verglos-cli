# Verglos SARIF 2.1.0 Importer

SARIF import accepts only version 2.1.0 through the bounded importer registry.
Run/tool/rule/result/location/fingerprint and automation payloads remain linked
to the exact source-byte digest; format-specific normalization must not discard
those fields. Malformed runs or unsupported versions fail closed before policy
evaluation.
