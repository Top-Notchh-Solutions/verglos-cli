# Verglos Hunt Planner

The Hunt planner is a dry-run boundary. It accepts only exact rule and subject
matches, then renders the digest-pinned command, isolation, limits, and network
intent. Plans carry `executes: false`; arbitrary shell is never accepted.
