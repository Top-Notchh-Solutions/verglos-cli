import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const protocol = await readFile(resolve(root, "docs/shipping/acceptance/external-workflow-protocol.md"), "utf8");
const template = await readFile(resolve(root, "docs/shipping/acceptance/consent-record.template.md"), "utf8");

const requiredProtocol = ["No scraping", "Required consent record", "Data handling", "Fixed workflow", "Success criteria", "ACCEPT-005"];
const requiredTemplate = ["Owner/consenting party name", "Exact commit SHA", "May findings be stored?", "Expiry date/time", "Founder approval", "Evidence deletion/expiry result"];
for (const marker of requiredProtocol) if (!protocol.includes(marker)) throw new Error(`protocol missing marker: ${marker}`);
for (const marker of requiredTemplate) if (!template.includes(marker)) throw new Error(`consent template missing marker: ${marker}`);
console.log(JSON.stringify({ schema: "verglos.private.acceptance-protocol.v1", protocol: "present", template: "present", externalContact: "not-performed", customerAcceptance: "open" }));
