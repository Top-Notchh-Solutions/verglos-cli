# Verglos OCI Manifest Resolver

OCI resolution is a provider-neutral byte boundary. A fetched manifest or
index must be supplied with a digest-pinned reference; mutable tags are never
promoted to immutable identity. Index child digests and explicit platforms are
preserved, and no platform is selected implicitly. Network fetching and
registry authentication remain outside this pure resolver.
