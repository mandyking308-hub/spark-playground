import { describe, expect, test } from "bun:test";

import { canRunDiscoveryQuery, isAllowedChildRecommendationReason } from "./discovery-policy";

describe("child discovery policy", () => {
  test("children cannot browse a child profile directory", () => {
    expect(
      canRunDiscoveryQuery({
        requesterIsChild: true,
        entity: "child_profile",
        usesBehaviouralProfiling: false,
        usesPopularityRanking: false,
        curatedOrContextual: true,
      }),
    ).toBe(false);
  });

  test("children can discover curated shows and topics", () => {
    expect(
      canRunDiscoveryQuery({
        requesterIsChild: true,
        entity: "show",
        usesBehaviouralProfiling: false,
        usesPopularityRanking: false,
        curatedOrContextual: true,
      }),
    ).toBe(true);
  });

  test("behavioural profiling and popularity ranking are rejected for child discovery", () => {
    expect(
      canRunDiscoveryQuery({
        requesterIsChild: true,
        entity: "project",
        usesBehaviouralProfiling: true,
        usesPopularityRanking: false,
        curatedOrContextual: true,
      }),
    ).toBe(false);

    expect(
      canRunDiscoveryQuery({
        requesterIsChild: true,
        entity: "project",
        usesBehaviouralProfiling: false,
        usesPopularityRanking: true,
        curatedOrContextual: true,
      }),
    ).toBe(false);
  });

  test("recommendations may use explicit interests and context, not prediction/popularity", () => {
    expect(isAllowedChildRecommendationReason("chosen_interest")).toBe(true);
    expect(isAllowedChildRecommendationReason("school_context")).toBe(true);
    expect(isAllowedChildRecommendationReason("editorial")).toBe(true);
    expect(isAllowedChildRecommendationReason("behavioural_prediction")).toBe(false);
    expect(isAllowedChildRecommendationReason("popularity")).toBe(false);
  });
});
