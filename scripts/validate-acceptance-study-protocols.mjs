import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const files = {
  comprehension: ["docs/shipping/acceptance/comprehension-test-protocol.md", ["Required questions", "zero critical hallucinations", "ACCEPT-006 remains open"]],
  hunt: ["docs/shipping/acceptance/hunt-adjudication-protocol.md", ["at least **100**", "environment-failure", "two reviewers", "ACCEPT-007 remains open"]],
};
for (const [name, [path, markers]] of Object.entries(files)) {
  const text = await readFile(resolve(root, path), "utf8");
  for (const marker of markers) if (!text.includes(marker)) throw new Error(`${name} protocol missing marker: ${marker}`);
}
console.log(JSON.stringify({ schema: "verglos.private.acceptance-study-protocols.v1", protocols: Object.keys(files), participantRun: "open", huntAdjudication: "open" }));
