# Verglos Optional detect-secrets Runner

The optional runner probes and invokes only a user-configured absolute
detect-secrets executable. Missing or non-responsive installations are
unsupported/incomplete; Verglos never installs Python, downloads packages, or
falls back to a same-named `PATH` command. Execution remains bounded and
attributed to the external tool.
