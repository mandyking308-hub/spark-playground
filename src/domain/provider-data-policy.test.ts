import { describe, expect, it } from "bun:test";

import {
  aiProviderMayTrainOnChildData,
  childBehaviouralAdvertisingThroughProviderAllowed,
  providerApprovalMustBeVersioned,
  providerCanProcess,
  providerMayChangeRegionOrSubprocessorsSilently,
  providerMayReceiveDataOutsideApprovedClasses,
} from "./provider-data-policy";

describe("provider data governance", () => {
  const base = {
    verified: true,
    purpose: "storage" as const,
    approvedDataClasses: ["child_content", "sanitized_media"] as const,
    regionApproved: true,
    retentionDays: 30,
    subprocessorsReviewed: true,
    incidentContactVerified: true,
    childDataTrainingAllowed: false,
    behaviouralAdvertisingAllowed: false,
  };

  it("allows only explicitly approved provider data classes", () => {
    expect(providerCanProcess(base, "child_content")).toBe(true);
    expect(providerCanProcess(base, "guardian_relationship")).toBe(false);
    expect(providerMayReceiveDataOutsideApprovedClasses()).toBe(false);
  });

  it("blocks unverified region or subprocessor states", () => {
    expect(providerCanProcess({ ...base, verified: false }, "child_content")).toBe(false);
    expect(providerCanProcess({ ...base, regionApproved: false }, "child_content")).toBe(false);
    expect(providerCanProcess({ ...base, subprocessorsReviewed: false }, "child_content")).toBe(false);
  });

  it("blocks provider training and behavioural advertising using child data", () => {
    expect(providerCanProcess({ ...base, childDataTrainingAllowed: true }, "child_content")).toBe(false);
    expect(providerCanProcess({ ...base, behaviouralAdvertisingAllowed: true }, "child_content")).toBe(false);
    expect(aiProviderMayTrainOnChildData()).toBe(false);
    expect(childBehaviouralAdvertisingThroughProviderAllowed()).toBe(false);
  });

  it("keeps observability restricted to operational telemetry", () => {
    const telemetry = { ...base, purpose: "observability" as const, approvedDataClasses: ["operational_telemetry"] as const };
    expect(providerCanProcess(telemetry, "operational_telemetry")).toBe(true);
    expect(providerCanProcess({ ...telemetry, approvedDataClasses: ["child_content"] as const }, "child_content")).toBe(false);
  });

  it("keeps payments restricted to payment references", () => {
    const payment = { ...base, purpose: "payment" as const, approvedDataClasses: ["payment_reference"] as const };
    expect(providerCanProcess(payment, "payment_reference")).toBe(true);
    expect(providerCanProcess({ ...payment, approvedDataClasses: ["child_content"] as const }, "child_content")).toBe(false);
  });

  it("restricts safeguarding data to narrow provider purposes", () => {
    const moderation = { ...base, purpose: "moderation" as const, approvedDataClasses: ["safeguarding"] as const };
    expect(providerCanProcess(moderation, "safeguarding")).toBe(true);
    expect(providerCanProcess({ ...moderation, purpose: "email" as const }, "safeguarding")).toBe(false);
  });

  it("requires bounded retention and versioned provider approval", () => {
    expect(providerCanProcess({ ...base, retentionDays: 366 }, "child_content")).toBe(false);
    expect(providerApprovalMustBeVersioned()).toBe(true);
    expect(providerMayChangeRegionOrSubprocessorsSilently()).toBe(false);
  });
});
