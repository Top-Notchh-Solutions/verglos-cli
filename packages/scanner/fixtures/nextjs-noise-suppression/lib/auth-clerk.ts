const logger = {
  warn: (_msg: string, _ctx: unknown) => {},
  info: (_msg: string, _ctx: unknown) => {},
  error: (_msg: string, _ctx: unknown) => {},
};

export function authClerkStub() {
  logger.warn("clerk-client", { reason: "no-session" });
  logger.info("clerk-workspace", { workspaceId: "ws_abc" });
  logger.error("clerk-user-create-failed", { error: "conflict" });
}

const CLERK_PUBLISHABLE_KEY =
  "pk_test_Y2xlcmsuc29tZWRvbWFpbi5jb20kZm9vYmFyLmJhemJheg";

export const clerkKey = CLERK_PUBLISHABLE_KEY;
