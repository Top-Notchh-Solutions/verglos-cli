# Verglos Local Baseline Store

Baselines are written beneath an explicit caller-provided directory with
owner-only permissions. Each write uses a temporary file followed by an atomic
rename, and reads revalidate the complete baseline contract before returning
data.
