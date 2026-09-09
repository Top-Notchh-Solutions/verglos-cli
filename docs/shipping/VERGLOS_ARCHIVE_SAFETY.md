# Verglos Archive Safety Gate

Archive extraction must validate member paths and link targets before writing
anything. The shared safety gate rejects absolute/traversal paths, duplicate
members, symlink/hardlink escapes, invalid sizes, member-count overflow, and
aggregate decompressed-size overflow. A parser/extractor must call this gate
before activation; this contract does not itself claim tar/zip decoding or
network download support.
