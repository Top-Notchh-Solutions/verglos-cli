export const AGENT_ACTIONS = ["inspect", "propose", "mutate", "install", "execute", "network", "except", "sign", "publish", "upload", "policy", "billing"] as const;
export type AgentAction = (typeof AGENT_ACTIONS)[number];

export interface ActionAuthority {
  readonly action: AgentAction;
  readonly approvalRequired: boolean;
  readonly sideEffect: "none" | "filesystem" | "process" | "network" | "hosted" | "identity";
}

const MATRIX: Record<AgentAction, ActionAuthority> = {
  inspect: { action: "inspect", approvalRequired: false, sideEffect: "none" },
  propose: { action: "propose", approvalRequired: false, sideEffect: "none" },
  mutate: { action: "mutate", approvalRequired: true, sideEffect: "filesystem" },
  install: { action: "install", approvalRequired: true, sideEffect: "filesystem" },
  execute: { action: "execute", approvalRequired: true, sideEffect: "process" },
  network: { action: "network", approvalRequired: true, sideEffect: "network" },
  except: { action: "except", approvalRequired: true, sideEffect: "identity" },
  sign: { action: "sign", approvalRequired: true, sideEffect: "identity" },
  publish: { action: "publish", approvalRequired: true, sideEffect: "hosted" },
  upload: { action: "upload", approvalRequired: true, sideEffect: "network" },
  policy: { action: "policy", approvalRequired: true, sideEffect: "identity" },
  billing: { action: "billing", approvalRequired: true, sideEffect: "hosted" },
};

export function actionAuthority(action: AgentAction): ActionAuthority { return MATRIX[action]; }
