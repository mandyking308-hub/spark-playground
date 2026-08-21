import { describe, expect, it } from "bun:test";

import {
  arbitraryDependencyInstallScriptAllowed,
  ciActionMustUseImmutableCommit,
  ciTokenMayHaveWritePermissionByDefault,
  dependencyDecision,
  dependencyInstallMayIgnoreLockfile,
  dependencyMayComeFromUnapprovedRegistry,
  exceptionIsValid,
} from "./supply-chain-policy";

describe("software supply-chain security", () => {
  const base = {
    sourceApproved: true,
    lockfileResolved: true,
    knownMalicious: false,
    vulnerabilityRisk: "low" as const,
    exceptionApproved: false,
    exceptionExpiresAt: null,
  };

  it("allows low-risk locked dependencies from approved sources", () => {
    expect(dependencyDecision(base)).toBe("allow");
  });

  it("blocks malicious, unlocked or unapproved dependencies", () => {
    expect(dependencyDecision({ ...base, knownMalicious: true })).toBe("block");
    expect(dependencyDecision({ ...base, lockfileResolved: false })).toBe("block");
    expect(dependencyDecision({ ...base, sourceApproved: false })).toBe("block");
  });

  it("routes high risk to review and blocks critical without a live exception", () => {
    expect(dependencyDecision({ ...base, vulnerabilityRisk: "high" })).toBe("review");
    expect(dependencyDecision({ ...base, vulnerabilityRisk: "critical" })).toBe("block");
  });

  it("permits only time-bounded approved critical exceptions for review", () => {
    const now = new Date("2026-08-21T10:00:00Z");
    const future = new Date("2026-08-22T10:00:00Z");
    const past = new Date("2026-08-20T10:00:00Z");
    expect(exceptionIsValid(true, future, now)).toBe(true);
    expect(exceptionIsValid(true, past, now)).toBe(false);
    expect(exceptionIsValid(false, future, now)).toBe(false);
    expect(dependencyDecision({ ...base, vulnerabilityRisk: "critical", exceptionApproved: true, exceptionExpiresAt: future }, now)).toBe("review");
  });

  it("requires immutable CI actions and least privilege tokens", () => {
    expect(ciActionMustUseImmutableCommit()).toBe(true);
    expect(ciTokenMayHaveWritePermissionByDefault()).toBe(false);
  });

  it("requires the lockfile and approved dependency sources", () => {
    expect(dependencyInstallMayIgnoreLockfile()).toBe(false);
    expect(dependencyMayComeFromUnapprovedRegistry()).toBe(false);
    expect(arbitraryDependencyInstallScriptAllowed()).toBe(false);
  });
});
