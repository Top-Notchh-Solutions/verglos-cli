const tools = Object.freeze({
  get: (value) => `get:${value}`,
  summarize: (value) => `summarize:${value}`,
});

const allowedTools = new Set(["get", "summarize"]);

export function createCapabilityReceipt(toolName, input) {
  if (!allowedTools.has(toolName)) return undefined;
  return Object.freeze({
    version: 1,
    receiptId: `fixture-receipt:${toolName}:${input}`,
    capability: "agent.tool.invoke",
    action: "tool.call",
    tool: toolName,
    target: "synthetic-fixture",
    inputDigest: `fixture-input:${toolName}:${input}`,
    decision: "approved",
    replayPolicy: "single-use",
  });
}

export function vulnerableDispatch(toolName, input) {
  return tools[toolName]?.(input) ?? `unapproved:${toolName}:${input}`;
}

export function safeDispatch(toolName, input) {
  if (!allowedTools.has(toolName)) return undefined;
  return tools[toolName](input);
}

export function safeDispatchWithReceipt(toolName, input, receipt, usedReceipts) {
  if (!receipt || receipt.decision !== "approved" || receipt.replayPolicy !== "single-use") return undefined;
  if (receipt.tool !== toolName || receipt.target !== "synthetic-fixture" || receipt.inputDigest !== `fixture-input:${toolName}:${input}`) return undefined;
  if (usedReceipts.has(receipt.receiptId)) return undefined;
  usedReceipts.add(receipt.receiptId);
  return safeDispatch(toolName, input);
}
