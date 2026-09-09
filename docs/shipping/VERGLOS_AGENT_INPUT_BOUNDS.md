# Verglos Agent Input Bounds

Agent-facing inputs have bounded UTF-8 sizes before execution or network work:
code, paths, context, and package names are rejected when oversized. The
limits are explicit and reusable across CLI and MCP handlers.
