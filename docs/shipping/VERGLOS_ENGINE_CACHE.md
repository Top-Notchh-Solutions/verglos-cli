# Verglos Engine Cache

Engine artifacts install beneath a user-controlled cache root at
`<engine>/<version>/engine.bin`. Installs verify the manifest digest, write a
staging file with executable permissions, atomically rename into place, and
remove their lock/staging state on failure. A lock collision is explicit; no
partial artifact is activated.
