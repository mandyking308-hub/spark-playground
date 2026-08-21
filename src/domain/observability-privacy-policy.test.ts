import { describe, expect, it } from "bun:test";

import {
  childBehaviouralFunnelAllowed,
  childCrossSessionAdvertisingIdentifierAllowed,
  diagnosticCorrelationIdMayBeReversibleToChildIdentity,
  safeRouteDimension,
  telemetryFieldAllowed,
  telemetryMayStoreFullIpAddress,
  telemetryMayStoreRawRequestOrResponseBody,
  validTelemetryRetentionDays,
} from "./observability-privacy-policy";

describe("observability privacy policy", () => {
  it("allows operational dimensions but not child/content identifiers", () => {
    for (const field of ["route_template", "status_code", "duration_bucket", "service_name", "error_code", "request_id_hash", "region_code"] as const) {
      expect(telemetryFieldAllowed(field)).toBe(true);
    }
    for (const field of ["child_profile_id", "email", "full_ip", "precise_location", "project_title", "project_body", "search_term", "ai_prompt", "chat_text", "safeguarding_summary"] as const) {
      expect(telemetryFieldAllowed(field)).toBe(false);
    }
  });

  it("does not allow behavioural funnels or advertising identifiers for children", () => {
    expect(childBehaviouralFunnelAllowed()).toBe(false);
    expect(childCrossSessionAdvertisingIdentifierAllowed()).toBe(false);
  });

  it("does not store raw request/response bodies or full IPs", () => {
    expect(telemetryMayStoreRawRequestOrResponseBody()).toBe(false);
    expect(telemetryMayStoreFullIpAddress()).toBe(false);
  });

  it("normalises route IDs and strips query strings before telemetry", () => {
    expect(safeRouteDimension("/projects/123?token=secret")).toBe("/projects/:id");
    expect(safeRouteDimension("/profiles/550e8400-e29b-41d4-a716-446655440000/view")).toBe("/profiles/:id/view");
  });

  it("keeps diagnostic retention bounded", () => {
    expect(validTelemetryRetentionDays(30)).toBe(true);
    expect(validTelemetryRetentionDays(90)).toBe(true);
    expect(validTelemetryRetentionDays(91)).toBe(false);
    expect(validTelemetryRetentionDays(0)).toBe(false);
  });

  it("does not make correlation hashes reversible to child identity", () => {
    expect(diagnosticCorrelationIdMayBeReversibleToChildIdentity()).toBe(false);
  });
});
