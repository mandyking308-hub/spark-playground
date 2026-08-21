export type LiveRlsScenario = {
  id: string;
  actor: string;
  action: string;
  expected: "allow" | "deny";
  reason: string;
};

export const coreLiveRlsScenarios: LiveRlsScenario[] = [
  { id: "child-own-project-read", actor: "child_a", action: "read child_a private project", expected: "allow", reason: "owner self access" },
  { id: "child-cross-project-read", actor: "child_a", action: "read child_b private project", expected: "deny", reason: "cross-child isolation" },
  { id: "child-cross-project-update", actor: "child_a", action: "update child_b project", expected: "deny", reason: "cross-child write isolation" },
  { id: "child-publish-direct", actor: "child_a", action: "set own project state to published", expected: "deny", reason: "publication is server-governed" },
  { id: "child-role-escalation", actor: "child_a", action: "change own primary_role or age_band", expected: "deny", reason: "authority fields are not browser-writable" },
  { id: "parent-private-draft", actor: "parent_a", action: "read child_a private project row", expected: "deny", reason: "guardian status is not a draft master key" },
  { id: "parent-own-link", actor: "parent_a", action: "read verified guardian link to child_a", expected: "allow", reason: "relationship visibility" },
  { id: "parent-cross-link", actor: "parent_a", action: "read parent_b guardian link to child_b", expected: "deny", reason: "cross-family isolation" },
  { id: "parent-own-request", actor: "parent_a", action: "read child_a publication permission request", expected: "allow", reason: "verified guardian may review scoped request" },
  { id: "parent-cross-request", actor: "parent_a", action: "read child_b publication permission request", expected: "deny", reason: "cross-family permission isolation" },
  { id: "revoked-guardian-request", actor: "parent_a_revoked", action: "read or decide child_a permission request", expected: "deny", reason: "revoked guardian link grants no authority" },
  { id: "parent-alumni-child", actor: "parent_alumni", action: "read child project or permission request", expected: "deny", reason: "parent alumni has no child-data entitlement" },
  { id: "anonymous-core", actor: "anon", action: "read profiles, projects, guardian links or permission tables", expected: "deny", reason: "phase-one Data API grants nothing to anon" },
  { id: "browser-rpc", actor: "authenticated_browser", action: "execute server permission RPC directly", expected: "deny", reason: "RPC execute is service-role only" },
  { id: "wrong-project-ref", actor: "browser", action: "connect app to unrelated Supabase project ref", expected: "deny", reason: "runtime pins the approved project ref" },
];

export const mandatoryDenyScenarioIds = [
  "child-cross-project-read",
  "child-cross-project-update",
  "child-publish-direct",
  "child-role-escalation",
  "parent-private-draft",
  "parent-cross-link",
  "parent-cross-request",
  "revoked-guardian-request",
  "parent-alumni-child",
  "anonymous-core",
  "browser-rpc",
  "wrong-project-ref",
] as const;
