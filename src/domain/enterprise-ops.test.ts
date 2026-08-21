import { describe, expect, test } from "bun:test";

import { canDeliverNotification, licenceUtilisationPercent } from "./enterprise-ops";

describe("child-safe notification policy", () => {
  test("blocks engagement bait for children", () => {
    expect(
      canDeliverNotification({
        recipientIsChild: true,
        purpose: "engagement_nudge",
        quietHoursActive: false,
      }),
    ).toBe(false);
  });

  test("blocks popularity notifications for children", () => {
    expect(
      canDeliverNotification({
        recipientIsChild: true,
        purpose: "popularity",
        quietHoursActive: false,
      }),
    ).toBe(false);
  });

  test("allows useful project updates outside quiet hours", () => {
    expect(
      canDeliverNotification({
        recipientIsChild: true,
        purpose: "project_update",
        quietHoursActive: false,
      }),
    ).toBe(true);
  });

  test("quiet hours suppress ordinary notifications", () => {
    expect(
      canDeliverNotification({
        recipientIsChild: true,
        purpose: "achievement",
        quietHoursActive: true,
      }),
    ).toBe(false);
  });

  test("urgent safety events can break quiet hours", () => {
    expect(
      canDeliverNotification({
        recipientIsChild: false,
        purpose: "safety",
        quietHoursActive: true,
        urgentSafetyEvent: true,
      }),
    ).toBe(true);
  });
});

describe("enterprise licence usage", () => {
  test("calculates bounded learner and school utilisation", () => {
    expect(
      licenceUtilisationPercent(
        {
          educationGroupId: "group-1",
          planName: "Group Network",
          licensedLearners: 1000,
          licensedSchools: 10,
          status: "active",
        },
        { activeLearners: 760, activeSchools: 8 },
      ),
    ).toEqual({ learnerPercent: 76, schoolPercent: 80 });
  });

  test("never reports more than 100 percent", () => {
    expect(
      licenceUtilisationPercent(
        {
          educationGroupId: "group-1",
          planName: "Group Network",
          licensedLearners: 100,
          licensedSchools: 1,
          status: "active",
        },
        { activeLearners: 120, activeSchools: 2 },
      ),
    ).toEqual({ learnerPercent: 100, schoolPercent: 100 });
  });
});
