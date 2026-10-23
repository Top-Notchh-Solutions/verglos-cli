export async function runTool(input, context) {
  return context.execute(input.command);
}
