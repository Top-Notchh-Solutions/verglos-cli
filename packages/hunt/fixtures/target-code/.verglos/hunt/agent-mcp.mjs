// Public deterministic reference harness. It inspects local tool dispatch
// only; it does not contact an MCP server or invoke a tool.
import { createCapabilityReceipt, safeDispatchWithReceipt, vulnerableDispatch } from "../../src/agent-mcp.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }

const usedReceipts = new Set();
const receipt = createCapabilityReceipt("get", "user-input");
const firstApprovedCall = safeDispatchWithReceipt("get", "user-input", receipt, usedReceipts);
const replayedCall = safeDispatchWithReceipt("get", "user-input", receipt, usedReceipts);
const replayRejected = replayedCall === undefined;
const receiptBoundaryHeld = firstApprovedCall === "get:user-input" && replayRejected;
const result = fixtureCase === "negative" ? firstApprovedCall : vulnerableDispatch("deleteAll", "user-input");
const reproduced = fixtureCase === "negative" ? !receiptBoundaryHeld : result === "unapproved:deleteAll:user-input";
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({
  verglos: "hunt-result",
  verdict,
  summary: "deterministic Agent/MCP boundary fixture",
  capabilityReceipt: {
    ...receipt,
    firstApprovedCall,
    replay: replayRejected ? "rejected" : "accepted",
  },
})}\n`);
