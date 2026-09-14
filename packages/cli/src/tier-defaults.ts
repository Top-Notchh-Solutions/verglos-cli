/** Public tier vocabulary; capability grants come from the server catalog. */
export type Tier = "free" | "pro" | "team" | "studio" | "enterprise" | "founder";

const KNOWN_TIERS: ReadonlySet<Tier> = new Set([
  "free",
  "pro",
  "team",
  "studio",
  "enterprise",
  "founder",
]);

export function normalizeTier(input: string | null | undefined): Tier {
  const value = (input ?? "free").toLowerCase();
  if (value === "compliance") return "enterprise";
  return KNOWN_TIERS.has(value as Tier) ? (value as Tier) : "free";
}
