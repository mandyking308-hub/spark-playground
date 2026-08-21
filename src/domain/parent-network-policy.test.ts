import { describe, expect, test } from "bun:test";

import {
  canConnectAdults,
  canEnterParentNetwork,
  canTransitionToParentAlumni,
  exposesChildRecordIdentifiers,
  parentNetworkProfileFields,
  type AdultNetworkIdentity,
} from "./parent-network-policy";

const currentParent: AdultNetworkIdentity = {
  userId: "adult-1",
  role: "parent",
  verifiedAdult: true,
  communityOptIn: true,
  hasCurrentParentLink: true,
  hasHistoricalParentLink: true,
};

const alumniParent: AdultNetworkIdentity = {
  userId: "adult-2",
  role: "parent_alumni",
  verifiedAdult: true,
  communityOptIn: true,
  hasCurrentParentLink: false,
  hasHistoricalParentLink: true,
};

describe("parent community entry", () => {
  test("verified opted-in current and alumni parents can enter", () => {
    expect(canEnterParentNetwork(currentParent)).toBe(true);
    expect(canEnterParentNetwork(alumniParent)).toBe(true);
  });

  test("unverified or non-opted-in adults cannot enter", () => {
    expect(canEnterParentNetwork({ ...currentParent, verifiedAdult: false })).toBe(false);
    expect(canEnterParentNetwork({ ...currentParent, communityOptIn: false })).toBe(false);
  });

  test("parent role requires current relationship and alumni role requires historical relationship", () => {
    expect(canEnterParentNetwork({ ...currentParent, hasCurrentParentLink: false })).toBe(false);
    expect(canEnterParentNetwork({ ...alumniParent, hasHistoricalParentLink: false })).toBe(false);
  });
});

describe("adult-to-adult connections", () => {
  test("verified current and alumni parents can connect with each other", () => {
    expect(canConnectAdults({ from: currentParent, to: alumniParent })).toBe(true);
  });

  test("connection cannot bypass verification or opt-in", () => {
    expect(canConnectAdults({ from: currentParent, to: { ...alumniParent, verifiedAdult: false } })).toBe(false);
    expect(canConnectAdults({ from: { ...currentParent, communityOptIn: false }, to: alumniParent })).toBe(false);
  });
});

describe("child-data separation", () => {
  test("adult network profile fields contain no child record identifiers", () => {
    const fields = parentNetworkProfileFields();
    expect(fields.has("displayName")).toBe(true);
    expect(exposesChildRecordIdentifiers()).toBe(false);
  });

  test("former parent only transitions to alumni after final current link ends and historical link exists", () => {
    expect(canTransitionToParentAlumni(currentParent)).toBe(false);
    expect(canTransitionToParentAlumni(alumniParent)).toBe(true);
  });
});
