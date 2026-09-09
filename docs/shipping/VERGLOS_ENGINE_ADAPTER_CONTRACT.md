# Verglos EngineAdapter Contract

Engine adapters expose versioned capabilities, requirements, health, execution,
normalization, raw-output lineage, and update metadata. Policy, billing,
viewer, and Release Record code consume normalized observations and typed run
documents, never vendor-specific engine structs. Execution requests bind a
target subject, bounded timeout, and explicit network mode; adapters must not
silently widen capabilities or destinations. Raw output remains optional,
redaction-aware evidence for independent verification.
