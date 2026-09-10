# Verglos Managed Trivy Adapter

The Trivy adapter is an external-engine boundary. It probes only `trivy
--version`, records binary identity and capability status, and reports an
unavailable engine with an explicit incomplete reason when the executable is
absent. Scan execution and normalization remain behind the qualified managed
process boundary; no target code is executed by health discovery.
