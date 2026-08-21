import { describe, expect, test } from "bun:test";

import {
  canCacheNavigationResponse,
  canCacheStaticAsset,
  canQueueActionForBackgroundReplay,
  shouldShowOfflineReadOnlyState,
} from "./offline-safety-policy";

describe("offline safety policy", () => {
  test("sensitive child and staff actions are never queued for background replay", () => {
    for (const action of [
      "publish_external",
      "submit_permission_decision",
      "submit_safeguarding_report",
      "submit_challenge_entry",
      "send_feedback",
      "send_community_post",
      "change_staff_grant",
    ] as const) {
      expect(canQueueActionForBackgroundReplay(action)).toBe(false);
    }
  });

  test("a purely private local draft may be retained locally without server replay", () => {
    expect(canQueueActionForBackgroundReplay("save_private_local_draft")).toBe(true);
  });

  test("protected application navigations are not cacheable", () => {
    expect(canCacheNavigationResponse("/dashboard/child")).toBe(false);
    expect(canCacheNavigationResponse("/alumni/community")).toBe(false);
    expect(canCacheNavigationResponse("/auth/sign-in")).toBe(false);
    expect(canCacheNavigationResponse("/api/projects")).toBe(false);
  });

  test("only known static shell assets are cacheable", () => {
    expect(canCacheStaticAsset("/assets/app-123.js")).toBe(true);
    expect(canCacheStaticAsset("/offline.html")).toBe(true);
    expect(canCacheStaticAsset("/storage/private-child-audio.mp3")).toBe(false);
  });

  test("offline mode is explicitly read-only for network-authoritative workflows", () => {
    expect(shouldShowOfflineReadOnlyState(false)).toBe(true);
    expect(shouldShowOfflineReadOnlyState(true)).toBe(false);
  });
});
