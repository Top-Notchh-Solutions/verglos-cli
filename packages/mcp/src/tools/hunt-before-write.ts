import { checkBeforeWrite, type CheckBeforeWriteInput } from "./check-before-write.js";

/**
 * Hunt's in-loop boundary is intentionally conservative. Arbitrary agent
 * code cannot be converted into a signed recipe, so this surface provides the
 * fast-path preflight and explicitly withholds a sandbox verdict until a
 * supported recipe is supplied by the host.
 */
export async function huntBeforeWritePreflight(input: CheckBeforeWriteInput) {
  const fastPath = await checkBeforeWrite(input);
  return {
    ok: true as const,
    tool: "verglos_hunt_before_write" as const,
    status: "not_attemptable" as const,
    verdict: "not_attemptable" as const,
    fastPath,
    limitations: [
      "No sandbox execution was attempted.",
      "Arbitrary code is not synthesized into a Hunt recipe.",
      "A signed, supported, target-bound recipe and host runtime are required for execution.",
    ] as const,
  };
}
