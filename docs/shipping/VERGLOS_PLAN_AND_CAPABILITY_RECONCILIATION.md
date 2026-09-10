# Verglos plan and capability reconciliation

Status: `TRUTH-004` migration decision and contradiction map

Reviewed: 2026-09-08

Owners: Product/Founder for commercial activation; Hosted Platform for catalog/authorization; CLI Core for opaque consumption

No plan behavior changes in this document. It establishes the migration target before commercial implementation begins.

## Authority decision

The target public plan IDs are `free | pro | team | studio | enterprise`.

- `founder` becomes an internal authorization override/role, not a public plan.
- `compliance` remains a read-compatible legacy alias and migrates to `enterprise`.
- `sentinel` is a retired legacy alias and migrates to `pro`.
- One versioned server-side plan catalog owns public labels, status, effective dates, prices, billing periods, currency, seats, applications, records, clients, retention, traffic, managed execution, capabilities, and overage rules.
- CLI entitlement data is versioned and opaque. A minimal Free/offline safety fallback cannot become duplicated commercial truth.
- Database plan columns eventually reference a catalog/version or validated public ID. Internal overrides are stored separately.
- Existing active licenses retain access during dual-read migration; no destructive rename precedes compatibility and rollback tests.

## Current vocabulary mismatch

| Surface | Current values | Conflict | Migration |
|---|---|---|---|
| shared plans | `free, pro, studio, enterprise` | no Team; mixes live and roadmap | replace display constants with catalog projection |
| shared config | `free, pro, studio, compliance` | no Team/Enterprise/Founder; config is not authorization | read legacy only; remove authority |
| entitlement types | `free, pro, studio, compliance, founder` | no Team/Enterprise; override mixed with plans | versioned canonical claims plus legacy decoder |
| CLI fallback tiers | `free, pro, studio, enterprise, founder`; Compliance maps to Enterprise | no Team; differs from web | server claims plus minimal compatibility fallback |
| CLI Hunt/Attest sets | raw Pro/Studio/Compliance/Founder checks | Enterprise can disagree with normalization | authorize by capability, never raw plan |
| web registry | `free, pro, studio, compliance, founder` | no Team/Enterprise; override mixed with plans | catalog-derived capabilities |
| `licenses.plan` | unrestricted text; default Pro | legacy/invalid values possible | alias mapper, then validated catalog reference |
| checkout | Pro only | no Team/Studio purchase; display and charge are separate | orders derive from active catalog price |
| account UI | raw plan label plus legacy capability count | may expose Compliance/Founder publicly | public projection plus separate internal badge |

## Pricing mismatch and decision

| Surface | Free | Pro | Team | Studio | Enterprise |
|---|---:|---:|---:|---:|---:|
| shared CLI display | $0 | $29/mo; $290/year in limits | absent | $199/mo; $1,990/year | contact |
| web checkout display | n/a | $29/mo or $290/year | absent | absent | absent |
| Razorpay charge | n/a | env paise; fallback ₹1; 30/365 days | absent | absent | absent |
| architecture recommendation | $0 | $29/$290 | $99/$990 | $249/$2,490 | contract; entry ARR hypothesis |

- Preserve current Pro at `$29/month` and `$290/year`, but do not claim the charged amount matches until catalog-bound gateway verification passes.
- Seed Team `$99/$990` and Studio `$249/$2,490` only as inactive launch hypotheses. They do not authorize checkout or GA.
- `$79` Team and `$199` Studio may exist only as named, time-bounded founding-cohort versions after founder authorization.
- Enterprise remains contract-priced. `$12k–$30k ARR` is an internal hypothesis, never a quote or public floor.
- Currency conversion, tax, refunds, discounts, regional pricing, and overage packs remain undecided.

## Allowance mismatch and decision

| Dimension | Current implementation | V1 catalog seed/target | Decision |
|---|---|---|---|
| Free local | no hosted account required | one local user; no cloud required; included local work unmetered | preserve; no artificial degradation |
| Pro seats | shared says 2; no member enforcement | 2 | target until membership enforcement ships |
| Pro apps | shared says 5; unlock enforces 2 fingerprints; monitor has no limit | 5 monitored apps | fingerprints and monitored apps are distinct units; migrate hard-coded fence |
| Pro records | no canonical record ledger | 100/month | inactive until record and usage ledgers exist |
| Pro history | shared/web use 30 days | target 90 days | public remains 30 until `PRO-009` |
| Team | absent | 5 seats, 25 apps, 500 records/month, 12 months | inactive hypothesis until Team gates |
| Studio seats | shared says 10 | 10 | inactive until member enforcement |
| Studio clients/apps/records | shared projects unlimited; no client model | 20 clients, 100 apps, 2,000 records/month | never say unlimited; inactive until ledgers/workspaces |
| Studio history | current code says 365 days | 3 years | no target claim before migration |
| Enterprise | null/unlimited-shaped constants | contracted values | explicit contract; null never means unlimited |
| machines | unlock enforces 5 unique/day | not a public seat/app allowance | abuse signal pending device policy |
| managed Hunt | absent | separately metered if launched | never bundle unlimited hosted compute |

