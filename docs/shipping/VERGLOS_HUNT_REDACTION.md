# Verglos Hunt Output Redaction

Hunt stdout and stderr are redacted for common credential-shaped values and
bounded by an explicit UTF-8 byte cap before evidence projection. Truncation
remains visible to consumers.
