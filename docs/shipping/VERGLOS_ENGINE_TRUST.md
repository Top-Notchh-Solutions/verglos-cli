# Verglos Engine Trust

Engine trust is established only by verifying an Ed25519 signature over the
canonical manifest bytes with an explicitly supplied public key. Filenames,
URLs, registry labels, and `PATH` are not trust roots. Invalid keys,
signatures, and algorithms fail closed and remain distinct from an unavailable
engine.
