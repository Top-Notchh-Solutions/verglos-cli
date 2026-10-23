const STORY_PLAN = {
  "free-scan": ["cli-package-suite"],
  "ci-decision": ["cli-package-suite"],
  "trivy-import": ["cli-package-suite"],
  "multi-tool-dedup": ["cli-package-suite"],
  "mismatch-incomplete": ["cli-package-suite", "web-composed-acceptance-substrates"],
  "exception-register": ["cli-package-suite", "web-composed-acceptance-substrates"],
  "hunt-isolation": ["cli-package-suite"],
  "offline-record": ["cli-package-suite"],
  "modified-cli": ["web-full-suite"],
  "studio-recipient": ["web-composed-acceptance-substrates"],
  "enterprise-runner": ["web-composed-acceptance-substrates"],
  "account-deletion": ["web-composed-acceptance-substrates"],
};

export const ACCEPTANCE_STORY_EXECUTION_PLAN = Object.freeze(
  Object.fromEntries(
    Object.entries(STORY_PLAN).map(([storyId, surfaces]) => [storyId, Object.freeze([...surfaces])]),
  ),
);

const ALLOWED_STATUSES = new Set([
  "substrate-covered",
  "qualification-open",
  "runtime-qualification-open",
  "customer-acceptance-open",
  "provider-qualification-open",
]);

/**
 * Bind every frozen story to a command label produced by the verifier.
 *
 * `substrateExecuted` means only that the repository-owned command surface
 * ran. `acceptanceStatus` is deliberately preserved from the story map so an
 * open hosted/provider/customer/reviewer gate cannot become a local pass.
 */
export function buildAcceptanceStoryCoverage(stories, executedLabels) {
  if (!Array.isArray(stories) || stories.length !== Object.keys(STORY_PLAN).length) {
    throw new Error("acceptance story plan requires exactly twelve story entries");
  }
  if (!(executedLabels instanceof Set)) {
    throw new Error("acceptance story plan requires the executed result labels");
  }

  const seen = new Set();
  const coverage = stories.map((story) => {
    if (!story || typeof story !== "object" || typeof story.id !== "string") {
      throw new Error("acceptance story map contains an invalid story");
    }
    if (seen.has(story.id) || !(story.id in STORY_PLAN)) {
      throw new Error(`acceptance story map contains an unknown or duplicate story: ${story.id}`);
    }
    seen.add(story.id);
    if (!ALLOWED_STATUSES.has(story.status)) {
      throw new Error(`acceptance story has an invalid status: ${story.id}`);
    }

    const requiredSurfaces = STORY_PLAN[story.id];
    const missingSurfaces = requiredSurfaces.filter((label) => !executedLabels.has(label));
    if (missingSurfaces.length > 0) {
      throw new Error(`acceptance story ${story.id} is missing executed surfaces: ${missingSurfaces.join(", ")}`);
    }

    return Object.freeze({
      id: story.id,
      acceptanceStatus: story.status,
      requiredSurfaces,
      substrateExecuted: true,
      qualificationRequired: story.status !== "substrate-covered",
      evidence: Object.freeze(Array.isArray(story.evidence) ? [...story.evidence] : []),
    });
  });

  if (seen.size !== Object.keys(STORY_PLAN).length) {
    throw new Error("acceptance story map does not cover all twelve frozen stories");
  }
  return Object.freeze(coverage);
}
