# `verglos target inspect`

`verglos target inspect <kind> <value>` resolves repository, package,
filesystem, artifact, and SBOM targets through the shared resolver contracts.
`--json` emits the subject, coverage, and limitations for automation. Exit 0
means complete coverage, exit 3 means explicit incomplete coverage, and exit
78 means unsupported/invalid target input. The command performs metadata reads
only and never executes project code or contacts a registry.
