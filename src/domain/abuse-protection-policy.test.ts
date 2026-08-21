import { describe, expect, it } from "bun:test";

import {
  abuseDecision,
  abuseLogsMayContainChildContent,
  automatedBlockMayCloseSafeguardingCase,
  botChallengeMayCollectBehaviouralAdvertisingData,
  childAccountEnumerationAllowed,
  rateLimitResponseMayRevealWhetherChildAccountExists,
} from "./abuse-protection-policy";

describe("abuse and automation protection", () => {
  const base = {
    surface: "sign_in" as const,
    attemptsInWindow: 1,
    verifiedSession: false,
    suspiciousAutomation: false,
    accountEnumerationPattern: false,
    knownAbusiveSource: false,
  };

  it("denies child lookup and account-enumeration patterns", () => {
    expect(abuseDecision({ ...base, surface: "child_lookup" })).toBe("deny");
    expect(abuseDecision({ ...base, accountEnumerationPattern: true })).toBe("deny");
    expect(childAccountEnumerationAllowed()).toBe(false);
    expect(rateLimitResponseMayRevealWhetherChildAccountExists()).toBe(false);
  });

  it("challenges suspicious automation and excessive attempts", () => {
    expect(abuseDecision({ ...base, suspiciousAutomation: true })).toBe("challenge");
    expect(abuseDecision({ ...base, attemptsInWindow: 11 })).toBe("challenge");
  });

  it("denies unauthenticated state-changing child actions", () => {
    expect(abuseDecision({ ...base, surface: "upload", attemptsInWindow: 1 })).toBe("deny");
    expect(abuseDecision({ ...base, surface: "feedback", attemptsInWindow: 1 })).toBe("deny");
    expect(abuseDecision({ ...base, surface: "challenge_submission", attemptsInWindow: 1 })).toBe("deny");
  });

  it("allows bounded verified actions", () => {
    expect(abuseDecision({ ...base, surface: "upload", attemptsInWindow: 3, verifiedSession: true })).toBe("allow");
    expect(abuseDecision({ ...base, surface: "partner_api", attemptsInWindow: 20, verifiedSession: true })).toBe("allow");
  });

  it("blocks known abusive sources", () => {
    expect(abuseDecision({ ...base, knownAbusiveSource: true })).toBe("deny");
  });

  it("keeps bot/safety systems privacy bounded", () => {
    expect(botChallengeMayCollectBehaviouralAdvertisingData()).toBe(false);
    expect(abuseLogsMayContainChildContent()).toBe(false);
    expect(automatedBlockMayCloseSafeguardingCase()).toBe(false);
  });
});
