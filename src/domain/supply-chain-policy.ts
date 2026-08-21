export type DependencyRisk = "low" | "medium" | "high" | "critical";
export type DependencyDecision = "allow" | "review" | "block";

export interface DependencyAssessment {
  sourceApproved: boolean;
  lockfileResolved: boolean;
  knownMalicious: boolean;
  vulnerabilityRisk: DependencyRisk;
  exceptionApproved: boolean;
  exceptionExpiresAt?: Date | null;
}

export function dependencyDecision(input: DependencyAssessment, now = new Date()): DependencyDecision {
  if (!input.sourceApproved || !input.lockfileResolved || input.knownMalicious) return "block";
  if (input.vulnerabilityRisk === "critical") {
    const validException = Boolean(input.exceptionApproved && input.exceptionExpiresAt && input.exceptionExpiresAt > now);
    return validException ? "review" : "block";
  }
  if (input.vulnerabilityRisk === "high") return "review";
  return "allow";
}

export function ciActionMustUseImmutableCommit(): true {
  return true;
}

export function ciTokenMayHaveWritePermissionByDefault(): false {
  return false;
}

export function dependencyInstallMayIgnoreLockfile(): false {
  return false;
}

export function dependencyMayComeFromUnapprovedRegistry(): false {
  return false;
}

export function arbitraryDependencyInstallScriptAllowed(): false {
  return false;
}

export function exceptionIsValid(approved: boolean, expiresAt: Date | null, now = new Date()): boolean {
  return approved && Boolean(expiresAt && expiresAt > now);
}

export const SUPPLY_CHAIN_PRINCIPLES = [
  "Dependency resolution is lockfile-driven and CI installs fail when the lockfile changes unexpectedly.",
  "CI actions are pinned to immutable commit SHAs rather than floating tags.",
  "Workflow tokens use least privilege and do not receive write access by default.",
  "New dependency sources and install scripts require explicit review rather than automatic execution.",
  "Known-malicious packages are blocked; critical vulnerability exceptions must be explicit and time-bounded.",
  "Package provenance, review decisions and exceptions are auditable without storing registry credentials.",
] as const;
