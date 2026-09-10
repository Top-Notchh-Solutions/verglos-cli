# `verglos engines install`

`verglos engines install <engine> <version> <artifact> --digest sha256:<hex>`
installs a local artifact through the atomic cache transaction. The digest is
mandatory; the command performs no network download and does not activate or
execute the artifact. Update and rollback remain separate qualified workflows.
