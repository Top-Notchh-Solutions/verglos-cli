# ICP top 300 TS/JS scan-campaign analysis

Reports dir: `scan-campaign-reports-icp300-tsjs-v1.5.2`
Generated: 2026-07-29T22:54:59.384Z

## Headline numbers

- Attempted scans: 300
- Successful scans: 293
- Failed scans: 7
- Average score: 69.2 / 100
- Median score: 85 / 100

## Score distribution

- Score 100: 48 repos
- Score 90+: 127 repos
- Score 70–89: 52 repos
- Score 40–69: 49 repos
- Score 1–39: 41 repos
- Score 0: 24 repos
- Score below 70: 114 repos

## Severity distribution

- Repos with ≥1 critical finding: 107 (36.5%)
- Repos with ≥1 high finding: 145 (49.5%)
- Repos with ≥1 critical OR high finding: 169 (57.7%)

- Total critical findings: 633
- Total high findings: 1955
- Total medium findings: 2384
- Total low findings: 847
- Total info findings: 8883

## Detector category breakdown

| Category | Findings | Repos |
|---|---:|---:|
| Cryptography | 7599 | 196 |
| Data Exposure | 3216 | 163 |
| Security Misconfiguration | 1904 | 194 |
| Input Validation & Injection | 1035 | 89 |
| Authorization | 691 | 53 |
| Dependency & Supply Chain | 257 | 68 |

## AI provenance

- Repos with ≥20% AI-authored estimate: 104
- Repos with ≥50% AI-authored estimate: 38
- Repos with ≥90% AI-authored estimate: 38

## Top critical rules (across all repos)

| Rule | Critical hits |
|---|---:|
| `D1-001` | 207 |
| `AI-002` | 148 |
| `D4-001` | 101 |
| `AI-001` | 97 |
| `AI-005` | 38 |
| `D1-002` | 22 |
| `D1-003` | 14 |
| `D8-002` | 3 |
| `D6-001` | 2 |
| `D1-005` | 1 |

## Top high-severity rules

| Rule | High hits |
|---|---:|
| `AI-003` | 604 |
| `D5-003` | 463 |
| `AI-008` | 305 |
| `D5-002` | 175 |
| `D1-006` | 111 |
| `D4-001` | 88 |
| `D6-001` | 75 |
| `D4-003` | 50 |
| `D1-007` | 36 |
| `D9-002` | 32 |
| `AI-004` | 10 |
| `D6-002` | 2 |
| `D3-001` | 2 |
| `D1-004` | 2 |

## Worst 15 repos by score

| Slug | Score | Crit | High | Med |
|---|---:|---:|---:|---:|
| `53AI-53AIHub` | 0 | 4 | 37 | 12 |
| `Prismer-AI-PrismerCloud` | 0 | 6 | 15 | 134 |
| `Team-Commonly-commonly` | 0 | 1 | 86 | 53 |
| `VoltAgent-voltagent` | 0 | 6 | 22 | 2 |
| `activepieces-activepieces` | 0 | 18 | 83 | 9 |
| `archestra-ai-archestra` | 0 | 5 | 69 | 21 |
| `danny-avila-LibreChat` | 0 | 1 | 99 | 9 |
| `diegosouzapw-OmniRoute` | 0 | 18 | 102 | 28 |
| `getmaxun-maxun` | 0 | 6 | 29 | 12 |
| `hexclave-hexclave` | 0 | 4 | 22 | 23 |
| `kaitranntt-ccs` | 0 | 3 | 14 | 169 |
| `koala73-worldmonitor` | 0 | 19 | 28 | 66 |
| `langwatch-langwatch` | 0 | 1 | 42 | 55 |
| `lobehub-lobehub` | 0 | 14 | 19 | 13 |
| `mastra-ai-mastra` | 0 | 59 | 41 | 15 |

## Top 10 by critical finding count

| Slug | Crit | High | Score |
|---|---:|---:|---:|
| `decolua-9router` | 66 | 6 | 14 |
| `mastra-ai-mastra` | 59 | 41 | 0 |
| `nocobase-nocobase` | 49 | 5 | 19 |
| `n8n-io-n8n` | 37 | 47 | 0 |
| `ruvnet-ruflo` | 29 | 38 | 0 |
| `koala73-worldmonitor` | 19 | 28 | 0 |
| `activepieces-activepieces` | 18 | 83 | 0 |
| `diegosouzapw-OmniRoute` | 18 | 102 | 0 |
| `can1357-oh-my-pi` | 17 | 3 | 8 |
| `strukto-ai-mirage` | 16 | 3 | 25 |

## Top 10 by high-severity finding count

| Slug | High | Crit | Score |
|---|---:|---:|---:|
| `nexu-io-open-design` | 124 | 12 | 0 |
| `diegosouzapw-OmniRoute` | 102 | 18 | 0 |
| `danny-avila-LibreChat` | 99 | 1 | 0 |
| `steedos-steedos-platform` | 93 | 0 | 0 |
| `teableio-teable` | 91 | 1 | 50 |
| `Team-Commonly-commonly` | 86 | 1 | 0 |
| `activepieces-activepieces` | 83 | 18 | 0 |
| `archestra-ai-archestra` | 69 | 5 | 0 |
| `hoangsonww-Claude-Code-Agent-Monitor` | 59 | 0 | 16 |
| `n8n-io-n8n` | 47 | 37 | 0 |
