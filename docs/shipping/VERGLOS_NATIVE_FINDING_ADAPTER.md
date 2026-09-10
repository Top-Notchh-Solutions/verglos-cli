# Verglos Native Finding Adapter

The native adapter projects existing scanner findings into a stable envelope
while preserving detector/rule identity, severity and original severity,
confidence, location, snippet, remediation, references, provenance, and legacy
verification state. It does not silently claim a normalized ObservationDocument;
that conversion remains a separate contract step with subject and engine
identity bound.
