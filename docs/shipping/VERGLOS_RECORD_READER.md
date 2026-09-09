# Verglos Safe Record Reader

The safe reader validates the Release Record manifest, loads every
content-addressed member, verifies its digest and declared size, and only then
returns member bytes. It does not execute member content or accept traversal
paths.
