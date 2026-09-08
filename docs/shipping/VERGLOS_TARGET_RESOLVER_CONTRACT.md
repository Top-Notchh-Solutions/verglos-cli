# Verglos Target Resolver Contract

Target resolution is a data-only boundary. A resolver receives explicit target
syntax and a context whose `executeProjectCode` value is literally `false`.
Repository, package, filesystem, artifact, SBOM, and OCI implementations may
discover identity and coverage, but must not run project scripts, builds,
install hooks, or target binaries. Network use is an explicit context choice.

Resolvers report a subject plus complete/incomplete coverage and limitations;
they do not invent identity when required metadata is unavailable. Later
resolver implementations must use the shared target types and capability names
so CLI, verifier, and API consumers can negotiate support without coupling to
a particular resolver.
