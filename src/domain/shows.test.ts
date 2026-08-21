import { describe, expect, test } from "bun:test";

import {
  canShowExposeOwnerProfileIdToPublic,
  nextEpisodeNumber,
  safePublicPublisherLabel,
} from "./shows";

describe("child shows", () => {
  test("public show pages never expose the child profile id as identity", () => {
    expect(canShowExposeOwnerProfileIdToPublic()).toBe(false);
  });

  test("approved creator alias is preferred over a real child display name", () => {
    expect(
      safePublicPublisherLabel({
        childDisplayName: "Real Child Name",
        approvedCreatorAlias: "Wild World Studio",
        schoolOrProgrammeLabel: "School Science Club",
      }),
    ).toBe("Wild World Studio");
  });

  test("falls back to school/programme label then generic creator label", () => {
    expect(safePublicPublisherLabel({ schoolOrProgrammeLabel: "Science Club" })).toBe("Science Club");
    expect(safePublicPublisherLabel({ childDisplayName: "Real Child Name" })).toBe("Young Creator");
  });

  test("episode numbering increments safely", () => {
    expect(nextEpisodeNumber([])).toBe(1);
    expect(
      nextEpisodeNumber([
        { id: "1", showId: "show", title: "One", episodeNumber: 1, state: "published" },
        { id: "2", showId: "show", title: "Three", episodeNumber: 3, state: "draft" },
      ]),
    ).toBe(4);
  });
});
