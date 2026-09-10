# Verglos OCI Reference Contract

OCI references are parsed before registry access. Registry hosts are lowercase
and cannot contain schemes or credentials; repositories are bounded lowercase
paths; tags are labels, while a digest is required for immutable identity.
Optional platforms use explicit `os/architecture[/variant]` syntax. The parser
does not resolve tags or select a platform—those remain explicit responsibilities
of the later OCI manifest resolver.
