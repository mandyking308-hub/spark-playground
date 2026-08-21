import { describe, expect, it } from "bun:test";

import {
  channelAllowedForRecipient,
  contentLooksLikeEngagementBait,
  externalLinkMayContainSensitiveObjectId,
  externalNotificationBody,
  mayBypassQuietHours,
  mayIncludeSensitiveDetailOutsideApp,
  mayUseOpenOrClickTracking,
  safeguardingDeliveryAllowed,
} from "./notification-delivery-policy";

describe("notification delivery privacy", () => {
  it("never includes sensitive detail on external surfaces", () => {
    expect(mayIncludeSensitiveDetailOutsideApp()).toBe(false);
    expect(externalLinkMayContainSensitiveObjectId()).toBe(false);
    expect(externalNotificationBody("safeguarding")).not.toContain("child");
    expect(externalNotificationBody("approval")).not.toContain("project");
  });

  it("keeps safeguarding escalation on verified adult recipient types", () => {
    expect(safeguardingDeliveryAllowed("child")).toBe(false);
    expect(safeguardingDeliveryAllowed("alumni")).toBe(false);
    expect(safeguardingDeliveryAllowed("parent")).toBe(true);
    expect(safeguardingDeliveryAllowed("staff")).toBe(true);
  });

  it("does not send child notifications by SMS or email", () => {
    expect(channelAllowedForRecipient("sms", "child")).toBe(false);
    expect(channelAllowedForRecipient("email", "child")).toBe(false);
    expect(channelAllowedForRecipient("push", "child")).toBe(true);
    expect(channelAllowedForRecipient("in_app", "child")).toBe(true);
  });

  it("never bypasses quiet hours for a child", () => {
    expect(mayBypassQuietHours("safeguarding", "child")).toBe(false);
    expect(mayBypassQuietHours("security", "child")).toBe(false);
  });

  it("only lets adult safety/security alerts bypass quiet hours", () => {
    expect(mayBypassQuietHours("safeguarding", "staff")).toBe(true);
    expect(mayBypassQuietHours("security", "parent")).toBe(true);
    expect(mayBypassQuietHours("achievement", "parent")).toBe(false);
  });

  it("blocks tracking for child notifications", () => {
    expect(mayUseOpenOrClickTracking("child")).toBe(false);
  });

  it("recognises engagement-bait patterns", () => {
    expect(contentLooksLikeEngagementBait("Keep your streak alive!")) .toBe(true);
    expect(contentLooksLikeEngagementBait("Your project review is complete.")) .toBe(false);
  });
});
