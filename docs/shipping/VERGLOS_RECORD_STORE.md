# Verglos Local Record Store

Record members are content-addressed by SHA-256, bounded to 50 MB per member,
validated on read, and published with atomic rename. Relative member paths
reject absolute, separator, and traversal forms; this store performs no
signing or hosted upload.