## Capability mismatch

| Family | Shared display | CLI fallback/gate | Web registry | Current truth | Target decision |
|---|---|---|---|---|---|
| native detectors | all shown Free | seven Free; deeper packs need web-only names | deeper packs Pro | shared display overstates Free | catalog exact detector packs |
| provenance/package/reports | Free | dot and legacy aliases coexist | legacy names | shipped with naming drift | versioned namespace; aliases only at decoder edge |
| fix | Pro | `fix` and `fix.auto` | Pro `fix` | bounded header fix | label bounded behavior |
| CI threshold | Pro | `ci_threshold` and `ci.threshold` | Pro | shipped | normalize later to `ci.threshold` |
| Hunt | tier access displayed | shells; raw plan checks | absent | not functional | add only after acceptance |
| monitoring | Pro | `monitor_register` and `monitor.cve` | daily/channels/deeper packs | hourly, unreliable, no digest | separate actions; remain partial |
| score history | Pro 30 days | no allowance claim | 30/365/1095 names | partial | numeric retention, not capability suffix |
| Attest/verify | Studio | shell and aliases | unsigned summary permitted | no signed journey | record/sign/publish actions after record contract |
| SBOM/risk/rotate | Studio-shaped | absent | names active | absent | remove active grants until shipped |
| Compliance extras | Enterprise-shaped/absent | absent | names active | absent | future Enterprise contract only |
| SSO/audit/custom | Enterprise display | fallback names | Compliance names | planned | canonical Enterprise catalog after gates |

New claims use a versioned dotted capability namespace, with exact names frozen in the later contract task. Numeric limits—days, seats, apps, records, clients, traffic, storage, managed runs—are allowance values, not capability strings.

## Enforcement mismatch

1. CLI gates are UX, not security; a modified CLI can omit them.
2. Some hosted routes check paid/Attest access, while other capabilities exist only in arrays or copy.
3. Generic paid checks authorize broad plan groups instead of resource/action capabilities.
4. Current rows have no tenant, membership, role, catalog version, allowance, or usage reservation.
5. Checkout is hard-coded USD while Razorpay independently reads paise with a sentinel fallback.
6. Offline Pro fallback omits deeper rule-pack names that online Pro receives.
7. Studio/Compliance capabilities can be returned when their product behavior is absent.

Target enforcement is server-side resource/action/tenant/role/capability authorization plus atomic usage reservation. The CLI displays effective truth but never grants hosted access.

## Migration mapping

| Current | Migration read | Future write | Public display |
|---|---|---|---|
| `sentinel` | Pro legacy | never | Pro |
| `pro` | preserve | Pro plus catalog version | Pro |
| `studio` | preserve only implemented access | only after Studio gates | Studio with maturity label until GA |
| `compliance` | Enterprise legacy | never | Enterprise only after contract mapping |
| `enterprise` | accept legacy CLI decoder | Enterprise plus contract | Enterprise |
| `founder` | internal super-admin override | outside public plan field | effective public plan plus internal badge |
| `team` | no current rows expected | only after Team gates | Team |
| unknown | Free display; deny paid hosted action | reject | never echo raw value |

## Preconditions

- Catalog has stable ID/version/status/effective interval, currency/period prices, allowances, and capabilities.
- Founder activates hypothesis prices; inactive entries are not purchasable.
- Current licenses are inventoried with reversible alias mapping and rollback.
- Hosted actions authorize tenant/resource/action/role/capability server-side.
- Gateway orders derive from catalog versions and reconcile signed amount/currency/period.
- `TRUTH-008` defines usage units before quota enforcement.
- Current Pro access survives dual-read compatibility tests.
- Public wording stays governed by the truth registry and release gates.

## Unresolved founder/commercial choices

- Team GA `$99` versus a named `$79` founding cohort.
- Studio GA `$249`, a named `$199` cohort, or another measured model.
- Additional-seat price and separately charged onboarding/branding.
- Regional currency, tax, invoice, refund, discount, and overage policy.
- Enterprise entry pricing and minimum allowances.

Inactive versioned entries let contract/catalog engineering proceed without guessing. These choices still block public checkout activation and GA pricing claims.
